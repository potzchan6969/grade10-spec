// Post a published digest to Slack: one message drawn from its data, with the page's link.
// node slack.mjs <data.json> --url <page link> [--channel <id>] [--send] - without --send it prints what it would post and calls nothing.
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
  (a, i) => !a.startsWith("--") && !/^--(url|channel)$/.test(args[i - 1]),
);
const url = option("url");
if (!file || !url)
  fail(
    "usage: node slack.mjs <data.json> --url <page link> [--channel <id>] [--send]",
  );
const page = url.split("#")[0];
const data = JSON.parse(readFileSync(resolve(file), "utf8"));
const channel = option("channel") ?? process.env.SLACK_CHANNEL;
const token = process.env.SLACK_BOT_TOKEN;

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
        url: page,
        style: "primary",
      },
    ],
  });

  const changes = data.changes ?? [];
  const shown = changes.slice(0, MAX_CHANGES);
  const phases = [...new Set(shown.map((c) => c.phase).filter(Boolean))];
  const groups = [
    ...phases.map((p) => [p, shown.filter((c) => c.phase === p)]),
    ["", shown.filter((c) => !c.phase)],
  ].filter(([, items]) => items.length);
  if (groups.length) out.push({ type: "divider" });
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

  const followups = data.followups ?? [];
  if (followups.length) {
    out.push({ type: "divider" });
    out.push(
      section(
        [
          "*Follow-ups*",
          ...followups.map(
            (f) =>
              `• *${mrkdwn(f.owner)}*: <${page}#fu-${f.id}|${label(f.title)}>`,
          ),
        ].join("\n"),
      ),
    );
  }
  out.push(
    context(
      `Each title opens its picture on <${page}|the digest>. The page sits behind the team's Cloudflare login for 30 days.`,
    ),
  );
  return out.slice(0, 50);
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
