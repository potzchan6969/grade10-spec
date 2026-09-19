import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Kanban } from "@phosphor-icons/react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  BOARD_FILTERS,
  type BoardFilter,
  type BoardRow,
  boardLanes,
  boardRows,
  FILTER_LABEL,
  filterOf,
  narrowedBy,
} from "../api/board";
import { useHandle } from "../api/handle";
import { STAGE_LABEL } from "../api/stage-view";
import { useArchive } from "../api/use-archive";
import { useManualIndex } from "../api/use-manual-index";
import { StageLane } from "../blocks/stage-lane";
import { TextField } from "../editor/fields";
import { ReadOnlyNotice } from "../editor/read-only-notice";
import { browserKeyStore } from "../editor/session";
import { ArchiveTimeline } from "./archive-timeline";
import { MaintenancePanel } from "./maintenance-panel";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

/**
 * The board: every change in flight in the lane its own files put it in, one
 * lane per stage.
 *
 * Nothing here is stored. The stage, whose turn it is and what sits beside it
 * are all derived from the artifacts on `main`, so the board and the change
 * page cannot disagree about a change; the filters and the shelf are URL
 * state, so a reading of a stuck board is a link somebody can send.
 */
export function InFlightPage() {
  const index = useManualIndex();
  useDocumentTitle("In Flight");
  // The archive answers whether a dependency shipped — without it a shipped
  // one would read as blocking — and it is what the Archived lane holds.
  const archive = useArchive();
  const archived =
    archive.status === "ready" ? archive.archive.changes : undefined;
  const [params] = useSearchParams();
  const filter = filterOf(params.get("filter"));
  const { handle, remember } = useHandle(browserKeyStore);

  const rows = boardRows([...index.snapshot.changes, ...(archived ?? [])], {
    now: Date.now(),
    released: new Set((archived ?? []).map((one) => one.id)),
    schemas: index.snapshot.schemas,
  });
  const kept = rows.filter((row) => narrowedBy(row, filter, handle));
  const shelved = kept.filter((row) => row.shelved);

  return (
    <>
      <ReadOnlyNotice className="mb-3 text-right" />
      <PageHeading
        summary="Every change in flight, in the lane its own artifacts put it in — one lane per stage, with the hand each waits on."
        title="In Flight"
      />

      <FilterRow filter={filter} params={params} shelved={shelved.length} />
      {filter === "mine" && handle === undefined ? (
        <HandleAsk remember={remember} />
      ) : null}

      {index.snapshot.changes.length === 0 ? (
        <EmptyState
          description="No change is in flight in this snapshot."
          icon={<Kanban aria-hidden />}
          title="Nothing in flight"
        />
      ) : (
        <>
          {boardLanes(kept).map((lane) => (
            <StageLane index={index} key={lane.stage} lane={lane} />
          ))}
          <Shelf rows={shelved} />
        </>
      )}

      <ArchiveTimeline title="Archive" />
      <MaintenancePanel />
    </>
  );
}

/** Exactly the five filters, and a link to the shelf section beside them —
 * the section itself always renders below the lanes, so this is a jump to
 * it, not a second way to show it. */
function FilterRow({
  filter,
  params,
  shelved,
}: {
  filter: BoardFilter | undefined;
  params: URLSearchParams;
  shelved: number;
}) {
  const to = (next: BoardFilter | undefined) => {
    const search = new URLSearchParams(params);
    if (next === undefined) search.delete("filter");
    else search.set("filter", next);
    const written = search.toString();
    return written === "" ? "/in-flight" : `/in-flight?${written}`;
  };

  return (
    <nav
      aria-label="Filters"
      className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1.5"
    >
      {BOARD_FILTERS.map((one) => (
        <Link
          aria-current={filter === one ? "page" : undefined}
          key={one}
          to={to(filter === one ? undefined : one)}
        >
          <Badge size="sm" variant={filter === one ? "info" : "outline"}>
            {FILTER_LABEL[one]}
          </Badge>
        </Link>
      ))}
      <Link className="ml-auto" to="#shelf">
        <Badge size="sm" variant="outline">
          <span>Shelf</span>
          <span className="opacity-70">{shelved}</span>
        </Badge>
      </Link>
    </nav>
  );
}

/**
 * Mine needs a handle and the manual has nobody signed in, so it asks for one
 * and narrows nothing until it has one: a filter that emptied the board while
 * asking who you are reads as a board with nothing on it.
 */
function HandleAsk({ remember }: { remember: (handle: string) => void }) {
  const [written, setWritten] = useState("");

  return (
    <form
      className="mb-6 flex flex-wrap items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        remember(written);
      }}
    >
      <Text as="span" className="mb-2.5" size="sm">
        Choose a handle to see the changes you are a hand of
      </Text>
      <div className="w-40">
        <TextField
          label="Your handle"
          onChange={setWritten}
          placeholder="handle"
          value={written}
        />
      </div>
      <Button size="sm" type="submit" variant="outline">
        Remember me
      </Button>
    </form>
  );
}

/**
 * What was set aside: a change nothing has landed on for a month comes off
 * its lane and sits here with its stage and its day count, so a long board is
 * the work in flight rather than everything anybody ever proposed.
 */
function Shelf({ rows }: { rows: BoardRow[] }) {
  if (rows.length === 0) return null;

  return (
    <section className="mt-12 border-border-subtle border-t pt-8">
      <h2 className="mb-1 font-heading font-bold text-lg" id="shelf">
        Shelf
      </h2>
      <Text as="p" className="mb-3" size="sm" tone="secondary">
        Nothing has landed on these for a month. Each is off its lane until it
        moves again.
      </Text>
      <ul className="flex flex-col gap-2">
        {rows.map((row) => (
          <li
            className="flex flex-wrap items-center gap-x-3 gap-y-1"
            key={row.change.id}
          >
            <Link
              className="text-sm underline underline-offset-2"
              to={`/in-flight/${row.change.id}`}
            >
              {row.change.title}
            </Link>
            <Badge size="sm" variant="outline">
              {STAGE_LABEL[row.stage]}
            </Badge>
            <Text as="span" size="xs" tone="secondary">
              {`${row.idleDays} days`}
            </Text>
          </li>
        ))}
      </ul>
    </section>
  );
}
