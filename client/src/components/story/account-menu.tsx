"use client";
import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AccountMenu(){const router=useRouter();const [busy,setBusy]=useState(false);async function logout(){setBusy(true);const client=createSupabaseBrowserClient();await client?.auth.signOut();router.push("/");router.refresh()}return <div className="account-menu"><Link href="/compte"><UserRound/> Mon compte</Link><button type="button" onClick={logout} disabled={busy}><LogOut/> {busy?"Déconnexion…":"Se déconnecter"}</button></div>}
