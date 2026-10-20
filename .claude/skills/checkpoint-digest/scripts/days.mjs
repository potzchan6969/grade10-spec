// Add a published digest to its branch's day list, and point the branch's one link at it.
// node days.mjs <days.json> <digest.json> --commit <7 characters> --out <folder>
// Writes <folder>/days.json, newest first, and <folder>/index.html, which opens the newest digest.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The bucket drops every page 30 days after upload; a day kept longer would link nowhere.
const KEEP_DAYS = 29;

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const [listFile, digestFile] = args.filter(
  (a, i) => !a.startsWith("--") && !/^--(commit|out)$/.test(args[i - 1]),
);
const commit = option("commit");
const out = option("out");
if (!listFile || !digestFile || !/^[0-9a-f]{7}$/.test(commit ?? "") || !out)
  fail(
    "usage: node days.mjs <days.json> <digest.json> --commit <7 characters> --out <folder>",
  );

const kept = JSON.parse(readFileSync(listFile, "utf8")).days;
if (!Array.isArray(kept)) fail(`${listFile} holds no days list`);
const data = JSON.parse(readFileSync(digestFile, "utf8"));
const now = new Date();
const oldest = now.getTime() - KEEP_DAYS * 24 * 60 * 60 * 1000;

const days = [
  {
    commit,
    date: data.stamp?.date,
    fromDate: data.stamp?.fromDate,
    at: now.toISOString(),
    title: plain(data.title),
    reason: plain(data.reason),
  },
  ...kept.filter((d) => d.commit !== commit && Date.parse(d.at) >= oldest),
];

mkdirSync(out, { recursive: true });
writeFileSync(join(out, "days.json"), `${JSON.stringify({ days }, null, 2)}\n`);
const latest = `${commit}/index.html`;
writeFileSync(
  join(out, "index.html"),
  `<!doctype html><html><head><meta charset="utf-8"><title>${entities(days[0].title)}</title><meta http-equiv="refresh" content="0;url=${latest}"><script>location.replace(${JSON.stringify(latest)} + location.hash);</script></head><body><a href="${latest}">Open the newest digest</a></body></html>\n`,
);
console.log(`${days.length} day(s); newest ${commit}`);

function plain(s) {
  return String(s ?? "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*|`/g, "");
}

function entities(s) {
  return s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
