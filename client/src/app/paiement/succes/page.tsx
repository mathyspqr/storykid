"use client";

import { CheckCircle2, LoaderCircle } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

function PaymentSuccessContent(){const params=useSearchParams();const router=useRouter();const storyId=params.get("story_id");const [confirmed,setConfirmed]=useState(false);useEffect(()=>{if(!storyId)return;let stopped=false;const check=async()=>{const response=await apiFetch(`/api/stories/${storyId}/status`,{cache:"no-store"});if(!response.ok||stopped)return;const story=await response.json();if(["full_generation_queued","full_generating","ready"].includes(story.status)){setConfirmed(true);window.setTimeout(()=>router.replace(`/livre/${storyId}`),450);}};void check();const timer=window.setInterval(()=>void check(),1200);return()=>{stopped=true;window.clearInterval(timer)}},[router,storyId]);return <main className="reader-state payment-success-state">{confirmed?<><CheckCircle2/><h1>Paiement confirmé</h1><p>Votre livre s’ouvre maintenant.</p></>:<><LoaderCircle/><h1>Confirmation du paiement…</h1><p>Nous sécurisons votre achat avant d’ouvrir votre histoire.</p></>}</main>}
export default function PaymentSuccess(){return <Suspense fallback={<main className="reader-state"><LoaderCircle/><h1>Confirmation du paiement…</h1></main>}><PaymentSuccessContent/></Suspense>}
