import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import PDFDocument from "pdfkit";
import {
  callGemini,
  callTextGeneration,
  generateStoryPreview,
} from "./gemini.js";
import { serviceConfig } from "../supabase/server.js";

type Job = {
  id: string;
  story_id: string;
  job_type: "preview" | "full_generation";
  attempt_count: number;
};
const pagesSchema = z.object({
  pages: z.array(
    z.object({
      pageNumber: z.number().int(),
      text: z.string().min(40).max(1500),
      imagePrompt: z.string().min(10).max(1500),
    }),
  ),
});

async function createPdf(
  service: SupabaseClient,
  story: {
    id: string;
    user_id: string;
    title: string;
    child_name: string;
    cover_storage_path: string | null;
  },
) {
  const { data: pages, error } = await service
    .from("story_pages")
    .select("page_number,text,illustration_storage_path")
    .eq("story_id", story.id)
    .order("page_number");
  if (error || !pages) throw new Error("PDF_PAGES_MISSING");
  const download = async (bucket: string, path: string | null) => {
    if (!path) return null;
    const image = await service.storage.from(bucket).download(path);
    return image.data ? Buffer.from(await image.data.arrayBuffer()) : null;
  };
  const [cover, renderedPages] = await Promise.all([
    download("story-covers", story.cover_storage_path),
    Promise.all(
      pages.map(async (page) => ({
        ...page,
        image: await download(
          "story-illustrations",
          page.illustration_storage_path,
        ),
      })),
    ),
  ]);
  const pdf = await new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.fontSize(12).fillColor("#6b55ef").text("STORYKID", { align: "center" });
    doc.moveDown();
    if (cover) {
      doc.image(cover, { fit: [430, 465], align: "center" });
      doc.moveDown(1.2);
    }
    doc
      .fontSize(31)
      .fillColor("#111737")
      .text(story.title, { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(15)
      .fillColor("#5f6680")
      .text(`Une histoire pour ${story.child_name}`, { align: "center" });
    for (const page of renderedPages) {
      doc.addPage();
      doc
        .fontSize(10)
        .fillColor("#6b55ef")
        .text(`PAGE ${page.page_number}`, { align: "right" });
      if (page.image) {
        doc.moveDown(0.5);
        doc.image(page.image, { fit: [495, 300], align: "center" });
        doc.moveDown();
      }
      doc
        .fontSize(17)
        .fillColor("#22253c")
        .text(page.text, { lineGap: 7, align: "left" });
    }
    doc.end();
  });
  const path = `${story.user_id}/${story.id}/book.pdf`;
  const uploaded = await service.storage
    .from("story-pdfs")
    .upload(path, pdf, { contentType: "application/pdf", upsert: true });
  if (uploaded.error) throw uploaded.error;
  return path;
}

async function processPreview(service: SupabaseClient, job: Job) {
  const { data: story } = await service
    .from("stories")
    .select("*")
    .eq("id", job.story_id)
    .single();
  if (!story) throw new Error("STORY_INPUT_MISSING");
  await service
    .from("stories")
    .update({
      status: "preview_generating",
      updated_at: new Date().toISOString(),
    })
    .eq("id", story.id);
  await service
    .from("generation_jobs")
    .update({ progress: 8 })
    .eq("id", job.id);
  const preview = await generateStoryPreview({
    childName: story.child_name,
    childAge: story.child_age,
    childPronoun: story.child_pronoun ?? "neutral",
    personalDetail: story.personal_detail,
    moment: story.moment,
    universe: story.universe,
    companion: story.companion,
    emotionalGoal: story.emotional_goal,
    tone: story.tone,
  });
  await service
    .from("generation_jobs")
    .update({ progress: 55 })
    .eq("id", job.id);
  const coverExt = preview.coverMime.includes("jpeg") ? "jpg" : "png";
  const coverPath = `${story.user_id}/${story.id}/preview-cover.${coverExt}`;
  const coverUpload = await service.storage
    .from("story-covers")
    .upload(coverPath, preview.coverBytes, {
      contentType: preview.coverMime,
      upsert: true,
    });
  if (coverUpload.error) throw coverUpload.error;
  await Promise.all(
    preview.pages.map(async (page, index) => {
      const ext = page.imageMime.includes("jpeg") ? "jpg" : "png";
      const path = `${story.user_id}/${story.id}/page-${page.pageNumber}.${ext}`;
      const upload = await service.storage
        .from("story-illustrations")
        .upload(path, page.imageBytes, {
          contentType: page.imageMime,
          upsert: true,
        });
      if (upload.error) throw upload.error;
      const { error } = await service.from("story_pages").upsert(
        {
          story_id: story.id,
          page_number: page.pageNumber,
          text: page.text,
          illustration_storage_path: path,
          is_preview: true,
        },
        { onConflict: "story_id,page_number" },
      );
      if (error) throw error;
      await service
        .from("generation_jobs")
        .update({ progress: 72 + index * 12 })
        .eq("id", job.id);
    }),
  );
  const { error: storyError } = await service
    .from("stories")
    .update({
      status: "preview_ready",
      title: preview.title,
      cover_storage_path: coverPath,
      preview_generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", story.id);
  if (storyError) throw storyError;
  await service.from("analytics_events").insert({
    user_id: story.user_id,
    story_id: story.id,
    event_name: "preview_ready",
    metadata: {},
  });
}

async function processFull(service: SupabaseClient, job: Job) {
  await service
    .from("stories")
    .update({ status: "full_generating", updated_at: new Date().toISOString() })
    .eq("id", job.story_id);
  await service
    .from("generation_jobs")
    .update({ progress: 12 })
    .eq("id", job.id);
  const { data: story } = await service
    .from("stories")
    .select("*")
    .eq("id", job.story_id)
    .single();
  const { data: previewPages } = await service
    .from("story_pages")
    .select("page_number,text")
    .eq("story_id", job.story_id)
    .lte("page_number", 2)
    .order("page_number");
  if (!story || !previewPages || previewPages.length < 2)
    throw new Error("STORY_INPUT_MISSING");
  const coverDownload = story.cover_storage_path
    ? await service.storage
        .from("story-covers")
        .download(story.cover_storage_path)
    : null;
  const coverReference = coverDownload?.data
    ? {
        inlineData: {
          mimeType: coverDownload.data.type || "image/png",
          data: Buffer.from(await coverDownload.data.arrayBuffer()).toString(
            "base64",
          ),
        },
      }
    : null;
  const opening = previewPages
    .map((page) => `Page ${page.page_number}: ${page.text}`)
    .join("\n");
  const response = await callTextGeneration({
    contents: [
      {
        parts: [
          {
            text: `Continue exactement cette histoire pour enfant sans réécrire les DEUX premières pages. Titre conservé: ${story.title}. Ouverture conservée mot pour mot:\n${opening}\nConfiguration: ${JSON.stringify({ name: story.child_name, age: story.child_age, moment: story.moment, universe: story.universe, companion: story.companion, goal: story.emotional_goal, tone: story.tone, childPronoun: story.child_pronoun ?? "neutral", personalDetail: story.personal_detail ?? null })}. Le héros est TOUJOURS un enfant humain : ne le transforme jamais en animal, créature ou mascotte. Seul le compagnon peut être un animal. Le détail personnel, le moment, l’univers, le compagnon, l’intention et le ton sont les fondations de l’intrigue : ils doivent faire avancer les actions et être visibles dans les imagePrompt, pas seulement être mentionnés. Si un détail personnel existe, il doit revenir naturellement comme fil rouge et trouver une résolution sur la dernière page. Crée les pages 3 à ${story.page_count}, chacune 80 à 130 mots, continuité stricte, fin rassurante et non médicale. Chaque page doit se dérouler dans une scène visuellement unique : lieu, action, moment de la journée et cadrage différents. Les imagePrompt ne doivent jamais réutiliser une même chambre, pose ou composition. La dernière page doit montrer une conclusion nouvelle et lumineuse, différente de toute scène précédente, et se terminer par une courte section « À retenir : … » adaptée à l’histoire. Écris pour ${story.child_age} ans : phrases courtes, mots du quotidien, vocabulaire concret, une idée par phrase, texte fluide à lire le soir. Évite les mots abstraits, rares, trop longs et les formulations d'adulte. Retourne uniquement JSON: {"pages":[{"pageNumber":3,"text":"...","imagePrompt":"..."}]}.`,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.72,
    },
  });
  const raw = response.candidates?.[0]?.content?.parts?.find(
    (part: { text?: string }) => part.text,
  )?.text;
  if (!raw) throw new Error("FULL_TEXT_EMPTY");
  const { pages } = pagesSchema.parse(JSON.parse(raw));
  await service
    .from("generation_jobs")
    .update({ progress: 34 })
    .eq("id", job.id);
  if (
    pages.length !== story.page_count - 2 ||
    pages.some((page, index) => page.pageNumber !== index + 3)
  )
    throw new Error("FULL_PAGE_COUNT_INVALID");
  let previousReference = coverReference?.inlineData ?? null;
  for (const page of pages) {
    const otherScenes = pages
      .filter((candidate) => candidate.pageNumber !== page.pageNumber)
      .map(
        (candidate) => `Page ${candidate.pageNumber}: ${candidate.imagePrompt}`,
      )
      .join(" | ");
    const image = await callGemini("gemini-3.1-flash-image", {
      contents: [
        {
          parts: [
            {
              text: `Illustration intérieure StoryKid en composition horizontale 3:2, conçue pour s’intégrer à une page de livre. Le héros est TOUJOURS un enfant humain : ne le transforme jamais en animal, créature ou mascotte. Utilise les images de référence fournies comme bible visuelle stricte : même enfant humain, même visage, coiffure, vêtements, proportions, palette et direction artistique. Seul le compagnon peut être un animal. Laisse une marge de sécurité autour des personnages. Nouvelle scène unique pour cette page : ${page.imagePrompt}. Elle doit être clairement différente de ces autres scènes : ${otherScenes}. ${story.personal_detail ? `Élément visuel obligatoire : ${story.personal_detail}. Si une franchise connue est citée, crée un équivalent original sans logo ni personnage protégé reconnaissable.` : ""} Aucun texte ni logo.`,
            },
            ...(coverReference ? [coverReference] : []),
            ...(previousReference ? [{ inlineData: previousReference }] : []),
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: "3:2" },
      },
    });
    const inline = image.candidates?.[0]?.content?.parts?.find(
      (part: { inlineData?: { data: string; mimeType: string } }) =>
        part.inlineData,
    )?.inlineData;
    if (!inline) throw new Error(`IMAGE_${page.pageNumber}_EMPTY`);
    previousReference = inline;
    const extension = inline.mimeType?.includes("jpeg") ? "jpg" : "png";
    const path = `${story.user_id}/${story.id}/page-${page.pageNumber}.${extension}`;
    const uploaded = await service.storage
      .from("story-illustrations")
      .upload(path, Buffer.from(inline.data, "base64"), {
        contentType: inline.mimeType ?? "image/png",
        upsert: true,
      });
    if (uploaded.error) throw uploaded.error;
    const { error } = await service.from("story_pages").upsert(
      {
        story_id: story.id,
        page_number: page.pageNumber,
        text:
          page.pageNumber === story.page_count
            ? `${page.text}\n\nMerci d’avoir créé cette histoire avec StoryKid.`
            : page.text,
        illustration_storage_path: path,
        is_preview: false,
      },
      { onConflict: "story_id,page_number" },
    );
    if (error) throw error;
  }
  await service
    .from("generation_jobs")
    .update({ progress: 84 })
    .eq("id", job.id);
  const pdfPath = await createPdf(service, story);
  await service
    .from("generation_jobs")
    .update({ progress: 96 })
    .eq("id", job.id);
  await service
    .from("stories")
    .update({
      status: "ready",
      pdf_storage_path: pdfPath,
      full_generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", story.id);
  await service.from("analytics_events").insert({
    user_id: story.user_id,
    story_id: story.id,
    event_name: "full_story_ready",
    metadata: { pages: story.page_count },
  });
}

export async function processNextGenerationJob() {
  const config = serviceConfig();
  const service = createClient(config.url, config.key, {
    auth: { persistSession: false },
  });
  const { data, error } = await service.rpc("claim_next_generation_job");
  if (error)
    return {
      body: { processed: false, error: "job_claim_failed" },
      status: 500,
    };
  const job = data?.[0] as Job | undefined;
  if (!job) return { body: { processed: false }, status: 200 };
  try {
    if (job.job_type === "preview") await processPreview(service, job);
    else await processFull(service, job);
    await service
      .from("generation_jobs")
      .update({
        status: "completed",
        progress: 100,
        completed_at: new Date().toISOString(),
      })
      .eq("id", job.id);
    return {
      body: { processed: true, storyId: job.story_id, jobType: job.job_type },
      status: 200,
    };
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Unknown";
    const isTransientGeminiError = [
      "GEMINI_429",
      "GEMINI_500",
      "GEMINI_502",
      "GEMINI_503",
      "GEMINI_504",
    ].includes(message);
    if (isTransientGeminiError && job.attempt_count < 3) {
      const retryDelayMs = 15_000 * 2 ** (job.attempt_count - 1);
      await service
        .from("generation_jobs")
        .update({
          status: "queued",
          progress: 8,
          error_code: "RETRYING_AFTER_TRANSIENT_ERROR",
          error_message: message.slice(0, 500),
          started_at: null,
          completed_at: null,
        })
        .eq("id", job.id);
      await service
        .from("stories")
        .update({
          status:
            job.job_type === "preview"
              ? "preview_queued"
              : "full_generation_queued",
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.story_id);
      setTimeout(() => void processNextGenerationJob(), retryDelayMs).unref();
      return { body: { processed: false, retrying: true }, status: 202 };
    }
    await service
      .from("generation_jobs")
      .update({
        status: "failed",
        error_code: message.startsWith("GEMINI_")
          ? message
          : "GENERATION_FAILED",
        error_message: message.slice(0, 500),
        completed_at: new Date().toISOString(),
      })
      .eq("id", job.id);
    await service
      .from("stories")
      .update({
        status:
          job.job_type === "preview" ? "preview_failed" : "generation_failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.story_id);
    return {
      body: { processed: false, error: "generation_failed" },
      status: 500,
    };
  }
}
