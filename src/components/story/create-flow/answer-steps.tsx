"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Headphones, PencilLine, Plus, Quote } from "lucide-react";
import { useEffect, useRef } from "react";
import { anchorOptions, feelingOptions, formatOptions, interestOptions, needOptions } from "@/components/story/create-flow/create-flow-data";
import { StudioAsset } from "@/components/story/create-flow/studio-asset";
import { labelForFeeling } from "@/lib/pre-paywall-teaser";
import type { CreationAnswers } from "@/types/generation";

type UpdateAnswers = <K extends keyof CreationAnswers>(key: K, value: CreationAnswers[K]) => void;

function CompactCustomField({ open, value, onChange, label, placeholder }: { open: boolean; value: string; onChange: (value: string) => void; label: string; placeholder: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 180); }, [open]);
  return <AnimatePresence initial={false}>{open ? <motion.label initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    <span className="sr-only">{label}</span><span className="studio-inline-field"><PencilLine /><input ref={inputRef} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></span>
  </motion.label> : null}</AnimatePresence>;
}

function Question({ number, label, children }: { number: string; label: string; children: React.ReactNode }) {
  return <div className="binding-question"><span>{number} · {label}</span><h1>{children}</h1></div>;
}

export function NeedStep({ answers, update }: { answers: CreationAnswers; update: UpdateAnswers }) {
  const short = ["Le soir", "Nouveau départ", "Grande émotion", "Oser", "Trouver sa place", "Changement"];
  return <div className="need-experience">
    <Question number="01" label="Le moment">Quel moment accompagner&nbsp;?</Question>
    <fieldset className="need-orbit"><legend className="sr-only">Moment à accompagner</legend>
      {needOptions.map((option, index) => { const selected = answers.need === option.value; return <motion.button key={option.value} type="button" aria-label={option.label} aria-pressed={selected} onClick={() => update("need", option.value)} whileTap={{ scale: .94 }} animate={{ y: selected ? -12 : 0, opacity: answers.need && !selected ? .42 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className={`need-object need-object-${index + 1} ${selected ? "is-selected" : ""}`}>
        <span className="need-object-pedestal"><StudioAsset id={option.value} /></span><span className="need-object-label">{short[index]}</span>
      </motion.button>; })}
      <button type="button" aria-pressed={answers.need === "custom"} onClick={() => update("need", "custom")} className={`need-custom ${answers.need === "custom" ? "is-selected" : ""}`}><Plus /> Autre</button>
    </fieldset>
    <div className="need-custom-field"><CompactCustomField open={answers.need === "custom"} value={answers.customNeed ?? ""} onChange={(v) => update("customNeed", v)} label="Décrivez ce moment" placeholder="Par exemple : dire au revoir à sa tétine" /></div>
  </div>;
}

export function ChildStep({ answers, update }: { answers: CreationAnswers; update: UpdateAnswers }) {
  function toggleInterest(value: string) { update("interests", answers.interests.includes(value) ? answers.interests.filter((x) => x !== value) : [...answers.interests, value].slice(-2)); }
  return <div className="child-experience">
    <Question number="02" label="L’enfant">Pour qui est cette histoire&nbsp;?</Question>
    <div className="child-tag-workbench"><div className="child-thread" /><div className="child-tag">
      <label><span>Son prénom</span><input aria-label="Son prénom" value={answers.childName} onChange={(e) => update("childName", e.target.value)} autoComplete="off" maxLength={30} placeholder="Camille" className="child-name-input" /></label>
      <fieldset className="child-age-dial"><legend>Son âge</legend><div>{["3","4","5","6","7","8","9+"].map(age => <motion.button key={age} type="button" aria-pressed={answers.age === age} onClick={() => update("age", age)} whileTap={{ scale: .92 }} className={answers.age === age ? "is-selected" : ""}>{age}</motion.button>)}</div></fieldset>
    </div><fieldset className="child-charms"><legend>Deux petits goûts <span>· optionnel</span></legend><div>
      {interestOptions.map(x => <button key={x} type="button" aria-pressed={answers.interests.includes(x)} onClick={() => toggleInterest(x)} className={answers.interests.includes(x) ? "is-selected" : ""}>{x}</button>)}
      <button type="button" className="child-charm-other" onClick={() => update("customInterests", answers.customInterests === undefined ? " " : undefined)}>+ autre détail</button>
    </div><div className="child-custom-field"><CompactCustomField open={answers.customInterests !== undefined} value={answers.customInterests?.trimStart() ?? ""} onChange={(v) => update("customInterests", v)} label="Autre détail" placeholder="Par exemple : son train en bois" /></div></fieldset></div>
  </div>;
}

export function AnchorStep({ answers, update }: { answers: CreationAnswers; update: UpdateAnswers }) {
  return <div className="anchor-experience"><Question number="03" label="Le repère">Quel repère l’accompagnera&nbsp;?</Question>
    <fieldset className="anchor-shelf"><legend className="sr-only">Repère narratif</legend><div className="anchor-shelf-line" />
      {anchorOptions.map((option, index) => { const selected = answers.storyAnchor === option.value; return <motion.button key={option.value} type="button" aria-label={option.label} aria-pressed={selected} onClick={() => update("storyAnchor", option.value)} whileTap={{ scale: .94 }} animate={{ y: selected ? -13 : 0, opacity: answers.storyAnchor && !selected ? .66 : 1 }} className={`anchor-object anchor-object-${index + 1} ${selected ? "is-selected" : ""}`}><span className="anchor-dome"><StudioAsset id={option.value} /></span><span>{option.label}</span></motion.button>; })}
      <button type="button" aria-pressed={answers.storyAnchor === "custom"} onClick={() => update("storyAnchor", "custom")} className="anchor-custom"><Plus /> Un repère bien à vous</button>
    </fieldset><div className="anchor-custom-field"><CompactCustomField open={answers.storyAnchor === "custom"} value={answers.customStoryAnchor ?? ""} onChange={(v) => update("customStoryAnchor", v)} label="Votre repère" placeholder="Par exemple : la couverture jaune de papi" /></div>
  </div>;
}

export function FeelingStep({ answers, update }: { answers: CreationAnswers; update: UpdateAnswers }) {
  return <div className={`feeling-experience mood-${answers.desiredFeeling || "neutral"}`}><Question number="04" label="L’émotion">Quelle émotion garder&nbsp;?</Question>
    <fieldset className="feeling-console"><legend className="sr-only">Sensation finale</legend><div className="feeling-dials">
      {feelingOptions.map((option, index) => { const selected = answers.desiredFeeling === option.value; return <motion.button key={option.value} type="button" aria-label={option.label} aria-pressed={selected} onClick={() => update("desiredFeeling", option.value)} whileTap={{ scale: .96 }} className={`feeling-dial feeling-dial-${index + 1} ${selected ? "is-selected" : ""}`}><span className="emotion-object-frame"><StudioAsset id={option.value} /></span><b>{option.label}</b></motion.button>; })}
    </div></fieldset>
  </div>;
}

export function FormatStep({ answers, update }: { answers: CreationAnswers; update: UpdateAnswers }) {
  const total = answers.audioEnabled ? "7,99 €" : "4,99 €";
  return <div className="format-experience"><Question number="05" label="Le format">Quel volume ce soir&nbsp;?</Question>
    <fieldset className="format-bench"><legend className="sr-only">Nombre de pages</legend>{formatOptions.map((option, index) => <motion.button key={option.value} type="button" aria-label={`${option.label}, ${option.note}, 4,99 €`} aria-pressed={answers.pageCount === option.value} onClick={() => update("pageCount", option.value)} animate={{ y: answers.pageCount === option.value ? -10 : 0 }} whileTap={{ scale:.96 }} className={`format-volume format-volume-${index + 1} ${answers.pageCount === option.value ? "is-selected" : ""}`}><span className="format-closed-book"><i /><b /></span><strong>{option.label}</strong><small>{index === 0 ? "Rituel court · 4,99 €" : "Rituel complet · 4,99 €"}</small></motion.button>)}</fieldset>
    <button type="button" role="switch" aria-label="Audio raconté" aria-checked={answers.audioEnabled} onClick={() => update("audioEnabled", !answers.audioEnabled)} className={`audio-knob ${answers.audioEnabled ? "is-on" : ""}`}><span><StudioAsset id="audio" /></span><b>Audio raconté</b><small>+ 3 €</small></button>
    <div className="format-total"><span>Votre sélection</span><strong>{total}</strong><small>Paiement unique</small></div>
  </div>;
}

export function SummaryStep({ answers, update, onEdit }: { answers: CreationAnswers; update: UpdateAnswers; onEdit: (step: number) => void }) {
  return <div className="summary-experience"><Question number="06" label="La composition">Tout est juste&nbsp;?</Question>
    <div className="summary-objects">
      <button type="button" onClick={() => onEdit(0)} className="summary-object summary-object-moment"><StudioAsset id={answers.need} variant="summary" /><span>Moment</span></button>
      <button type="button" onClick={() => onEdit(2)} className="summary-object summary-object-companion"><StudioAsset id={answers.storyAnchor} variant="summary" /><span>Repère</span></button>
      <button type="button" onClick={() => onEdit(3)} className={`summary-object summary-object-feeling feeling-dial-${feelingOptions.findIndex(option => option.value === answers.desiredFeeling) + 1}`}><StudioAsset id={answers.desiredFeeling} variant="summary" /><span>{labelForFeeling(answers)}</span></button>
      <button type="button" onClick={() => onEdit(4)} className="summary-object summary-object-format"><span className={`summary-format-book is-${answers.pageCount}`}><i /></span><span>{answers.pageCount} pages</span></button>
      <button type="button" role="switch" aria-checked={answers.audioEnabled} onClick={() => update("audioEnabled", !answers.audioEnabled)} className={`summary-object summary-object-audio ${answers.audioEnabled ? "is-on" : ""}`}>{answers.audioEnabled ? <StudioAsset id="audio" variant="summary" /> : <Headphones />}<span>{answers.audioEnabled ? "Audio" : "Sans audio"}</span></button>
    </div>
    <label className="summary-note"><span><Quote /> Un mot doux <small>· optionnel</small></span><input value={answers.parentIntent ?? ""} onChange={(e) => update("parentIntent",e.target.value)} maxLength={120} placeholder="tu peux prendre ton temps" /></label>
    <p className="summary-honesty">Rien n’est encore créé. La révélation commence après paiement.</p>
  </div>;
}
