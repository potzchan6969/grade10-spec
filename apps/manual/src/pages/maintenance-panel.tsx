import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { CaretRight, Wrench } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router";
import { routeForPagePath } from "../api/paths";
import type { CheckWarning } from "../api/types";
import { useManualIndex } from "../api/use-manual-index";

/** The check names its rules; the snapshot carries the key, and this is where
 * the key becomes a sentence. A rule this does not know still gets its own
 * group, under its key — a new rule shows up as itself rather than vanishing. */
const RULE_TITLES: Record<string, string> = {
  stale: "Pages older than the specs they embed",
  skeleton: "Capability pages missing their acceptance shelf",
  figma: "Figma links that point off figma.com",
  journeys: "Specs whose journeys no page shows",
  ref: "References that resolve to nothing, or to two things",
};

function groupByRule(warnings: CheckWarning[]): [string, CheckWarning[]][] {
  const groups = new Map<string, CheckWarning[]>();
  for (const warning of warnings) {
    const list = groups.get(warning.rule) ?? [];
    list.push(warning);
    groups.set(warning.rule, list);
  }
  return [...groups].sort(([a], [b]) => a.localeCompare(b));
}

/**
 * What the last build's `check:manual` had to say. Warnings never fail a
 * deploy, so without this they would live only in a CI log nobody opens — and
 * a stale page stays stale because nothing on the site admits it.
 *
 * Collapsed by default: this is a chore list, not the reason anyone came.
 */
export function MaintenancePanel() {
  const index = useManualIndex();
  const [open, setOpen] = useState(false);
  const warnings = index.snapshot.warnings;

  if (warnings.length === 0) return null;

  return (
    <section className="mt-12 border-border-subtle border-t pt-8">
      <button
        aria-expanded={open}
        className="-mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-center gap-2 rounded-(--radius-lg) px-2 py-1 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={() => setOpen((on) => !on)}
        type="button"
      >
        <span
          className={`inline-flex shrink-0 text-secondary-foreground transition-transform ${open ? "rotate-90" : ""}`}
        >
          <CaretRight aria-hidden size={14} weight="bold" />
        </span>
        <span className="inline-flex text-secondary-foreground">
          <Wrench aria-hidden size={16} />
        </span>
        <h2 className="font-heading font-bold text-lg" id="maintenance">
          Maintenance
        </h2>
        <Badge size="sm" variant="warning">
          {warnings.length}
        </Badge>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <Text as="p" className="mt-3" size="sm" tone="secondary">
            What `check:manual` said about the store this snapshot was built
            from. None of it fails a deploy; all of it is somebody's next small
            job.
          </Text>
          <div className="mt-4 space-y-6">
            {groupByRule(warnings).map(([rule, group]) => (
              <div key={rule}>
                <Text as="p" className="mb-2" size="sm" weight="medium">
                  {RULE_TITLES[rule] ?? rule}{" "}
                  <Text as="span" size="xs" tone="secondary">
                    {group.length}
                  </Text>
                </Text>
                <ul className="space-y-1.5 border-border border-l pl-4">
                  {group.map((warning) => (
                    <li key={`${warning.page ?? ""}:${warning.message}`}>
                      <WarningRow warning={warning} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** A warning about a page links to the page — the only useful next click. One
 * about a store file names the file, because there is no page to send anyone
 * to yet. */
function WarningRow({ warning }: { warning: CheckWarning }) {
  const route = warning.page ? routeForPagePath(warning.page) : null;

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
