import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Archive } from "@phosphor-icons/react";
import { useState } from "react";
import { byShipped, shippedDate } from "../api/derive";
import { slugify } from "../api/paths";
import { taskTotals } from "../api/stages";
import { monthKey, relativeTime } from "../api/time";
import type { ChangeEntry } from "../api/types";
import { useArchive } from "../api/use-archive";
import { Attribution, DeltaKinds } from "../blocks/change-views";
import { ClampedText } from "../blocks/clamped-text";
import { InlineMarkdown } from "../blocks/inline-markdown";

type ArchiveTimelineProps = {
  /** Only changes whose deltas touch this spec. Omit for the whole archive. */
  specId?: string;
  title?: string;
};

/**
 * Years of shipped work, fetched only when a timeline mounts. The endpoint may
 * not be served at all — that is a missing section, said plainly, not an error.
 */
export function ArchiveTimeline({
  specId,
  title = "Shipped before",
}: ArchiveTimelineProps) {
  const state = useArchive();

  return (
    <section className="mt-12 border-border-subtle border-t pt-8">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex text-secondary-foreground">
          <Archive aria-hidden size={16} />
        </span>
        <h2 className="font-heading font-bold text-lg" id={slugify(title)}>
          {title}
        </h2>
      </div>

      {state.status === "loading" ? (
        <div className="space-y-2">
          <Skeleton aria-label="Loading the archive" className="h-4 w-40" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : null}

      {state.status === "unavailable" ? (
        <Text as="p" size="sm" tone="secondary">
          Archive unavailable — {state.reason}. It loads once `/api/archive` is
          being served.
        </Text>
      ) : null}

      {state.status === "ready" ? (
        <Timeline
          changes={state.archive.changes.filter((change) =>
            specId
              ? change.deltas.some((delta) => delta.spec === specId)
              : true,
          )}
          empty={
            specId
              ? `Nothing has shipped against ${specId} yet.`
              : "The archive is empty."
          }
        />
      ) : null}
    </section>
  );
}

const FIRST_PAGE = 12;

function Timeline({
  changes,
  empty,
}: {
  changes: ChangeEntry[];
  empty: string;
}) {
  const [full, setFull] = useState(false);

  if (changes.length === 0) {
    return (
      <Text as="p" size="sm" tone="secondary">
        {empty}
      </Text>
    );
  }

  // Years of archive is a scroll nobody asked for; the newest months open, the
  // rest arrive on request.
  const ordered = [...changes].sort(byShipped);
  const shown = full ? ordered : ordered.slice(0, FIRST_PAGE);
  const hidden = ordered.length - shown.length;

  const months = new Map<string, ChangeEntry[]>();
  for (const change of shown) {
    const key = monthKey(shippedDate(change) ?? "");
    const list = months.get(key) ?? [];
    list.push(change);
    months.set(key, list);
  }

  return (
    <>
      <ol className="space-y-6">
        {[...months].map(([month, entries]) => (
          <li key={month}>
            <Text
              as="p"
              className="mb-2 uppercase tracking-wide"
              size="xs"
              tone="secondary"
              weight="medium"
            >
              {month}
            </Text>
            <ul className="space-y-px border-border border-l pl-4">
              {entries.map((change) => {
                const { done, total } = taskTotals(change);
                const shipped = shippedDate(change);
                return (
                  <li
                    className="relative py-2 before:absolute before:top-4 before:-left-[1.3125rem] before:size-2 before:rounded-full before:bg-border-strong"
                    key={change.id}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <Text as="span" size="sm" weight="medium">
                        <InlineMarkdown text={change.title} />
                      </Text>
                      <Text
                        as="span"
                        className="font-mono"
                        size="xs"
                        tone="secondary"
                      >
                        {change.id}
                      </Text>
                      <Text
                        as="span"
                        className="ml-auto"
                        size="xs"
                        tone="secondary"
                      >
                        {shipped ? relativeTime(shipped) : "undated"}
                      </Text>
                    </div>
                    <ClampedText lines={2} text={change.why} />
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <Text as="span" size="xs" tone="secondary">
                        {total > 0 ? (
                          <span className="font-mono">
                            {done}/{total} tasks ·{" "}
                          </span>
                        ) : null}
                        <Attribution change={change} />
                      </Text>
                      <span className="flex flex-wrap gap-1">
                        <DeltaKinds
                          kinds={[
                            ...new Set(
                              change.deltas.flatMap((delta) => delta.kinds),
                            ),
                          ]}
                        />
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
      {hidden > 0 ? (
        <Button
          className="mt-4"
          onClick={() => setFull(true)}
          size="sm"
          variant="secondary"
        >
          Show {hidden} older
        </Button>
      ) : null}
    </>
  );
}
