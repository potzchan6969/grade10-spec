// Post a built digest to Slack: one message drawn from its data, then its pictures and the page in the message's thread.
// node slack.mjs <data.json> [--channel <id>] [--send] - without --send it prints what it would post and calls nothing.
import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const API = "https://slack.com/api";
const SECTIONS = ["extra", "changed", "ship", "followups"];
const MAX_TEXT = 2900;

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const file = args.find(
  (a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--channel"),
);
if (!file) fail("usage: node slack.mjs <data.json> [--channel <id>] [--send]");
const dir = dirname(resolve(file));
const data = JSON.parse(readFileSync(resolve(file), "utf8"));
const channel = option("channel") ?? process.env.SLACK_CHANNEL;
const token = process.env.SLACK_BOT_TOKEN;
const send = args.includes("--send");

const message = {
  channel,
  text: `${data.title}: ${plain(data.reason)}`,
  blocks: blocks(),
};
const uploads = [
  ...SECTIONS.map((id) => join(dir, "check", `page-1280-light-${id}.png`)),
  join(dir, "page.html"),
].filter(existsSync);

if (!send) {
  console.log(JSON.stringify({ message, uploads }, null, 2));
  console.log("dry run: add --send to post");
  process.exit(0);
}
if (!token) fail("SLACK_BOT_TOKEN is not set");
if (!channel) fail("name the channel: --channel <id> or SLACK_CHANNEL");

const posted = await call("chat.postMessage", message);
const files = [];
for (const path of uploads) {
  const { upload_url, file_id } = await call(
    "files.getUploadURLExternal",
    new URLSearchParams({
      filename: basename(path),
      length: String(statSync(path).size),
    }),
  );
  const put = await fetch(upload_url, {
    method: "POST",
    body: readFileSync(path),
  });
  if (!put.ok) fail(`upload of ${basename(path)} refused: ${put.status}`);
  files.push({ id: file_id, title: titleOf(path) });
}
if (files.length)
  await call("files.completeUploadExternal", {
    files,
    channel_id: posted.channel,
    thread_ts: posted.ts,
  });
const { permalink } = await call(
  "chat.getPermalink",
  new URLSearchParams({ channel: posted.channel, message_ts: posted.ts }),
);
console.log(
  JSON.stringify({
    channel: posted.channel,
    ts: posted.ts,
    permalink,
    files: files.length,
  }),
);

function blocks() {
  const s = data.stamp ?? {};
  const range = s.from && s.commit ? `${s.from}..${s.commit}` : s.commit;
  const out = [
    {
      type: "header",
      text: { type: "plain_text", text: data.title.slice(0, 150) },
    },
    { type: "section", text: { type: "mrkdwn", text: mrkdwn(data.reason) } },
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
  const phases = [...new Set(changes.map((c) => c.phase ?? ""))];
  for (const phase of phases) {
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
      { type: "mrkdwn", text: "Pictures and the full page are in the thread." },
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

function titleOf(path) {
  const id = basename(path).match(/-light-(\w+)\.png$/)?.[1];
  if (!id) return `${data.title} - full page`;
  if (id === "extra") return data.extra?.title ?? "Overview";
  return (
    { changed: "What changed", ship: "Ship it", followups: "Follow-ups" }[id] ??
    id
  );
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
