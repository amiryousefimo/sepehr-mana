import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.woff2': 'font/woff2',
};
const allowed = new Set([
  '/tests/hackathon/staff/viewport.html',
  '/tests/hackathon/staff/preview.html',
  '/tests/hackathon/staff/fixture.mjs',
  '/public/hackaton/game/staff.mjs',
  '/public/hackaton/game/staff.css',
  '/public/hackaton/assets/Sahel-FD-BjaEWcOg.woff2',
]);
const root = new URL('../../../', import.meta.url);
const entry = '/tests/hackathon/staff/viewport.html';
const host = 'http://127.0.0.1:8715';
createServer(async (request, response) => {
  const path = new URL(request.url, host).pathname;
  if (path === '/') return response.writeHead(302, { Location: entry }).end();
  const file = path;
  if (!allowed.has(file)) return response.writeHead(404).end();
  try {
    const bytes = await readFile(new URL(file.slice(1), root));
    response.writeHead(200, { 'Content-Type': contentTypes[extname(file)], 'Cache-Control': 'no-store' }).end(bytes);
  } catch {
    response.writeHead(500).end();
  }
}).listen(8715, '127.0.0.1', () => console.log(host + entry));
