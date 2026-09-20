/**
 * Types for `team-parse.mjs`. Three readers: `team.mjs`, the store's own
 * reader of the map, which re-exports it; `tools/relay` and `tools/manual`,
 * both of which import it under `allowJs: false` and so read the map through
 * these declarations alone — the manual re-exports `TeamMember` and `TeamMap`
 * from its own `api/types.ts` rather than declaring the shape a second time.
 * `team-parse.mjs` itself stays untyped JavaScript, held to this by nothing
 * but its own tests, the way every other file under `scripts/openspec/lib/`
 * is. `handle.d.mts` is beside it for the same reason.
 *
 * One shape, named here, spoken of one way wherever it is read.
 */
export declare const TEAM_MAP: string;

/** One person of the map: the address `git config user.email` gives, the
 * Slack member a message is addressed to, and the roles that handle may take.
 * A handle with no `slack` is sent no message. */
export type TeamMember = {
  email?: string;
  slack?: string;
  roles: string[];
};

/** Who the store knows, and where a role is posted to: one channel per role,
 * for a stage whose hand the change does not name. */
export type TeamMap = {
  handles: Record<string, TeamMember>;
  channels: Record<string, string>;
};

export declare const parseTeamMap: (text: string) => TeamMap;
