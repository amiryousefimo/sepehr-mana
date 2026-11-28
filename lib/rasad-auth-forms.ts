export async function readAuthBody(request: Request, contentType: string) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== contentType) {
    return {status: 415 as const};
  }
  const reader = request.body?.getReader();
  if (!reader) return {status: 400 as const};
  const decoder = new TextDecoder();
  let body = "";
  let bytes = 0;
  try {
    for (let part = await reader.read(); !part.done; part = await reader.read()) {
      bytes += part.value.byteLength;
      if (bytes > 4096) {
        await reader.cancel().catch(() => undefined);
        return {status: 413 as const};
      }
      body += decoder.decode(part.value, {stream: true});
    }
    return {status: 200 as const, body: body + decoder.decode()};
  } catch {
    return {status: 400 as const};
  } finally {
    reader.releaseLock();
  }
}
