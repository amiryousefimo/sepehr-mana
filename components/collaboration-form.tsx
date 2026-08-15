"use client";

import {useRef, useState, type FormEvent} from "react";
import {ArrowUpLeft, CheckCircle2, FileText, Phone, Send, Upload} from "lucide-react";
import type {CollaborationContent} from "@/lib/collaboration-content";

const maxResumeSize = 5 * 1024 * 1024;
const acceptedResumeExtensions = [".pdf", ".doc", ".docx"];

export function CollaborationForm({
  copy,
  locale,
  phone,
  phoneHref
}: {
  copy: CollaborationContent["form"];
  locale: "fa" | "en";
  phone: string;
  phoneHref: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [selectedFile, setSelectedFile] = useState("");
  const [fileError, setFileError] = useState("");

  function validateResume(file?: File) {
    if (!file) {
      setSelectedFile("");
      setFileError("");
      return true;
    }

    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!acceptedResumeExtensions.includes(extension)) {
      setSelectedFile("");
      setFileError(copy.resumeInvalid);
      return false;
    }

    if (file.size > maxResumeSize) {
      setSelectedFile("");
      setFileError(copy.resumeTooLarge);
      return false;
    }

    setSelectedFile(file.name);
    setFileError("");
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const resume = formData.get("resume");
    if (!(resume instanceof File) || !resume.size || !validateResume(resume)) {
      setFileError((current) => current || copy.resumeRequired);
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/collaboration", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      formRef.current?.reset();
      setSelectedFile("");
      setFileError("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      className="collaboration-form"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <div className="collaboration-form__grid">
        <label>
          <span>{copy.name}</span>
          <input type="text" name="name" autoComplete="name" maxLength={100} required />
        </label>
        <label>
          <span>{copy.organization}</span>
          <input type="text" name="organization" autoComplete="organization" maxLength={120} />
        </label>
        <label>
          <span>{copy.role}</span>
          <input type="text" name="role" autoComplete="organization-title" maxLength={100} />
        </label>
        <label>
          <span>{copy.phone}</span>
          <input type="tel" name="phone" autoComplete="tel" maxLength={30} required />
        </label>
        <label className="collaboration-form__wide">
          <span>{copy.email}</span>
          <input type="email" name="email" autoComplete="email" maxLength={160} dir="ltr" required />
        </label>
        <label className="collaboration-form__wide">
          <span>{copy.collaborationType}</span>
          <select name="collaborationType" defaultValue="">
            <option value="" disabled>{copy.collaborationPlaceholder}</option>
            {copy.collaborationOptions.map((option) => (
              <option value={option} key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          <span>{copy.budget}</span>
          <select name="budget" defaultValue="">
            <option value="" disabled>{copy.budgetPlaceholder}</option>
            {copy.budgetOptions.map((option) => (
              <option value={option} key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          <span>{copy.timeline}</span>
          <select name="timeline" defaultValue="">
            <option value="" disabled>{copy.timelinePlaceholder}</option>
            {copy.timelineOptions.map((option) => (
              <option value={option} key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="collaboration-form__wide">
          <span>{copy.resume}</span>
          <span className={`resume-upload${fileError ? " resume-upload--error" : ""}`}>
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (!validateResume(file)) event.currentTarget.value = "";
              }}
              required
            />
            <span className="resume-upload__icon">
              {selectedFile ? <FileText aria-hidden="true" /> : <Upload aria-hidden="true" />}
            </span>
            <span className="resume-upload__copy">
              <b>{selectedFile || copy.resumeAction}</b>
              <small>{fileError || copy.resumeHint}</small>
            </span>
          </span>
        </label>
        <label className="collaboration-form__wide">
          <span>{copy.message}</span>
          <textarea
            name="message"
            placeholder={copy.messagePlaceholder}
            maxLength={5000}
            rows={6}
            required
          />
        </label>
      </div>

      <label className="collaboration-form__consent">
        <input type="checkbox" name="consent" required />
        <span>{copy.consent}</span>
      </label>

      <input
        className="collaboration-form__honeypot"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <input type="hidden" name="locale" value={locale} />

      <div className="collaboration-form__footer">
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

      <div className="collaboration-form__status" aria-live="polite">
        {status === "success" && (
          <p className="collaboration-form__status--success">
            <CheckCircle2 aria-hidden="true" />
            {copy.success}
          </p>
        )}
        {status === "error" && (
          <p className="collaboration-form__status--error">{copy.error}</p>
        )}
      </div>

      <a className="collaboration-form__call" href={phoneHref}>
        <Phone aria-hidden="true" />
        <span>{copy.call}</span>
        <b dir="ltr">{phone}</b>
        <ArrowUpLeft aria-hidden="true" />
      </a>
    </form>
  );
}
