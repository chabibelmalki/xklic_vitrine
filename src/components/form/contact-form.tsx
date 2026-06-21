"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, PartyPopper, Send } from "lucide-react";
import { contactSchema, type ContactValues } from "@/lib/contact-schema";
import { Field, TextInput, TextArea } from "@/components/form/fields";
import { Turnstile, TURNSTILE_ENABLED } from "@/components/form/turnstile";
import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/utils";

type Status = "form" | "submitting" | "done" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("form");
  const [token, setToken] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", phone: "", message: "", company: "" },
  });

  const onSubmit = async (values: ContactValues) => {
    // Anti-robot : si Turnstile est activé, on exige un jeton avant l'envoi.
    if (TURNSTILE_ENABLED && !token) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken: token || undefined }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("done");
    } catch {
      setStatus("error");
      setToken("");
    }
  };

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="rounded-card border border-line bg-ink-soft px-6 py-12 text-center shadow-card"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ember/10 text-ember-soft">
          <PartyPopper size={26} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-light text-cream">
          Message envoyé !
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cream-muted">
          Merci, on te recontacte très vite. Tu peux aussi nous joindre directement
          par téléphone ou WhatsApp.
        </p>
      </motion.div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5 rounded-card border border-line bg-ink-soft/60 p-6 shadow-card sm:p-8"
    >
      {/* Honeypot anti-bot — invisible, hors flux, ignoré des humains. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register("company")}
      />

      <Field label="Nom" htmlFor="name" error={errors.name?.message}>
        <TextInput
          id="name"
          placeholder="Ton nom"
          invalid={!!errors.name}
          {...register("name")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
          <TextInput
            id="email"
            type="email"
            inputMode="email"
            placeholder="toi@exemple.fr"
            invalid={!!errors.email}
            {...register("email")}
          />
        </Field>
        <Field
          label="Téléphone"
          htmlFor="phone"
          optional
          error={errors.phone?.message}
        >
          <TextInput
            id="phone"
            type="tel"
            inputMode="tel"
            placeholder="06 12 34 56 78"
            invalid={!!errors.phone}
            {...register("phone")}
          />
        </Field>
      </div>

      <Field label="Message" htmlFor="message" error={errors.message?.message}>
        <TextArea
          id="message"
          placeholder="Dis-nous en quelques mots ce dont tu as besoin…"
          invalid={!!errors.message}
          {...register("message")}
        />
      </Field>

      <Turnstile onVerify={setToken} onExpire={() => setToken("")} />

      {status === "error" ? (
        <p className="text-sm text-ember-soft">
          L&apos;envoi a échoué. Réessaie, ou contacte-nous par téléphone.
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Envoi…
          </>
        ) : (
          <>
            <Send size={18} />
            Envoyer le message
          </>
        )}
      </Button>
    </form>
  );
}
