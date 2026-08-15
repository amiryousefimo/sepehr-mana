"use client";

import {useRef, useState, type FormEvent} from "react";
import {ArrowUpLeft, CheckCircle2, Send} from "lucide-react";
import type {SiteContent} from "@/lib/content";

export function ContactForm({
  copy,
  locale,
  phoneHref
}: {
  copy: SiteContent["contact"];
  locale: "fa" | "en";
  phoneHref: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(event.currentTarget)
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      formRef.current?.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} ref={formRef}>
      <h3>{copy.formTitle}</h3>
      <div className="form-grid">
        <label>
          <span>{copy.name}</span>
          <input type="text" name="name" autoComplete="name" maxLength={100} required />
        </label>
        <label>
          <span>{copy.organization}</span>
          <input type="text" name="organization" autoComplete="organization" maxLength={120} />
        </label>
        <label className="form-field--wide">
          <span>{copy.email}</span>
          <input type="email" name="email" autoComplete="email" maxLength={160} dir="ltr" required />
        </label>
        <label className="form-field--wide">
          <span>{copy.phone}</span>
          <input type="tel" name="phone" autoComplete="tel" maxLength={30} required />
        </label>
        <label className="form-field--wide">
          <span>{copy.message}</span>
          <textarea name="message" maxLength={5000} rows={4} required />
        </label>
      </div>

      <input
        className="contact-form__honeypot"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <input type="hidden" name="locale" value={locale} />

      <div className="contact-form__footer">
        <button
          className="button button--primary"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? copy.sending : copy.submit}
          <Send aria-hidden="true" />
        </button>
        <p>{copy.note}</p>
      </div>

      <div className="contact-form__status" aria-live="polite">
        {status === "success" && (
          <p className="contact-form__status--success">
            <CheckCircle2 aria-hidden="true" />
            {copy.success}
          </p>
        )}
        {status === "error" && (
          <p className="contact-form__status--error">{copy.error}</p>
        )}
      </div>

      <a className="contact-form__call" href={phoneHref}>
        {copy.call}
        <ArrowUpLeft aria-hidden="true" />
      </a>
    </form>
  );
}
