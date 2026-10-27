import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import {
  Table,
  TableBody,
} from "@grade10/design-system/components/display/table";
import { TableCell } from "@grade10/design-system/components/display/table-cell";
import { TableHead } from "@grade10/design-system/components/display/table-head";
import { TableHeader } from "@grade10/design-system/components/display/table-header";
import { TableRow } from "@grade10/design-system/components/display/table-row";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { Coins } from "@phosphor-icons/react";
import { storyHref } from "../../../pages/workbench-story-nav";
import {
  TOP_UP_COPY,
  TOP_UP_HISTORY_COPY,
  TOP_UP_HISTORY_ENTRIES,
  type TopUpHistoryEntry,
} from "./top-ups-content";
import {
  TopUpsBreadcrumbs,
  TopUpsPageShell,
  TopUpsPrototypeNote,
  useSmUp,
} from "./top-ups-shared";

/** The pack picker the empty state opens. */
const TOP_UP_DIALOG_STORY_ID =
  "loyalty-top-ups-prototypes-top-up-dialog--default";

type TopUpHistoryState = "default" | "empty";

const copy = TOP_UP_HISTORY_COPY;

const STATUS_VARIANT = {
  credited: "default",
  "under-review": "warning",
  "not-approved": "outline",
  "charged-back": "error",
} as const;

/** One history row's points and, when it is held, why no receipt yet. */
function PackCell({ entry }: { entry: TopUpHistoryEntry }) {
  return (
    <span className="flex min-w-0 flex-col items-start">
      <span>{TOP_UP_COPY.packPoints(entry.points)}</span>
      {entry.status === "under-review" ? (
        <span className="text-xs text-secondary-foreground">
          {copy.underReviewHint}
        </span>
      ) : null}
    </span>
  );
}

function StatusBadge({ entry }: { entry: TopUpHistoryEntry }) {
  return (
    <Badge variant={STATUS_VARIANT[entry.status]}>
      {copy.status[entry.status]}
    </Badge>
  );
}

function ReceiptLink({ entry }: { entry: TopUpHistoryEntry }) {
  return entry.receipt ? (
    <Link href={`#receipt-${entry.id}`} size="sm">
      {copy.receipt}
    </Link>
  ) : null;
}

/** The ledger as a table from 640px up; each row a stacked card below. */
function HistoryRows({ smUp }: { smUp: boolean }) {
  if (!smUp) {
    return (
      <div className="flex w-full flex-col gap-3">
        {TOP_UP_HISTORY_ENTRIES.map((entry) => (
          <div
            className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-background p-4"
            key={entry.id}
          >
            <div className="flex items-center justify-between gap-2">
              <Text size="sm" tone="secondary">
                {entry.date}
              </Text>
              <StatusBadge entry={entry} />
            </div>
            <Text weight="medium">
              {TOP_UP_COPY.packPoints(entry.points)}{" "}
              {TOP_UP_COPY.packPointsSuffix}
            </Text>
            <div className="flex items-center justify-between gap-2">
              <Text size="sm" tone="secondary">
                {copy.colPaid}
              </Text>
              <Text size="sm">{TOP_UP_COPY.packPrice(entry.paid)}</Text>
            </div>
            {entry.status === "under-review" ? (
              <Text size="xs" tone="secondary">
                {copy.underReviewHint}
              </Text>
            ) : null}
            <ReceiptLink entry={entry} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table aria-label={copy.title}>
      <TableHeader>
        <TableHead className="w-28">{copy.colDate}</TableHead>
        <TableHead className="flex-1">{copy.colPack}</TableHead>
        <TableHead align="end" className="w-28">
          {copy.colPaid}
        </TableHead>
        <TableHead className="w-32">{copy.colStatus}</TableHead>
        <TableHead className="w-20">{copy.colReceipt}</TableHead>
      </TableHeader>
      <TableBody>
        {TOP_UP_HISTORY_ENTRIES.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="w-28">{entry.date}</TableCell>
            <TableCell className="flex-1">
              <PackCell entry={entry} />
            </TableCell>
            <TableCell align="end" className="w-28">
              {TOP_UP_COPY.packPrice(entry.paid)}
            </TableCell>
            <TableCell className="w-32">
              <StatusBadge entry={entry} />
            </TableCell>
            <TableCell className="w-20">
              <ReceiptLink entry={entry} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/**
 * Every pack the member bought or tried to buy: paid, held, refused or
 * charged back. A wireframe until the design lands.
 */
function TopUpHistoryPrototype({ state }: { state: TopUpHistoryState }) {
  const smUp = useSmUp();
  return (
    <TopUpsPageShell>
      <TopUpsPrototypeNote settles="where Top-Up History is reached from — the dialog link and a Points History link — and whether it earns a rail item." />
      <TopUpsBreadcrumbs current={copy.title} />
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          {copy.title}
        </h1>
        <Text className="text-secondary-foreground">{copy.description}</Text>
      </div>

      <div className="flex w-full max-w-3xl flex-col gap-4">
        {state === "empty" ? (
          <EmptyState
            actions={
              <Button
                render={<a href={storyHref(TOP_UP_DIALOG_STORY_ID)} />}
                size="md"
              >
                {copy.empty.action}
              </Button>
            }
            description={copy.empty.description}
            icon={<Coins aria-hidden size={24} weight="regular" />}
            title={copy.empty.title}
          />
        ) : (
          <HistoryRows smUp={smUp} />
        )}
      </div>
    </TopUpsPageShell>
  );
}

export type { TopUpHistoryState };
export { TopUpHistoryPrototype };
