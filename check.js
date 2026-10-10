#!/usr/bin/env node
/**
 * Checks the translation files before you commit them.
 *
 *     npm run check
 *
 * Every file in _data/lang/ must have exactly the same keys as the first
 * language in _data/languages.yml, and the same number of items in each list
 * (a missing FAQ answer is a mistake, not a choice). It also catches YAML
 * that will not parse, the name written any way but AmziXz, a "for sale" box
 * pointing past the last group on the Uses page, and a language without its
 * file or its pages.
 *
 * GitHub Pages refuses to build a broken translation anyway (strict mode in
 * _config.yml); this just tells you what is wrong in plain words, before you
 * push. A copy of the services site's check.js, adapted.
 */

import { readFile, readdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as yaml from "js-yaml";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
/** The pages every language must have, by slug. */
const PAGES = ["index", "about", "uses", "contact"];
/** @type {string[]} */
const problems = [];

/** @param {string} file */
async function load(file) {
  try {
    return /** @type {any} */ (yaml.load(await readFile(file, "utf8"), { filename: file }));
  } catch (error) {
    problems.push(`${path.relative(ROOT, file)} does not parse: ${String(/** @type {Error} */ (error).message).split("\n")[0]}`);
    return null;
  }
}

/**
 * Compare the shape of `other` against `ref`: same keys, same list lengths.
 * @param {any} ref
 * @param {any} other
 * @param {string} where
 * @param {string} name
 */
function compare(ref, other, where, name) {
  if (Array.isArray(ref)) {
    if (!Array.isArray(other)) return void problems.push(`${name}: ${where} should be a list`);
    if (ref.length !== other.length) {
      problems.push(`${name}: ${where} has ${other.length} items, the reference has ${ref.length}`);
    }
    ref.forEach((item, i) => i < other.length && compare(item, other[i], `${where}[${i + 1}]`, name));
    return;
  }
  if (ref && typeof ref === "object") {
    if (!other || typeof other !== "object") return void problems.push(`${name}: ${where} should be a section`);
    for (const key of Object.keys(ref)) {
      if (!(key in other)) problems.push(`${name}: missing ${where ? where + "." : ""}${key}`);
      else compare(ref[key], other[key], where ? `${where}.${key}` : key, name);
    }
    for (const key of Object.keys(other)) {
      if (!(key in ref)) problems.push(`${name}: extra key ${where ? where + "." : ""}${key} (not in the reference)`);
    }
    return;
  }
  if (typeof other === "string" && other.trim() === "" && typeof ref === "string" && ref.trim() !== "") {
    problems.push(`${name}: ${where} is empty`);
  }
}

/**
 * The name is always written AmziXz. Handles, addresses and domains
 * (@itsamzixz, amzixz@proton.me, services.amzixz.id.lv) are left alone.
 * @param {any} value
 * @param {string} where
 * @param {string} name
 */
function nameCase(value, where, name) {
  if (Array.isArray(value)) return value.forEach((v, i) => nameCase(v, `${where}[${i + 1}]`, name));
  if (value && typeof value === "object") {
    for (const [key, v] of Object.entries(value)) nameCase(v, where ? `${where}.${key}` : key, name);
    return;
  }
  if (typeof value !== "string") return;
  for (const match of value.matchAll(/[\w@.]*amzixz[\w@.]*/gi)) {
    const word = match[0];
    if (word.includes("@") || /amzixz\.|\.amzixz/i.test(word)) continue;
    if (!/^AmziXz/.test(word.replace(/^[^A-Za-z]+/, ""))) {
      problems.push(`${name}: ${where} writes the name as "${word}"; it is always AmziXz`);
    }
  }
}

const languages = await load(path.join(ROOT, "_data", "languages.yml"));
if (languages) {
  const files = (await readdir(path.join(ROOT, "_data", "lang"))).filter((f) => f.endsWith(".yml"));
  /** @type {string[]} */
  const codes = languages.map((/** @type {any} */ l) => l.code);

  for (const f of files) {
    const code = f.replace(/\.yml$/, "");
    if (!codes.includes(code)) problems.push(`_data/lang/${f} exists but "${code}" is not in _data/languages.yml`);
  }

  const reference = await load(path.join(ROOT, "_data", "lang", `${codes[0]}.yml`));
  for (const lang of languages) {
    const file = path.join(ROOT, "_data", "lang", `${lang.code}.yml`);
    try {
      await access(file);
    } catch {
      problems.push(`${lang.code}: _data/lang/${lang.code}.yml is missing`);
      continue;
    }
    for (const slug of PAGES) {
      const page = path.join(ROOT, ...String(lang.prefix).split("/").filter(Boolean), `${slug}.html`);
      try {
        await access(page);
      } catch {
        problems.push(`${lang.code}: no page at ${path.relative(ROOT, page)}`);
      }
    }
    const data = await load(file);
    if (!data || !reference) continue;
    if (lang.code !== codes[0]) compare(reference, data, "", `${lang.code}.yml`);
    nameCase(data, "", `${lang.code}.yml`);

    const uses = data.uses || {};
    const groups = (uses.groups || []).length;
    if (!(Number.isInteger(uses.sale_group) && uses.sale_group >= 0 && uses.sale_group <= groups)) {
      problems.push(`${lang.code}.yml: uses.sale_group must be a number from 0 (no box) to ${groups}`);
    }
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):\n  - ` + problems.join("\n  - "));
  process.exit(1);
}
console.log("✓ Translations are complete and consistent.");
