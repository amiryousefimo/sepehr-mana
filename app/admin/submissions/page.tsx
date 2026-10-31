"use client";

import {useEffect, useState} from "react";
import {ClipboardList, Mail, RefreshCw, Send} from "lucide-react";
import {ElderlyCareSurveyTab, type SurveyRecord} from "@/components/admin/elderly-care-survey-tab";

type ContactRecord = {
  id: string; ts: number; name: string; organization: string;
  phone: string; email: string; message: string; locale: string;
};

type CollaborationRecord = {
  id: string; ts: number; name: string; organization: string; role: string;
  phone: string; email: string; collaborationType: string; budget: string;
  timeline: string; message: string; locale: string; resumeFilename: string;
};

function formatDate(ts: number) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium", timeStyle: "short"
  }).format(new Date(ts));
}

function ContactTable({records}: {records: ContactRecord[]}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  if (!records.length) return <p className="admin-empty">No contact submissions yet.</p>;
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th><th>Name</th><th>Organization</th>
            <th>Phone</th><th>Email</th><th>Locale</th><th>Message</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <>
              <tr key={r.id} className={expanded === r.id ? "admin-table__row--active" : ""}>
                <td dir="ltr">{formatDate(r.ts)}</td>
                <td>{r.name}</td>
                <td>{r.organization || "—"}</td>
                <td dir="ltr">{r.phone}</td>
                <td dir="ltr"><a href={`mailto:${r.email}`}>{r.email}</a></td>
                <td><span className="admin-badge">{r.locale}</span></td>
                <td>
                  <button
                    className="admin-btn-link"
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  >
                    {expanded === r.id ? "Hide" : "View"}
                  </button>
                </td>
              </tr>
              {expanded === r.id && (
                <tr key={`${r.id}-msg`} className="admin-table__expand">
                  <td colSpan={7}>
                    <pre>{r.message}</pre>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CollaborationTable({records}: {records: CollaborationRecord[]}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  if (!records.length) return <p className="admin-empty">No collaboration submissions yet.</p>;
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th><th>Name</th><th>Role</th><th>Organization</th>
            <th>Email</th><th>Type</th><th>Budget</th><th>Resume</th><th>Message</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <>
              <tr key={r.id} className={expanded === r.id ? "admin-table__row--active" : ""}>
                <td dir="ltr">{formatDate(r.ts)}</td>
                <td>{r.name}</td>
                <td>{r.role || "—"}</td>
                <td>{r.organization || "—"}</td>
                <td dir="ltr"><a href={`mailto:${r.email}`}>{r.email}</a></td>
                <td>{r.collaborationType || "—"}</td>
                <td>{r.budget || "—"}</td>
                <td><span className="admin-badge admin-badge--file">{r.resumeFilename}</span></td>
                <td>
                  <button
                    className="admin-btn-link"
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  >
                    {expanded === r.id ? "Hide" : "View"}
                  </button>
                </td>
              </tr>
              {expanded === r.id && (
                <tr key={`${r.id}-msg`} className="admin-table__expand">
                  <td colSpan={9}>
                    <pre>{r.message}</pre>
                    <small>Timeline: {r.timeline || "—"} · Phone: {r.phone}</small>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SubmissionsPage() {
  const [tab, setTab] = useState<"contact" | "collaboration" | "survey">("contact");
  const [contact, setContact] = useState<ContactRecord[]>([]);
  const [collaboration, setCollaboration] = useState<CollaborationRecord[]>([]);
  const [survey, setSurvey] = useState<SurveyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [cr, colr, sr] = await Promise.all([
      fetch("/api/admin/submissions?type=contact").then(r => r.json()) as Promise<{submissions: ContactRecord[]}>,
      fetch("/api/admin/submissions?type=collaboration").then(r => r.json()) as Promise<{submissions: CollaborationRecord[]}>,
      fetch("/api/admin/submissions?type=elderly-care-survey").then(r => r.json()) as Promise<{submissions: SurveyRecord[]}>
    ]);
    setContact(cr.submissions ?? []);
    setCollaboration(colr.submissions ?? []);
    setSurvey(sr.submissions ?? []);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Submissions</h1>
        <button className="admin-btn-icon" onClick={load} title="Refresh">
          <RefreshCw aria-hidden="true" />
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === "contact" ? "admin-tab--active" : ""}`}
          onClick={() => setTab("contact")}
        >
          <Mail aria-hidden="true" />
          Contact
          {contact.length > 0 && <span className="admin-count">{contact.length}</span>}
        </button>
        <button
          className={`admin-tab ${tab === "collaboration" ? "admin-tab--active" : ""}`}
          onClick={() => setTab("collaboration")}
        >
          <Send aria-hidden="true" />
          Collaboration
          {collaboration.length > 0 && <span className="admin-count">{collaboration.length}</span>}
        </button>
        <button
          className={`admin-tab ${tab === "survey" ? "admin-tab--active" : ""}`}
          onClick={() => setTab("survey")}
        >
          <ClipboardList aria-hidden="true" />
          Elderly care survey
          {survey.length > 0 && <span className="admin-count">{survey.length}</span>}
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading…</div>
      ) : tab === "contact" ? (
        <ContactTable records={contact} />
      ) : tab === "collaboration" ? (
        <CollaborationTable records={collaboration} />
      ) : (
        <ElderlyCareSurveyTab records={survey} />
      )}
    </div>
  );
}
