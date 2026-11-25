const {createHash, randomBytes} = require("node:crypto");
const {writeFileSync} = require("node:fs");

const [username, credentialsPath, verifierPath] = process.argv.slice(2);
if (!/^[a-z0-9][a-z0-9._-]{0,40}$/.test(username ?? "") || !credentialsPath || !verifierPath) {
  throw new Error("Usage: node scripts/provision-rasad-viewer.cjs username private-credentials-file verifier-file");
}
const password = randomBytes(24).toString("base64url");
const salt = randomBytes(16).toString("hex");
const verifier = salt + ":" + createHash("sha256").update(salt + ":" + password).digest("hex");
writeFileSync(credentialsPath, JSON.stringify({username, password}, null, 2) + "\n", {flag: "wx", mode: 0o600});
writeFileSync(verifierPath, JSON.stringify({username, verifier}, null, 2) + "\n", {flag: "wx"});
