// Post a published digest to Slack: one message drawn from its data, with the page's link.
// node slack.mjs <data.json> --url <page link> [--channel <id>] [--send] - without --send it prints what it would post and calls nothing.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const API = "https://slack.com/api";
const MAX_TEXT = 2900;

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
const data = JSON.parse(readFileSync(resolve(file), "utf8"));
const channel = option("channel") ?? process.env.SLACK_CHANNEL;
const token = process.env.SLACK_BOT_TOKEN;

const message = {
  channel,
  text: `${data.title}: ${plain(data.reason)}`,
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

function blocks() {
  const s = data.stamp ?? {};
  const range = s.from && s.commit ? `${s.from}..${s.commit}` : s.commit;
  const out = [
    {
      type: "header",
      text: { type: "plain_text", text: data.title.slice(0, 150) },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: mrkdwn(data.reason) },
      accessory: {
        type: "button",
        text: { type: "plain_text", text: "Open the page" },
        url,
        style: "primary",
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: [s.repo, s.branch, range && `\`${range}\``, s.date]
            .filter(Boolean)
            .join("  ·  "),
        },
      ],
    },
  ];
  const changes = data.changes ?? [];
  for (const phase of [...new Set(changes.map((c) => c.phase ?? ""))]) {
    const lines = changes
      .filter((c) => (c.phase ?? "") === phase)
      .map((c) => `• *${mrkdwn(c.title)}* - ${mrkdwn(c.now)}`);
    out.push({ type: "divider" });
    out.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: clip(
          [phase && `*${phase}*`, ...lines].filter(Boolean).join("\n"),
        ),
      },
    });
  }
  const followups = data.followups ?? [];
  if (followups.length) {
    out.push({ type: "divider" });
    out.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: clip(
          [
            "*Follow-ups*",
            ...followups.map(
              (f) => `• ${mrkdwn(f.title)} - ${mrkdwn(f.owner)}`,
            ),
          ].join("\n"),
        ),
      },
    });
  }
  out.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `<${url}|The page> draws each change; it is behind the team's Cloudflare login for 30 days.`,
      },
    ],
  });
  return out.slice(0, 50);
}

// The page's markdown - **bold**, `code`, [text](https://...) - in Slack's own.
function mrkdwn(s) {
  return String(s ?? "")
    .replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c])
    .replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, "<$2|$1>")
    .replace(/\*\*([^*]+)\*\*/g, "*$1*");
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
