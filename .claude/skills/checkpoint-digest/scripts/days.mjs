// Put a run's day pages in their branch's day list, and point the branch's one link at the newest day.
// node days.mjs <days.json> <digest.json>... --out <folder>
// Writes <folder>/days.json, one entry per day, newest first, and <folder>/index.html, which opens the newest day.
// A redrawn day replaces its entry, so the list holds the same days however often the digest runs.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The bucket drops every page 30 days after its last upload; a day kept longer could link nowhere.
const KEEP_DAYS = 29;

const args = process.argv.slice(2);
const out = args[args.indexOf("--out") + 1];
const [listFile, ...digestFiles] = args.filter(
  (a, i) => !a.startsWith("--") && args[i - 1] !== "--out",
);
if (!listFile || !digestFiles.length || !args.includes("--out") || !out)
  fail("usage: node days.mjs <days.json> <digest.json>... --out <folder>");

const kept = JSON.parse(readFileSync(listFile, "utf8")).days;
if (!Array.isArray(kept)) fail(`${listFile} holds no days list`);
const drawn = digestFiles.map((file) => {
  const data = JSON.parse(readFileSync(file, "utf8"));
  const date = data.stamp?.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? ""))
    fail(`${file}: stamp.date is not a day`);
  return { date, title: plain(data.title), reason: plain(data.reason) };
});
const oldest = new Date(Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);
const days = [
  ...drawn,
  ...kept.filter((d) => !drawn.some((n) => n.date === d.date)),
]
  .filter((d) => d.date >= oldest)
  .sort((a, b) => b.date.localeCompare(a.date));

mkdirSync(out, { recursive: true });
writeFileSync(join(out, "days.json"), `${JSON.stringify({ days }, null, 2)}\n`);
const latest = `${days[0].date}/index.html`;
writeFileSync(
  join(out, "index.html"),
  `<!doctype html><html><head><meta charset="utf-8"><title>${entities(days[0].title)}</title><meta http-equiv="refresh" content="0;url=${latest}"><script>location.replace(${JSON.stringify(latest)} + location.hash);</script></head><body><a href="${latest}">Open the newest day</a></body></html>\n`,
);
console.log(`${days.length} day(s); newest ${days[0].date}`);

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
