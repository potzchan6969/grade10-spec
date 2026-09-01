import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import { ClockCounterClockwise } from "@phosphor-icons/react";
import { useEffect } from "react";
import { Link } from "react-router";
import { type FeedRef, feedRef } from "../api/derive";
import { dayLabel, relativeTime, shortSha } from "../api/time";
import type { HistoryEvent } from "../api/types";
import { useManualIndex } from "../api/use-manual-index";
import { markSeen } from "../shell/recent-seen";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

/**
 * Every commit that moved the store, in the order it happened. Nothing here is
 * new data: the build already walks the log for each page's own date, and this
 * is that walk read as a chronology.
 */
export function RecentPage() {
  const index = useManualIndex();
  useDocumentTitle("Recent changes");
  const history = index.snapshot.history;
  const newest = history[0]?.date;

  useEffect(() => {
    if (newest) markSeen(newest);
  }, [newest]);

  return (
    <>
      <PageHeading
        summary="Every commit to the store, and what it touched."
        title="Recent changes"
      />

      {history.length === 0 ? (
        <EmptyState
          description="This snapshot was built outside a git checkout, so there is no history to read."
          icon={<ClockCounterClockwise aria-hidden />}
          title="No history"
        />
      ) : (
        <ol className="space-y-6">
          {byDay(history).map(([day, events]) => (
            <li key={day}>
              <Text
                as="p"
                className="mb-2 uppercase tracking-wide"
                size="xs"
                tone="secondary"
                weight="medium"
              >
                {day}
              </Text>
              <ul className="divide-y divide-border-subtle rounded-(--radius-2xl) border border-border bg-card">
                {events.map((event) => (
                  <li key={event.sha}>
                    <EventRow event={event} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

/** Consecutive events under one day, newest day first — the list stays flat,
 * the separators only say where a day ended. */
function byDay(history: HistoryEvent[]): [string, HistoryEvent[]][] {
  const days = new Map<string, HistoryEvent[]>();
  for (const event of history) {
    const day = dayLabel(event.date);
    const list = days.get(day) ?? [];
    list.push(event);
    days.set(day, list);
  }
  return [...days];
}

function EventRow({ event }: { event: HistoryEvent }) {
  const index = useManualIndex();

  return (
    <div className="px-3.5 py-2.5">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <Text as="span" className="min-w-0 flex-1" size="sm" weight="medium">
          {event.subject}
        </Text>
        <Text as="span" className="font-mono" size="xs" tone="secondary">
          {shortSha(event.sha)}
        </Text>
        <Text as="span" size="xs" tone="secondary">
          {relativeTime(event.date)}
        </Text>
      </div>
      {event.refs.length > 0 ? (
        <ul className="mt-1.5 flex flex-wrap items-center gap-1">
          {event.refs.map((ref) => {
            const resolved = feedRef(index, ref);
            return (
              <li className="min-w-0 max-w-full" key={resolved.key}>
                <RefChip chip={resolved} />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

const KIND_TONE = {
  page: "default",
  spec: "info",
  change: "warning",
  archived: "outline",
  file: "outline",
} as const;

function RefChip({ chip }: { chip: FeedRef }) {
  return (
    <Badge
      className={cn("max-w-full", chip.kind === "file" && "font-mono")}
      render={chip.to ? <Link to={chip.to} /> : undefined}
      size="sm"
      title={chip.label}
      variant={KIND_TONE[chip.kind]}
    >
      <span className="truncate">{chip.label}</span>
    </Badge>
  );
}
