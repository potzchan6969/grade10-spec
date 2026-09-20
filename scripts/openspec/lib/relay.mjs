/**
 * The one client of the relay.
 *
 * A wake writes the payload it was fired with to `.round/relay.json` before
 * it does anything else, and every call a run makes back to the relay —
 * `post`, `done`, `bind`, `land`, `alive` — is made from here.
 * `relay-post.mjs` and `plan-land.mjs` both read the wake and call this
 * client, so the url building and the fetch exist once: two copies drift on
 * the day an endpoint moves or the token stops riding the path.
 *
 * The token is the wake's own — HMAC over the room, the wake and its expiry,
 * signed by the relay and expiring with the wake's budget. It rides the path
 * of every call, which is where the relay verifies it, and no call bears it
 * twice: a header nothing reads is the same secret in one more log. It is
 * never printed, and no chat token reaches a run.
 *
 * Nothing here exits the process. A wake's file that no run can use is thrown
 * as a `RelayError`, and the entry point that read it prints the message in
 * its own voice — `::error::` where a workflow log is reading — and exits 1.
 *
 * `openspec/changes/run-a-round-on-every-artifact/tech-design.md`, The relay:
 * "The run writes it whole to `.round/relay.json`, which `lib/relay.mjs` —
 * the one client `relay-post.mjs` and `plan-land.mjs` share — reads for the
 * url, the token, the change, the sender and the thread".
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { roundArtifactOf } from "../../../tools/manual/src/store/read-rounds.mts";

/** The wake's own file, root-relative — what a refusal names. */
export const RELAY_FILE = join(".round", "relay.json");

/** A wake nothing can be made of: the file missing where one was expected, or
 * written in a way no call can be built from. Its message is the whole of
 * what a caller prints. */
export class RelayError extends Error {
  constructor(message) {
    super(message);
    this.name = "RelayError";
  }
}

/**
 * The wake this run was fired with, or `null` where there is none: a terminal
 * round has no wake, prints what it would have posted and pushes `main`
 * itself.
 *
 * `ROUND_WAKE=relay` says a wake was expected. Then a missing or unreadable
 * file is not a terminal round, it is a run that lost the payload it was
 * given — so it throws rather than quietly printing into a thread nobody is
 * reading, and the entry point reports it and exits 1.
 */
export function readWake(root = process.cwd()) {
  const file = join(root, RELAY_FILE);
  const expected = process.env.ROUND_WAKE === "relay";
  if (!existsSync(file)) {
    if (expected)
      throw new RelayError(`${RELAY_FILE} is not there, and ROUND_WAKE=relay`);
    return null;
  }
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch (cause) {
    throw new RelayError(`${RELAY_FILE} is not JSON: ${cause.message}`);
  }
  if (!parsed.relay?.url || !parsed.relay?.token) {
    throw new RelayError(`${RELAY_FILE} names no relay.url and relay.token`);
  }
  return {
    url: String(parsed.relay.url).replace(/\/+$/, ""),
    token: parsed.relay.token,
    change: parsed.change ?? undefined,
    reason: parsed.reason ?? undefined,
    sender: parsed.sender ?? undefined,
    thread: parsed.thread ?? undefined,
    messages: parsed.messages ?? [],
  };
}

/**
 * The calls a run may make on its wake, over one `fetch`: `{ status, body }`
 * for each, so a caller judges 200, 403 and 409 itself rather than being
 * thrown at. A relay that cannot be reached at all is a different fact and is
 * thrown, since no status says it.
 */
export function relayOf(wake) {
  const call = async (method, path, body) => {
    const response = await fetch(`${wake.url}/runs/${wake.token}${path}`, {
      method,
      ...(body === undefined
        ? {}
        : {
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
          }),
    });
    const text = await response.text().catch(() => "");
    let parsed;
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = {};
    }
    return { status: response.status, body: parsed, text };
  };
  return {
    url: wake.url,
    /** A reply in the change's thread, or in the planning channel where the
     * record names no thread. `confirm` is the button under it, from
     * `confirmOf`: the thread then shows one button, and a press is the same
     * word as typing it. */
    post: (text, confirm) => call("POST", "/post", { text, confirm }),
    /** The wake closed; the room fires again when it is dirty. */
    done: () => call("POST", "/done", {}),
    /** The room's mapping warmed with the change this run opened. */
    bind: (change) => call("POST", "/bind", { change }),
    /** `main` moved to `sha` after the relay's own checks: 403 names the
     * check that refused, 409 says `main` moved under the run. */
    land: ({ sha, kind, artifact }) =>
      call("POST", "/land", { sha, kind, artifact }),
    /** 200 while this wake is still the room's current one. */
    alive: () => call("GET", "/alive"),
  };
}

/**
 * What a Confirm button reads, per artifact of the chain.
 *
 * One hand's artifacts share one button, so a product manager confirms the
 * proposal once rather than confirming "requirements" twice: the Proposed
 * stage's button says proposal, and the Specified stage's says requirements.
 * A task group's button is named by its number, and a held row's by the
 * recommendations it carries.
 *
 * The words are the round's, here, because the relay composes none: it posts
 * the label it is given and sends the word back as a thread reply.
 */
export const CONFIRM_LABEL = {
  proposal: "Confirm proposal",
  decisions: "Confirm proposal",
  "user-journeys": "Confirm proposal",
  "ui-design": "Confirm design",
  "tech-design": "Confirm tech design",
  specs: "Confirm requirements",
  "test-cases": "Confirm requirements",
  tasks: "Confirm plan",
};

/**
 * The button for one artifact, one task group's number, or a held row — the
 * label and the word the relay posts. Null is a name the chain issues no
 * button for, which the caller refuses by name rather than posting a button
 * nobody asked for.
 *
 * A group reaches this in any of the spellings the store issues — `5`, `5.`,
 * `group 5` — so the name is read by `roundArtifactOf`, the reader every
 * other place tells a group from an artifact id with. A task and the round's
 * own `apply` are neither, and are refused by name.
 */
export function confirmOf(name, held = false) {
  if (held)
    return {
      label: "Confirm with recommendations",
      word: "land with recommendations",
    };
  const target = roundArtifactOf(String(name ?? ""));
  if (target === null) return null;
  if (/^\d+$/.test(target))
    return { label: `Confirm group ${target}`, word: "land" };
  const label = CONFIRM_LABEL[target];
  return label ? { label, word: "land" } : null;
}

/**
 * The relay's answer as a sentence, for the run's log.
 *
 * The relay answers a refused landing with the check that refused it, which
 * is a token: `not-the-hand` says nothing to the hand reading the run. One
 * pure function, so the words are written once and every entry point that
 * reports an answer says the same thing. A token nothing here names is
 * printed as it came, because a check the relay grows is better read raw
 * than reported as something else.
 *
 * Two openings, because not every status `/land` answers with is a check
 * refusing: a wake the room no longer runs, a room with no change bound, and
 * a code host that could not be reached or would not move `main` are the
 * relay not taking the landing at all. A hand told such a landing was
 * refused goes looking for the rule it broke, so those say the relay would
 * not take it, and the host's own words are appended where the answer
 * carries them — the relay knows nothing more about them than it was told.
 *
 * `tools/relay/src/land.ts` declares the checks the word and the read are
 * refused by. The rest are about the run rather than its landing: `room.ts`
 * issues `stale-wake` and `no-change-bound` and answers `github.ts`'s
 * `HostError` as `host-unavailable`, and `github.ts` names `not-fast-forward`,
 * which a run retries rather than reports, and `host-refused`, which it
 * reports with the host's own words.
 */
export function answerOf(reason, { artifact, change, message } = {}) {
  const answered = ANSWERED[reason];
  const said = answered ?? SENTENCE[reason];
  const what = said
    ? said({
        artifact: named(artifact, "the artifact"),
        change: named(change, "the change"),
      })
    : (reason ?? "no reason given");
  const detail = message ? ` — ${message}` : "";
  const opening = answered
    ? "the relay would not take the landing"
    : "the relay refused the landing";
  return `${opening}: ${what}${detail}`;
}

/** One sentence per status `/land` answers with that is not a check refusing
 * — the room about itself, and the code host. */
const ANSWERED = {
  "stale-wake": () => "the room is running another wake now",
  "no-change-bound": () => "no change is bound to the room yet",
  "host-unavailable": () => "the code host could not be reached",
  "host-refused": () => "the code host would not move `main`",
};

/** One sentence per check, in the order `land.ts` runs them. */
const SENTENCE = {
  "word-not-said": () => "nobody said land in the thread",
  "sender-unknown": () => "the team map names no handle for whoever said it",
  "unknown-artifact": ({ artifact }) =>
    `the schema issues no artifact called ${artifact}`,
  "unknown-role": ({ artifact }) => `the schema names no hand for ${artifact}`,
  "not-the-hand": ({ artifact }) =>
    `the word was not the hand's — ${artifact} waits on its hand's word`,
  "landed-by-mismatch": ({ artifact }) =>
    `the landing's own \`landed_by:\` for ${artifact} names another handle`,
  "file-outside-change": ({ change }) =>
    `the landing writes outside ${change}'s own directory and the pages`,
  "not-only-reviewed": () =>
    "a read again writes the record's `reviewed:` block and nothing else",
  "reviewed-line-removed": () =>
    "the landing drops a `reviewed:` line another artifact's read again wrote",
  "compare-truncated": () =>
    "the code host listed only some of what the landing changed",
  "map-unreadable": () => "the team map would not parse",
};

/** A name the sentence quotes, or the plain word where the call has none. */
function named(value, plain) {
  return value ? `\`${value}\`` : plain;
}
