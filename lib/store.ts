import {appendFile, mkdir, readFile, writeFile} from "fs/promises";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, {recursive: true});
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type ContactRecord = {
  id: string;
  ts: number;
  name: string;
  organization: string;
  phone: string;
  email: string;
  message: string;
  locale: string;
};

export type CollaborationRecord = {
  id: string;
  ts: number;
  name: string;
  organization: string;
  role: string;
  phone: string;
  email: string;
  collaborationType: string;
  budget: string;
  timeline: string;
  message: string;
  locale: string;
  resumeFilename: string;
};

export type TeamMember = {
  name: string;
  role: string;
  introduction: string;
  education: string[];
  initials: string;
  photoUrl?: string;
};

// ─── Contact ─────────────────────────────────────────────────────────────────

export async function appendContact(record: ContactRecord): Promise<void> {
  await ensureDataDir();
  await appendFile(
    path.join(DATA_DIR, "contact.jsonl"),
    JSON.stringify(record) + "\n",
    "utf-8"
  );
}

export async function readContactSubmissions(): Promise<ContactRecord[]> {
  await ensureDataDir();
  try {
    const text = await readFile(path.join(DATA_DIR, "contact.jsonl"), "utf-8");
    return text
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as ContactRecord)
      .reverse();
  } catch {
    return [];
  }
}

// ─── Collaboration ────────────────────────────────────────────────────────────

export async function appendCollaboration(record: CollaborationRecord): Promise<void> {
  await ensureDataDir();
  await appendFile(
    path.join(DATA_DIR, "collaboration.jsonl"),
    JSON.stringify(record) + "\n",
    "utf-8"
  );
}

export async function readCollaborationSubmissions(): Promise<CollaborationRecord[]> {
  await ensureDataDir();
  try {
    const text = await readFile(path.join(DATA_DIR, "collaboration.jsonl"), "utf-8");
    return text
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as CollaborationRecord)
      .reverse();
  } catch {
    return [];
  }
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export async function readTeam(): Promise<TeamMember[] | null> {
  try {
    const text = await readFile(path.join(DATA_DIR, "team.json"), "utf-8");
    return JSON.parse(text) as TeamMember[];
  } catch {
    return null;
  }
}

export async function writeTeam(team: TeamMember[]): Promise<void> {
  await ensureDataDir();
  await writeFile(
    path.join(DATA_DIR, "team.json"),
    JSON.stringify(team, null, 2),
    "utf-8"
  );
}
