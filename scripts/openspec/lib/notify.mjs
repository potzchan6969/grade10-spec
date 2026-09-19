/*
 * Where a message goes, how it is keyed, and the one way it is sent.
 *
 * Two senders read this: the push workflow's `changed-changes.mjs --stages`,
 * which tells a hand the change has reached them, and `digest.mjs`, which
 * tells a person their week. What each says is its own — the words belong
 * beside the facts they are drawn from — but who a message is addressed to,
 * what key stops it being sent twice, and the call that posts it are one
 * answer for both, because two answers would address a rename two ways and
 * would spend two retries on one rate limit.
 *
 * Nothing here decides whether to send. The caller holds `--send`; without
 * it every payload is printed and the Slack API is never called.
 */
import { appendFileSync, readFileSync } from "node:fs";

import { channelOf, memberOf } from "./team.mjs";

/** The one call that posts a message. */
export const POST_MESSAGE = "https://slack.com/api/chat.postMessage";

/**
 * Who a message is addressed to: the hand's Slack member, or the role's
 * channel where the change names no hand for it.
 *
 * Three answers, and the third is not a failure. A handle the team map does
 * not know and a handle it knows with no `slack` are both sent nothing —
 * `Q27` and the map's own line — and the run says so out loud, because a
 * message nobody got is worth a line in the log and is never worth a guess at
 * who else might want it. A removed hand is an unnamed one: the role's channel
 * hears, which is what makes taking a hand off a change a move.
 */
export function addressOf(map, { role, hand }) {
  if (!hand) {
    const channel = channelOf(map, role);
    if (!channel) {
      return { skipped: `no channel for \`${role}\` in the team map` };
    }
    return { to: "channel", channel };
  }
  const member = memberOf(map, hand);
  if (!member) return { skipped: `the team map does not know \`${hand}\`` };
  if (!member.slack) {
    return { skipped: `\`${hand}\` has no Slack member in the team map` };
  }
  return { to: "member", channel: member.slack };
}

/** `<channel>/<ts>` as the record writes a thread, split for the API. */
export function threadPartsOf(thread) {
  const [channel, ts] = String(thread ?? "").split("/");
  return channel && ts ? { channel, ts } : undefined;
}

/**
 * A thread's permalink: the workspace host, the channel, and the timestamp
 * with its separator taken out, which is the form Slack resolves.
 *
 * `chat.getPermalink` would answer the same thing and spends a call per hand
 * on a value the record already holds.
 */
export function permalinkOf(workspaceUrl, thread) {
  const parts = threadPartsOf(thread);
  if (!parts || !workspaceUrl) return undefined;
  const host = workspaceUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `https://${host}/archives/${parts.channel}/p${parts.ts.replace(".", "")}`;
}

/**
 * The keys this run has already sent, one per line.
 *
 * The file is the run's own, restored and saved by the job under the run id
 * with no prefix fallback: it makes a re-run of one push send nothing twice,
 * and it deliberately says nothing about the push before it, so a stage
 * re-entered after a revert is told again (`Q26`). A file that is not there
 * yet is an empty set, which is what the first run of a push reads.
 */
export function readSentKeys(file) {
  if (!file) return new Set();
  try {
    return new Set(
      readFileSync(file, "utf8")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    );
  } catch {
    return new Set();
  }
}

/** The keys this run sent, appended rather than rewritten: a run that fails
 * halfway has still sent what it sent. */
export function appendSentKeys(file, keys) {
  if (!file || keys.length === 0) return;
  appendFileSync(file, `${keys.join("\n")}\n`);
}

/**
 * Every message, posted once.
 *
 * One retry on a 429 and no more: the rate limit Slack reports is per method
 * and measured in seconds, so a second wait would hold a workflow open on a
 * message a person will read on the board anyway. Everything else — a bad
 * token, a channel the bot is not in — is reported with the message it
 * refused, after all of them have been tried, because one unreachable channel
 * is no reason to leave the other hands untold.
 */
export async function sendAll(
  messages,
  { token, fetch: fetched = globalThis.fetch, sleep = wait } = {},
) {
  if (!token) throw new Error("SLACK_BOT_TOKEN is not set");
  const sent = [];
  const refused = [];
  for (const message of messages) {
    const body = {
      channel: message.channel,
      // `text` rides along with blocks as the notification's own line, which
      // is what a phone shows before the message is opened.
      text: message.text,
      ...(message.blocks ? { blocks: message.blocks } : {}),
      ...(message.threadTs ? { thread_ts: message.threadTs } : {}),
    };
    try {
      const answer = await post(fetched, token, body);
      if (answer.status === 429) {
        await sleep(retryAfter(answer));
        const again = await post(fetched, token, body);
        if (!again.ok) throw new Error(again.why);
      } else if (!answer.ok) throw new Error(answer.why);
      sent.push(message.key);
    } catch (cause) {
      refused.push(`${message.key} → ${message.channel}: ${cause.message}`);
    }
  }
  if (refused.length > 0) {
    const error = new Error(
      `Slack refused ${refused.length}:\n${refused.join("\n")}`,
    );
    // What did go out, so the caller can key it: a message sent once is not
    // worth sending again because another one failed.
    error.sent = sent;
    throw error;
  }
  return sent;
}

async function post(fetched, token, body) {
  const answer = await fetched(POST_MESSAGE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  });
  // Slack answers a refusal with 200 and `ok: false`, so the body is what
  // says whether the message was posted; the status only says 429.
  const read = await answer.json().catch(() => ({}));
  return {
    status: answer.status,
    ok: answer.status === 200 && read.ok === true,
    why: read.error ?? `HTTP ${answer.status}`,
  };
}

/** Slack's own `retry-after`, in milliseconds; a second where it says
 * nothing. */
function retryAfter(answer) {
  const header = answer.headers?.get?.("retry-after");
  const seconds = Number(header);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : 1000;
}

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/** What the run prints when it is not sending: one block per message, the
 * address first, so a dry run reads like the messages it would have sent. */
export function printable(messages) {
  return messages
    .map(
      (message) =>
        `→ ${message.to === "member" ? "DM" : "channel"} ${message.channel} [${message.key}]\n${message.text}`,
    )
    .join("\n\n");
}
