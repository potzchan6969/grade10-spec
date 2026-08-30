import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { ClipboardText, Warning } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router";
import { type QaRow, qaRows } from "../api/derive";
import { specTitle } from "../api/paths";
import { useManualIndex } from "../api/use-manual-index";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

/**
 * The reviewer's worklist. One derivation over what the snapshot already
 * carries — no new state, nothing to keep in sync — answering the question no
 * screen answered before: what is pending across the platform, and which
 * capability do I open first.
 *
 * Order is the answer: a suite nobody can read, then drafts nobody has stood
 * behind, then scenarios no case traces.
 */
export function QaPage() {
  const index = useManualIndex();
  useDocumentTitle("QA");
  const rows = qaRows(index);

  return (
    <>
      <PageHeading
        summary="Every capability that has claimed acceptance, hardest review first."
        title="QA"
      />

      {rows.length === 0 ? (
        <EmptyState
          description="No capability in this snapshot carries journeys or a test-case suite."
          icon={<ClipboardText aria-hidden />}
          title="Nothing to review"
        />
      ) : (
        <>
          <Totals rows={rows} />
          <ul className="mt-5 space-y-2.5">
            {rows.map((row) => (
              <li key={row.spec.id}>
                <QaRowCard row={row} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function Totals({ rows }: { rows: QaRow[] }) {
  const draft = rows.reduce((sum, row) => sum + row.cases.draft, 0);
  const actual = rows.reduce((sum, row) => sum + row.cases.actual, 0);
  const covered = rows.reduce((sum, row) => sum + row.covered, 0);
  const countable = rows.reduce((sum, row) => sum + row.countable, 0);
  const suites = rows.filter((row) => row.cases.total > 0).length;

  return (
    <Text as="p" size="sm" tone="secondary">
      {rows.length} capabilities · {suites} {suites === 1 ? "suite" : "suites"}{" "}
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
