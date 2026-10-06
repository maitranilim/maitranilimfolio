import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const site = join(root, "nilim-portfolio");
const html = readFileSync(join(site, "index.html"), "utf8");
const errors = [];

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));

for (const match of html.matchAll(/\s(?:src|href)="([^"]+)"/g)) {
  const value = match[1];
  if (/^(https?:|mailto:|data:)/.test(value)) continue;
  if (value.startsWith("#")) {
    if (value.length > 1 && !ids.has(value.slice(1))) errors.push(`Missing anchor target ${value}`);
    continue;
  }
  const path = value.split(/[?#]/)[0];
  if (!existsSync(join(site, path))) errors.push(`Missing file ${path}`);
}

for (const match of html.matchAll(/<img\b[^>]*>/g)) {
  if (!/\salt=/.test(match[0])) errors.push(`Image without alt: ${match[0].slice(0, 80)}`);
}

const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (!ldMatch) {
  errors.push("Missing JSON-LD block");
} else {
  try {
    JSON.parse(ldMatch[1]);
  } catch (error) {
    errors.push(`Invalid JSON-LD: ${error.message}`);
  }
}

if (!/<title>[^<]+<\/title>/.test(html)) errors.push("Missing <title>");
if (!/name="description"/.test(html)) errors.push("Missing meta description");
if ((html.match(/<h1\b/g) || []).length !== 1) errors.push("Expected exactly one <h1>");

try {
  execFileSync(process.execPath, ["--check", join(site, "app.js")], { stdio: "pipe" });
} catch (error) {
  errors.push(`app.js syntax error: ${error.stderr}`);
}

try {
  JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
} catch (error) {
  errors.push(`Invalid vercel.json: ${error.message}`);
}

const limit = 1.2 * 1024 * 1024;
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const info = statSync(full);
    if (info.isDirectory()) walk(full);
    else if (info.size > limit) errors.push(`Asset over 1.2 MB: ${full.slice(site.length + 1)}`);
  }
}
walk(join(site, "assets"));

if (errors.length) {
  console.error(errors.map((line) => `- ${line}`).join("\n"));
  process.exit(1);
}
console.log("Portfolio checks passed");
