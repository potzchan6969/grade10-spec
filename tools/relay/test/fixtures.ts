/**
 * What the router's tests, the room's tests and the live object's tests all
 * need: one deployment, a Durable Object namespace whose objects are whatever
 * the test answers with, the storage a test drives one over, and the push the
 * code host sends.
 *
 * Written once here because a second copy drifts: a secret the router reads
 * under one name and the room under another, or a head two files spell
 * differently, is a test that passes while the relay refuses.
 */
import type { Env } from "../src/env.ts";
import type { Head } from "../src/live-state.ts";

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
export const WEBHOOK_SECRET = "the-code-host-webhook-secret";

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
    LIVE: stubNamespace(async () => {
      throw new Error("this test reaches no live object");
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
    GITHUB_WEBHOOK_SECRET: WEBHOOK_SECRET,
    ...over,
  };
}

/** Where `main` is, as the code host's push names it. */
export const HEAD: Head = {
  main: "d6fde92930d4715a2b49857d24b940956b26d2d3",
  at: "2026-09-20T14:02:11+08:00",
  subject: "docs(planning): the live line",
};

/** The commit after it, for a second move. */
export const NEXT: Head = {
  main: "9f1c0a7b2d3e4f5061728394a5b6c7d8e9f01234",
  at: "2026-09-20T15:11:02+08:00",
  subject: "feat(relay): the eighth secret",
};

/** A push of `main` as the code host sends one, with whatever this test
 * changes of it. */
export function push(over: Record<string, unknown> = {}): unknown {
  return {
    ref: "refs/heads/main",
    after: HEAD.main,
    repository: { full_name: REPO },
    head_commit: {
      id: HEAD.main,
      timestamp: HEAD.at,
      message: `${HEAD.subject}\n\nThe body a page never shows.`,
    },
    ...over,
  };
}

/**
 * The storage a Durable Object is driven over: a map, and the one alarm a room
 * sets. The runtime stores what it can serialize, so a state or a head that
 * stopped being plain data fails here rather than in production.
 */
export class StorageMap {
  readonly held = new Map<string, unknown>();
  alarm: number | null = null;

  async get<T>(key: string): Promise<T | undefined> {
    return this.held.get(key) as T | undefined;
  }

  async put(key: string, value: unknown): Promise<void> {
    this.held.set(key, JSON.parse(JSON.stringify(value)));
  }

  async delete(key: string): Promise<boolean> {
    return this.held.delete(key);
  }

  async setAlarm(at: number): Promise<void> {
    this.alarm = at;
  }

  async deleteAlarm(): Promise<void> {
    this.alarm = null;
  }
}

export const storageMap = (): StorageMap => new StorageMap();
