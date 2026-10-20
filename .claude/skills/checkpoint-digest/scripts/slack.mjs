// Post what a run brought to one day's digest: the day's changes whose commits are new since the last post, with the page's link.
// node slack.mjs <data.json> --url <page link> [--latest <branch link>] [--from <rev> --to <rev>] [--channel <id>] [--send]
// Without --send it prints what it would post and calls nothing. The run's commits come from the data's range, or --from and --to.
// A day with no new change posts nothing. The button opens --latest, the link that always shows the newest digest.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const API = "https://slack.com/api";
const MAX_TEXT = 2900;
const MAX_CHANGES = 12;
const KIND = { new: "New", changed: "Changed", removed: "Removed" };

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const file = args.find(
  (a, i) =>
    !a.startsWith("--") &&
    !/^--(url|latest|from|to|channel)$/.test(args[i - 1]),
);
const url = option("url");
if (!file || !url)
  fail(
    "usage: node slack.mjs <data.json> --url <page link> [--latest <branch link>] [--from <rev> --to <rev>] [--channel <id>] [--send]",
  );
const page = url.split("#")[0];
const latest = option("latest") ?? page;
const data = JSON.parse(readFileSync(resolve(file), "utf8"));
const channel = option("channel") ?? process.env.SLACK_CHANNEL;
const token = process.env.SLACK_BOT_TOKEN;
const fresh = brought();
const changes = (data.changes ?? []).filter((c) =>
  (c.commits ?? []).some((sha) => fresh.some((f) => f.startsWith(sha))),
);
if (!changes.length) {
  console.log(`nothing new on ${data.stamp?.date}: no post`);
  process.exit(0);
}

const message = {
  channel,
  text: `${plain(data.title)}: ${plain(data.reason)}`,
  blocks: blocks(),
  unfurl_links: false,
};

if (!args.includes("--send")) {
  console.log(JSON.stringify(message, null, 2));
  console.log("dry run: add --send to post");
  process.exit(0);
}
if (!token) fail("SLACK_BOT_TOKEN is not set");
if (!channel) fail("name the channel: --channel <id> or SLACK_CHANNEL");

const posted = await call("chat.postMessage", message);
const { permalink } = await call(
  "chat.getPermalink",
  new URLSearchParams({ channel: posted.channel, message_ts: posted.ts }),
);
console.log(
  JSON.stringify({ channel: posted.channel, ts: posted.ts, permalink }),
);

// The page's top, then its At a glance list: the same order, each title opening its card.
function blocks() {
  const s = data.stamp ?? {};
  const where = [s.repo, s.branch].filter(Boolean).join(" · ");
  const out = [
    {
      type: "header",
      text: { type: "plain_text", text: plain(data.title).slice(0, 150) },
    },
    context([period(s), where, range(s)].filter(Boolean).join("  ·  ")),
    section(mrkdwn(data.reason)),
  ];
  const numbers = data.numbers ?? [];
  if (numbers.length)
    out.push(
      context(
        numbers
          .map((n) => `*${figure(n.value)}* ${mrkdwn(n.label)}`)
          .join("  ·  "),
      ),
    );
  if (data.since) out.push(context(mrkdwn(data.since)));
  // A button of its own row, so the reason keeps the full width on a phone.
  out.push({
    type: "actions",
    elements: [
      {
        type: "button",
        text: { type: "plain_text", text: "Open the digest" },
        url: latest,
        style: "primary",
      },
    ],
  });

  const all = data.changes?.length ?? 0;
  const shown = changes.slice(0, MAX_CHANGES);
  const phases = [...new Set(shown.map((c) => c.phase).filter(Boolean))];
  const groups = [
    ...phases.map((p) => [p, shown.filter((c) => c.phase === p)]),
    ["", shown.filter((c) => !c.phase)],
  ].filter(([, items]) => items.length);
  out.push(
    { type: "divider" },
    context(
      `*${changes.length} new* since the last post${all > changes.length ? `, of ${all} on the day` : ""}`,
    ),
  );
  for (const [phase, items] of groups)
    out.push(
      section(
        [phase && `*${mrkdwn(phase)}*`, ...items.map(line)]
          .filter(Boolean)
          .join("\n"),
      ),
    );
  const more = changes.length - shown.length;
  if (more > 0)
    out.push(
      context(
        `<${page}#changed|${more} more change${more === 1 ? "" : "s"}> on the page`,
      ),
    );

  // Follow-ups stay on the page: a post every hour would repeat them.
  const followups = data.followups?.length ?? 0;
  out.push(
    context(
      [
        followups
          ? `<${page}#followups|${followups} follow-up${followups === 1 ? "" : "s"}> on the page.`
          : null,
        `Each title opens its picture on <${page}|the day's digest>. The page sits behind the team's Cloudflare login for 30 days.`,
      ]
        .filter(Boolean)
        .join(" "),
    ),
  );
  return out.slice(0, 50);
}

// The commits this run brought: the range the run read, never the day's, so an earlier post is not repeated.
function brought() {
  const from = option("from") ?? data.range?.from;
  const to = option("to") ?? data.range?.to;
  if (!from || !to)
    fail(
      "name the run's commits: --from and --to, or a range in the data as publish.mjs writes it",
    );
  return execFileSync("git", ["rev-list", "--no-merges", to, `^${from}`], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
    .split("\n")
    .filter(Boolean);
}

// One change: its kind, its title linked to its card, and who notices it.
function line(c) {
  const kind = KIND[c.kind] ? `${KIND[c.kind]}: ` : "";
  const who = [c.who ?? []].flat().filter(Boolean);
  return `• ${kind}*<${page}#${c.id}|${label(c.title)}>*${who.length ? ` · _${mrkdwn(who.join(", "))}_` : ""}`;
}

// The days the digest covers, as the page writes them: the year once, on the last day.
function period(s) {
  const day = (v) => {
    const m = String(v ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null;
  };
  const text = (d, year) => {
    const part = Object.fromEntries(
      new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
        .formatToParts(d)
        .map((p) => [p.type, p.value]),
    );
    return [part.weekday, part.day, part.month, year ? part.year : null]
      .filter(Boolean)
      .join(" ");
  };
  const from = day(s.fromDate);
  const to = day(s.date);
  if (!to) return s.date;
  if (!from || +from === +to) return text(to, true);
  return `${text(from, from.getUTCFullYear() !== to.getUTCFullYear())} to ${text(to, true)}`;
}

// The commits the digest covers, opening GitHub's comparison of the two.
function range(s) {
  if (!s.from || !s.commit) return s.commit ? `\`${s.commit}\`` : null;
  const text = `${s.from}..${s.commit}`;
  return /^[\w.-]+\/[\w.-]+$/.test(s.repo ?? "")
    ? `<https://github.com/${s.repo}/compare/${s.from}...${s.commit}|${text}>`
    : `\`${text}\``;
}

function figure(v) {
  return typeof v === "number" ? v.toLocaleString("en-GB") : mrkdwn(v);
}

function section(text) {
  return { type: "section", text: { type: "mrkdwn", text: clip(text) } };
}

function context(text) {
  return { type: "context", elements: [{ type: "mrkdwn", text: clip(text) }] };
}

// The page's markdown - **bold**, `code`, [text](https://...) - in Slack's own.
function mrkdwn(s) {
  return entities(s)
    .replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, "<$2|$1>")
    .replace(/\*\*([^*]+)\*\*/g, "*$1*");
}

// A link's words: Slack draws no formatting inside them, and a | or > would end the link.
function label(s) {
  return entities(plain(s)).replace(/\|/g, "/");
}

function entities(s) {
  return String(s ?? "").replace(
    /[&<>]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c],
  );
}

function plain(s) {
  return String(s ?? "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*|`/g, "");
}

function clip(text) {
  return text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT - 2)} …` : text;
}

async function call(method, body) {
  const json = !(body instanceof URLSearchParams);
  for (let attempt = 0; attempt < 2; attempt++) {
    const answer = await fetch(`${API}/${method}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": json
          ? "application/json; charset=utf-8"
          : "application/x-www-form-urlencoded",
      },
      body: json ? JSON.stringify(body) : body,
    });
    if (answer.status === 429 && attempt === 0) {
      const wait = Number(answer.headers.get("retry-after") ?? 1);
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }
    const result = await answer.json();
    if (!result.ok)
      fail(
        `${method} refused: ${result.error}${result.needed ? ` (needs ${result.needed})` : ""}`,
      );
    return result;
  }
  fail(`${method} was rate limited twice`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
