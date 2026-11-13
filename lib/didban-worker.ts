import {spawn} from "node:child_process";
import {join} from "node:path";

const workerState = globalThis as typeof globalThis & {didbanStarting?: Promise<void>};

async function isReady() {
  try {
    const response = await fetch(`http://127.0.0.1:${process.env.WORKBENCH_PORT || "8877"}/api/health`, {
      cache: "no-store", signal: AbortSignal.timeout(750)
    });
    return response.ok && (await response.json()).ok === true;
  } catch {
    return false;
  }
}

export async function ensureDidbanWorker() {
  if (await isReady()) return;
  if (!workerState.didbanStarting) {
    workerState.didbanStarting = (async () => {
      const child = spawn(process.env.WORKBENCH_PYTHON || "python3", ["-S", join(process.cwd(), "didban", "production.py")], {
        cwd: process.cwd(), windowsHide: true, stdio: "inherit",
        env: {...process.env, WORKBENCH_DATA: process.env.WORKBENCH_DATA || join(process.cwd(), "data", "didban"), WORKBENCH_PREFIX: "/didban"}
      });
      let startupError: Error | undefined;
      child.on("error", error => {startupError = error;});
      child.on("exit", code => {startupError = new Error(`Didban worker exited (${code})`);});
      child.unref();
      const deadline = Date.now() + 10_000;
      while (Date.now() < deadline) {
        if (startupError) throw startupError;
        if (await isReady()) return;
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      throw new Error("Didban worker did not become ready");
    })().finally(() => {workerState.didbanStarting = undefined;});
  }
  await workerState.didbanStarting;
}
