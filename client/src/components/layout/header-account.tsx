"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronDown, LogOut, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function HeaderAccount() {
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    client.auth.getUser().then(({ data }) => setEmail(data.user && !data.user.is_anonymous ? data.user.email ?? null : null));
    const { data: { subscription } } = client.auth.onAuthStateChange((_, session) => setEmail(session?.user && !session.user.is_anonymous ? session.user.email ?? null : null));
    return () => subscription.unsubscribe();
  }, []);

  async function signOut(){await createSupabaseBrowserClient()?.auth.signOut();setOpen(false);setEmail(null);window.location.href="/";}

  useEffect(() => {
    function close(event: MouseEvent) { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); }
    function escape(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);

  if (!email) return <Link href="/connexion" className="inline-flex h-10 items-center rounded-xl border border-[#d7d5e4] px-4 text-sm font-extrabold text-[#303856] transition hover:border-[#6b55ef] hover:text-[#6b55ef]">Se connecter</Link>;

  return <div ref={ref} className="relative">
    <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-haspopup="menu" className={`inline-flex h-10 max-w-[190px] items-center gap-2 rounded-xl border px-3 text-sm font-extrabold transition-all duration-200 ${open ? "border-[#8a78ee] bg-[#f7f5ff] text-[#493bb9] shadow-[0_8px_20px_rgba(80,61,190,.12)]" : "border-[#d7d5e4] text-[#303856] hover:border-[#aaa1dc] hover:bg-[#fcfbff]"}`}>
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#e7e1ff] to-[#fff0e9] text-[10px] text-[#5d4dce]">{email[0]?.toUpperCase()}</span>
      <span className="truncate">{email}</span><ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
    </button>
    <AnimatePresence>
      {open ? <motion.div role="menu" initial={{ opacity: 0, y: -8, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: .98 }} transition={{ duration: .18, ease: [0.16, 1, 0.3, 1] }} className="absolute right-0 top-[52px] z-50 w-[258px] origin-top-right overflow-hidden rounded-[20px] border border-[#e5e1f2] bg-white/95 p-2 shadow-[0_24px_55px_rgba(40,27,99,.18)] backdrop-blur-xl">
        <div className="mb-1 flex items-center gap-2 rounded-[14px] bg-[#f7f5ff] px-3 py-2.5 text-[#63588d]"><Sparkles className="h-3.5 w-3.5 text-[#ff8b67]" /><span className="text-[10px] font-black uppercase tracking-[.14em]">Votre espace StoryKid</span></div>
        <Link role="menuitem" href="/bibliotheque" onClick={() => setOpen(false)} className="group flex items-center gap-3 rounded-[14px] px-3 py-3 text-sm font-extrabold text-[#2f3856] transition hover:bg-[#f3f0ff] hover:text-[#5a48ca]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eeeaff] text-[#6958dc] transition group-hover:scale-105"><BookOpen className="h-[17px] w-[17px]" /></span>
          <span className="flex-1">Ma bibliothèque</span><span className="text-lg font-normal text-[#b1aad5] transition group-hover:translate-x-0.5">›</span>
        </Link>
        <button type="button" role="menuitem" onClick={signOut} className="flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-extrabold text-[#6d7490] transition hover:bg-[#fff3ef] hover:text-[#d65c4f]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f5f3fa]"><LogOut className="h-[17px] w-[17px]" /></span><span>Se déconnecter</span></button>
      </motion.div> : null}
    </AnimatePresence>
  </div>;
}
