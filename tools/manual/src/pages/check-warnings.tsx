import { Text } from "@grade10/design-system/components/display/text";
import { Warning } from "@phosphor-icons/react";
import type { CheckWarning } from "../api/types";

/** The check names its rules; the snapshot carries the key, and this is where
 * the key becomes a sentence. A rule this does not know still gets its own
 * group, under its key read out — a new rule shows up as itself rather than
 * vanishing. */
const RULE_TITLES: Record<string, string> = {
  design: "Figma and the code disagreeing, from the nightly design sync",
  figma: "Figma links naming a file, frame or set that is not there",
  ref: "References that resolve to nothing, or to two things",
  dense: "Denser than the style allows",
  prose: "Marks inside a sentence, read as words",
  ledger: "Ledgers written as a table, outside an example",
  icon: "No icon in the rail",
};

/** A key with no sentence behind it is a rule somebody added and nobody
 * described yet: shown as itself, so it reads as a group rather than vanishing
 * into another one. */
export function ruleTitle(rule: string): string {
  return RULE_TITLES[rule] ?? rule;
}

/** The warnings a page owns. A warning names a store-relative path, and the
 * page it is about is the only place the person who can act on it will be. */
export function warningsForPage(
  warnings: CheckWarning[],
  path: string,
): CheckWarning[] {
  return warnings.filter((warning) => warning.page === path);
}

/**
 * The warnings that are about this page, on this page: the person who can act
 * on one is the one reading the page it is about.
 */
export function PageWarnings({ warnings }: { warnings: CheckWarning[] }) {
  if (warnings.length === 0) return null;

  return (
    <aside
      aria-label="What the last check said about this page"
      className="my-5 rounded-(--radius-2xl) border border-warning-border bg-warning/10 px-4 py-3"
    >
      <ul className="space-y-2">
        {warnings.map((warning) => (
          <li className="flex gap-2" key={`${warning.rule}:${warning.message}`}>
            <span className="mt-0.5 inline-flex shrink-0 text-warning">
              <Warning aria-hidden size={14} weight="fill" />
            </span>
            <div className="min-w-0">
              <Text as="p" size="xs" tone="secondary" weight="medium">
                {ruleTitle(warning.rule)}
              </Text>
              <Text as="p" size="sm">
                {warning.message}
              </Text>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
