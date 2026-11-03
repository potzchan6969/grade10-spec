import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxButton } from "@grade10/design-system/components/forms/checkbox-button";
import { X } from "@phosphor-icons/react";
import type { RunWalk, Surface } from "../../api/desk";
import {
  caseLabels,
  caseResult,
  currentObservations,
  type RunReading,
  settledValue,
  valueOn,
} from "../model";
import { BoundText } from "./bound-text";
import { MarkChip, Pip } from "./marks";

const LABEL =
  "mb-1.5 font-bold text-[0.65625rem] text-secondary-foreground uppercase tracking-wider";

/** A walk as the suite writes it: its starting state once, then each route
 * step with what it should show, ticked as observed. A case's verdict still
 * comes from its own rows. */
export function WalkPane({
  walk,
  reading,
  surface,
  closed,
  onObserve,
  onCase,
  onLeave,
}: {
  walk: RunWalk;
  reading: RunReading;
  surface: Surface;
  closed: boolean;
  onObserve: (step: number, seen: boolean) => void;
  onCase: (id: string) => void;
  onLeave: () => void;
}) {
  const ticks = currentObservations(reading.view.observations);
  const bind = (name: string) => settledValue(reading.view.spec, name);
  const labels = caseLabels(reading.view.spec.cases);
  const seen = walk.route.filter(
    (_, step) => ticks.get(`${walk.id}#${step}`)?.seen,
  ).length;
  return (
    <article
      aria-label="The walk"
      className="flex min-w-0 flex-col gap-5 rounded-(--radius-2xl) border border-border-strong bg-background p-4 lg:p-5"
      data-slot="walk-pane"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Text as="p" className="font-mono" size="xs" tone="secondary">
            Walk · {seen} of {walk.route.length} observed
          </Text>
          <h2 className="mt-1 font-bold text-manual-h3 leading-snug">
            {walk.title}
          </h2>
        </div>
        <Button
          aria-label="Leave the walk"
          onClick={onLeave}
          size="sm"
          variant="ghost"
        >
          <X aria-hidden />
        </Button>
      </header>
      <section>
        <h3 className={LABEL}>Starting state, once</h3>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
          {walk.start.map((line) => (
            <li key={line}>
              <BoundText bind={bind} text={line} />
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className={LABEL}>Route</h3>
        <ol className="flex flex-col gap-2">
          {walk.route.map((step, at) => {
            const tick = ticks.get(`${walk.id}#${at}`);
            return (
              <li
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 rounded-(--radius-lg) border border-border p-2.5"
                data-step={at}
                key={step.step}
              >
                <CheckboxButton
                  aria-label={`Step ${at + 1} observed`}
                  checked={tick?.seen ?? false}
                  disabled={closed}
                  onCheckedChange={(checked: boolean) => onObserve(at, checked)}
                />
                <div className="flex min-w-0 flex-col gap-1 text-sm">
                  <span>
                    <b>{at + 1}.</b> <BoundText bind={bind} text={step.step} />
                  </span>
                  {step.expect ? (
                    <span className="border-success/60 border-l-2 pl-2 text-secondary-foreground">
                      <BoundText bind={bind} text={step.expect} />
                    </span>
                  ) : null}
                  <span className="flex flex-wrap gap-1.5">
                    {step.cases
                      .filter((id) => reading.caseById.has(id))
                      .map((id) => (
                        <button
                          className="inline-flex items-center gap-1.5 rounded-(--radius-md) border border-border px-1.5 py-0.5 text-xs outline-none hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
                          key={id}
                          onClick={() => onCase(id)}
                          type="button"
                        >
                          <span className="font-mono">
                            {labels.get(id) ?? id}
                          </span>
                          <span className="flex gap-[3px]">
                            {(reading.rowsByCase.get(id) ?? []).map((row) => (
                              <Pip
                                key={row.key}
                                value={valueOn(reading, row, surface)}
                              />
                            ))}
                          </span>
                          <MarkChip value={caseResult(reading, id, surface)} />
                        </button>
                      ))}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </article>
  );
}
