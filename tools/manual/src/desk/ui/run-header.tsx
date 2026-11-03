import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import {
  ArrowCounterClockwise,
  DownloadSimple,
  FileCsv,
  Lock,
  SealCheck,
} from "@phosphor-icons/react";
import { useState } from "react";
import {
  MARK_LABEL,
  type MarkValue,
  type RunSummary,
  SURFACE_LABEL,
  SURFACES,
  type Surface,
} from "../../api/desk";
import { ConfirmDialog } from "../../editor/confirm-dialog";
import type { LiveStatus } from "../client";
import type { Counts } from "../model";
import { MARK_FILL } from "./marks";

const ORDER: MarkValue[] = ["pass", "fail", "blocked", "todo", "skipped", "na"];

export const rateText = (rate: number | null): string =>
  rate === null ? "—" : `${Math.round(rate * 100)}%`;

/** A surface's line of the Summary tab: its counts, n/a left out of the
 * rate. */
export function SurfaceSummary({
  surface,
  counts,
  mine,
}: {
  surface: Surface;
  counts: Counts;
  mine: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1.5 rounded-(--radius-lg) border px-3 py-2",
        mine
          ? "border-border-strong bg-background"
          : "border-border bg-background-subtle",
      )}
      data-surface={surface}
    >
      <div className="flex items-baseline justify-between gap-2">
        <Text as="span" size="xs" weight="bold">
          {SURFACE_LABEL[surface]}
        </Text>
        <Text as="span" data-rate size="sm" weight="bold">
          {rateText(counts.rate)}
        </Text>
      </div>
      <div
        aria-hidden
        className="flex h-1.5 overflow-hidden rounded-full bg-muted"
      >
        {ORDER.filter((value) => value !== "na" && counts[value] > 0).map(
          (value) => (
            <i
              className={MARK_FILL[value]}
              key={value}
              style={{ flex: counts[value] }}
            />
          ),
        )}
      </div>
      <Text as="p" className="leading-snug" size="xs" tone="secondary">
        {ORDER.filter((value) => counts[value] > 0)
          .map((value) => `${counts[value]} ${MARK_LABEL[value]}`)
          .join(" · ") || "no rows"}
      </Text>
    </div>
  );
}

const STATE_LABEL: Record<RunSummary["state"], string> = {
  open: "open",
  finalized: "finalized, recorded in git",
  closed: "closed",
};

const LIVE_LABEL: Record<LiveStatus, string> = {
  connecting: "Connecting",
  live: "Live",
  offline: "Reconnecting",
};

type Pending = "finalized" | "closed" | null;

export function RunHeader({
  run,
  sections,
  counts,
  surface,
  status,
  waiting,
  canRerun,
  onState,
  onRerun,
  onDownload,
}: {
  run: RunSummary;
  sections: number;
  counts: Record<Surface, Counts>;
  surface: Surface;
  status: LiveStatus;
  waiting: number;
  canRerun: boolean;
  onState: (state: "finalized" | "closed") => void;
  onRerun: () => void;
  onDownload: (what: "csv" | "record") => void;
}) {
  const [confirm, setConfirm] = useState<Pending>(null);
  return (
    <header className="flex flex-col gap-3 pt-5 pb-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-bold text-manual-h3 leading-tight">
            Run {run.id} · {run.name}
          </h1>
          <Text as="p" className="mt-1" size="sm" tone="secondary">
            {run.env} · {STATE_LABEL[run.state]} · {run.cases} cases, {run.rows}{" "}
            rows under {sections} sections
            {run.rerunOf ? ` · re-run of run ${run.rerunOf}` : ""}
          </Text>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            title={waiting > 0 ? `${waiting} writes wait to send` : undefined}
            variant={
              status === "live"
                ? waiting > 0
                  ? "warning"
                  : "success"
                : "warning"
            }
          >
            {LIVE_LABEL[status]}
            {waiting > 0 ? ` · ${waiting} to send` : ""}
          </Badge>
          {run.state === "open" ? (
            <Button
              onClick={() => setConfirm("finalized")}
              size="sm"
              variant="outline"
            >
              <SealCheck aria-hidden /> Finalize
            </Button>
          ) : null}
          {run.state === "finalized" ? (
            <Button
              onClick={() => setConfirm("closed")}
              size="sm"
              variant="outline"
            >
              <Lock aria-hidden /> Close
            </Button>
          ) : null}
          {canRerun ? (
            <Button onClick={onRerun} size="sm" variant="outline">
              <ArrowCounterClockwise aria-hidden /> Re-run failed and blocked
            </Button>
          ) : null}
          <Button onClick={() => onDownload("csv")} size="sm" variant="ghost">
            <FileCsv aria-hidden /> Export CSV
          </Button>
          {run.state !== "open" ? (
            <Button
              onClick={() => onDownload("record")}
              size="sm"
              variant="ghost"
            >
              <DownloadSimple aria-hidden /> Download record
            </Button>
          ) : null}
        </div>
      </div>
      <fieldset
        aria-label="The Summary's counts, per surface"
        className="grid min-w-0 grid-cols-2 gap-2 lg:grid-cols-4"
      >
        {SURFACES.map((one) => (
          <SurfaceSummary
            counts={counts[one]}
            key={one}
            mine={one === surface}
            surface={one}
          />
        ))}
      </fieldset>
      <ConfirmDialog
        body={
          confirm === "finalized"
            ? "The selection is frozen from here and the run sheet records it in git. Marking goes on."
            : "Marking ends for everyone. The run's verdicts stay the latest for its cases."
        }
        confirmLabel={confirm === "finalized" ? "Finalize" : "Close the run"}
        onConfirm={() => {
          if (confirm) onState(confirm);
          setConfirm(null);
        }}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
        open={confirm !== null}
        title={
          confirm === "finalized"
            ? `Finalize run ${run.id}?`
            : `Close run ${run.id}?`
        }
      />
    </header>
  );
}
