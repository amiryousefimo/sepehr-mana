import {createHmac} from "node:crypto";

export async function readDidbanReport() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("Admin configuration is missing");
  const response = await fetch(`http://127.0.0.1:${process.env.WORKBENCH_PORT || "8877"}/api/internal/report`, {
    cache: "no-store", signal: AbortSignal.timeout(10_000),
    headers: {"X-Didban-Bridge": createHmac("sha256", secret).update("didban-report-v1").digest("hex")}
  });
  if (!response.ok) throw new Error("Didban report unavailable");
  return response.json();
}
