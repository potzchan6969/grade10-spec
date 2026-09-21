import { Text } from "@grade10/design-system/components/display/text";
import { Warning } from "@phosphor-icons/react";
import { Link } from "react-router";
import { routeForPagePath } from "../api/paths";
import type { CheckWarning } from "../api/types";
import { useManualIndex } from "../api/use-manual-index";

/** The check names its rules; the snapshot carries the key, and this is where
 * the key becomes a sentence. A rule this does not know still gets its own
 * group, under its key read out — a new rule shows up as itself rather than
 * vanishing. */
const RULE_TITLES: Record<string, string> = {
  design: "Figma and the code disagreeing, from the nightly design sync",
  stale: "Pages older than the specs they embed",
  skeleton: "Capability pages missing their acceptance shelf",
  figma: "Figma links naming a file, frame or set that is not there",
  fold: "Delta sections the archive discards",
  suite: "Specs whose test cases no page shows",
  coverage: "Scenarios no test case traces",
  ref: "References that resolve to nothing, or to two things",
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

export function groupByRule(
  warnings: CheckWarning[],
): [string, CheckWarning[]][] {
  const groups = new Map<string, CheckWarning[]>();
  for (const warning of warnings) {
    const list = groups.get(warning.rule) ?? [];
    list.push(warning);
    groups.set(warning.rule, list);
  }
  return [...groups].sort(([a], [b]) => a.localeCompare(b));
}

/** A warning about a page links to the page — the only useful next click. One
 * about a store file names the file, because there is no page to send anyone
 * to yet. */
export function WarningRow({ warning }: { warning: CheckWarning }) {
  const { manualDir } = useManualIndex();
  const route = warning.page ? routeForPagePath(manualDir, warning.page) : null;

  return (
    <Text as="p" size="sm">
      {route ? (
        <Link className="font-medium hover:underline" to={route}>
          {warning.page}
        </Link>
      ) : warning.page ? (
        <span className="font-medium">{warning.page}</span>
      ) : null}
      {warning.page ? (
        <span className="text-secondary-foreground"> — </span>
      ) : null}
      <Text as="span" size="sm" tone="secondary">
        {warning.message}
      </Text>
    </Text>
  );
}

/**
 * The warnings that are about this page, on this page. The stale rule names
 * which requirements moved, and the person who can act on that is the one
 * reading the page it is about — not whoever thinks to expand a collapsed
 * chore list on the Board.
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
