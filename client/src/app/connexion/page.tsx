import { Suspense } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LoginForm } from "@/components/story/login-form";
export default function LoginPage(){return <main className="account-page"><header><BrandLogo/></header><section><p className="library-eyebrow">Votre espace privé</p><h1>Retrouvez vos histoires</h1><p>Connectez-vous pour ouvrir votre bibliothèque StoryKid.</p><Suspense><LoginForm/></Suspense></section></main>}
