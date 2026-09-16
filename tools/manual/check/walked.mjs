/*
 * RULE `walked`: every capability says who walks it. The stories are their
 * own file beside the spec, and a capability no end user reaches on its own
 * — a policy every surface inherits, a package contract, a convention —
 * writes that file too, holding `**Walked by:** nobody` in place of the
 * stories. The exemption used to be a missing file, which is also what an
 * omission looks like: a user-facing capability archived without journeys
 * has no suite QA can derive, and nothing said so. Now the absence is a
 * decision written down, and a file that is neither stories nor the
 * declaration is named.
 *
 * Asked of the durable store, and of every in-flight delta whose capability
 * has no durable journeys yet — a delta against a capability that already
 * says who walks it owes nothing here.
 *
 * Every delta's file is read all the same, and one the reader refuses is
 * reported under `store` rather than skipped: the skip is what let the
 * schema's own template — which the reader used to refuse for its headings —
 * satisfy this rule by parsing as nothing.
 */
import { join } from "node:path";
import { readTextIfExists } from "../src/store/disk.mts";
import { readJourneys, walkedByNobody } from "../src/store/read-specs.mts";
import { message } from "./context.mjs";

const DECLARATION = "`**Walked by:** nobody`";

export function checkWalked(ctx, shape, changes) {
  for (const [id, dir] of shape.dirs) {
    const spec = ctx.specs.get(id);
    // A file the readers refused is the store rule's to name.
    if (!spec || spec.error || spec.journeysError) continue;
    const file = `${dir}/user-journeys.md`;
    if (spec.journeys === undefined) {
      ctx.add(
        "walked",
        file,
        `missing: name who walks \`${id}\`, or say ${DECLARATION} and why`,
      );
      continue;
    }
    sayOneThing(ctx, file, spec.journeys.length, spec.unwalked === true);
  }

  for (const change of changes) {
    for (const delta of change.deltas) {
      const durable = ctx.specs.get(delta.spec);
      // A capability that already says who walks it owes nothing here; its
      // file is still read, because a file no reader can parse is a finding
      // wherever it sits.
      const owed =
        durable?.journeys === undefined && durable?.journeysError === undefined;
      const file = `openspec/changes/${change.id}/specs/${delta.spec}/user-journeys.md`;
      const text = readTextIfExists(join(ctx.roots.store, file));
      if (text === undefined) {
        if (owed) {
          ctx.add(
            "walked",
            file,
            `missing, and \`${delta.spec}\` has no durable journeys: name who walks it, or say ${DECLARATION} and why`,
          );
        }
        continue;
      }
      let stories;
      try {
        stories = readJourneys(text).length;
      } catch (cause) {
        // Named rather than skipped. Swallowing it left the rule below
        // measuring a file it had not read, and a template the reader refused
        // passed the gate by parsing as nothing at all.
        ctx.add("store", file, refusal(delta.spec, cause));
        continue;
      }
      if (owed) sayOneThing(ctx, file, stories, walkedByNobody(text));
    }
  }
}

/** Same shape as the store rule's own refusals: the id, the line when the
 * reader knew one, and what it refused. */
function refusal(id, cause) {
  const at = typeof cause?.line === "number" ? ` line ${cause.line}` : "";
  return `${id}${at}: ${message(cause)}`;
}

/** A journeys file holds stories, or the declaration — never neither, and
 * never both. */
function sayOneThing(ctx, file, stories, unwalked) {
  if (stories === 0 && !unwalked) {
    ctx.add(
      "walked",
      file,
      `holds no story and does not say ${DECLARATION}: one or the other`,
    );
  } else if (stories > 0 && unwalked) {
    ctx.add(
      "walked",
      file,
      `says ${DECLARATION} and holds ${stories} ${stories === 1 ? "story" : "stories"}: one of the two is wrong`,
    );
  }
}
