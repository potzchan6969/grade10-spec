/**
 * What the bug-fix rounds read back from an agent's answer. Every field is a
 * line the diagnosis template in `docs/governance/bug-fixes.md` asks for, so a
 * missing one is refused by name rather than guessed.
 */

/** The diagnosis's four keyed lines: its lane, the repository it lands in,
 * the command that runs its regression test alone, and the fix's commit
 * subject. */
export function parseDiagnosis(text) {
  const field = (name) =>
    new RegExp(`^\\s*\\**${name}\\s*(?::\\**|\\**:)\\s*(.+)$`, "im")
      .exec(text)?.[1]
      ?.trim();
  const lane = field("Lane")
    ?.toLowerCase()
    .match(/^(bug|change)\b/)?.[1];
  const landsIn = field("Lands in")?.replace(/`/g, "");
  const test = /^`(.+)`$/.exec(field("Test") ?? "")?.[1];
  const subject = /^`?(fix\([a-z0-9-]+\): [^`]+)`?$/.exec(
    field("Commit") ?? "",
  )?.[1];
  const missing = [
    ["Lane: bug|change", lane],
    ["Lands in: here|<owner/repo>", landsIn],
    ["Test: `<command>`", test],
    ["Commit: fix(<domain>): <outcome>", subject],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);
  return { lane, landsIn, test, subject, missing };
}

/** The verifier's table: one row per kind of finding, its last cell opening
 * on `stands`, `falls` or `asks`. A row whose verdict is none of the three is
 * returned as `unread`, so a malformed answer never passes as a clean one. */
export function parseVerdicts(text) {
  const rows = [];
  for (const line of String(text).split("\n")) {
    if (!/^\s*\|/.test(line) || /^\s*\|\s*-/.test(line)) continue;
    const cells = line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim());
    if (cells[0] === "#") continue;
    const last = cells.at(-1) ?? "";
    const verdict = /^[`*_\s]*(stands|falls|asks)\b/i
      .exec(last)?.[1]
      ?.toLowerCase();
    rows.push({ verdict: verdict ?? "unread", row: line.trim() });
  }
  return rows;
}

/** A reader's own table, read where no verifier is dispatched: every row it
 * files at `blocks` or `fix` stands. */
export function parseFindings(text) {
  return parseVerdicts(text).map(({ row }) => ({
    verdict: /\|[`*_\s]*(blocks|fix)[`*_\s]*\|?\s*$/i.test(row)
      ? "stands"
      : "falls",
    row,
  }));
}

/** The symptom check's answer: `Verified: yes` or `Verified: no`. */
export function parseVerified(text) {
  return /^\s*\**Verified\s*(?::\**|\**:)\s*yes\b/im.test(String(text));
}

/** Paths a bug fix never touches: CI, manifests and lockfiles, the agents'
 * own instructions, the planning record, and a submodule's pin, which moves
 * in its own pull request once the fix it carries has merged - a fix that
 * needs any of them is not a bug fix run unattended. */
export const PROTECTED =
  /^(\.github\/|\.claude\/|\.codex\/|\.cursor\/|openspec\/|docs\/prds\/|external\/|\.gitmodules$|AGENTS\.md$|CLAUDE\.md$|biome\.json$)|(^|\/)(package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|[^/]*tsconfig[^/]*\.json)$/;

export const protectedPaths = (paths) =>
  paths.filter((path) => PROTECTED.test(path));
