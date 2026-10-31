"use client";

import {useMemo, useState, type FormEvent} from "react";
import {CheckCircle2, ChevronLeft, ChevronRight, Send} from "lucide-react";
import {
  detectContradictions,
  computeReliability,
  computeScores,
  deriveDecision,
  questionsForSection,
  surveyIntro,
  surveySections,
  validateSectionAnswers,
  type SurveyAnswers
} from "@/lib/elderly-care-survey";
import type {ElderlyCareSurveyPageCopy} from "@/lib/survey-page-content";
import type {Locale} from "@/lib/site";

type Phase = "intro" | "sections" | "followUp" | "done";

export function ElderlyCareSurveyForm({
  copy,
  intro,
  locale
}: {
  copy: ElderlyCareSurveyPageCopy["form"];
  intro: ElderlyCareSurveyPageCopy["intro"];
  locale: Locale;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [followUpConsent, setFollowUpConsent] = useState(false);
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [responseId, setResponseId] = useState("");

  const currentSection = surveySections[sectionIndex];
  const sectionQuestions = useMemo(
    () => (currentSection ? questionsForSection(currentSection) : []),
    [currentSection]
  );

  const totalSteps = surveySections.length + 1;
  const currentStep =
    phase === "intro"
      ? 0
      : phase === "sections"
        ? sectionIndex + 1
        : phase === "followUp"
          ? totalSteps
          : totalSteps;
  const progress = Math.round((currentStep / totalSteps) * 100);

  const showQ02Notice = answers.Q02 === "خیر" && phase === "sections";

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({...prev, [id]: value}));
    setValidationError("");
  }

  function goNextSection() {
    const missing = validateSectionAnswers(currentSection, answers);
    if (missing) {
      setValidationError(copy.required);
      return;
    }
    if (sectionIndex < surveySections.length - 1) {
      setSectionIndex((i) => i + 1);
      window.scrollTo({top: 0, behavior: "smooth"});
      return;
    }
    setPhase("followUp");
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  function goPrevSection() {
    if (phase === "followUp") {
      setPhase("sections");
      setSectionIndex(surveySections.length - 1);
      return;
    }
    if (sectionIndex > 0) {
      setSectionIndex((i) => i - 1);
    } else {
      setPhase("intro");
    }
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setValidationError("");

    try {
      const response = await fetch("/api/survey/elderly-care", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          answers,
          followUpConsent,
          contactPhone: followUpConsent ? contactPhone : "",
          contactEmail: followUpConsent ? contactEmail : "",
          locale
        })
      });

      const data = (await response.json()) as {ok?: boolean; id?: string; error?: string};
      if (!response.ok || !data.ok || !data.id) {
        setStatus("error");
        return;
      }

      setResponseId(data.id);
      setPhase("done");
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  if (phase === "done") {
    return (
      <div className="survey-form survey-form--success">
        <CheckCircle2 aria-hidden="true" />
        <h2>{copy.successTitle}</h2>
        <p>{copy.successBody}</p>
        {responseId && (
          <p className="survey-form__response-id">
            {copy.successId}: <b dir="ltr">{responseId.slice(0, 8)}</b>
          </p>
        )}
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="survey-form">
        <div className="survey-form__intro-blocks">
          <article>
            <h3>{intro.serviceLabel}</h3>
            <p>{surveyIntro["تعریف سرویس"]}</p>
          </article>
          <article>
            <h3>{intro.goalLabel}</h3>
            <p>{surveyIntro["هدف تحقیق"]}</p>
          </article>
          <article>
            <h3>{intro.privacyLabel}</h3>
            <p>{surveyIntro["محرمانگی"]}</p>
          </article>
        </div>
        <button
          className="button button--primary survey-form__start"
          type="button"
          onClick={() => {
            setPhase("sections");
            setSectionIndex(0);
          }}
        >
          {intro.start}
          <ChevronLeft aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <form className="survey-form" onSubmit={handleSubmit}>
      <div className="survey-form__progress" aria-hidden="true">
        <span>{copy.progress}</span>
        <div className="survey-form__progress-track">
          <i style={{width: `${progress}%`}} />
        </div>
        <b>
          {phase === "followUp"
            ? `${copy.sectionOf} ${totalSteps} ${copy.of} ${totalSteps}`
            : `${copy.sectionOf} ${sectionIndex + 1} ${copy.of} ${surveySections.length}`}
        </b>
      </div>

      {phase === "sections" && (
        <>
          <header className="survey-form__section-head">
            <span className="section-kicker">
              <i />
              {currentSection}
            </span>
          </header>

          {showQ02Notice && (
            <p className="survey-form__notice" role="status">
              {copy.q02Notice}
            </p>
          )}

          <div className="survey-form__questions">
            {sectionQuestions.map((question) => (
              <fieldset className="survey-question" key={question.id}>
                <legend>
                  <span className="survey-question__id">{question.id}</span>
                  {question.text}
                </legend>
                {question.note && (
                  <p className="survey-question__note">{question.note}</p>
                )}
                {question.type === "text" ? (
                  <textarea
                    name={question.id}
                    rows={5}
                    maxLength={4000}
                    value={answers[question.id] ?? ""}
                    onChange={(e) => setAnswer(question.id, e.target.value)}
                  />
                ) : (
                  <div className="survey-question__options">
                    {question.options?.map((option) => (
                      <label className="survey-option" key={option}>
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={() => setAnswer(question.id, option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </fieldset>
            ))}
          </div>

          {validationError && (
            <p className="survey-form__error" role="alert">
              {validationError}
            </p>
          )}

          <div className="survey-form__nav">
            <button className="button button--ghost" type="button" onClick={goPrevSection}>
              <ChevronRight aria-hidden="true" />
              {copy.previous}
            </button>
            <button className="button button--primary" type="button" onClick={goNextSection}>
              {copy.next}
              <ChevronLeft aria-hidden="true" />
            </button>
          </div>
        </>
      )}

      {phase === "followUp" && (
        <>
          <header className="survey-form__section-head">
            <h2>{copy.followUpTitle}</h2>
            <p>{copy.followUpDescription}</p>
          </header>

          <label className="survey-form__consent">
            <input
              type="checkbox"
              checked={followUpConsent}
              onChange={(e) => setFollowUpConsent(e.target.checked)}
            />
            <span>{copy.followUpConsent}</span>
          </label>

          {followUpConsent && (
            <div className="survey-form__contact">
              <label>
                <span>{copy.contactPhone}</span>
                <input
                  type="tel"
                  name="contactPhone"
                  dir="ltr"
                  maxLength={30}
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </label>
              <label>
                <span>{copy.contactEmail}</span>
                <input
                  type="email"
                  name="contactEmail"
                  dir="ltr"
                  maxLength={160}
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </label>
            </div>
          )}

          <input
            className="collaboration-form__honeypot"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {status === "error" && (
            <p className="survey-form__error" role="alert">
              {copy.error}
            </p>
          )}

          <div className="survey-form__nav">
            <button className="button button--ghost" type="button" onClick={goPrevSection}>
              <ChevronRight aria-hidden="true" />
              {copy.previous}
            </button>
            <button
              className="button button--primary"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? copy.sending : copy.submit}
              <Send aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </form>
  );
}

// Exported for potential preview / tests
export function previewAnalysis(answers: SurveyAnswers) {
  const scores = computeScores(answers);
  const flags = detectContradictions(answers);
  const reliability = computeReliability(flags);
  const decision = deriveDecision(answers, scores, reliability);
  return {scores, flags, reliability, decision};
}
