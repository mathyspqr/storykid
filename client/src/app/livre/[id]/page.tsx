import { ReaderPage } from "@/components/story/reader-page";
export default async function LivrePage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{mode?:string;paywall?:string}>}){const {id}=await params;const {mode,paywall}=await searchParams;return <ReaderPage id={id} classic={mode==="classic"} initialPaywall={paywall==="1"}/>}
