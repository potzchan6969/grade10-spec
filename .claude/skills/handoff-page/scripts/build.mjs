// Check a handoff page's data, then write the page and the reply from it.
// node build.mjs <data.json> [--out page.html] [--url <page link>] - exits 1 on a FAIL and writes nothing.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args.splice(i, 2)[1];
};
const outArg = option("--out");
const url = option("--url");
const [file] = args;
if (!file) {
  console.error(
    "usage: node build.mjs <data.json> [--out page.html] [--url <page link>]",
  );
  process.exit(2);
}
const here = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(file);
const dir = dirname(dataPath);
const out = resolve(outArg ?? join(dir, "page.html"));
const replyPath = join(dirname(out), "reply.md");

let data;
try {
  data = JSON.parse(readFileSync(dataPath, "utf8"));
} catch (e) {
  console.log(`FAIL  ${file}: not valid JSON - ${e.message}`);
  process.exit(1);
}

const problems = [];
const fail = (at, message) => problems.push(["FAIL", at, message]);
const warn = (at, message) => problems.push(["warn", at, message]);
const isText = (v) => typeof v === "string" && v.trim() !== "";
const isObject = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v);

// The schema names every key and allowed value; this file adds the rules a schema cannot say.
const SCHEMA = JSON.parse(
  readFileSync(join(here, "..", "assets", "data.schema.json"), "utf8"),
);
const VERDICT_WORDS = {
  ready: "Ready",
  decide: "Ready once you decide",
  "not-ready": "Not ready",
  blocked: "Blocked",
};
const VERDICTS = Object.fromEntries(
  SCHEMA.properties.verdict.enum.map((v) => [v, VERDICT_WORDS[v] ?? v]),
);
const STATUSES = SCHEMA.$defs.proof.properties.status.enum;
const TONES = SCHEMA.$defs.tone.enum;
const PAGES = SCHEMA.properties.page.enum;
const FRAMES = SCHEMA.$defs["picture-mock"].properties.frame.enum;
const RESERVED = [
  "page",
  "top",
  "glance",
  "decide",
  "changed",
  "try",
  "extra",
  "proof",
  "ship",
  "followups",
  "engineers",
  "answers",
  "copy-answers",
  "agent-decisions",
  "filter-note",
  "lightbox",
];
// Ids the page gives its own parts: questions, blockers, proof rows, follow-ups, areas and controls.
const RESERVED_PREFIX =
  /^(q\d|b\d|proof-\d|fu-|area-|for-\d|try-role-|answer-|lightbox-|handoff-)/;
const SHAPES = { data: Object.keys(SCHEMA.properties) };
for (const [name, def] of Object.entries(SCHEMA.$defs))
  if (def.properties) SHAPES[name] = Object.keys(def.properties);
const PICTURES = Object.fromEntries(
  Object.keys(SCHEMA.$defs)
    .filter((name) => name.startsWith("picture-"))
    .map((name) => [name.slice("picture-".length), SHAPES[name]]),
);
const MOCK_PARTS = [
  "h",
  "text",
  "label",
  "button",
  "switch",
  "field",
  "notice",
  "tip",
  "badge",
  "divider",
];

const distance = (a, b) => {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const next = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      prev = row[j];
      row[j] = next;
    }
  }
  return row[b.length];
};

function shape(value, keys, at) {
  if (!isObject(value)) {
    fail(at, "should be an object");
    return false;
  }
  for (const k of Object.keys(value)) {
    if (keys.includes(k)) continue;
    const near = keys.find(
      (c) => distance(c.toLowerCase(), k.toLowerCase()) <= 2,
    );
    warn(
      `${at}.${k}`,
      near
        ? `unknown key, so the page ignores it; did you mean "${near}"?`
        : `unknown key, so the page ignores it; this takes ${keys.join(", ")}`,
    );
  }
  return true;
}

function need(value, key, at, hint = "is required") {
  if (!isText(value?.[key])) fail(`${at}.${key}`, hint);
}

function items(value, at) {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    fail(at, "should be a list");
    return [];
  }
  return value;
}

function long(value, max, at) {
  if (isText(value) && value.length > max)
    warn(at, `${value.length} characters; keep it to one line of about ${max}`);
}

function link(href, at) {
  if (!isText(href) || !/^https?:\/\//.test(href))
    fail(at, "a link starts with https://");
}

function reasons(list, at, asked = true) {
  const all = items(list, at);
  if (asked && !all.length)
    warn(
      at,
      "link the evidence: a decision row, a requirement, a commit or a test",
    );
  all.forEach((r, i) => {
    if (!shape(r, SHAPES.reason, `${at}[${i}]`)) return;
    need(r, "text", `${at}[${i}]`);
    if (r.href != null) link(r.href, `${at}[${i}].href`);
  });
}

function localFile(src, at) {
  if (!isText(src)) return fail(at, "is required");
  if (/^[a-z]+:/i.test(src) || src.startsWith("/")) {
    return fail(
      at,
      "publish the image beside the page and give its relative path, such as shots/lot.jpg",
    );
  }
  if (!existsSync(join(dir, src)))
    fail(at, `${src} is not next to the data file`);
}

function picture(p, at) {
  if (p == null) return;
  if (Array.isArray(p)) {
    for (const [i, one] of p.entries()) picture(one, `${at}[${i}]`);
    return;
  }
  if (!isObject(p))
    return fail(at, "should be a picture, or a list of pictures");
  const keys = PICTURES[p.kind];
  if (!keys)
    return fail(
      `${at}.kind`,
      `"${p.kind}" is not a picture; use one of ${Object.keys(PICTURES).join(", ")}`,
    );
  shape(p, keys, at);
  if (p.kind === "shot") localFile(p.src, `${at}.src`);
  if (p.kind === "beforeNow") {
    localFile(p.before, `${at}.before`);
    localFile(p.now, `${at}.now`);
  }
  if (p.kind === "mock") mock(p, at);
  if (p.kind === "flow") {
    const steps = items(p.steps, `${at}.steps`);
    if (steps.length < 2) fail(`${at}.steps`, "a flow needs at least 2 steps");
    steps.forEach((s, i) => {
      if (!shape(s, SHAPES.flowStep, `${at}.steps[${i}]`)) return;
      need(s, "text", `${at}.steps[${i}]`);
      tone(s.tone, `${at}.steps[${i}].tone`);
    });
  }
  if (p.kind === "lanes") {
    const lanes = items(p.lanes, `${at}.lanes`);
    if (lanes.length < 2)
      fail(
        `${at}.lanes`,
        "name at least 2 lanes, one per person's screen or system",
      );
    const events = items(p.events, `${at}.events`);
    if (!events.length) fail(`${at}.events`, "add the events, in time order");
    events.forEach((e, i) => {
      const where = `${at}.events[${i}]`;
      if (!shape(e, SHAPES.lanesEvent, where)) return;
      need(e, "text", where);
      if (!lanes.includes(e.lane))
        fail(`${where}.lane`, `"${e.lane}" is not one of the lanes`);
      if (e.to != null && !lanes.includes(e.to))
        fail(`${where}.to`, `"${e.to}" is not one of the lanes`);
      tone(e.tone, `${where}.tone`);
    });
  }
  if (p.kind === "states") {
    const states = items(p.states, `${at}.states`);
    if (states.length < 2)
      fail(`${at}.states`, "a status needs at least 2 states");
    states.forEach((s, i) => {
      if (!shape(s, SHAPES.state, `${at}.states[${i}]`)) return;
      need(s, "name", `${at}.states[${i}]`);
      need(
        s,
        "means",
        `${at}.states[${i}]`,
        "what the state means for the reader",
      );
    });
  }
  if (p.kind === "table") {
    const rows = items(p.rows, `${at}.rows`);
    if (!rows.length) fail(`${at}.rows`, "add the rows, each a list of cells");
    rows.forEach((r, i) => {
      if (!Array.isArray(r))
        fail(`${at}.rows[${i}]`, "each row is a list of cells");
      else if (Array.isArray(p.columns) && r.length !== p.columns.length) {
        warn(
          `${at}.rows[${i}]`,
          `${r.length} cells under ${p.columns.length} columns`,
        );
      }
    });
  }
  if (p.kind === "diff") {
    const rows = items(p.rows, `${at}.rows`);
    if (!rows.length)
      fail(
        `${at}.rows`,
        'add the rows, such as {"name": "`color.primary`", "before": "#c4903d", "now": "#b5832f"}',
      );
    rows.forEach((r, i) => {
      const where = `${at}.rows[${i}]`;
      if (!shape(r, SHAPES.diffRow, where)) return;
      need(r, "name", where, "the token, key or rule that moved");
      const was = r.before != null && r.before !== "";
      const is = r.now != null && r.now !== "";
      for (const k of ["before", "now"])
        if (r[k] != null && typeof r[k] !== "string")
          fail(`${where}.${k}`, "the value as text");
      if (!was && !is)
        fail(
          where,
          "give before, now or both; one alone draws it as removed or new",
        );
      else if (was && is && r.before === r.now)
        warn(where, "before and now are the same; drop the row");
    });
  }
  if (p.kind === "board") {
    const columns = items(p.columns, `${at}.columns`);
    if (columns.length < 2)
      fail(
        `${at}.columns`,
        "a board has at least 2 columns, one per stage things moved to",
      );
    columns.forEach((c, i) => {
      const where = `${at}.columns[${i}]`;
      if (!shape(c, SHAPES.boardColumn, where)) return;
      need(c, "name", where, "the stage, such as Proposed or Accepted");
      if (!items(c.items, `${where}.items`).every(isText))
        fail(`${where}.items`, "a list of strings, one per thing in the stage");
      tone(c.tone, `${where}.tone`);
    });
  }
  if (p.kind === "bars") {
    const bars = items(p.items, `${at}.items`);
    if (bars.length < 2)
      fail(`${at}.items`, "a chart compares at least 2 values");
    bars.forEach((b, i) => {
      if (!shape(b, SHAPES.bar, `${at}.items[${i}]`)) return;
      need(b, "label", `${at}.items[${i}]`);
      if (typeof b.value !== "number")
        fail(`${at}.items[${i}].value`, "must be a number");
    });
  }
}

function mock(p, at) {
  if (p.frame != null && !FRAMES.includes(p.frame))
    fail(`${at}.frame`, `use one of ${FRAMES.join(", ")}`);
  if (p.frame === "desktop" && !isText(p.url)) {
    warn(
      `${at}.url`,
      "the page's address, read from the routes; the bar stays empty without it",
    );
  }
  if (p.frame === "push")
    return need(
      p,
      "title",
      at,
      "the notification's title, in the catalog's words",
    );
  const parts = items(p.items, `${at}.items`);
  if (!parts.length)
    fail(
      `${at}.items`,
      'draw the screen with items such as {"label": "Time left", "value": "29:12"}',
    );
  parts.forEach((it, i) => {
    const where = `${at}.items[${i}]`;
    if (!shape(it, SHAPES.mockItem, where)) return;
    const main = Object.keys(it).filter((k) => MOCK_PARTS.includes(k));
    if (main.length !== 1)
      fail(where, `needs exactly one of ${MOCK_PARTS.join(", ")}`);
    tone(it.tone, `${where}.tone`);
  });
}

function recorded(value, at) {
  need(
    value,
    "text",
    at,
    "the record that now holds the answer, such as a decisions.md row",
  );
  if (value.href != null) link(value.href, `${at}.href`);
}

function tone(value, at) {
  if (value != null && !TONES.includes(value))
    fail(at, `use one of ${TONES.join(", ")}`);
}

function words(value, at) {
  if (typeof value === "string") {
    if (/<\/?[a-z][^>]*>/i.test(value))
      warn(
        at,
        "markup shows as plain text; use **bold**, `code` or [text](https://...)",
      );
    if (/[–—]/.test(value)) warn(at, "use a plain hyphen (-), not a dash");
    for (const m of value.matchAll(/\[[^\]]+\]\(([^)]*)\)/g)) {
      if (!/^(https?:\/\/|#)/.test(m[1]))
        fail(at, `link "${m[1]}" must start with https:// or #`);
    }
  } else if (Array.isArray(value)) {
    for (const [i, v] of value.entries()) words(v, `${at}[${i}]`);
  } else if (isObject(value)) {
    for (const [k, v] of Object.entries(value)) words(v, `${at}.${k}`);
  }
}

shape(data, SHAPES.data, "data");
const page = data.page ?? "feature";
if (data.lead != null && data.lead !== "changes" && data.lead !== "extra")
  fail(
    "data.lead",
    'use "extra" to open on the extra section, "changes" to open on What changed, or leave it out',
  );
if (data.lead === "extra" && data.extra == null)
  fail("data.lead", '"extra" leads only when data.extra names a fragment');
if (!PAGES.includes(page)) fail("data.page", `use one of ${PAGES.join(", ")}`);
const digest = page === "digest";
need(data, "title", "data", "name the page in two to four words");
if (
  isText(data.title) &&
  (/[:|]| - /.test(data.title) || data.title.trim().split(/\s+/).length > 5)
) {
  warn(
    "data.title",
    `"${data.title}" reads as a caption; name the page in two to four words`,
  );
}
if (digest && data.verdict != null)
  fail("data.verdict", "a digest reports what moved and carries no verdict");
if (!digest && !(data.verdict in VERDICTS))
  fail("data.verdict", `use one of ${Object.keys(VERDICTS).join(", ")}`);
need(
  data,
  "reason",
  "data",
  'the one reason, such as "Ready to merge once 2 decisions are made"',
);
long(data.reason, 110, "data.reason");
if (shape(data.stamp, SHAPES.stamp, "data.stamp")) {
  need(data.stamp, "repo", "data.stamp");
  need(
    data.stamp,
    "commit",
    "data.stamp",
    "a page tied to no commit cannot be trusted after the next push",
  );
  if (digest) {
    need(
      data.stamp,
      "from",
      "data.stamp",
      "the checkpoint commit the digest starts from",
    );
    need(
      data.stamp,
      "fromDate",
      "data.stamp",
      "the day the checkpoint commit landed: fromDate in facts.json",
    );
  } else
    need(
      data.stamp,
      "version",
      "data.stamp",
      "v1 on the first publish, then v2 and on",
    );
  for (const k of ["date", "fromDate"])
    if (data.stamp[k] != null && !/^\d{4}-\d{2}-\d{2}/.test(data.stamp[k]))
      fail(`data.stamp.${k}`, "a day as YYYY-MM-DD, such as 2026-10-19");
  const version = data.stamp.version;
  if (isText(version) && !/^v\d+$/.test(version))
    warn("data.stamp.version", "use v1, v2 and on");
  if (isText(version) && version !== "v1" && !isText(data.since)) {
    warn(
      "data.since",
      "say what moved since the last version, so a returning reader skips the rest",
    );
  }
}
const figures = items(data.numbers, "data.numbers");
figures.forEach((n, i) => {
  const at = `data.numbers[${i}]`;
  if (!shape(n, SHAPES.number, at)) return;
  need(n, "label", at, 'what is counted, such as "commits"');
  if (!Number.isFinite(n.value) && !isText(n.value))
    fail(`${at}.value`, "the count, such as 227");
});
if (figures.length > 4)
  warn(
    "data.numbers",
    `${figures.length} numbers; keep the 3 or 4 a reader would repeat`,
  );
if (data.example)
  warn(
    "data.example",
    'still the example: replace every value with your own facts, then delete "example"',
  );

const decide = data.decide ?? {};
if (data.decide != null) shape(decide, SHAPES.decide, "data.decide");
const questions = items(decide.questions, "data.decide.questions");
const blockers = items(decide.blockers, "data.decide.blockers");
const agentDecisions = items(
  decide.agentDecisions,
  "data.decide.agentDecisions",
);
const numbers = new Set();
questions.forEach((q, i) => {
  const at = `data.decide.questions[${i}]`;
  if (!shape(q, SHAPES.question, at)) return;
  if (!Number.isInteger(q.n) || q.n < 1)
    fail(
      `${at}.n`,
      "number the questions 1, 2, 3; never renumber a published one",
    );
  else if (numbers.has(`q${q.n}`))
    fail(`${at}.n`, `question ${q.n} appears twice`);
  numbers.add(`q${q.n}`);
  need(q, "title", at);
  need(q, "ask", at, "the exact question, in the reader's words");
  need(q, "why", at, "why the answer matters to the people it reaches");
  need(q, "blocks", at, "the work that waits on the answer");
  reasons(q.reasons, `${at}.reasons`, q.answered == null);
  picture(q.picture, `${at}.picture`);
  if (
    q.answered != null &&
    shape(q.answered, SHAPES.answered, `${at}.answered`)
  ) {
    if (!items(q.options).some((o) => o?.key === q.answered.option)) {
      fail(`${at}.answered.option`, "the letter of the option that was picked");
    }
    recorded(q.answered, `${at}.answered`);
  }
  const options = items(q.options, `${at}.options`);
  if (options.length < 2)
    fail(`${at}.options`, "a question needs at least 2 options");
  const keys = new Set();
  options.forEach((o, j) => {
    const where = `${at}.options[${j}]`;
    if (!shape(o, SHAPES.option, where)) return;
    const expected = String.fromCharCode(65 + j);
    if (!/^[A-Z]$/.test(o.key ?? ""))
      fail(`${where}.key`, `a capital letter: "${expected}"`);
    else if (keys.has(o.key))
      fail(`${where}.key`, `option ${o.key} appears twice`);
    else if (o.key !== expected)
      warn(
        `${where}.key`,
        `letter the options in order; this one is "${expected}"`,
      );
    keys.add(o.key);
    need(o, "label", where);
    need(o, "outcome", where, "what happens if this option is picked");
    need(o, "cost", where, 'what the option costs; write "None" when nothing');
    long(o.label, 40, `${where}.label`);
    picture(o.picture, `${where}.picture`);
    if (JSON.stringify(o.picture ?? null).includes('"rendered"')) {
      warn(
        `${where}.picture`,
        "an option's picture is a planned screen; rendered marks a stand-in for a screen the build already has",
      );
    }
  });
  const recommended = options.filter((o) => o?.recommended === true);
  if (recommended.length !== 1)
    fail(`${at}.options`, 'mark exactly one option "recommended": true');
  else if (options[0]?.recommended !== true)
    fail(`${at}.options`, "put the recommended option first, as A");
  const drawn = q.picture || options.some((o) => o?.picture);
  if (q.answered == null && options.length > 1 && !drawn) {
    warn(
      `${at}.options`,
      "draw each option when they differ in what people see or how a flow runs",
    );
  }
});
blockers.forEach((b, i) => {
  const at = `data.decide.blockers[${i}]`;
  if (!shape(b, SHAPES.blocker, at)) return;
  if (!Number.isInteger(b.n) || b.n < 1)
    fail(
      `${at}.n`,
      "number the blockers 1, 2, 3; never renumber a published one",
    );
  else if (numbers.has(`b${b.n}`))
    fail(`${at}.n`, `blocker ${b.n} appears twice`);
  numbers.add(`b${b.n}`);
  need(b, "title", at);
  need(b, "action", at, "the exact action a person takes");
  need(b, "why", at, "why the action is needed");
  need(b, "blocks", at, "the work that cannot go on without it");
  reasons(b.reasons, `${at}.reasons`, b.done == null);
  if (b.done != null && shape(b.done, SHAPES.done, `${at}.done`)) {
    recorded(b.done, `${at}.done`);
  }
});
agentDecisions.forEach((d, i) => {
  const at = `data.decide.agentDecisions[${i}]`;
  if (!shape(d, SHAPES.agentDecision, at)) return;
  need(d, "decision", at);
  need(d, "taken", at, "the option taken without asking");
});
const openQuestions = questions.filter(
  (q) => isObject(q) && q.answered == null,
);
const openBlockers = blockers.filter((b) => isObject(b) && b.done == null);
if (data.verdict === "decide" && !openQuestions.length)
  fail("data.verdict", '"decide" needs a question in decide.questions');
if (data.verdict === "blocked" && !openBlockers.length)
  fail("data.verdict", '"blocked" needs a blocker in decide.blockers');
if (data.verdict === "ready" && (openQuestions.length || openBlockers.length)) {
  fail(
    "data.verdict",
    'a page that still asks is not ready; use "decide" or "blocked"',
  );
}

const changes = items(data.changes, "data.changes");
if ((page === "feature" || digest) && !changes.length)
  fail("data.changes", `a ${page} page always says what changed`);
const changeIds = new Set();
changes.forEach((c, i) => {
  const at = `data.changes[${i}]`;
  if (!shape(c, SHAPES.change, at)) return;
  if (!/^[a-z][a-z0-9-]*$/.test(c.id ?? ""))
    fail(
      `${at}.id`,
      'lowercase words joined by hyphens, such as "extended-label"',
    );
  else if (RESERVED.includes(c.id) || RESERVED_PREFIX.test(c.id))
    fail(`${at}.id`, `"${c.id}" is taken by the page; pick another`);
  else if (changeIds.has(c.id)) fail(`${at}.id`, `"${c.id}" appears twice`);
  changeIds.add(c.id);
  const kinds =
    page === "decision"
      ? ["settled", "new", "changed", "removed"]
      : ["new", "changed", "removed"];
  if ((page === "feature" || c.kind != null) && !kinds.includes(c.kind))
    fail(`${at}.kind`, `use one of ${kinds.join(", ")}`);
  need(c, "title", at);
  need(
    c,
    "now",
    at,
    page === "decision" ? "the settled fact" : "what a person sees now",
  );
  if ((c.kind === "changed" || c.kind === "removed") && !isText(c.before))
    fail(`${at}.before`, "what a person saw before");
  if (
    c.who != null &&
    !isText(c.who) &&
    !(Array.isArray(c.who) && c.who.every(isText))
  ) {
    fail(`${at}.who`, 'who notices, as a list such as ["Bidders"]');
  }
  if (page !== "decision" && !c.picture)
    warn(
      `${at}.picture`,
      "lead with a picture: a shot, a beforeNow, a mock, a flow or lanes",
    );
  items(c.links, `${at}.links`).forEach((l, j) => {
    if (!shape(l, SHAPES.link, `${at}.links[${j}]`)) return;
    need(l, "text", `${at}.links[${j}]`, "the words of the link");
    link(l.href, `${at}.links[${j}].href`);
  });
  long(c.title, 90, `${at}.title`);
  long(c.before, 240, `${at}.before`);
  long(c.now, 240, `${at}.now`);
  picture(c.picture, `${at}.picture`);
});

if (data.try != null && shape(data.try, SHAPES.try, "data.try")) {
  items(data.try.steps, "data.try.steps").forEach((s, i) => {
    const at = `data.try.steps[${i}]`;
    if (!shape(s, SHAPES.step, at)) return;
    need(s, "title", at);
    if (!isText(s.success))
      warn(
        `${at}.success`,
        "the exact message the screen shows when the step worked",
      );
    picture(s.picture, `${at}.picture`);
  });
}

const proof = items(data.proof, "data.proof");
if (!proof.length && !digest)
  fail(
    "data.proof",
    "every page carries proof: the claim, how it was proven, on which commit",
  );
proof.forEach((p, i) => {
  const at = `data.proof[${i}]`;
  if (!shape(p, SHAPES.proof, at)) return;
  need(p, "claim", at);
  need(p, "how", at, "how it was proven: a test, a CI run, a walk");
  if (!STATUSES.includes(p.status))
    fail(`${at}.status`, `use one of ${STATUSES.join(", ")}`);
  if (
    ["verified", "partial", "failed"].includes(p.status) &&
    !isText(p.revision)
  ) {
    fail(`${at}.revision`, "the commit it was proven on");
  }
  if (["partial", "not-run", "failed"].includes(p.status) && !isText(p.why))
    fail(`${at}.why`, "why it is not fully proven");
  if (p.change != null && !changeIds.has(p.change))
    fail(`${at}.change`, `no change has the id "${p.change}"`);
  if (p.href != null) link(p.href, `${at}.href`);
});
for (const id of changeIds) {
  if (page === "feature" && !proof.some((p) => p?.change === id)) {
    warn(
      "data.proof",
      `no row proves change "${id}"; give one row "change": "${id}"`,
    );
  }
}
if (data.verdict === "ready" && proof.some((p) => p?.status === "failed")) {
  fail(
    "data.verdict",
    "a failed claim and a Ready verdict cannot stand together",
  );
}

if (data.ship != null && shape(data.ship, SHAPES.ship, "data.ship")) {
  if (
    data.ship.needs != null &&
    !(Array.isArray(data.ship.needs) && data.ship.needs.every(isText))
  ) {
    fail("data.ship.needs", "a list of sentences");
  }
  if (!isText(data.ship.undo))
    warn("data.ship.undo", "how to undo it, or that it cannot be undone");
}

const followupIds = new Set();
items(data.followups, "data.followups").forEach((f, i) => {
  const at = `data.followups[${i}]`;
  if (!shape(f, SHAPES.followup, at)) return;
  if (!/^[a-z0-9][a-z0-9-]*$/.test(f.id ?? ""))
    fail(
      `${at}.id`,
      "lowercase words joined by hyphens; an id outlives a version",
    );
  else if (followupIds.has(f.id)) fail(`${at}.id`, `"${f.id}" appears twice`);
  followupIds.add(f.id);
  need(f, "title", at);
  need(f, "owner", at, "who takes it");
  if (!isText(f.why)) warn(`${at}.why`, "why it is left");
});

if (data.engineers == null)
  warn("data.engineers", "add For engineers: commits, files and links");
else if (shape(data.engineers, SHAPES.engineers, "data.engineers")) {
  items(data.engineers.commits, "data.engineers.commits").forEach((c, i) => {
    const at = `data.engineers.commits[${i}]`;
    if (!shape(c, SHAPES.commit, at)) return;
    need(c, "sha", at);
    need(c, "subject", at);
    if (c.href != null) link(c.href, `${at}.href`);
  });
  items(data.engineers.links, "data.engineers.links").forEach((l, i) => {
    if (shape(l, SHAPES.link, `data.engineers.links[${i}]`))
      link(l.href, `data.engineers.links[${i}].href`);
  });
  for (const part of ["files", "notes"]) {
    const list = items(data.engineers[part], `data.engineers.${part}`);
    if (!list.every(isText))
      fail(`data.engineers.${part}`, "a list of strings");
  }
}

let extra = "";
if (data.extra != null && shape(data.extra, SHAPES.extra, "data.extra")) {
  need(data.extra, "title", "data.extra", "the section's heading");
  localFile(data.extra.file, "data.extra.file");
  if (isText(data.extra.file) && existsSync(join(dir, data.extra.file))) {
    extra = readFileSync(join(dir, data.extra.file), "utf8");
    if (/<\/template/i.test(extra))
      fail("data.extra.file", "the fragment cannot hold </template>");
  }
}

words(data, "data");

for (const [level, at, message] of problems)
  console.log(`${level}  ${at}: ${message}`);
const failed = problems.filter(([level]) => level === "FAIL").length;
if (failed) {
  console.log(`not built: ${failed} to fix in ${file}`);
  process.exit(1);
}

const escapeHtml = (s) =>
  s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const template = readFileSync(
  join(here, "..", "assets", "template.html"),
  "utf8",
);
const html = template
  .replace(
    /<title>[^<]*<\/title>/,
    () => `<title>${escapeHtml(data.title)}</title>`,
  )
  .replace(
    /(<script type="application\/json" id="handoff-data">)[\s\S]*?(<\/script>)/,
    (_, start, end) =>
      `${start}${JSON.stringify(data).replace(/</g, "\\u003c")}${end}`,
  )
  .replace(
    /<template id="handoff-extra"><\/template>/,
    () => `<template id="handoff-extra">${extra}</template>`,
  );
writeFileSync(out, html);
writeFileSync(replyPath, reply());

const shown = (p) => {
  const r = relative(process.cwd(), p);
  return r && !r.startsWith("..") ? r : p;
};
console.log(
  `built ${shown(out)} (${Math.round(html.length / 1024)} KB) and ${shown(replyPath)}`,
);
console.log(`next: node ${join(here, "check.mjs")} ${out}`);

function reply() {
  const end = (s) => {
    const t = String(s ?? "").trim();
    return /[.!?]$/.test(t) ? t : `${t}.`;
  };
  const sources = (list) =>
    (list ?? [])
      .map((r) => (r.href ? `[${r.text}](${r.href})` : r.text))
      .join("; ");
  const asks = openQuestions.length || openBlockers.length;
  const lines = [
    `**${digest ? data.title : VERDICTS[data.verdict]}** - ${end(data.reason)}`,
    "",
    url ? `${url}${asks ? "#decide" : ""}` : "{{link}}",
  ];
  if (openQuestions.length) {
    lines.push("", "### Questions", "");
    for (const q of openQuestions) {
      lines.push(`${q.n}. **${q.title}** - ${end(q.ask)}`);
      for (const o of q.options) {
        lines.push(
          `   - **${o.key} - ${o.label}${o.recommended ? " - Recommended" : ""}** - ${end(o.outcome)} Cost: ${end(o.cost)}`,
        );
      }
      lines.push(
        `   - **Why it matters** - ${end(q.why)}`,
        `   - **Blocks** - ${end(q.blocks)}`,
      );
      if (q.reasons?.length)
        lines.push(`   - **Reasons** - ${sources(q.reasons)}`);
    }
  }
  if (openBlockers.length) {
    lines.push("", "### Blockers", "");
    for (const b of openBlockers) {
      lines.push(
        `${b.n}. **${b.title}** - ${end(b.action)}`,
        `   - **Why it matters** - ${end(b.why)}`,
        `   - **Blocks** - ${end(b.blocks)}`,
      );
      if (b.reasons?.length)
        lines.push(`   - **Reasons** - ${sources(b.reasons)}`);
    }
  }
  if (agentDecisions.length) {
    lines.push("", "### Decisions made by Agents", "");
    for (const d of agentDecisions)
      lines.push(`- **${d.decision}** - ${end(d.taken)}`);
  }
  if (!digest)
    lines.push(
      "",
      "The page is behind the team's Cloudflare login; answer in a PR comment or here.",
    );
  return `${lines.join("\n")}\n`;
}
