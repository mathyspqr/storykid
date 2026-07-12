import { redirect } from "next/navigation";
export default async function LegacyStoryPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; redirect(`/livre/${id}`); }
