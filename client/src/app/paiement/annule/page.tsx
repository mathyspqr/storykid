"use client";
import Link from "next/link";import { Suspense,useEffect } from "react";import { useSearchParams } from "next/navigation";import { apiFetch } from "@/lib/api";
function Cancelled(){const params=useSearchParams();const id=params.get("story_id");useEffect(()=>{if(id)void apiFetch(`/api/stories/${id}/cancel-checkout`,{method:"POST"})},[id]);return <main className="reader-state"><h1>Paiement annulé</h1><p>Votre aperçu et vos réponses sont conservés. Aucun paiement n’a été effectué.</p><Link href={id?`/livre/${id}`:"/bibliotheque"}>Revenir à l’aperçu</Link></main>}
export default function PaymentCancelled(){return <Suspense fallback={<main className="reader-state"><h1>Préparation du retour…</h1></main>}><Cancelled/></Suspense>}
