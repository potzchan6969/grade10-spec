import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { ClipboardText, Warning } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router";
import {
  type ChangeSuiteRow,
  changeSuiteRows,
  type QaRow,
  qaRows,
} from "../api/derive";
import { specTitle } from "../api/paths";
import { useManualIndex } from "../api/use-manual-index";
import { CopyableCommand } from "../blocks/copyable-command";
import { InlineMarkdown } from "../blocks/inline-markdown";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

/**
 * The reviewer's worklist. One derivation over what the snapshot already
 * carries — no new state, nothing to keep in sync — answering the question no
 * screen answered before: what is pending across the platform, and which
 * capability do I open first.
 *
 * Order is the answer: the suites riding in-flight changes first — they are
 * where a PM is actually waiting on a review, and no capability page can show
 * them yet — then a suite nobody can read, then drafts nobody has stood
 * behind, then scenarios no case traces.
 */
export function QaPage() {
  const index = useManualIndex();
  useDocumentTitle("QA");
  const rows = qaRows(index);
  const inFlight = changeSuiteRows(index);

  return (
    <>
      <PageHeading
        summary="Every suite awaiting review — riding a change or beside a durable capability — hardest review first."
        title="QA"
      />

      {rows.length === 0 && inFlight.length === 0 ? (
        <EmptyState
          description="No capability in this snapshot carries journeys or a test-case suite."
          icon={<ClipboardText aria-hidden />}
          title="Nothing to review"
        />
      ) : (
        <>
          <Totals inFlight={inFlight} rows={rows} />
          <Text as="p" className="mt-1" size="xs" tone="secondary">
            A review is the whole loop today: `approved` is the record the build
            holds a suite to — no runner or export consumes it yet.
          </Text>
          <InFlightSuites rows={inFlight} />
          {rows.length > 0 ? (
            <>
              <h2 className="mt-7 mb-2.5 font-heading font-bold text-base">
                Capabilities
              </h2>
              <ul className="space-y-2.5">
                {rows.map((row) => (
                  <li key={row.spec.id}>
                    <QaRowCard row={row} />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </>
      )}
    </>
  );
}

/**
 * Suites sitting beside an in-flight change's deltas. The capability may not
 * exist durably yet, so this is the one surface that can show them — without
 * it, a 19-case suite a PM asked QA to review read as "1 suite" platform-wide.
 */
function InFlightSuites({ rows }: { rows: ChangeSuiteRow[] }) {
  if (rows.length === 0) return null;

  return (
    <>
      <h2 className="mt-7 mb-2.5 font-heading font-bold text-base">
        In flight
      </h2>
      <ul className="space-y-2.5">
        {rows.map(({ change, suite }) => (
          <li key={`${change.id}/${suite.spec}`}>
            <article className="rounded-(--radius-2xl) border border-border bg-card p-3.5">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <Link
                  className="font-medium text-sm hover:underline"
                  to={`/in-flight/${change.id}`}
                >
                  <InlineMarkdown text={change.title} />
                </Link>
                <Text
                  as="span"
                  className="font-mono"
                  size="xs"
                  tone="secondary"
                >
                  {suite.spec}
                </Text>
                <span className="ml-auto">
                  {suite.error ? (
                    <Badge size="sm" variant="error">
                      unreadable
                    </Badge>
                  ) : (
                    <Badge
                      size="sm"
                      variant={
                        suite.status === "approved" ? "success" : "warning"
                      }
                    >
                      {suite.status}
                    </Badge>
                  )}
                </span>
              </div>

              {suite.error ? (
                <div className="mt-2 flex items-baseline gap-1.5 text-destructive">
                  <Warning aria-hidden size={13} weight="fill" />
                  <Text as="span" size="xs">
                    {suite.error.file}
                    {suite.error.line ? `:${suite.error.line}` : ""} —{" "}
                    {suite.error.message}
                  </Text>
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <Text as="span" size="xs" tone="secondary">
                    {suite.cases.total}{" "}
                    {suite.cases.total === 1 ? "case" : "cases"}
                  </Text>
                  {suite.cases.draft > 0 ? (
                    <Badge size="sm" variant="warning">
                      {suite.cases.draft} draft
                    </Badge>
                  ) : null}
                  {suite.cases.actual > 0 ? (
                    <Badge size="sm" variant="success">
                      {suite.cases.actual} actual
                    </Badge>
                  ) : null}
                  {suite.cases.deprecated > 0 ? (
                    <Badge size="sm" variant="outline">
                      {suite.cases.deprecated} deprecated
                    </Badge>
                  ) : null}
                  {suite.cases.draft > 0 ? (
                    <span className="ml-auto">
                      <CopyableCommand command={`/tcs-review ${change.id}`} />
                    </span>
                  ) : null}
                </div>
              )}
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}

function Totals({
  rows,
  inFlight,
}: {
  rows: QaRow[];
  inFlight: ChangeSuiteRow[];
}) {
  const draft =
    rows.reduce((sum, row) => sum + row.cases.draft, 0) +
    inFlight.reduce((sum, row) => sum + row.suite.cases.draft, 0);
  const actual =
    rows.reduce((sum, row) => sum + row.cases.actual, 0) +
    inFlight.reduce((sum, row) => sum + row.suite.cases.actual, 0);
  const covered = rows.reduce((sum, row) => sum + row.covered, 0);
  const countable = rows.reduce((sum, row) => sum + row.countable, 0);
  const suites =
    rows.filter((row) => row.cases.total > 0).length + inFlight.length;

  return (
    <Text as="p" size="sm" tone="secondary">
      {rows.length} capabilities · {suites} {suites === 1 ? "suite" : "suites"}
      {inFlight.length > 0
        ? ` (${inFlight.length} riding ${inFlight.length === 1 ? "a change" : "changes"})`
        : ""}{" "}
      · {draft} draft {draft === 1 ? "case" : "cases"} waiting on a review ·{" "}
      {actual} reviewed · {covered} of {countable} scenarios traced
    </Text>
  );
}

const FIRST_IDS = 8;

function QaRowCard({ row }: { row: QaRow }) {
  const [open, setOpen] = useState(false);
  const { cases } = row;
  const shown = open ? row.untraced : row.untraced.slice(0, FIRST_IDS);

  return (
    <article className="rounded-(--radius-2xl) border border-border bg-card p-3.5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <Link
          className="font-medium text-sm hover:underline"
          to={row.anchor ? `${row.route}#${row.anchor}` : row.route}
        >
          {specTitle(row.spec)}
        </Link>
        <Text as="span" className="font-mono" size="xs" tone="secondary">
          {row.spec.id}
        </Text>
        <span className="ml-auto flex items-center gap-1.5">
          {row.suiteStatus ? (
            <Badge
              size="sm"
              variant={row.suiteStatus === "approved" ? "success" : "warning"}
            >
              {row.suiteStatus}
            </Badge>
          ) : (
            <Badge size="sm" variant="outline">
              no suite
            </Badge>
          )}
        </span>
      </div>

      {row.error ? (
        <div className="mt-2 flex items-baseline gap-1.5 text-destructive">
          <Warning aria-hidden size={13} weight="fill" />
          <Text as="span" size="xs">
            {row.error.file}
            {row.error.line ? `:${row.error.line}` : ""} — {row.error.message}
          </Text>
        </div>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <Text as="span" size="xs" tone="secondary">
          {cases.total} {cases.total === 1 ? "case" : "cases"}
        </Text>
        {cases.draft > 0 ? (
          <Badge size="sm" variant="warning">
            {cases.draft} draft
          </Badge>
        ) : null}
        {cases.actual > 0 ? (
          <Badge size="sm" variant="success">
            {cases.actual} actual
          </Badge>
        ) : null}
        {cases.deprecated > 0 ? (
          <Badge size="sm" variant="outline">
            {cases.deprecated} deprecated
          </Badge>
        ) : null}
        <Text
          as="span"
          className="ml-auto font-mono"
          size="xs"
          tone="secondary"
        >
          {row.covered}/{row.countable} traced
        </Text>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <Text as="span" size="xs" tone="secondary">
          {row.journeys} {row.journeys === 1 ? "journey" : "journeys"}
          {row.outOfSuite.length > 0
            ? ` · ${row.outOfSuite.length} out of suite`
            : ""}
        </Text>
        {row.untraced.length > 0 ? (
          <button
            aria-expanded={open}
            className="cursor-pointer text-secondary-foreground text-xs underline decoration-border-strong underline-offset-2 hover:text-foreground"
            onClick={() => setOpen((on) => !on)}
            type="button"
          >
            {row.untraced.length} untraced
          </button>
        ) : null}
      </div>

      {row.untraced.length > 0 && open ? (
        <ul className="mt-1.5 flex flex-wrap gap-1">
          {shown.map((id) => (
            <li key={id}>
              <Link
                className="inline-flex rounded-(--radius-lg) border border-border-subtle px-1.5 py-0.5 font-mono text-secondary-foreground text-xs transition-colors hover:border-border-strong hover:bg-muted"
                to={`${row.route}#${id}`}
              >
                {id}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
