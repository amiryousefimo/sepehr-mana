import {randomUUID} from "node:crypto";
import {appendFile, mkdir, open, readdir, unlink} from "node:fs/promises";
import {isIP} from "node:net";
import {basename, resolve} from "node:path";

const dayMs = 24 * 60 * 60 * 1000;
export const auditDays = 30;
const maxResults = 200;
const readLimit = 512 * 1024;
const recordLimit = 2_048;
const auditFilePattern = /^rasad-(\d{4}-\d{2}-\d{2})\.jsonl$/;
const dateKey = (time: number) => new Date(time).toISOString().slice(0, 10);
let lastPruned = "";

export type AuditSource = "rasad" | "site-admin";
export type AuditResult = "accepted" | "rejected" | "blocked" | "unavailable" | "report_open";
export type AuditReason = "credentials_verified" | "wrong_password" | "unknown_account" | "invalid_origin" |
  "invalid_form" | "server_not_configured" | "session_error" | "report_loaded";

export type AuditEvent = {
  id: string; time: string; source: AuditSource; result: AuditResult; reason: AuditReason;
  account: string | null; ip: string | null; ipSource: "trusted_header" | "forwarded_hint" | "unknown";
};

export function requestAddress(headers: Headers): Pick<AuditEvent, "ip" | "ipSource"> {
  const trustedHeader = process.env.RASAD_AUDIT_IP_HEADER?.trim().toLowerCase();
  if (trustedHeader && /^[-a-z0-9]+$/.test(trustedHeader)) {
    const trusted = headers.get(trustedHeader)?.trim();
    return trusted && isIP(trusted) ? {ip: trusted, ipSource: "trusted_header"} : {ip: null, ipSource: "unknown"};
  }
  const forwarded = headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  return forwarded && isIP(forwarded) ? {ip: forwarded, ipSource: "forwarded_hint"} : {ip: null, ipSource: "unknown"};
}

function auditDirectory() {
  return resolve(process.env.RASAD_AUDIT_DIR || resolve(process.cwd(), "data", "rasad-audit"));
}

async function prune(directory: string, now: number) {
  const day = dateKey(now);
  const key = directory + ":" + day;
  if (lastPruned === key) return;
  const earliest = dateKey(now - (auditDays - 1) * dayMs);
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const written = entry.isFile() ? auditFilePattern.exec(entry.name)?.[1] : undefined;
    if (written && written < earliest) await unlink(resolve(directory, entry.name)).catch(() => undefined);
  }
  lastPruned = key;
}

export async function recordLogin(request: Request, source: AuditSource, result: AuditResult, reason: AuditReason, account: string | null) {
  const event: AuditEvent = {id: randomUUID(), time: new Date().toISOString(), source, result, reason, account, ...requestAddress(request.headers)};
  const line = JSON.stringify(event);
  try {
    const directory = auditDirectory();
    await mkdir(directory, {recursive: true, mode: 0o700});
    await appendFile(resolve(directory, `rasad-${dateKey(Date.now())}.jsonl`), line + "\n", {mode: 0o600});
    await prune(directory, Date.now()).catch(() => undefined);
  } catch {
    console.error("[rasad-audit:storage-unavailable] " + line);
  }
  return event.id;
}

type AuditFilter = {result?: string; account?: string; ref?: string};

export async function readLoginAudit(filters: AuditFilter) {
  const directory = auditDirectory();
  let unavailable = false;
  let partial = false;
  let names: string[];
  try {
    await mkdir(directory, {recursive: true, mode: 0o700});
    names = await readdir(directory);
  } catch {
    return {events: [] as AuditEvent[], unavailable: true, partial};
  }
  const earliest = dateKey(Date.now() - (auditDays - 1) * dayMs);
  const latest = dateKey(Date.now());
  const events: AuditEvent[] = [];
  const entries = names.filter(name => {
    const day = auditFilePattern.exec(name)?.[1];
    return day && day >= earliest && day <= latest;
  }).sort().reverse();
  if (entries.some(name => name !== basename(name))) return {events, unavailable: true, partial};
  for (const name of entries) {
    try {
      const handle = await open(resolve(directory, name), "r");
      try {
        const {size} = await handle.stat();
        const offset = Math.max(0, size - readLimit);
        const buffer = Buffer.alloc(size - offset);
        const {bytesRead} = await handle.read(buffer, 0, buffer.byteLength, offset);
        const rows = buffer.subarray(0, bytesRead).toString("utf-8").trimEnd().split("\n");
        if (offset) {rows.shift(); partial = true;}
        for (const line of rows.reverse()) {
          if (!line || line.length > recordLimit) continue;
          try {
            const event = JSON.parse(line) as AuditEvent;
            if ((filters.result && event.result !== filters.result) ||
                (filters.account && event.account !== filters.account) ||
                (filters.ref && event.id !== filters.ref)) continue;
            events.push(event);
          } catch {
            partial = true;
          }
          if (events.length >= maxResults) return {events, unavailable, partial: true};
        }
      } finally {
        await handle.close();
      }
    } catch {
      unavailable = true;
    }
  }
  return {events, unavailable, partial};
}
