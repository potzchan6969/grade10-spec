import {
  behindText,
  escapeSlackText,
  toldBodyOf,
} from "../../../../scripts/openspec/lib/wording.mjs";
import { behindOf, handOf, handOfArtifact } from "./stages.ts";
import type { ChangeEntry, Role, SchemaArtifact, Stage } from "./types.ts";

/**
 * What the hands of this change are being told, right now, in the words they
 * are told it in.
 *
 * The bodies come from `scripts/openspec/lib/wording.mjs`, the module the
 * push workflow composes its own messages from, so the manual cannot say one
 * thing about a change while Slack says another. What is left here is what
 * only the manual knows: where its own reader can reach the change.
 *
 * Which messages: one per hand the stage waits on, and one for the earliest
 * behind artifact, which is the message the workflow sends about it. Nothing
 * for a stage that waits on no hand — Designed, Released and Archived are a
 * design pair's, a cut's and the fold's, and nobody is being sent anything
 * about them.
 */

/** One message, and who it reaches. */
export type ToldMessage = {
  role: Role;
  /** The handle the change names for that role. Absent where it names none:
   * the role's channel is told instead, which is the same message. */
  hand?: string;
  kind: "your-turn" | "staging" | "behind";
  /** The body, in Slack `mrkdwn`. */
  text: string;
};

/**
 * A thread's permalink: the channel and the timestamp with its separator
 * taken out, which is the form Slack resolves.
 *
 * Built against Slack's own host, because the manual has no workspace name to
 * build one with and the redirect lands a signed-in reader in their own.
 * Exported: the Your turn card's thread link is the same permalink, and one
 * definition is what keeps the link a message carries and the link the card
 * offers the same link.
 */
export function slackThreadUrl(thread: string): string {
  const [channel, ts = ""] = thread.split("/");
  return `https://slack.com/archives/${channel}/p${ts.replace(".", "")}`;
}

/** The change as a message links it: its thread where the record names one,
 * its own page where it does not — the manual's route, since a reader of the
 * manual is already on it. */
function linkedTitle(change: ChangeEntry): string {
  const url = change.thread
    ? slackThreadUrl(change.thread)
    : `/in-flight/${encodeURIComponent(change.id)}`;
  return `<${url}|${escapeSlackText(change.title)}>`;
}

export function toldNowOf(
  change: ChangeEntry,
  stage: Stage,
  artifacts: SchemaArtifact[],
  /** The run sheet the store was configured with, as the snapshot carries it:
   * the same `TCS_SHEET_URL` the push workflow's own message links. */
  sheetUrl?: string,
): ToldMessage[] {
  const linked = linkedTitle(change);
  const told: ToldMessage[] = [];
  const named = (role: Role) => {
    const hand = change.hands?.[role];
    return hand ? { hand } : {};
  };

  for (const role of handOf(change, stage, artifacts)) {
    told.push({
      role,
      ...named(role),
      ...toldBodyOf({ id: change.id, stage }, role, { linked, sheetUrl }),
    });
  }

  const [behind] = behindOf(change, artifacts);
  const hand = behind && handOfArtifact(behind.artifact, artifacts);
  if (behind && hand) {
    told.push({
      role: hand,
      ...named(hand),
      kind: "behind",
      text: behindText(behind, linked),
    });
  }
  return told;
}
