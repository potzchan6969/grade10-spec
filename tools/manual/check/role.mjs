/*
 * RULE `role`: a journey's actor is somebody who uses the product. The role
 * is an end user the spec already names, or an outside agent that acts on
 * its own — a crawler, a preview fetcher, a provider calling back.
 *
 * Two kinds are not roles. Software this repository ships is the system's
 * side of the story: a consuming application, a service, a caller, a
 * package. The people who build the product are its makers, not its users:
 * an engineer wiring a call, a developer seeding fixtures, a reviewer
 * reading a contract. What those two walk is a test or a working step, and
 * a capability reached only that way says `**Walked by:** nobody`.
 *
 * The pull is strongest where a capability has real actors and one contract
 * scenario without a home — a package's export list, a copy shape — and a
 * story gets invented to accept it. It should have no journey at all, named
 * under `**Out of suite:**` in the `feature-tcs.md` beside it.
 *
 * Read off the head noun alone, so the qualifiers a real actor carries pass:
 * a `backend reviewer` reviews, a `developer running the auction service
 * locally` develops. A warning, not a failure — a role the denylist has not
 * seen is the author's call, not this rule's.
 */

const AS_A = /^\*\*As an?\*\*\s+(.+?)\s*,?\s*$/m;

/** The words a story reaches for when it puts the system on the actor's
 * side, tested against the head noun only. */
const SYSTEM_SIDE = new Set([
  "application",
  "applications",
  "service",
  "services",
  "client",
  "clients",
  "caller",
  "callers",
  "consumer",
  "consumers",
  "package",
  "packages",
  "system",
  "systems",
  "component",
  "components",
  "endpoint",
  "endpoints",
]);

/** The people who build the product rather than use it. A capability they
 * alone reach is unwalked, and its scenarios stand without a story. */
const MAKER_SIDE = new Set([
  "engineer",
  "engineers",
  "developer",
  "developers",
  "programmer",
  "programmers",
  "reviewer",
  "reviewers",
  "tester",
  "testers",
  "maintainer",
  "maintainers",
]);

/** Where the leading noun phrase stops: the clause that qualifies the actor
 * rather than naming it. Never at the first word, so `consuming application`
 * keeps its noun. */
const QUALIFIER = new Set([
  "who",
  "whose",
  "which",
  "that",
  "with",
  "of",
  "in",
  "at",
  "on",
  "for",
  "from",
  "against",
  "about",
  "to",
]);

/** The noun a role is built on: the last word of its leading noun phrase. */
function headNoun(role) {
  const words = role
    .toLowerCase()
    .replace(/^an?\s+|^the\s+/, "")
    .split(/\s+/);
  let end = words.length;
  for (let i = 1; i < words.length; i++) {
    if (QUALIFIER.has(words[i]) || /ing$/.test(words[i])) {
      end = i;
      break;
    }
  }
  return words
    .slice(0, end)
    .pop()
    ?.replace(/[^a-z-]/g, "");
}

export function checkRole(ctx, shape) {
  for (const [id, dir] of shape.dirs) {
    const spec = ctx.specs.get(id);
    if (!spec || spec.error || spec.journeysError || !spec.journeys) continue;
    for (const journey of spec.journeys) {
      const role = AS_A.exec(journey.text)?.[1];
      if (!role) continue;
      const noun = headNoun(role);
      if (!noun) continue;
      if (SYSTEM_SIDE.has(noun)) {
        ctx.add(
          "role",
          `${dir}/user-journeys.md`,
          `${journey.id} is walked by \`${role}\` — \`${noun}\` names the system's side of the story, not an actor; name whoever operates it, or drop the journey and put its scenarios under \`**Out of suite:**\``,
        );
      } else if (MAKER_SIDE.has(noun)) {
        ctx.add(
          "role",
          `${dir}/user-journeys.md`,
          `${journey.id} is walked by \`${role}\` — \`${noun}\` builds the product rather than uses it, and what they walk is a test, not a journey; drop it, and say \`**Walked by:** nobody\` if nobody else reaches the capability`,
        );
      }
    }
  }
}
