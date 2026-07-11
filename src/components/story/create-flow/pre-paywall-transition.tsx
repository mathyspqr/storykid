"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { StudioBook } from "@/components/story/create-flow/studio-object";
import type { CreationAnswers } from "@/types/generation";

export function PrePaywallTransition({ answers, onComplete }: { answers: CreationAnswers; onComplete: () => void }) {
  const reduce = useReducedMotion(); const [sealed, setSealed] = useState(false);
  useEffect(() => { const a = window.setTimeout(() => setSealed(true), reduce ? 100 : 650); const b = window.setTimeout(onComplete, reduce ? 350 : 1650); return () => { clearTimeout(a); clearTimeout(b); }; }, [onComplete, reduce]);
  return <main className="binding-studio reveal-stage"><div className="binding-grain" /><header className="binding-header"><BrandLogo className="[&_span:last-child]:text-[#f4ead9]" /></header><div className="reveal-focus">
    <motion.div initial={{ scale:.72, y:80, rotate:-7 }} animate={{ scale:1.08, y:0, rotate:0 }} transition={{ duration:reduce?0:.78, ease:[.22,1,.36,1] }}><StudioBook answers={answers} step={5} /></motion.div>
    <motion.p key={String(sealed)} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>{sealed ? "La révélation est prête" : "On rassemble vos choix"}</motion.p>
    <motion.i initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:reduce?0:1.4, ease:[.22,1,.36,1] }} />
  </div></main>;
}
