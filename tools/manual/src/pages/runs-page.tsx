import { Alert } from "@grade10/design-system/components/display/alert";
import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import { ClipboardText, UploadSimple } from "@phosphor-icons/react";
import { type DragEvent, useEffect, useId, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { RunSummary } from "../api/desk";
import { relativeTime } from "../api/time";
import { useManualIndex } from "../api/use-manual-index";
import { handleOf } from "../desk/checks";
import { readRunSpec } from "../desk/run-spec-file";
import { useDesk } from "../desk/use-desk";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

const STATE_TONE = {
  open: "info",
  finalized: "success",
  closed: "default",
} as const;

/** Every run on the desk, newest first, and a door to open one from the
 * file the run sheet writes. */
export function RunsPage() {
  useDocumentTitle("Runs");
  const desk = useDesk();
  const index = useManualIndex();
  const navigate = useNavigate();
  const [runs, setRuns] = useState<RunSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<string[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputId = useId();
  const who = (email: string) => handleOf(email, index.snapshot.team);
  const phaseName = (id: string) =>
    index.snapshot.phases?.find((one) => one.id === id)?.name ?? id;

  useEffect(() => {
    if (!desk) return;
    desk.runs().then(setRuns, (cause: unknown) => {
      console.error("runs unavailable", cause);
      setError(cause instanceof Error ? cause.message : String(cause));
    });
    desk.me().then(
      (one) => setMe(one.email),
      (cause: unknown) =>
        console.error("desk could not say who is signed in", cause),
    );
  }, [desk]);

  const open = async (file: File | undefined) => {
    if (!file || !desk) return;
    const reading = readRunSpec(await file.text());
    if (!reading.ok) {
      setProblems([
        `${file.name} is not a run the desk can open:`,
        ...reading.problems,
      ]);
      return;
    }
    setProblems([]);
    try {
      const run = await desk.openRun(reading.spec);
      navigate(`/runs/${encodeURIComponent(run.id)}`);
    } catch (cause) {
      console.error("the desk refused the run", cause);
      setProblems([cause instanceof Error ? cause.message : String(cause)]);
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    void open(event.dataTransfer.files[0]);
  };

  return (
    <>
      <PageHeading
        summary="QA's runs, each a list of cases marked on Web, Mobile and the automated columns."
        title="Runs"
      >
        {me ? (
          <Text as="p" size="sm" tone="secondary">
            Signed in as <b className="text-foreground">{who(me)}</b>
            {who(me) !== me ? ` (${me})` : ""}
          </Text>
        ) : null}
      </PageHeading>

      <label
        className={cn(
          "mb-6 flex cursor-pointer flex-col items-center gap-1.5 rounded-(--radius-2xl) border border-border-strong border-dashed bg-background-subtle px-4 py-6 text-center transition-colors hover:border-foreground",
          dragging && "border-foreground bg-background",
        )}
        htmlFor={inputId}
        onDragLeave={() => setDragging(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDrop={onDrop}
      >
        <UploadSimple aria-hidden size={20} />
        <Text as="span" size="sm" weight="medium">
          Open a run
        </Text>
        <Text as="span" size="xs" tone="secondary">
          Drop the RunSpec file the run sheet wrote, or choose it
        </Text>
        <input
          accept="application/json,.json"
          className="sr-only"
          id={inputId}
          onChange={(event) => {
            void open(event.target.files?.[0]);
            event.target.value = "";
          }}
          type="file"
        />
      </label>

      {problems.length > 0 ? (
        <Alert
          className="mb-6"
          description={
            <ul className="list-disc pl-5">
              {problems.slice(1).map((one) => (
                <li key={one}>{one}</li>
              ))}
            </ul>
          }
          role="alert"
          status="error"
          title={problems[0]}
        />
      ) : null}

      {error ? (
        <EmptyState
          description={error}
          icon={<ClipboardText aria-hidden />}
          title="The desk cannot be reached"
        />
      ) : runs === null ? (
        <Text as="p" size="sm" tone="secondary">
          Reading the desk…
        </Text>
      ) : runs.length === 0 ? (
        <EmptyState
          description="A run opens here once the run sheet's dry run is confirmed, or from its file above."
          icon={<ClipboardText aria-hidden />}
          title="No runs yet"
        />
      ) : (
        <ul className="divide-y divide-border-subtle rounded-(--radius-2xl) border border-border bg-card">
          {runs.map((run) => (
            <li key={run.id}>
              <Link
                className="flex flex-col gap-1 px-3.5 py-3 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                data-run={run.id}
                to={`/runs/${encodeURIComponent(run.id)}`}
              >
                <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <Text
                    as="span"
                    className="min-w-0 flex-1"
                    size="sm"
                    weight="medium"
                  >
                    Run {run.id} · {run.name}
                  </Text>
                  <Badge size="sm" variant={STATE_TONE[run.state]}>
                    {run.state}
                  </Badge>
                </span>
                <Text as="span" size="xs" tone="secondary">
                  {[
                    run.env,
                    run.phase ? phaseName(run.phase) : null,
                    `${run.cases} cases, ${run.rows} rows`,
                    run.rerunOf ? `re-run of run ${run.rerunOf}` : null,
                    `opened by ${who(run.openedBy)} ${relativeTime(run.openedAt)}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
