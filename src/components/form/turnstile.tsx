"use client";

import { useEffect, useRef } from "react";

// Widget Cloudflare Turnstile auto-contenu : charge le script Cloudflare (une
// seule fois pour la page), monte le widget quand le composant apparaît, et
// remonte le jeton via `onVerify`. Rendu UNIQUEMENT si une clé publique est
// configurée — sinon il s'efface (repli gracieux en dev).
//
// La clé publique est inlinée au build par Next (préfixe NEXT_PUBLIC_).

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

// True si Turnstile est activé (clé publique présente). Les formulaires s'en
// servent pour exiger un jeton avant l'envoi.
export const TURNSTILE_ENABLED = !!SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

type TurnstileProps = {
  /** Appelé avec le jeton dès que le défi est résolu. */
  onVerify: (token: string) => void;
  /** Appelé sur expiration / erreur (le jeton précédent n'est plus valide). */
  onExpire?: () => void;
  className?: string;
};

export function Turnstile({ onVerify, onExpire, className }: TurnstileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  // Callbacks gardés à jour dans des refs (hors render) : le widget n'est monté
  // qu'une fois, mais doit toujours appeler la dernière version des handlers.
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    const el = ref.current;
    if (!SITE_KEY || !el) return;
    let cancelled = false;

    function mount() {
      if (cancelled || !window.turnstile || !el || el.childElementCount) return;
      widgetId.current = window.turnstile.render(el, {
        sitekey: SITE_KEY,
        callback: (t: string) => onVerifyRef.current(t),
        "error-callback": () => onExpireRef.current?.(),
        "expired-callback": () => onExpireRef.current?.(),
      });
    }

    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = mount;
      document.head.appendChild(s);
    } else {
      mount();
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={ref} className={className} />;
}
