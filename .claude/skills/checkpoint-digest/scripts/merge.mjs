// Fold the cards each chunk's agent wrote into the day's page, and their shots into one capture plan.
// node merge.mjs <day folder> - reads <day>/chunks.json and every <day>/chunks/<id>.json, writes <day>/data.json and <day>/plan.json
// A chunk's file is {"changes": [...], "followups": [...], "plan": [...]}: cards, follow-ups and shots as data.json and
// shoot.mjs take them. Its cards take the chunk's place in data.json's changes, in chunks.json's order, ahead of the cards
// the lead wrote itself; merging again replaces them, so a redrawn chunk never doubles. A card may list only its own
// chunk's commits: a change that spans chunks is the lead's to draw.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export function merge(plan, parts, data) {
  const errors = [];
  const ids = new Set();
  const shots = new Set();
  const cards = [];
  const followups = [];
  const shotPlan = [];
  const report = [];
  for (const c of plan.chunks) {
    const part = parts[c.id];
    if (!part) {
      errors.push(`chunks/${c.id}.json is missing: its agent wrote nothing`);
      continue;
    }
    const own = [...c.spec, ...c.build];
    const match = (sha) =>
      own.find((s) => s.startsWith(sha) || sha.startsWith(s));
    const drawn = new Set();
    for (const card of part.changes ?? []) {
      if (ids.has(card.id))
        errors.push(`${c.id}: card ${card.id} is another chunk's id too`);
      ids.add(card.id);
      for (const sha of card.commits ?? []) {
        if (match(sha)) drawn.add(match(sha));
        else
          errors.push(
            `${c.id}: card ${card.id} lists ${sha}, which is not this chunk's; a change across chunks is the lead's`,
          );
      }
      cards.push(card);
    }
    for (const f of part.followups ?? []) followups.push(f);
    for (const s of part.plan ?? []) {
      if (shots.has(s.name))
        errors.push(`${c.id}: shot ${s.name} is another chunk's name too`);
      shots.add(s.name);
      shotPlan.push(s);
    }
    report.push(
      `${c.id}: ${(part.changes ?? []).length} cards, ${drawn.size} of ${own.length} commits drawn`,
    );
  }
  const lead = (data.changes ?? []).filter((card) => !ids.has(card.id));
  const theirs = new Set(followups.map((f) => f.id));
  return {
    errors,
    report,
    data: {
      ...data,
      changes: [...cards, ...lead],
      followups: [
        ...(data.followups ?? []).filter((f) => !theirs.has(f.id)),
        ...followups,
      ],
    },
    plan: shotPlan,
  };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const day = process.argv[2];
  if (!day) {
    console.error("usage: node merge.mjs <day folder>");
    process.exit(1);
  }
  const read = (path) => JSON.parse(readFileSync(path, "utf8"));
  const plan = read(join(day, "chunks.json"));
  const parts = {};
  for (const c of plan.chunks) {
    const path = join(day, "chunks", `${c.id}.json`);
    if (existsSync(path)) parts[c.id] = read(path);
  }
  const out = merge(plan, parts, read(join(day, "data.json")));
  for (const line of out.report) console.log(line);
  if (out.errors.length) {
    for (const e of out.errors) console.error(`FAIL ${e}`);
    process.exit(1);
  }
  writeFileSync(
    join(day, "data.json"),
    `${JSON.stringify(out.data, null, 2)}\n`,
  );
  writeFileSync(
    join(day, "plan.json"),
    `${JSON.stringify(out.plan, null, 2)}\n`,
  );
  console.log(
    `data.json: ${out.data.changes.length} cards; plan.json: ${out.plan.length} shots`,
  );
}
