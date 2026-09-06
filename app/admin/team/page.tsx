"use client";

import {useEffect, useState} from "react";
import {Plus, RefreshCw, Save, Trash2, X} from "lucide-react";
import {content} from "@/lib/content";

type TeamMember = {
  name: string; role: string; introduction: string;
  education: string[]; initials: string; photoUrl?: string;
};

const defaultFa = content.fa.team.people;
const defaultEn = content.en.team.people;

function MemberForm({
  member,
  onSave,
  onCancel
}: {
  member: TeamMember;
  onSave: (m: TeamMember) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<TeamMember>({...member});

  function field(key: keyof TeamMember, label: string, type = "text") {
    const value = form[key];
    if (key === "education") return null;
    return (
      <label key={key} className="admin-field">
        <span>{label}</span>
        {key === "introduction" ? (
          <textarea
            value={value as string ?? ""}
            rows={3}
            onChange={(e) => setForm({...form, [key]: e.target.value})}
          />
        ) : (
          <input
            type={type}
            value={value as string ?? ""}
            onChange={(e) => setForm({...form, [key]: e.target.value})}
          />
        )}
      </label>
    );
  }

  return (
    <div className="admin-member-form">
      <div className="admin-member-form__grid">
        {field("name", "Name")}
        {field("role", "Role")}
        {field("initials", "Initials")}
        {field("photoUrl", "Photo URL")}
        {field("introduction", "Introduction")}
      </div>
      <div className="admin-field">
        <span>Education (one per line)</span>
        <textarea
          value={form.education.join("\n")}
          rows={3}
          onChange={(e) => setForm({...form, education: e.target.value.split("\n").filter(Boolean)})}
        />
      </div>
      <div className="admin-member-form__actions">
        <button className="admin-btn admin-btn--primary" onClick={() => onSave(form)}>
          <Save aria-hidden="true" /> Save member
        </button>
        <button className="admin-btn admin-btn--ghost" onClick={onCancel}>
          <X aria-hidden="true" /> Cancel
        </button>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [locale, setLocale] = useState<"fa" | "en">("fa");
  const [team, setTeam] = useState<TeamMember[] | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"" | "saved" | "error">("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/team");
    const data = await res.json() as {team?: TeamMember[]};
    // If no overrides saved yet, fall back to the static default for current locale
    setTeam(data.team ?? (locale === "fa" ? [...defaultFa] : [...defaultEn]));
    setLoading(false);
  }

  useEffect(() => { void load(); }, [locale]);

  async function save(members: TeamMember[]) {
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/admin/team", {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({team: members})
    });
    setSaving(false);
    setStatus(res.ok ? "saved" : "error");
    setTimeout(() => setStatus(""), 3000);
  }

  function updateMember(index: number, updated: TeamMember) {
    const next = [...(team ?? [])];
    next[index] = updated;
    setTeam(next);
    setEditIndex(null);
    void save(next);
  }

  function removeMember(index: number) {
    const next = (team ?? []).filter((_, i) => i !== index);
    setTeam(next);
    void save(next);
  }

  function addMember() {
    const blank: TeamMember = {name: "", role: "", introduction: "", education: [], initials: "?"};
    const next = [...(team ?? []), blank];
    setTeam(next);
    setEditIndex(next.length - 1);
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Team members</h1>
        <div className="admin-page__actions">
          <div className="admin-locale-switch">
            <button
              className={locale === "fa" ? "active" : ""}
              onClick={() => setLocale("fa")}
            >FA</button>
            <button
              className={locale === "en" ? "active" : ""}
              onClick={() => setLocale("en")}
            >EN</button>
          </div>
          <button className="admin-btn-icon" onClick={load} title="Refresh">
            <RefreshCw aria-hidden="true" />
          </button>
          <button className="admin-btn admin-btn--primary" onClick={addMember}>
            <Plus aria-hidden="true" /> Add member
          </button>
        </div>
      </div>

      {status === "saved" && <p className="admin-status admin-status--ok">Saved successfully.</p>}
      {status === "error" && <p className="admin-status admin-status--err">Save failed.</p>}
      {saving && <p className="admin-status">Saving…</p>}

      {loading ? (
        <div className="admin-loading">Loading…</div>
      ) : (
        <div className="admin-member-list">
          {(team ?? []).map((member, i) => (
            <div key={i} className="admin-member-card">
              {editIndex === i ? (
                <MemberForm
                  member={member}
                  onSave={(m) => updateMember(i, m)}
                  onCancel={() => setEditIndex(null)}
                />
              ) : (
                <div className="admin-member-card__row">
                  <div className="admin-member-card__avatar">
                    {member.photoUrl
                      ? <img src={member.photoUrl} alt={member.name} />
                      : <span>{member.initials}</span>
                    }
                  </div>
                  <div className="admin-member-card__info">
                    <strong>{member.name || <em>Unnamed</em>}</strong>
                    <small>{member.role}</small>
                    <p>{member.introduction}</p>
                    {member.education.length > 0 && (
                      <ul>{member.education.map((e, j) => <li key={j}>{e}</li>)}</ul>
                    )}
                  </div>
                  <div className="admin-member-card__btns">
                    <button className="admin-btn admin-btn--ghost" onClick={() => setEditIndex(i)}>
                      Edit
                    </button>
                    <button className="admin-btn admin-btn--danger" onClick={() => removeMember(i)}>
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
