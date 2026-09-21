/**
 * Types for `wording.mjs`, read only by the browser project
 * (`tools/manual/tsconfig.app.json`), which does not allow a plain `.mjs`
 * import: `wording.mjs` itself stays untyped JavaScript, held to this by
 * nothing but its own tests, the way every other file under
 * `scripts/openspec/lib/` is. `handle.d.mts` and `team-parse.d.mts` are
 * beside it for the same reason.
 */
import type { Role, Stage } from "../../../tools/manual/src/api/types.ts";

/** The change as a message reads it: the id a command is written with, the
 * stage the sentence names, and the build the deploy recorded where the
 * record carries one. */
export type WordedChange = {
  id: string;
  stage: Stage;
  deployedBuild?: string;
};

/** The change as a landing reply reads it: the stage it is at now, the roles
 * of that stage and the hand each names, where one is named. */
export type WordedLanding = {
  stage: Stage;
  roles: Role[];
  hands: Partial<Record<Role, string>>;
};

/** One artifact that landed, and whose word landed it. */
export type WordedLanded = { artifact: string; by: string };

/** One artifact that is behind, and what moved before it. */
export type WordedBehind = { artifact: string; changed: string[] };

export declare const escapeSlackText: (text: string) => string;
export declare const threadPathOf: (
  thread: string | undefined,
) => string | undefined;
export declare const linkedOf: (url: string, title: string) => string;
export declare const yourTurnText: (
  at: WordedChange,
  role: Role,
  linked: string,
) => string;
export declare const stagingText: (
  linked: string,
  options?: { sheetUrl?: string; build?: string },
) => string;
export declare const toldBodyOf: (
  at: WordedChange,
  role: Role,
  options: { linked: string; sheetUrl?: string },
) => { kind: "your-turn" | "staging"; text: string };
export declare const behindText: (
  behind: WordedBehind,
  linked: string,
) => string;
export declare const landedText: (
  at: WordedLanding,
  landed: WordedLanded[],
) => string;
