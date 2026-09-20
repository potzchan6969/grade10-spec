/**
 * What the router's tests and the room's tests both need: one deployment, and
 * one Durable Object namespace whose rooms are whatever the test answers with.
 *
 * Written once here because a second copy of the deployment drifts: a secret
 * the router reads under one name and the room under another is a test that
 * passes while the relay refuses.
 */
import type { Env } from "../src/env.ts";

export const CHANNEL = "C0PLAN";
export const APP = "U0APP";
export const SIGNING = "the-signing-secret";
export const WAKE = "the-workflow's-wake-token";
export const TOKEN_SECRET = "the-relay's-own-hmac-secret";
export const BOT_TOKEN = "xoxb-in-the-environment-alone";
export const REPO = "9gag/grade10-spec";
export const RELAY_URL = "https://grade10-relay.workers.dev";
export const FIRE_URL = "https://runner.example/fire";
export const ROUTINE_TOKEN = "the-routine-token";
export const GITHUB_TOKEN = "the-code-host-token";

/**
 * A namespace whose rooms are one function: the name the caller addressed and
 * the request it sent. A name is its own id here, so a test reads the name;
 * `idFromString` answers the id it was given, which is what the relay takes
 * back out of a wake token.
 */
export function stubNamespace(
  room: (name: string, request: Request) => Promise<Response>,
): DurableObjectNamespace {
  const namespace = {
    idFromName: (name: string) => ({ toString: () => name }),
    idFromString: (id: string) => ({ toString: () => id }),
    get: (id: { toString(): string }) => ({
      fetch: (request: Request) => room(id.toString(), request),
    }),
  };
  return namespace as unknown as DurableObjectNamespace;
}

/** The deployment, with whatever this test needs of it changed. */
export function testEnv(over: Partial<Env> = {}): Env {
  return {
    ROOM: stubNamespace(async () => {
      throw new Error("this test reaches no room");
    }),
    PLANNING_CHANNEL: CHANNEL,
    REPO,
    RELAY_URL,
    SLACK_APP_USER: APP,
    SLACK_SIGNING_SECRET: SIGNING,
    SLACK_BOT_TOKEN: BOT_TOKEN,
    ROUTINE_FIRE_URL: FIRE_URL,
    ROUTINE_TOKEN,
    GITHUB_TOKEN,
    TOKEN_SECRET,
    WAKE_TOKEN: WAKE,
    ...over,
  };
}
