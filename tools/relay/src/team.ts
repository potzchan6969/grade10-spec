/**
 * The team map: a Slack member id to the handle the store knows. Read from
 * `docs/prds/team.yaml` on `main`, cached ten minutes, because a landing and a
 * payload both ask for it and the file changes when somebody joins.
 *
 * A member the map does not name resolves to null — the map's own way of saying
 * it does not know yet — and a landing on a word refuses that.
 */
import { parse } from "yaml";

export const TEAM_PATH = "docs/prds/team.yaml";

export const TEAM_TTL_MS = 10 * 60_000;

/** Slack member id to `@handle`. */
export function parseTeam(text: string): Map<string, string> {
  const map = new Map<string, string>();
  const parsed = parse(text) as {
    handles?: Record<string, { slack?: string }>;
  } | null;
  for (const [handle, entry] of Object.entries(parsed?.handles ?? {})) {
    const slack = entry?.slack;
    if (typeof slack === "string" && slack) map.set(slack, `@${handle}`);
  }
  return map;
}

/**
 * The map with its cache. The loader and the clock are injected, so a test
 * reads the ten minutes without waiting them out and without a fetch.
 */
export class TeamMap {
  private cached: Map<string, string> | null = null;
  private loadedAt = 0;
  private readonly load: () => Promise<string>;
  private readonly now: () => number;

  constructor(load: () => Promise<string>, now: () => number = Date.now) {
    this.load = load;
    this.now = now;
  }

  async handles(): Promise<Map<string, string>> {
    if (this.cached && this.now() - this.loadedAt < TEAM_TTL_MS)
      return this.cached;
    this.cached = parseTeam(await this.load());
    this.loadedAt = this.now();
    return this.cached;
  }

  async handleOf(slack: string): Promise<string | null> {
    return (await this.handles()).get(slack) ?? null;
  }
}
