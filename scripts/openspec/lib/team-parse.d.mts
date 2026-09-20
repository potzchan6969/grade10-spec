/**
 * Types for `team-parse.mjs`, read only by the projects that cannot import a
 * plain `.mjs` — `tools/manual/tsconfig.app.json` and the relay, which
 * bundles for a Worker: `team-parse.mjs` itself stays untyped JavaScript,
 * held to this by nothing but its own tests, the way every other file under
 * `scripts/openspec/lib/` is. `handle.d.mts` is beside it for the same
 * reason.
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

export type TeamMapText = {
  handles: Record<string, TeamMember>;
  channels: Record<string, string>;
};

export declare const parseTeamMap: (text: string) => TeamMapText;
