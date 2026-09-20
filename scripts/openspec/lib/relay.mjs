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
 * signed by the relay and expiring with the wake's budget. It is carried as
 * the bearer of every call and never printed. No chat token reaches a run.
 *
 * `openspec/changes/run-a-round-on-every-artifact/tech-design.md`, The relay:
 * "The run writes it whole to `.round/relay.json`, which `lib/relay.mjs` —
 * the one client `relay-post.mjs` and `plan-land.mjs` share — reads for the
 * url, the token, the change, the sender and the thread".
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** The wake's own file, root-relative — what a refusal names. */
export const RELAY_FILE = join(".round", "relay.json");

/**
 * The wake this run was fired with, or `null` where there is none: a terminal
 * round has no wake, prints what it would have posted and pushes `main`
 * itself.
 *
 * `ROUND_WAKE=relay` says a wake was expected. Then a missing or unreadable
 * file is not a terminal round, it is a run that lost the payload it was
 * given — so it fails loudly rather than quietly printing into a thread
 * nobody is reading.
 */
export function readWake(root = process.cwd()) {
  const file = join(root, RELAY_FILE);
  const expected = process.env.ROUND_WAKE === "relay";
  if (!existsSync(file)) {
    if (expected) die(`${RELAY_FILE} is not there, and ROUND_WAKE=relay`);
    return null;
  }
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch (cause) {
    die(`${RELAY_FILE} is not JSON: ${cause.message}`);
  }
  if (!parsed.relay?.url || !parsed.relay?.token) {
    die(`${RELAY_FILE} names no relay.url and relay.token`);
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
      headers: {
        authorization: `Bearer ${wake.token}`,
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
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
     * record names no thread. */
    post: (text) => call("POST", "/post", { text }),
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

function die(message) {
  console.error(message);
  process.exit(1);
}
