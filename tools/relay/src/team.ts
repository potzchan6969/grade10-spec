/**
 * The team map: a Slack member id to the handle the store knows. Read from
 * `docs/prds/team.yaml` on `main`, cached ten minutes, because a landing and a
 * payload both ask for it and the file changes when somebody joins.
 *
 * The file is read by the store's own parser, `scripts/openspec/lib/
 * team-parse.mjs`, so the relay has no second idea of what the map says: a
 * handle the store refuses is a handle the relay refuses, and both spell a
 * handle through `handleOf`.
 *
 * A member the map does not name resolves to null — the map's own way of
 * saying it does not know yet. The caller reads the map again before it
 * refuses on that, because somebody who joined inside the cache window is in
 * the file and not in the cache.
 */
import { handleOf } from "../../../scripts/openspec/lib/handle.mjs";
import {
  parseTeamMap,
  TEAM_MAP,
} from "../../../scripts/openspec/lib/team-parse.mjs";

export { TEAM_MAP };

export const TEAM_TTL_MS = 10 * 60_000;

/** Slack member id to the handle, spelled the one way the store spells it. */
export function slackHandles(text: string): Map<string, string> {
  const map = parseTeamMap(text);
  const handles = new Map<string, string>();
  for (const handle of Object.keys(map.handles)) {
    const slack = map.handles[handle]?.slack;
    if (slack) handles.set(slack, handleOf(handle));
  }
  return handles;
}

/**
 * The map with its cache. The map itself is `TeamMap`, the shape
 * `team-parse.mjs` parses; this is what holds one reading of it for ten
 * minutes. The loader and the clock are injected, so a test reads those ten
 * minutes without waiting them out and without a fetch.
 */
export class TeamCache {
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
    return this.reload();
  }

  /** The file read again, whatever the cache holds. */
  async reload(): Promise<Map<string, string>> {
    this.cached = slackHandles(await this.load());
    this.loadedAt = this.now();
    return this.cached;
  }

  /**
   * The handle of a member, the file read again on a miss (`Q55`): a
   * teammate who joined inside the cache window is in the map and not in the
   * cache, and a landing refused for that would name the wrong check.
   */
  async handleOf(slack: string): Promise<string | null> {
    const cached = (await this.handles()).get(slack);
    if (cached) return cached;
    return (await this.reload()).get(slack) ?? null;
  }
}
