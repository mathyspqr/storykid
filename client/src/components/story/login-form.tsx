"use client";

import { Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function passwordChecks(password: string) {
  return [
    { label: "8 caractères minimum", valid: password.length >= 8 },
    { label: "une minuscule", valid: /[a-z]/.test(password) },
    { label: "une majuscule", valid: /[A-Z]/.test(password) },
    { label: "un chiffre", valid: /\d/.test(password) },
  ];
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
  const [mode, setMode] = useState<"login" | "signup" | "reset">(
    params.get("reset") === "1"
      ? "reset"
      : params.get("mode") === "signup"
        ? "signup"
        : "login",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const next = params.get("next")?.startsWith("/")
    ? params.get("next")!
    : "/bibliotheque";
  const checks = passwordChecks(password);
  const strongPassword = checks.every((check) => check.valid);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    if (mode !== "login" && !strongPassword) {
      setMessage("Choisissez un mot de passe plus robuste avant de continuer.");
      return;
    }
    if (mode !== "login" && password !== confirmation) {
      setMessage("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setBusy(true);
    const client = createSupabaseBrowserClient();
    if (!client) {
      setMessage("L’authentification n’est pas configurée.");
      setBusy(false);
      return;
    }
    if (mode === "reset") {
      const { error } = await client.auth.updateUser({ password });
      if (error) {
        setMessage(
          "Le lien de réinitialisation a expiré. Demandez-en un nouveau.",
        );
        setBusy(false);
        return;
      }
      setMessage(
        "Votre mot de passe a été mis à jour. Vous pouvez vous connecter.",
      );
      setBusy(false);
      setMode("login");
      setPassword("");
      setConfirmation("");
      router.replace("/connexion");
      return;
    }
    const result =
      mode === "login"
        ? await client.auth.signInWithPassword({ email, password })
        : await client.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${location.origin}${next}` },
          });
    if (result.error) {
      setMessage(
        mode === "login"
          ? "Adresse ou mot de passe incorrect."
          : "Impossible de créer ce compte. Vérifiez votre adresse et votre mot de passe.",
      );
      setBusy(false);
      return;
    }
    if (mode === "signup" && !result.data.session) {
      setMessage(
        "Votre compte est presque prêt : vérifiez l’email de confirmation envoyé.",
      );
      setBusy(false);
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function google() {
    setBusy(true);
    const client = createSupabaseBrowserClient();
    const { error } = client
      ? await client.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `${location.origin}${next}` },
        })
      : { error: new Error("configuration") };
    if (error) {
      setMessage("La connexion Google est indisponible.");
      setBusy(false);
    }
  }

  async function requestReset() {
    const client = createSupabaseBrowserClient();
    if (!email.includes("@")) {
      setMessage("Indiquez votre adresse email pour recevoir le lien.");
      return;
    }
    if (!client) {
      setMessage("L’authentification n’est pas configurée.");
      return;
    }
    setBusy(true);
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/connexion?reset=1`,
    });
    setBusy(false);
    setMessage(
      error
        ? "Le lien n’a pas pu être envoyé. Réessayez dans quelques instants."
        : "Si un compte existe pour cette adresse, un lien de réinitialisation vient d’être envoyé.",
    );
  }

  function toggleMode() {
    setMode(mode === "login" ? "signup" : "login");
    setMessage("");
    setConfirmation("");
    setShowPassword(false);
  }

  return (
    <form onSubmit={submit} className="login-form">
      {mode === "reset" ? (
        <div className="login-reset-intro">
          <strong>Choisissez un nouveau mot de passe</strong>
          <span>
            Utilisez un mot de passe que vous n’utilisez pas ailleurs.
          </span>
        </div>
      ) : null}
      {googleEnabled && mode !== "reset" ? (
        <>
          <button
            type="button"
            className="login-google"
            onClick={google}
            disabled={busy}
          >
            Continuer avec Google
          </button>
          <div className="login-separator">
            <span />
            ou
            <span />
          </div>
        </>
      ) : null}
      {mode !== "reset" ? (
        <label>
          <span>Adresse email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
      ) : null}
      <label className="login-password-field">
        <span>
          {mode === "reset" ? "Nouveau mot de passe" : "Mot de passe"}
        </span>
        <div>
          <input
            type={showPassword ? "text" : "password"}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
          <button
            type="button"
            className="login-password-toggle"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </label>
      {mode !== "login" ? (
        <>
          <div className="password-strength" aria-live="polite">
            <div className="password-strength-heading">
              <span>Sécurité du mot de passe</span>
              <strong className={strongPassword ? "is-strong" : ""}>
                {strongPassword ? "Robuste" : "À renforcer"}
              </strong>
            </div>
            <div className="password-strength-track" aria-hidden="true">
              <i
                className={`strength-${checks.filter((check) => check.valid).length}`}
              />
            </div>
            <ul>
              {checks.map((check) => (
                <li key={check.label} className={check.valid ? "is-valid" : ""}>
                  <Check aria-hidden="true" />
                  {check.label}
                </li>
              ))}
            </ul>
          </div>
          <label>
            <span>Confirmer le mot de passe</span>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              minLength={8}
              required
            />
          </label>
        </>
      ) : null}
      {message ? <p role="alert">{message}</p> : null}
      {mode === "login" ? (
        <button
          type="button"
          className="login-forgot"
          onClick={requestReset}
          disabled={busy}
        >
          Mot de passe oublié ?
        </button>
      ) : null}
      <button
        type="submit"
        disabled={busy || (mode !== "login" && !strongPassword)}
      >
        {busy
          ? mode === "login"
            ? "Connexion…"
            : "Mise à jour…"
          : mode === "login"
            ? "Se connecter"
            : mode === "reset"
              ? "Enregistrer mon mot de passe"
              : "Créer mon compte"}
      </button>
      <p className="login-switch">
        {mode === "reset"
          ? "Vous vous souvenez de votre mot de passe ?"
          : mode === "login"
            ? "Vous n’avez pas de compte ?"
            : "Vous avez déjà un compte ?"}{" "}
        <button
          type="button"
          onClick={() => (mode === "reset" ? setMode("login") : toggleMode())}
        >
          {mode === "login" ? "S’inscrire" : "Se connecter"}
        </button>
      </p>
      <div className="login-mark">
        <BrandLogo compact />
      </div>
    </form>
  );
}
