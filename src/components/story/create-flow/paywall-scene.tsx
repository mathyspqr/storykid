"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Pencil, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { StudioAsset } from "@/components/story/create-flow/studio-asset";
import { StudioBook } from "@/components/story/create-flow/studio-object";
import type { CreationAnswers, PrePaywallTeaser } from "@/types/generation";

export function PaywallScene({ teaser, answers, checkoutMessage, onAudioChange, onCheckout, onEdit }: { teaser: PrePaywallTeaser; answers: CreationAnswers; checkoutMessage?: string; onAudioChange: (enabled:boolean)=>void; onCheckout:()=>void; onEdit:()=>void }) {
  const reduceMotion = useReducedMotion();
  const price = teaser.selectedPrice.toFixed(2).replace(".",",");
  return <main className="binding-studio paywall-studio binding-mood-reassuring"><div className="binding-grain" /><header className="binding-header"><BrandLogo className="[&_span:last-child]:text-[#f4ead9]" /><span className="paywall-secure"><ShieldCheck /> Paiement unique</span></header>
    <section className="paywall-copy"><span>Composition scellée</span><h1>L’histoire de {teaser.childName}<br/>peut prendre vie.</h1><p>{teaser.pageCount} pages illustrées, personnalisées à partir de vos choix.</p><ul><li><Check /> Histoire entièrement personnalisée</li><li><Check /> PDF à conserver</li><li><Check /> Sans abonnement</li></ul><button type="button" aria-label="Modifier mes réponses" onClick={onEdit} className="paywall-edit"><Pencil/> Modifier mes choix</button></section>
    <section className="paywall-product" aria-label="Livre générique fermé et scellé">
      <div className="paywall-halo" />
      <motion.div className="paywall-book" initial={{ opacity:0, y:38, rotate:-4 }} animate={{ opacity:1, y:0, rotate:0 }} whileHover={reduceMotion ? undefined : { y:-8, rotate:-1 }} transition={{ duration:.7,ease:[.22,1,.36,1] }}><StudioBook answers={answers} step={5} /></motion.div>
      <div className="paywall-decision">
        <button type="button" role="switch" aria-label="Ajouter l’audio" aria-checked={teaser.audioEnabled} onClick={() => onAudioChange(!teaser.audioEnabled)} className={`paywall-audio ${teaser.audioEnabled?"is-on":""}`}><span><StudioAsset id="audio" /></span><b>Ajouter l’audio</b><small>+ 3 €</small><i /></button>
        <div className="paywall-price"><span>{teaser.pageCount} pages · PDF</span><strong>{price} €</strong></div>
        <button type="button" aria-label={`Débloquer le mini-livre — ${price} €`} onClick={onCheckout} className="paywall-cta">Débloquer le mini-livre <span>{price} €</span></button>
        <small className="paywall-locked-note">Livre fermé · création après paiement</small>
        {checkoutMessage ? <p role="status">{checkoutMessage}</p> : null}
      </div>
    </section>
  </main>;
}
