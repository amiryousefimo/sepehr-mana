import "server-only";

const powerBiOrigin = "https://app.powerbi.com";
const guid = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i;
const parameters = new Set([
  "reportId", "autoAuth", "ctid", "groupId", "config", "pageName", "filterPaneEnabled", "navContentPaneEnabled"
]);

export function readPowerBiEmbed(configuredUrl: string | undefined): string | null {
  if (!configuredUrl?.trim()) return null;

  let embed: URL;
  try {
    embed = new URL(configuredUrl.trim());
  } catch {
    return null;
  }
  if (embed.origin !== powerBiOrigin || embed.pathname !== "/reportEmbed" ||
      embed.username || embed.password || embed.hash) return null;

  const query = embed.searchParams;
  for (const parameter of query.keys()) {
    if (!parameters.has(parameter) || query.getAll(parameter).length !== 1) return null;
  }
  if (!guid.test(query.get("reportId") ?? "")) return null;
  for (const parameter of ["ctid", "groupId"]) {
    if (query.has(parameter) && !guid.test(query.get(parameter) ?? "")) return null;
  }

  query.set("autoAuth", "true");
  return embed.href;
}
