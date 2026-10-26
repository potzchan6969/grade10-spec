/*
 * RULE `copy`: a message key cited with its words names a message the English
 * catalogs hold, and quotes what they hold.
 *
 * Copy moves without the store: a writer edits a catalog, a translator a
 * locale, and neither opens a spec. A label quoted bare in a requirement then
 * reads exactly like one that still matches, and a search for the old words
 * misses every paraphrase. So where the words are the claim — a refusal the
 * reader must see, a legal line — the store cites the key and the words
 * together:
 *
 *   `auctionListing.verifyAction` ("Verify")
 *
 * The key is the join; the words are for the reader, and this rule holds them
 * to the catalog. A long message may be cited by its opening words and an
 * ellipsis — `auctionListing.identityRequired` ("Bids this high need…") — and
 * those words must open what the catalog holds. Where only a place is meant, the store names the control by
 * role and region instead and cites nothing.
 *
 * Only a key followed by its quoted words is a citation. A bare dotted name in
 * backticks is far more often an event, a setting or a procedure that happens
 * to share a namespace's name — `grading.sweep.repair` is an event — and a
 * test file's title in brackets follows its file name the same way, so a
 * namespace no catalog has, or a file name, is not read as one.
 *
 * Every brand's English layer answers, beside the shared one: a key a brand
 * claims holds that brand's words, and a citation matching any of them is
 * true. `--fix` rewrites the words only where the catalogs agree on one value.
 *
 * Citations are checked in the durable store, the in-flight changes and the
 * manual's pages. The archive is the record of what shipped, worded as it was.
 */
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readText, walkFiles } from "../src/store/disk.mts";

const MESSAGES = "packages/i18n/messages";
const LOCALE = "en";
const ARCHIVE = "openspec/changes/archive/";
const ELLIPSIS = "…";

const CITATION =
  /`([a-z][A-Za-z0-9]*)\.([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*)`\s+\("((?:[^"\\\n]|\\.)*)"\)/g;
const FILE = /\.(?:[cm]?[jt]sx?|json|md|ya?ml|css)$/;

/** How a message is written between the brackets: a quote or a line break
 * escaped as the catalog's JSON writes it, so the words stay on one line. */
export const quoted = (words) =>
  words.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");

/**
 * Every English message, as namespace → key → the words each layer gives it.
 * A key whose value is a group of messages is held as `null`, so a citation of
 * the group is told so rather than told the key does not exist.
 */
export function readCatalogs(root) {
  const catalogs = new Map();
  const dir = join(root, MESSAGES);
  if (!existsSync(dir)) return catalogs;
  for (const layer of readdirSync(dir)) {
    const locale = join(dir, layer, LOCALE);
    if (!existsSync(locale)) continue;
    for (const file of readdirSync(locale)) {
      if (!file.endsWith(".json")) continue;
      const namespace = file.slice(0, -".json".length);
      if (!catalogs.has(namespace)) catalogs.set(namespace, new Map());
      flatten(
        JSON.parse(readText(join(locale, file))),
        "",
        catalogs.get(namespace),
      );
    }
  }
  return catalogs;
}

function flatten(node, prefix, into) {
  for (const [name, value] of Object.entries(node)) {
    const key = prefix ? `${prefix}.${name}` : name;
    if (typeof value === "string") {
      const words = into.get(key) ?? new Set();
      words.add(value);
      into.set(key, words);
    } else {
      if (!into.has(key)) into.set(key, null);
      flatten(value, key, into);
    }
  }
}

/**
 * `dirs` are the store-relative directories whose Markdown cites copy. With
 * `fix`, a citation whose words drifted from the one value the catalogs agree
 * on is rewritten in place and not reported; the count of rewrites is
 * returned.
 */
export function checkCopy(root, dirs, add, { fix = false } = {}) {
  const catalogs = readCatalogs(root);
  if (catalogs.size === 0) return 0;
  let rewritten = 0;

  const paths = dirs
    .filter((dir) => existsSync(join(root, dir)))
    .flatMap((dir) => walkFiles(root, join(root, dir), ".md"));

  for (const path of new Set(paths)) {
    if (path.startsWith(ARCHIVE)) continue;
    const text = readText(join(root, path));
    if (!text.includes('("')) continue;
    let fixedHere = 0;

    const next = text.replace(
      CITATION,
      (whole, namespace, key, written, offset) => {
        const messages = catalogs.get(namespace);
        if (!messages || FILE.test(`${namespace}.${key}`)) return whole;
        const cited = `\`${namespace}.${key}\``;
        const line = lineOf(text, offset);

        if (!messages.has(key)) {
          add(
            "copy",
            path,
            `line ${line}: ${cited} names no message in the English catalogs`,
          );
          return whole;
        }
        const words = messages.get(key);
        if (words === null) {
          add(
            "copy",
            path,
            `line ${line}: ${cited} names a group of messages, not one`,
          );
          return whole;
        }
        const held = [...words].map(quoted);
        if (held.some((one) => says(one, written))) return whole;

        if (fix && held.length === 1) {
          fixedHere++;
          return whole.replace(
            `("${written}")`,
            () => `("${shortenLike(held[0], written)}")`,
          );
        }
        add(
          "copy",
          path,
          `line ${line}: ${cited} reads ${held.map((one) => `"${one}"`).join(" or ")} in the English catalogs, not "${written}"` +
            (held.length === 1
              ? " — `pnpm check:manual --fix` rewrites it"
              : ""),
        );
        return whole;
      },
    );

    if (fixedHere > 0) {
      writeFileSync(join(root, path), next);
      rewritten += fixedHere;
    }
  }
  return rewritten;
}

/** Whether the written words say the held message: all of it, or its opening
 * words and an ellipsis. An ellipsis with nothing before it says nothing. */
function says(held, written) {
  if (held === written) return true;
  if (!written.endsWith(ELLIPSIS)) return false;
  const opening = written.slice(0, -ELLIPSIS.length).trimEnd();
  return opening !== "" && held.startsWith(opening);
}

/** The held message cut to as many words as the drifted citation wrote, so a
 * rewrite keeps the citation as short as its writer made it. */
function shortenLike(held, written) {
  if (!written.endsWith(ELLIPSIS)) return held;
  const count = written.slice(0, -ELLIPSIS.length).trim().split(/\s+/).length;
  const words = held.split(" ");
  return words.length <= count
    ? held
    : `${words.slice(0, count).join(" ")}${ELLIPSIS}`;
}

function lineOf(text, offset) {
  let line = 1;
  for (let at = 0; at < offset; at++) if (text[at] === "\n") line++;
  return line;
}
