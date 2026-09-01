import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { CaretRight, Wrench } from "@phosphor-icons/react";
import { useState } from "react";
import { useManualIndex } from "../api/use-manual-index";
import { groupByRule, ruleTitle, WarningRow } from "./check-warnings";

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
                  {ruleTitle(rule)}{" "}
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
