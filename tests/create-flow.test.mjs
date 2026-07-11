import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import test from "node:test";
import { chromium } from "playwright";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
mkdirSync("test-results", { recursive: true });

async function advanceToPaywall(page) {
  await page.getByRole("button", { name: /Rendre le soir plus doux/ }).click();
  await page.getByRole("button", { name: "Continuer" }).click();

  await page.getByPlaceholder("Camille").fill("Lina");
  await page.getByRole("button", { name: "5", exact: true }).click();
  await page.getByRole("button", { name: "les animaux" }).click();
  await page.getByRole("button", { name: "Continuer" }).click();

  await page.getByRole("button", { name: /Poulpe lumineux/ }).click();
  await page.getByRole("button", { name: "Continuer" }).click();

  await page.getByRole("button", { name: /Rassuré/ }).click();
  await page.getByRole("button", { name: "Continuer" }).click();

  await page.getByRole("switch", { name: /Audio raconté/ }).click();
  await page.getByRole("button", { name: "Continuer" }).click();

  await page.getByPlaceholder(/tu peux prendre ton temps/).fill("Tu peux avancer à ton rythme.");
  await page.getByRole("button", { name: "Préparer la révélation" }).click();
  await page.getByText(/On rassemble vos choix|La révélation est prête/).waitFor();
  await page.waitForTimeout(700);
  await page.screenshot({ path: "test-results/pre-paywall-transition-desktop.png", fullPage: true });
  await page.getByRole("heading", { name: /peut prendre vie/ }).waitFor({ timeout: 6000 });
}

test("desktop: le tunnel mène au paywall sans génération pré-paiement", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    const forbiddenRequests = [];

    page.on("request", (request) => {
      if (/\/api\/(stories|images|audio|generate)|openai|replicate|stability/i.test(request.url())) {
        forbiddenRequests.push(request.url());
      }
    });

    await page.goto(`${baseURL}/creer`);
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.reload();
    await page.getByRole("heading", { name: /Quel moment accompagner/ }).waitFor();
    await page.screenshot({ path: "test-results/creer-desktop-start.png", fullPage: true });
    await page.getByRole("button", { name: /Rendre le soir plus doux/ }).click();
    await assert.doesNotReject(() => page.getByRole("button", { name: /Rendre le soir plus doux/ }).waitFor());
    assert.equal(await page.getByRole("button", { name: /Rendre le soir plus doux/ }).getAttribute("aria-pressed"), "true");
    await page.getByRole("button", { name: /Rendre le soir plus doux/ }).click();
    await advanceToPaywall(page);

    assert.equal(forbiddenRequests.length, 0, `Appels interdits: ${forbiddenRequests.join(", ")}`);
    assert.equal(await page.locator(".studio-book-token, .studio-book-anchor, .studio-book-emotion, .studio-book-audio").count(), 4, "Les quatre objets choisis doivent rester visibles jusqu’au paywall");
    await assert.doesNotReject(() => page.getByText(/Livre fermé · création après paiement/i).waitFor());
    await assert.doesNotReject(() => page.getByRole("button", { name: /7,99 €$/ }).waitFor());

    await assert.doesNotReject(() => page.getByLabel(/Livre générique fermé et scellé/).waitFor());
    await page.screenshot({ path: "test-results/creer-desktop-paywall.png", fullPage: true });

    const paywallAudio = page.getByRole("switch", { name: /Ajouter l’audio/ });
    await paywallAudio.click();
    await assert.doesNotReject(() => page.getByRole("button", { name: /4,99 €$/ }).waitFor());
    await paywallAudio.click();
    const checkoutButton = page.getByRole("button", { name: /Débloquer le mini-livre/ });
    await checkoutButton.click();
    await assert.doesNotReject(() => page.getByText(/checkout sécurisé/).waitFor());
    assert.equal(forbiddenRequests.length, 0, `Appels interdits après interaction checkout: ${forbiddenRequests.join(", ")}`);

    await page.getByRole("button", { name: "Modifier mes réponses" }).click();
    await assert.doesNotReject(() => page.getByRole("heading", { name: /Tout est juste/ }).waitFor());
  } finally {
    await browser.close();
  }
});

test("reduced-motion et mobile paysage restent utilisables", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 844, height: 390 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    await page.goto(`${baseURL}/creer`);
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.evaluate(() => {
      localStorage.setItem("storykid:lastInput", JSON.stringify({ childName: "Leo", childAge: "9+" }));
      localStorage.setItem("storykid:create-flow:v2", JSON.stringify({ answers: { childName: "Leo", age: "9+" } }));
    });
    await page.reload();
    await page.getByRole("heading", { name: /Quel moment accompagner/ }).waitFor();
    await page.getByRole("button", { name: /Rendre le soir plus doux/ }).click();
    assert.equal(await page.getByRole("button", { name: /Rendre le soir plus doux/ }).getAttribute("aria-pressed"), "true");
    const widths = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    assert.ok(widths.document <= widths.viewport, `Débordement paysage: ${JSON.stringify(widths)}`);
    await assert.doesNotReject(() => page.getByRole("button", { name: "Continuer" }).waitFor());
  } finally {
    await browser.close();
  }
});

test("mobile: validation, champ libre et absence de débordement horizontal", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    await page.goto(`${baseURL}/creer`);
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.reload();

    await page.getByRole("button", { name: "Continuer" }).click();
    const validationAlert = page.getByRole("alert").filter({ hasText: "Choisissez le moment" });
    await assert.doesNotReject(() => validationAlert.waitFor());
    assert.match(await validationAlert.textContent(), /Choisissez le moment/);

    await page.getByRole("button", { name: "Autre", exact: true }).click();
    const customNeed = page.getByPlaceholder(/dire au revoir à sa tétine/);
    await customNeed.fill("Apprivoiser le premier trajet en train");
    assert.equal(await customNeed.inputValue(), "Apprivoiser le premier trajet en train");
    await page.waitForTimeout(600);

    const inputBox = await customNeed.boundingBox();
    const footerBox = await page.locator("footer").boundingBox();
    assert.ok(inputBox && footerBox && inputBox.y + inputBox.height <= footerBox.y, "Le champ libre est masqué par le CTA fixe");

    const widths = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
    assert.ok(widths.document <= widths.viewport, `Débordement horizontal: ${JSON.stringify(widths)}`);
    await page.screenshot({ path: "test-results/creer-mobile-custom.png", fullPage: true });

    await page.reload();
    await assert.doesNotReject(() => customNeed.waitFor());
    assert.equal(await customNeed.inputValue(), "Apprivoiser le premier trajet en train");
    await page.getByRole("button", { name: "Continuer" }).click();
    const childNameInput = page.getByPlaceholder("Camille");
    assert.equal(await childNameInput.inputValue(), "", "Une ancienne valeur locale ne doit jamais préremplir le prénom");
    await childNameInput.fill("Lina");
    await page.getByRole("button", { name: "5", exact: true }).click();
    await page.getByRole("button", { name: "Continuer" }).click();

    await page.getByRole("button", { name: /Un repère bien à vous/ }).click();
    await page.getByPlaceholder(/couverture jaune de papi/).fill("la petite lampe orange");
    await page.getByRole("button", { name: "Continuer" }).click();
    await page.getByRole("button", { name: /Émerveillé/ }).click();
    await page.getByRole("button", { name: "Continuer" }).click();
    await page.getByRole("switch", { name: /Audio raconté/ }).click();
    await page.getByRole("button", { name: "Continuer" }).click();
    await page.getByRole("button", { name: "Préparer la révélation" }).click();
    await page.getByRole("heading", { name: /peut prendre vie/ }).waitFor({ timeout: 6000 });

    const paywallWidths = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
    assert.ok(paywallWidths.document <= paywallWidths.viewport, `Débordement du paywall mobile: ${JSON.stringify(paywallWidths)}`);
    await assert.doesNotReject(() => page.getByRole("button", { name: /7,99 €$/ }).waitFor());
    await page.screenshot({ path: "test-results/creer-mobile-paywall.png", fullPage: true });
  } finally {
    await browser.close();
  }
});

test("les collections, prénoms longs et ambiances restent ancrés", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 760 } });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    await page.goto(`${baseURL}/creer`);
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.reload();

    for (const label of ["Rendre le soir plus doux", "Aborder un nouveau départ", "Accueillir une grosse émotion", "L’aider à oser", "Trouver sa place", "Traverser un changement"]) {
      const option = page.getByRole("button", { name: label });
      await option.click();
      assert.equal(await option.getAttribute("aria-pressed"), "true");
    }
    await page.getByRole("button", { name: "Continuer" }).click();
    await page.getByPlaceholder("Camille").fill("Jean-Baptiste");
    await page.getByRole("button", { name: "8", exact: true }).click();
    await page.getByRole("button", { name: "Continuer" }).click();

    for (const label of ["Poulpe lumineux", "Doudou complice", "Petite étoile", "Renard veilleur", "Veilleuse dorée", "Cartable courageux"]) {
      const option = page.getByRole("button", { name: label });
      await option.click();
      assert.equal(await option.getAttribute("aria-pressed"), "true");
    }
    await page.getByRole("button", { name: "Continuer" }).click();
    for (const [label, mood] of [["Apaisé", "calm"], ["Rassuré", "reassuring"], ["Courageux", "brave"], ["Amusé", "playful"], ["Émerveillé", "magical"]]) {
      await page.getByRole("button", { name: label }).click();
      assert.ok((await page.locator("main.binding-studio").getAttribute("class")).includes(`binding-mood-${mood}`));
    }
    const widths = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    assert.ok(widths.document <= widths.viewport, `Débordement collection: ${JSON.stringify(widths)}`);
  } finally {
    await browser.close();
  }
});
