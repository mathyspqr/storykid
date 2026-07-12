import "dotenv/config";
import express from "express";
import cors from "cors";
import Stripe from "stripe";
import { z } from "zod";
import { createHash } from "node:crypto";
import { authenticatedUser, service } from "./supabase/server.js";
import {
  STORY_OFFERS,
  calculateOfferTotal,
  storyConfigurationSchema,
} from "./contracts/story-production.js";
import { processNextGenerationJob } from "./generation/worker.js";

const app = express();
const port = Number(process.env.PORT ?? 3002);
const origin = process.env.CLIENT_ORIGIN ?? "http://localhost:3001";
const stripeSecret =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_SECRET_KEY
    : (process.env.STRIPE_SECRET_KEY_TEST ?? process.env.STRIPE_SECRET_KEY);
const stripeWebhookSecret =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_WEBHOOK_SECRET
    : (process.env.STRIPE_WEBHOOK_SECRET_TEST ??
      process.env.STRIPE_WEBHOOK_SECRET);
app.use(cors({ origin, credentials: false }));
app.set("trust proxy", 1);
const eventNames = [
  "create_story_started",
  "questionnaire_step_viewed",
  "questionnaire_option_selected",
  "questionnaire_completed",
  "preview_requested",
  "preview_ready",
  "preview_opened",
  "preview_page_read",
  "auth_gate_viewed",
  "account_created",
  "paywall_viewed",
  "checkout_started",
  "payment_completed",
  "full_story_ready",
  "library_opened",
  "story_opened",
] as const;
const id = z.string().uuid();
const auth = async (req: express.Request, res: express.Response) => {
  const user = await authenticatedUser(req);
  if (!user) {
    res.status(401).json({
      code: "unauthorized",
      message: "Connectez-vous pour retrouver vos histoires.",
    });
    return null;
  }
  if (user.is_anonymous) {
    res.status(401).json({
      code: "account_required",
      message:
        "Créez ou connectez-vous à votre compte pour préparer et retrouver votre aperçu.",
    });
    return null;
  }
  return user;
};
const previewIpHash = (req: express.Request) =>
  createHash("sha256")
    .update(`${process.env.RATE_LIMIT_SECRET ?? "storykid-local"}:${req.ip}`)
    .digest("hex");
const previewRetentionMs = 24 * 60 * 60 * 1000;
async function removeStoryAssets(
  db: ReturnType<typeof service>,
  story: { id: string; user_id: string },
) {
  for (const bucket of ["story-covers", "story-illustrations", "story-pdfs"]) {
    const prefix = `${story.user_id}/${story.id}`;
    const { data } = await db.storage
      .from(bucket)
      .list(prefix, { limit: 1000 });
    const paths = (data ?? []).map((file) => `${prefix}/${file.name}`);
    if (paths.length) await db.storage.from(bucket).remove(paths);
  }
}
async function purgeExpiredPreviews() {
  const db = service();
  const before = new Date(Date.now() - previewRetentionMs).toISOString();
  const [{ data: previews }, { data: drafts }] = await Promise.all([
    db
      .from("stories")
      .select("id,user_id")
      .in("status", ["preview_ready", "preview_failed", "checkout_created"])
      .lt("preview_generated_at", before),
    db
      .from("stories")
      .select("id,user_id")
      .eq("status", "draft")
      .lt("created_at", before),
  ]);
  for (const story of [...(previews ?? []), ...(drafts ?? [])]) {
    await removeStoryAssets(db, story);
    await db.from("stories").delete().eq("id", story.id);
  }
}

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const secret = stripeSecret;
    const signing = stripeWebhookSecret;
    if (!secret || !signing)
      return res.status(503).json({ error: "not_configured" });
    let event: Stripe.Event;
    try {
      event = new Stripe(secret).webhooks.constructEvent(
        req.body,
        req.header("stripe-signature") ?? "",
        signing,
      );
    } catch {
      return res.status(400).json({ error: "invalid_signature" });
    }
    if (event.type !== "checkout.session.completed")
      return res.json({ received: true });
    const session = event.data.object;
    const storyId = session.metadata?.story_id;
    const userId = session.metadata?.user_id;
    const offerId = session.metadata?.offer_id as "standard" | undefined;
    if (
      !storyId ||
      !userId ||
      !offerId ||
      session.payment_status !== "paid" ||
      session.currency !== "eur" ||
      session.amount_total !== calculateOfferTotal(offerId)
    )
      return res.status(400).json({ error: "payment_mismatch" });
    const db = service();
    const { data: story } = await db
      .from("stories")
      .select("id,status,format")
      .eq("id", storyId)
      .eq("user_id", userId)
      .maybeSingle();
    if (
      !story ||
      story.format !== offerId ||
      ![
        "checkout_created",
        "full_generation_queued",
        "full_generating",
        "ready",
      ].includes(story.status)
    )
      return res.status(400).json({ error: "story_mismatch" });
    await db.from("purchases").upsert(
      {
        user_id: userId,
        story_id: storyId,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: String(session.payment_intent ?? ""),
        amount_cents: session.amount_total,
        currency: "eur",
        offer_id: offerId,
        status: "paid",
      },
      { onConflict: "stripe_checkout_session_id", ignoreDuplicates: true },
    );
    if (story.status === "checkout_created") {
      await db
        .from("stories")
        .update({
          status: "full_generation_queued",
          paid_at: new Date().toISOString(),
        })
        .eq("id", storyId);
      await db
        .from("generation_jobs")
        .upsert(
          { story_id: storyId, job_type: "full_generation", status: "queued" },
          { onConflict: "story_id,job_type", ignoreDuplicates: true },
        );
      void processNextGenerationJob();
    }
    return res.json({ received: true });
  },
);
app.use(express.json({ limit: "1mb" }));

app.post("/api/stories/draft", async (req, res) => {
  const user = await auth(req, res);
  if (!user) return;
  const { data, error } = await service()
    .from("stories")
    .insert({ user_id: user.id, status: "draft" })
    .select("id")
    .single();
  if (error)
    return res.status(500).json({
      code: "draft_save_failed",
      message: "Le brouillon n’a pas pu être créé.",
    });
  res.status(201).json({ id: data.id });
});
app.patch("/api/stories/:id", async (req, res) => {
  const user = await auth(req, res);
  if (!user) return;
  if (!id.safeParse(req.params.id).success)
    return res.status(404).json({ code: "not_found" });
  const partial = storyConfigurationSchema.partial().safeParse(req.body);
  if (!partial.success)
    return res.status(400).json({
      code: "invalid_draft",
      message: "Cette modification n’est pas valide.",
    });
  const map: Record<string, string> = {
    childName: "child_name",
    childAge: "child_age",
    emotionalGoal: "emotional_goal",
    childPronoun: "child_pronoun",
    personalDetail: "personal_detail",
  };
  const update = Object.fromEntries(
    Object.entries(partial.data).map(([key, value]) => [
      map[key] ?? key,
      value,
    ]),
  );
  if (partial.data.format)
    Object.assign(update, {
      page_count: STORY_OFFERS[partial.data.format].pages,
    });
  const { data } = await service()
    .from("stories")
    .update(update)
    .eq("id", req.params.id)
    .eq("user_id", user.id)
    .eq("status", "draft")
    .select("id")
    .maybeSingle();
  if (!data)
    return res.status(409).json({
      code: "draft_update_failed",
      message: "Le brouillon n’a pas pu être sauvegardé.",
    });
  res.json({ saved: true });
});
app.get("/api/stories/:id", async (req, res) => {
  const user = await auth(req, res);
  if (!user) return;
  const { data } = await service()
    .from("stories")
    .select(
      "id,status,moment,child_name,child_age,child_pronoun,personal_detail,universe,companion,emotional_goal,tone,format",
    )
    .eq("id", req.params.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return res.status(404).json({ code: "not_found" });
  res.json({
    id: data.id,
    status: data.status,
    answers: {
      moment: data.moment,
      childName: data.child_name,
      childAge: data.child_age,
      childPronoun: data.child_pronoun,
      personalDetail: data.personal_detail,
      universe: data.universe,
      companion: data.companion,
      emotionalGoal: data.emotional_goal,
      tone: data.tone,
      format: data.format,
    },
  });
});
app.post("/api/stories", async (req, res) => {
  const user = await auth(req, res);
  if (!user) return;
  const body = req.body as Record<string, unknown> & { id?: string };
  const parsed = storyConfigurationSchema.safeParse(body);
  if (!parsed.success)
    return res.status(400).json({
      code: "invalid_configuration",
      message: "Certaines réponses sont incomplètes ou invalides.",
    });
  const offer = STORY_OFFERS[parsed.data.format];
  const values = {
    moment: parsed.data.moment,
    child_name: parsed.data.childName,
    child_age: parsed.data.childAge,
    child_pronoun: parsed.data.childPronoun,
    personal_detail: parsed.data.personalDetail ?? null,
    universe: parsed.data.universe,
    companion: parsed.data.companion,
    emotional_goal: parsed.data.emotionalGoal,
    tone: parsed.data.tone,
    format: parsed.data.format,
    page_count: offer.pages,
  };
  const db = service();
  const query = body.id
    ? db
        .from("stories")
        .update(values)
        .eq("id", body.id)
        .eq("user_id", user.id)
        .eq("status", "draft")
        .select("id")
        .single()
    : db
        .from("stories")
        .insert({ user_id: user.id, status: "draft", ...values })
        .select("id")
        .single();
  const { data, error } = await query;
  if (error)
    return res.status(500).json({
      code: "story_save_failed",
      message: "Votre brouillon n’a pas pu être sauvegardé.",
    });
  res.status(201).json({ id: data.id });
});
app.post("/api/stories/:id/preview", async (req, res) => {
  const user = await auth(req, res);
  if (!user) return;
  const db = service();
  const { data: quota, error: quotaError } =
    process.env.NODE_ENV === "production"
      ? await db.rpc("consume_preview_quota", { p_ip_hash: previewIpHash(req) })
      : { data: true, error: null };
  if (!quotaError && !quota)
    return res.status(429).json({
      code: "daily_preview_limit",
      message:
        "Un aperçu gratuit a déjà été créé aujourd’hui depuis cette connexion. Revenez demain pour en préparer un nouveau.",
    });
  const { data: story } = await db
    .from("stories")
    .select("status")
    .eq("id", req.params.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!story)
    return res
      .status(404)
      .json({ code: "not_found", message: "Ce brouillon est introuvable." });
  if (story.status === "preview_ready") {
    const { count } = await db
      .from("story_pages")
      .select("id", { count: "exact", head: true })
      .eq("story_id", req.params.id)
      .lte("page_number", 2);
    if ((count ?? 0) >= 2)
      return res.json({ id: req.params.id, status: "preview_ready" });
    await db
      .from("stories")
      .update({ status: "preview_queued" })
      .eq("id", req.params.id);
    await db
      .from("generation_jobs")
      .update({
        status: "queued",
        progress: 0,
        error_code: null,
        error_message: null,
      })
      .eq("story_id", req.params.id)
      .eq("job_type", "preview");
    void processNextGenerationJob();
    return res
      .status(202)
      .json({ id: req.params.id, status: "preview_queued" });
  }
  if (
    ![
      "draft",
      "preview_failed",
      "preview_queued",
      "preview_generating",
    ].includes(story.status)
  )
    return res.status(409).json({
      code: "preview_not_allowed",
      message: "Cet aperçu ne peut pas être relancé maintenant.",
    });
  await db
    .from("stories")
    .update({ status: "preview_queued" })
    .eq("id", req.params.id);
  await db
    .from("generation_jobs")
    .upsert(
      { story_id: req.params.id, job_type: "preview", status: "queued" },
      { onConflict: "story_id,job_type" },
    );
  void processNextGenerationJob();
  res.status(202).json({ id: req.params.id, status: "preview_queued" });
});
app.get("/api/stories/:id/status", async (req, res) => {
  const user = await auth(req, res);
  if (!user) return;
  const db = service();
  const { data } = await db
    .from("stories")
    .select("id,status,preview_generated_at,full_generated_at")
    .eq("id", req.params.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return res.status(404).json({ code: "not_found" });
  const { data: job } = await db
    .from("generation_jobs")
    .select("progress")
    .eq("story_id", data.id)
    .in("status", ["queued", "running"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const fallback =
    data.status === "preview_queued"
      ? 5
      : data.status === "preview_generating"
        ? 45
        : data.status === "full_generation_queued"
          ? 8
          : data.status === "full_generating"
            ? 55
            : 100;
  res.json({ ...data, progress: job?.progress ?? fallback });
});
app.post("/api/stories/:id/retry", async (req, res) => {
  const user = await auth(req, res);
  if (!user) return;
  const db = service();
  const { data: story } = await db
    .from("stories")
    .select("status")
    .eq("id", req.params.id)
    .eq("user_id", user.id)
    .maybeSingle();
  const type =
    story?.status === "preview_failed"
      ? "preview"
      : story?.status === "generation_failed"
        ? "full_generation"
        : null;
  if (!type) return res.status(409).json({ code: "retry_not_allowed" });
  const status =
    type === "preview" ? "preview_queued" : "full_generation_queued";
  await db.from("stories").update({ status }).eq("id", req.params.id);
  await db
    .from("generation_jobs")
    .update({
      status: "queued",
      attempt_count: 0,
      progress: 5,
      started_at: null,
      completed_at: null,
      error_code: null,
      error_message: null,
    })
    .eq("story_id", req.params.id)
    .eq("job_type", type);
  void processNextGenerationJob();
  res.json({ status });
});
app.post("/api/stories/:id/cancel-checkout", async (req, res) => {
  const user = await auth(req, res);
  if (!user) return;
  await service()
    .from("stories")
    .update({ status: "preview_ready" })
    .eq("id", req.params.id)
    .eq("user_id", user.id)
    .eq("status", "checkout_created");
  res.json({ cancelled: true });
});
app.post("/api/stories/:id/claim", async (req, res) => {
  const user = await auth(req, res);
  if (!user || user.is_anonymous)
    return res.status(401).json({ code: "account_required" });
  const token = z.object({ claimToken: z.string().uuid() }).safeParse(req.body);
  if (!token.success) return res.status(400).json({ code: "invalid_claim" });
  const { data } = await service()
    .from("stories")
    .update({ user_id: user.id, updated_at: new Date().toISOString() })
    .eq("id", req.params.id)
    .eq("claim_token", token.data.claimToken)
    .in("status", ["preview_ready", "auth_required", "payment_required"])
    .select("id")
    .maybeSingle();
  data
    ? res.json({ claimed: true })
    : res.status(409).json({
        code: "claim_failed",
        message: "Cette histoire n’a pas pu être rattachée à votre compte.",
      });
});
app.get("/api/library", async (req, res) => {
  const user = await auth(req, res);
  if (!user || user.is_anonymous)
    return res.status(401).json({ code: "account_required" });
  const db = service();
  const { data: stories } = await db
    .from("stories")
    .select(
      "id,title,child_name,status,format,page_count,cover_storage_path,pdf_storage_path,preview_generated_at,created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const books = await Promise.all(
    (stories ?? []).map(async (story) => {
      const { data: job } = await db
        .from("generation_jobs")
        .select("progress")
        .eq("story_id", story.id)
        .in("status", ["queued", "running"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return {
        ...story,
        progress: job?.progress ?? null,
        expiresAt:
          story.status !== "ready"
            ? new Date(
                new Date(
                  story.preview_generated_at ?? story.created_at,
                ).getTime() + previewRetentionMs,
              ).toISOString()
            : null,
        cover: story.cover_storage_path
          ? ((
              await db.storage
                .from("story-covers")
                .createSignedUrl(story.cover_storage_path, 600)
            ).data?.signedUrl ?? "")
          : "",
      };
    }),
  );
  res.json({ books });
});
app.get("/api/stories/:id/reader", async (req, res) => {
  const user = await auth(req, res);
  if (!user) return;
  const db = service();
  const { data: story } = await db
    .from("stories")
    .select(
      "id,status,title,child_name,page_count,format,emotional_goal,cover_storage_path,pdf_storage_path,claim_token",
    )
    .eq("id", req.params.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!story) return res.status(404).json({ code: "not_found" });
  const { data: records } = await db
    .from("story_pages")
    .select("page_number,text,illustration_storage_path")
    .eq("story_id", story.id)
    .order("page_number");
  const { data: latestFailedJob } = await db
    .from("generation_jobs")
    .select("error_code")
    .eq("story_id", story.id)
    .eq("status", "failed")
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const visible = (records ?? []).filter(
    (page) => page.page_number <= 2 || story.status === "ready",
  );
  const cover = story.cover_storage_path
    ? ((
        await db.storage
          .from("story-covers")
          .createSignedUrl(story.cover_storage_path, 600)
      ).data?.signedUrl ?? "")
    : "";
  const pages = await Promise.all(
    visible.map(async (page) => ({
      pageNumber: page.page_number,
      text: page.text,
      illustrationUrl: page.illustration_storage_path
        ? ((
            await db.storage
              .from("story-illustrations")
              .createSignedUrl(page.illustration_storage_path, 600)
          ).data?.signedUrl ?? "")
        : "",
    })),
  );
  if (story.status === "ready") {
    const morals: Record<string, string> = { calm: "Même quand tout bouge, on peut retrouver son calme tout doucement.", reassure: "On peut avoir peur et avancer quand même, surtout bien accompagné.", courage: "Le courage, c’est essayer même quand le cœur bat un peu fort.", dream: "Les rêves grandissent quand on ose les garder près de soi.", smile: "Un petit sourire peut rendre une grande aventure plus légère." };
    pages.push({ pageNumber: (story.page_count ?? pages.length) + 1, text: `À retenir\n\n${morals[story.emotional_goal ?? ""] ?? "Chaque aventure commence par un petit pas."}\n\nMerci d’avoir créé cette histoire avec l’équipe StoryKid.`, illustrationUrl: "" });
  }
  const { data: progress } = user.is_anonymous
    ? { data: null }
    : await db
        .from("reading_progress")
        .select("last_page")
        .eq("user_id", user.id)
        .eq("story_id", story.id)
        .maybeSingle();
  res.json({
    story: { ...story, generationError: latestFailedJob?.error_code ?? null },
    coverUrl: cover,
    pages,
    anonymous: Boolean(user.is_anonymous),
    initialPage: progress?.last_page ?? 1,
  });
});
app.put("/api/stories/:id/progress", async (req, res) => {
  const user = await auth(req, res);
  if (!user || user.is_anonymous)
    return res.status(401).json({ code: "unauthorized" });
  const page = z
    .object({ page: z.number().int().min(1).max(20) })
    .safeParse(req.body);
  if (!page.success) return res.status(400).json({ code: "invalid_progress" });
  const { data: story } = await service()
    .from("stories")
    .select("id,page_count")
    .eq("id", req.params.id)
    .eq("user_id", user.id)
    .eq("status", "ready")
    .maybeSingle();
  if (!story || page.data.page > story.page_count)
    return res.status(404).json({ code: "not_found" });
  await service().from("reading_progress").upsert(
    {
      user_id: user.id,
      story_id: req.params.id,
      last_page: page.data.page,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,story_id" },
  );
  res.json({ saved: true });
});
app.post("/api/stories/:id/checkout", async (req, res) => {
  const user = await auth(req, res);
  if (!user || user.is_anonymous)
    return res.status(401).json({
      code: "account_required",
      message: "Enregistrez d’abord votre histoire.",
    });
  if (!stripeSecret)
    return res.status(503).json({
      code: "stripe_not_configured",
      message: "Le paiement sécurisé n’est pas encore configuré.",
    });
  const body = z.object({ offerId: z.literal("standard") }).safeParse(req.body);
  if (!body.success) return res.status(400).json({ code: "invalid_offer" });
  const db = service();
  const { data: story } = await db
    .from("stories")
    .select("id,child_name,status")
    .eq("id", req.params.id)
    .eq("user_id", user.id)
    .in("status", ["preview_ready", "checkout_created"])
    .maybeSingle();
  if (!story)
    return res.status(409).json({
      code: "preview_required",
      message: "L’aperçu doit être prêt avant le paiement.",
    });
  const offer = STORY_OFFERS[body.data.offerId];
  if (story.status === "preview_ready")
    await db
      .from("stories")
      .update({
        status: "checkout_created",
        format: body.data.offerId,
        page_count: offer.pages,
      })
      .eq("id", story.id)
      .eq("status", "preview_ready");
  try {
    const session = await new Stripe(stripeSecret).checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: offer.priceCents,
            product_data: {
              name: `Histoire StoryKid de ${story.child_name}`,
              description: `${offer.pages} pages illustrées · accès permanent`,
            },
          },
        },
      ],
      success_url: `${origin}/paiement/succes?story_id=${story.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/paiement/annule?story_id=${story.id}`,
      metadata: {
        story_id: story.id,
        user_id: user.id,
        offer_id: body.data.offerId,
      },
    });
    res.json({ url: session.url });
  } catch {
    await db
      .from("stories")
      .update({ status: "preview_ready" })
      .eq("id", story.id);
    res.status(502).json({
      code: "checkout_failed",
      message: "Le paiement sécurisé n’a pas pu s’ouvrir.",
    });
  }
});
app.get("/api/stories/:id/pdf", async (req, res) => {
  const user = await auth(req, res);
  if (!user || user.is_anonymous)
    return res.status(401).json({ code: "account_required" });
  const db = service();
  const { data: story } = await db
    .from("stories")
    .select("pdf_storage_path,status")
    .eq("id", req.params.id)
    .eq("user_id", user.id)
    .eq("status", "ready")
    .maybeSingle();
  if (!story) return res.status(404).json({ code: "not_found" });
  if (!story.pdf_storage_path)
    return res.status(202).json({ status: "pdf_preparing" });
  const { data, error } = await db.storage
    .from("story-pdfs")
    .createSignedUrl(story.pdf_storage_path, 120, { download: true });
  if (error || !data) return res.status(503).json({ code: "pdf_unavailable" });
  res.json({ url: data.signedUrl });
});
app.post("/api/analytics", async (req, res) => {
  const user = await auth(req, res);
  if (!user) return;
  const parsed = z
    .object({
      eventName: z.enum(eventNames),
      storyId: z.string().uuid().optional(),
      metadata: z
        .record(
          z.string(),
          z.union([z.string().max(80), z.number(), z.boolean()]),
        )
        .default({}),
    })
    .safeParse(req.body);
  if (parsed.success)
    await service().from("analytics_events").insert({
      user_id: user.id,
      story_id: parsed.data.storyId,
      event_name: parsed.data.eventName,
      metadata: parsed.data.metadata,
    });
  res.status(202).json({ accepted: true });
});
app.post("/api/internal/generation", async (req, res) => {
  if (
    !process.env.CRON_SECRET ||
    req.header("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  )
    return res.status(401).json({ error: "unauthorized" });
  const result = await processNextGenerationJob();
  res.status(result.status).json(result.body);
});
app.get("/health", (_, res) => res.json({ ok: true }));
app.listen(port, () => console.log(`StoryKid API listening on ${port}`));
setInterval(() => {
  void processNextGenerationJob();
  void purgeExpiredPreviews();
}, 300_000).unref();
void purgeExpiredPreviews();
