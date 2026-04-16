#!/usr/bin/env node
/**
 * Gera docs/web-excellence/framework-manifest.json a partir de
 * .cursor/skills-web-excellence e .cursor/commands
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const skillsDir = join(
  root,
  process.env.FRAMEWORK_SKILLS_DIR?.trim() || ".cursor/skills-web-excellence",
);
const commandsDir = join(root, ".cursor/commands");
const outDir = join(root, "docs", "web-excellence");
const outPath = join(outDir, "framework-manifest.json");

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (name.endsWith(".md") && name !== "SKILLS_INDEX.md") acc.push(p);
  }
  return acc;
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) return null;
  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) return null;
  const block = raw.slice(4, end);
  const data = {};
  let currentKey = null;
  let listMode = false;
  for (const line of block.split("\n")) {
    if (/^requires:/.test(line)) {
      listMode = true;
      currentKey = "requires";
      data.requires = [];
      continue;
    }
    if (/^provides:/.test(line)) {
      listMode = true;
      currentKey = "provides";
      data.provides = [];
      continue;
    }
    if (/^used_by:/.test(line)) {
      listMode = true;
      currentKey = "used_by";
      data.used_by = [];
      continue;
    }
    const m = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (m && !line.startsWith("  -")) {
      listMode = false;
      const k = m[1];
      let v = m[2].replace(/^["']|["']$/g, "");
      if (v === "" || v === '""') data[k] = "";
      else data[k] = v;
      continue;
    }
    if (listMode && currentKey && /^\s*-\s+/.test(line)) {
      const item = line.replace(/^\s*-\s+/, "").trim();
      if (!data[currentKey]) data[currentKey] = [];
      const sm = item.match(/^(skill|rule|agent|command):\s*(.+)$/);
      if (sm) data[currentKey].push({ type: sm[1], ref: sm[2].trim() });
      else data[currentKey].push({ type: "raw", ref: item });
    }
  }
  return data;
}

const skills = [];
for (const p of walk(skillsDir)) {
  const raw = readFileSync(p, "utf8");
  const fm = parseFrontmatter(raw);
  if (!fm?.id?.startsWith("skill-")) continue;
  const rel = p.replace(root + "/", "");
  skills.push({
    id: fm.id,
    title: fm.title ?? "",
    path: rel,
    category: fm.category ?? "",
    agent: fm.agent ?? "",
    priority: fm.priority ?? "",
    requires: fm.requires ?? [],
    provides: Array.isArray(fm.provides) ? fm.provides.map((x) => x.ref ?? x) : [],
  });
}

const commands = [];
function walkCmd(dir, prefix = "") {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkCmd(p, `${prefix}${name}/`);
    else if (name.endsWith(".md") && name !== "COMMANDS_INDEX.md") {
      const raw = readFileSync(p, "utf8");
      const fm = parseFrontmatter(raw);
      const rel = p.replace(root + "/", "");
      commands.push({
        id: fm?.id ?? "",
        title: fm?.title ?? "",
        path: rel,
        category: fm?.category ?? prefix.replace(/\/$/, ""),
        agent: fm?.agent ?? "",
      });
    }
  }
}
walkCmd(commandsDir);

const manifest = {
  version: "2.1.0",
  generatedAt: new Date().toISOString(),
  skills: skills.sort((a, b) => a.id.localeCompare(b.id)),
  commands: commands.sort((a, b) => a.path.localeCompare(b.path)),
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Wrote ${outPath} (${skills.length} skills, ${commands.length} commands)`);
