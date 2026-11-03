import { brandCatalogs, sharedCatalogs } from "@grade10/i18n";
import { valueHash } from "@grade10/ui-verification/copy-catalog";
import {
  blocksApproval,
  type CopyIssue,
  checkValue,
} from "@grade10/ui-verification/copy-checks";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStorybookApi } from "storybook/manager-api";
import { useTheme } from "storybook/theming";
import {
  copyShipsTo,
  decideEdit,
  listCopyRecords,
  markReviewed,
  proposeEdit,
  shipEdits,
} from "./copy-client";
import {
  type CatalogLayer,
  CELL_STATE_LABELS,
  type CellState,
  type CellStatus,
  type CopyCell,
  type CopyChangeset,
  type CopyProposal,
  type CopyRecords,
  type CopyRow,
  catalogRows,
  cellKey,
  cellStatus,
  EMPTY_RECORDS,
  indexRecords,
  layerLocales,
  personLabel,
} from "./copy-review-model";
import { themeVariables } from "./panel-theme";

import "./verification-panel.css";
import "./copy-review.css";

// The Storybook manager builder compiles this TSX with React.createElement.
void React;

const ARCHIVE_BASE =
  typeof window === "undefined" ? "" : window.location.origin;
const LAYERS: Readonly<Record<string, CatalogLayer>> = {
  shared: sharedCatalogs as unknown as CatalogLayer,
  ...(brandCatalogs as unknown as Record<string, CatalogLayer>),
};
const PAGE_SIZE = 150;

type Pane = "review" | "approve" | "ship";
type Filter = "all" | "todo" | "changes" | "waiting" | "reviewed";

const FILTERS: readonly { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "todo", label: "Not reviewed" },
  { id: "changes", label: "Changes requested" },
  { id: "waiting", label: "Edit in progress" },
  { id: "reviewed", label: "Reviewed" },
];

const hashKey = (value: string | null) => (value === null ? "\u0000" : value);

function rowGroup(states: CellState[]): Exclude<Filter, "all"> {
  if (states.includes("changes-requested")) return "changes";
  if (states.includes("todo")) return "todo";
  if (states.every((state) => state === "reviewed")) return "reviewed";
  return "waiting";
}

function StateChip({ state }: { state: CellState }) {
  return (
    <span className="copy-state" data-state={state}>
      {CELL_STATE_LABELS[state]}
    </span>
  );
}

function Issues({ issues }: { issues: readonly CopyIssue[] }) {
  if (issues.length === 0) return null;
  return (
    <ul className="copy-issues">
      {issues.map((issue) => (
        <li
          key={`${issue.kind}-${issue.message}`}
          data-severity={issue.severity}
        >
          {issue.message}
        </li>
      ))}
    </ul>
  );
}

function shipmentLabel(set: CopyChangeset): string {
  if (set.shipment.kind === "files")
    return "Written to this checkout. Commit the files to ship them.";
  const pull = set.status?.pullRequest?.state;
  if (set.status?.error) return `Status unavailable: ${set.status.error}`;
  if (pull === "open") return "Pull request open";
  if (pull === "closed") return "Pull request closed without merging";
  if (pull === "merged")
    return set.status?.site?.includesMerge
      ? "Merged, and grade10's pin includes it"
      : "Merged, not on the site yet: grade10's pin has not moved past it";
  return "Pull request opened";
}

export function CopyReviewPage() {
  const theme = useTheme();
  const managerApi = useStorybookApi();
  const [records, setRecords] = useState<CopyRecords>(EMPTY_RECORDS);
  const [shipsTo, setShipsTo] = useState<"pull-request" | "files">(
    "pull-request",
  );
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [busy, setBusy] = useState(false);
  const [pane, setPane] = useState<Pane>("review");
  const [layer, setLayer] = useState("shared");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState<{
    locale: string;
    draft: string;
  } | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [unpicked, setUnpicked] = useState<ReadonlySet<string>>(new Set());
  const [hashes, setHashes] = useState<ReadonlyMap<string, string> | null>(
    null,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: refresh reloads the records on demand
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    void Promise.all([
      listCopyRecords(ARCHIVE_BASE, controller.signal),
      copyShipsTo(ARCHIVE_BASE, controller.signal),
    ])
      .then(([next, target]) => {
        setRecords(next);
        setShipsTo(target);
        setLoaded(true);
      })
      .catch((failure: unknown) => {
        if (controller.signal.aborted) return;
        setError(failure instanceof Error ? failure.message : String(failure));
      });
    return () => controller.abort();
  }, [refresh]);

  // Every value in the catalog, by cell, across all layers.
  const values = useMemo(() => {
    const map = new Map<string, string | null>();
    for (const [name, catalog] of Object.entries(LAYERS))
      for (const row of catalogRows(name, catalog, LAYERS.shared))
        for (const [locale, value] of Object.entries(row.values))
          map.set(cellKey({ ...row, locale }), value);
    return map;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const distinct = [...new Set(values.values())];
    void Promise.all(
      distinct.map(
        async (value) => [hashKey(value), await valueHash(value)] as const,
      ),
    ).then((pairs) => {
      if (!cancelled) setHashes(new Map(pairs));
    });
    return () => {
      cancelled = true;
    };
  }, [values]);

  const index = useMemo(() => indexRecords(records), [records]);
  const statusOf = useCallback(
    (cell: CopyCell): CellStatus => {
      const value = values.get(cellKey(cell)) ?? null;
      return cellStatus(index, cell, value, hashes?.get(hashKey(value)) ?? "");
    },
    [values, index, hashes],
  );

  const rows = useMemo(
    () => catalogRows(layer, LAYERS[layer], LAYERS.shared),
    [layer],
  );
  const locales = useMemo(() => layerLocales(LAYERS[layer]), [layer]);
  const rowStates = useMemo(() => {
    const map = new Map<string, CellState[]>();
    if (!hashes) return map;
    for (const row of rows)
      map.set(
        row.id,
        locales.map((locale) => statusOf({ ...row, locale }).state),
      );
    return map;
  }, [rows, locales, hashes, statusOf]);

  const needle = query.trim().toLowerCase();
  const matching = rows.filter((row) => {
    const states = rowStates.get(row.id);
    if (filter !== "all" && (!states || rowGroup(states) !== filter))
      return false;
    if (!needle) return true;
    return (
      `${row.namespace}.${row.key}`.toLowerCase().includes(needle) ||
      Object.values(row.values).some((value) =>
        value?.toLowerCase().includes(needle),
      )
    );
  });
  const filterCounts = Object.fromEntries(
    FILTERS.map(({ id }) => [
      id,
      id === "all"
        ? rows.length
        : rows.filter((row) => {
            const states = rowStates.get(row.id);
            return states ? rowGroup(states) === id : false;
          }).length,
    ]),
  );
  const current = rows.find((row) => row.id === selected) ?? null;

  // Proposals whose cell still stands where they left it.
  const live = (wanted: CellState[]) =>
    hashes
      ? records.proposals.filter((proposal) => {
          const status = statusOf(proposal);
          return (
            status.proposal?.id === proposal.id && wanted.includes(status.state)
          );
        })
      : [];
  const queue = live(["proposed", "check-failed"]);
  const approved = live(["approved"]);
  const picked = approved.filter((proposal) => !unpicked.has(proposal.id));

  async function act(action: () => Promise<unknown>) {
    setBusy(true);
    setError("");
    try {
      await action();
      setEditing(null);
      setRefresh((value) => value + 1);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      setBusy(false);
    }
  }

  function hashOf(value: string | null): string {
    const hash = hashes?.get(hashKey(value));
    if (!hash) throw new Error("The catalog is still loading.");
    return hash;
  }

  function sendForApproval(row: CopyRow, locale: string, draft: string) {
    const baseValue = row.values[locale] ?? null;
    return act(() =>
      proposeEdit(ARCHIVE_BASE, {
        layer: row.layer,
        namespace: row.namespace,
        key: row.key,
        locale,
        baseValue,
        baseHash: hashOf(baseValue),
        value: draft,
        reference: row.reference,
      }),
    );
  }

  function renderLocaleCard(row: CopyRow, locale: string) {
    const value = row.values[locale] ?? null;
    const status = statusOf({ ...row, locale });
    const isEditing = editing?.locale === locale;
    const draftIssues = isEditing
      ? checkValue({ locale, value: editing.draft, reference: row.reference })
      : [];
    const currentIssues =
      value === null
        ? []
        : checkValue({ locale, value, reference: row.reference });
    const canEdit = [
      "todo",
      "reviewed",
      "changes-requested",
      "closed",
    ].includes(status.state);
    return (
      <section className="copy-card" key={locale} aria-label={locale}>
        <div className="copy-card-heading">
          <h3>{locale}</h3>
          <StateChip state={status.state} />
        </div>
        <p lang={locale} className="copy-value">
          {value ?? <em className="verification-muted">Missing</em>}
        </p>
        <Issues issues={currentIssues} />
        {status.proposal && status.state !== "reviewed" ? (
          <div className="copy-proposal" lang={locale}>
            <span className="verification-metadata">
              Proposed by {personLabel(status.proposal.proposer)}
            </span>
            <p>{status.proposal.value}</p>
            <Issues issues={status.proposal.issues} />
          </div>
        ) : null}
        {status.state === "changes-requested" && status.decision ? (
          <p className="copy-comment">
            {personLabel(status.decision.approver)}: {status.decision.comment}
          </p>
        ) : null}
        {isEditing ? (
          <div className="copy-editor">
            <label className="verification-field">
              Proposed value
              <textarea
                lang={locale}
                rows={3}
                value={editing.draft}
                onChange={(event) =>
                  setEditing({ locale, draft: event.target.value })
                }
              />
            </label>
            {draftIssues.length ? (
              <Issues issues={draftIssues} />
            ) : (
              <p className="verification-metadata">Checks pass.</p>
            )}
            <div className="verification-inline-actions">
              <button
                className="verification-primary"
                disabled={busy || editing.draft === (value ?? "")}
                onClick={() => void sendForApproval(row, locale, editing.draft)}
                type="button"
              >
                Send for approval
              </button>
              <button onClick={() => setEditing(null)} type="button">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="verification-inline-actions">
            {status.state === "todo" ? (
              <button
                className="verification-primary"
                disabled={busy || value === null}
                onClick={() =>
                  void act(() =>
                    markReviewed(ARCHIVE_BASE, {
                      layer: row.layer,
                      namespace: row.namespace,
                      key: row.key,
                      locale,
                      valueHash: hashOf(value),
                    }),
                  )
                }
                type="button"
              >
                Looks right
              </button>
            ) : null}
            {canEdit ? (
              <button
                disabled={busy}
                onClick={() =>
                  setEditing({
                    locale,
                    draft:
                      status.state === "changes-requested" && status.proposal
                        ? status.proposal.value
                        : (value ?? ""),
                  })
                }
                type="button"
              >
                Propose edit
              </button>
            ) : (
              <span className="verification-metadata">
                {status.state === "approved"
                  ? "Approved. It ships from the Ship tab."
                  : status.state === "shipping" ||
                      status.state === "waiting-for-pin"
                    ? "Shipped. See the Ship tab."
                    : "Waiting in Approve."}
              </span>
            )}
          </div>
        )}
      </section>
    );
  }

  function renderProposal(proposal: CopyProposal) {
    const blocked = blocksApproval(proposal.issues);
    const comment = comments[proposal.id] ?? "";
    return (
      <article className="copy-card" key={proposal.id}>
        <div className="copy-card-heading">
          <h3>
            <code>
              {proposal.layer}/{proposal.namespace}.{proposal.key}
            </code>{" "}
            · {proposal.locale}
          </h3>
          <StateChip state={blocked ? "check-failed" : "proposed"} />
        </div>
        <div className="copy-compare" lang={proposal.locale}>
          <div>
            <span className="verification-metadata">Current</span>
            <p>
              {proposal.baseValue ?? (
                <em className="verification-muted">Missing</em>
              )}
            </p>
          </div>
          <div>
            <span className="verification-metadata">
              Proposed by {personLabel(proposal.proposer)}
            </span>
            <p>{proposal.value}</p>
          </div>
        </div>
        <Issues issues={proposal.issues} />
        <label className="verification-field">
          Comment (needed to request changes)
          <textarea
            rows={2}
            value={comment}
            onChange={(event) =>
              setComments({ ...comments, [proposal.id]: event.target.value })
            }
          />
        </label>
        <div className="verification-inline-actions">
          <button
            className="verification-primary"
            disabled={busy || blocked}
            onClick={() =>
              void act(() =>
                decideEdit(ARCHIVE_BASE, {
                  proposalId: proposal.id,
                  verdict: "approved",
                  ...(comment.trim() ? { comment } : {}),
                }),
              )
            }
            title={blocked ? "Fix the failed check first" : undefined}
            type="button"
          >
            Approve edit
          </button>
          <button
            disabled={busy || !comment.trim()}
            onClick={() =>
              void act(() =>
                decideEdit(ARCHIVE_BASE, {
                  proposalId: proposal.id,
                  verdict: "changes-requested",
                  comment,
                }),
              )
            }
            type="button"
          >
            Request changes
          </button>
        </div>
      </article>
    );
  }

  const tabs: readonly { id: Pane; label: string; count: number }[] = [
    {
      id: "review",
      label: "1 Review",
      count: (filterCounts.todo ?? 0) + (filterCounts.changes ?? 0),
    },
    { id: "approve", label: "2 Approve", count: queue.length },
    { id: "ship", label: "Ship", count: approved.length },
  ];

  return (
    <main
      className="verification-panel verification-page copy-review"
      style={themeVariables(theme)}
    >
      <header className="verification-panel-header">
        <div>
          <h2>Copy review</h2>
          <p>
            Each value in @grade10/i18n is reviewed, any edit is proposed, and
            an approver approves it before it ships.
          </p>
        </div>
        <div className="verification-inline-actions">
          <button onClick={() => managerApi.navigate("/")} type="button">
            Back to stories
          </button>
          <button
            onClick={() => managerApi.navigate("/verification-dashboard/")}
            type="button"
          >
            Dashboard
          </button>
          <button
            onClick={() => setRefresh((value) => value + 1)}
            type="button"
          >
            Refresh
          </button>
        </div>
      </header>

      <div className="copy-tabs" role="tablist" aria-label="Copy review steps">
        {tabs.map((tab) => (
          <button
            aria-selected={pane === tab.id}
            key={tab.id}
            onClick={() => setPane(tab.id)}
            role="tab"
            type="button"
          >
            {tab.label}
            <span className="copy-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {error ? (
        <p className="verification-error" role="alert">
          Copy review: {error}
        </p>
      ) : null}
      {!loaded || !hashes ? (
        <p className="verification-muted" role="status">
          Loading copy…
        </p>
      ) : null}

      {pane === "review" ? (
        <>
          <div className="copy-toolbar">
            <label className="verification-field">
              Layer
              <select
                value={layer}
                onChange={(event) => {
                  setLayer(event.target.value);
                  setSelected(null);
                  setEditing(null);
                  setLimit(PAGE_SIZE);
                }}
              >
                {Object.keys(LAYERS).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="verification-field copy-search">
              Search keys or text
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setLimit(PAGE_SIZE);
                }}
              />
            </label>
            <fieldset className="copy-filters">
              <legend className="verification-visually-hidden">
                Filter keys
              </legend>
              {FILTERS.map((each) => (
                <button
                  aria-pressed={filter === each.id}
                  key={each.id}
                  onClick={() => {
                    setFilter(each.id);
                    setLimit(PAGE_SIZE);
                  }}
                  type="button"
                >
                  {each.label}
                  <span className="copy-count">{filterCounts[each.id]}</span>
                </button>
              ))}
            </fieldset>
          </div>
          <div className="copy-layout">
            <div className="verification-table-scroll copy-table-wrap">
              <table className="copy-table">
                <thead>
                  <tr>
                    <th scope="col">Key</th>
                    {locales.map((locale) => (
                      <th key={locale} scope="col">
                        {locale}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matching.slice(0, limit).map((row) => (
                    <tr aria-selected={row.id === selected} key={row.id}>
                      <th scope="row">
                        <button
                          className="copy-key"
                          onClick={() => {
                            setSelected(row.id);
                            setEditing(null);
                          }}
                          type="button"
                        >
                          {row.namespace}.{row.key}
                        </button>
                      </th>
                      {locales.map((locale, at) => {
                        const state = rowStates.get(row.id)?.[at];
                        return (
                          <td key={locale} lang={locale}>
                            <span className="copy-cell-value">
                              {row.values[locale] ?? (
                                <em className="verification-muted">Missing</em>
                              )}
                            </span>
                            {state && state !== "reviewed" ? (
                              <StateChip state={state} />
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              {matching.length > limit ? (
                <button
                  className="copy-more"
                  onClick={() => setLimit(limit + PAGE_SIZE)}
                  type="button"
                >
                  Show more ({matching.length - limit} left)
                </button>
              ) : null}
              {matching.length === 0 ? (
                <p className="verification-muted copy-empty">No keys match.</p>
              ) : null}
            </div>
            <aside className="copy-detail" aria-label="Review key">
              {current ? (
                <>
                  <div>
                    <h3>
                      <code>
                        {current.namespace}.{current.key}
                      </code>
                    </h3>
                    <p className="verification-metadata">
                      packages/i18n/messages/{current.layer}/&lt;locale&gt;/
                      {current.namespace}.json
                    </p>
                  </div>
                  {locales.map((locale) => renderLocaleCard(current, locale))}
                </>
              ) : (
                <p className="verification-muted">Select a key to review it.</p>
              )}
            </aside>
          </div>
        </>
      ) : null}

      {pane === "approve" ? (
        <div className="copy-list">
          {queue.length === 0 ? (
            <p className="verification-muted">No edit is waiting.</p>
          ) : (
            queue.map(renderProposal)
          )}
          <p className="verification-metadata">
            An edit with an error cannot be approved; a warning is your call.
            Every decision is kept, and the newest one holds.
          </p>
        </div>
      ) : null}

      {pane === "ship" ? (
        <div className="copy-list">
          <section className="verification-section">
            <h3>Approved edits</h3>
            {approved.length === 0 ? (
              <p className="verification-muted">No approved edit is waiting.</p>
            ) : (
              <ul className="copy-ship-list">
                {approved.map((proposal) => (
                  <li key={proposal.id}>
                    <label>
                      <input
                        checked={!unpicked.has(proposal.id)}
                        onChange={(event) => {
                          const next = new Set(unpicked);
                          if (event.target.checked) next.delete(proposal.id);
                          else next.add(proposal.id);
                          setUnpicked(next);
                        }}
                        type="checkbox"
                      />
                      <span>
                        <code>
                          {proposal.layer}/{proposal.namespace}.{proposal.key}
                        </code>{" "}
                        · {proposal.locale}
                        <span
                          className="copy-ship-change"
                          lang={proposal.locale}
                        >
                          {proposal.baseValue ?? "Missing"} → {proposal.value}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            <div className="verification-inline-actions">
              <button
                className="verification-primary"
                disabled={busy || picked.length === 0}
                onClick={() =>
                  void act(() =>
                    shipEdits(
                      ARCHIVE_BASE,
                      picked.map((proposal) => proposal.id),
                    ),
                  )
                }
                type="button"
              >
                {shipsTo === "files"
                  ? "Write to this checkout"
                  : "Open pull request on grade10-spec"}
              </button>
            </div>
            <p className="verification-metadata">
              {shipsTo === "files"
                ? "The edits are written into this checkout's catalog files for you to commit."
                : "The edits ship as one pull request on grade10-spec. The site shows them after grade10 moves its spec pin and deploys."}{" "}
              An edit whose catalog value moved since it was proposed is left
              out.
            </p>
          </section>
          <section className="verification-section">
            <h3>Shipped</h3>
            {records.changesets.length === 0 ? (
              <p className="verification-muted">Nothing has shipped yet.</p>
            ) : (
              <ul className="copy-ship-list">
                {[...records.changesets].reverse().map((set) => (
                  <li key={set.id}>
                    <div>
                      {set.shipment.kind === "pull-request" ? (
                        <a
                          href={set.shipment.url}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Pull request #{set.shipment.number}
                        </a>
                      ) : (
                        <span>{set.shipment.paths.join(", ")}</span>
                      )}{" "}
                      · {set.proposalIds.length} edit
                      {set.proposalIds.length === 1 ? "" : "s"} ·{" "}
                      {personLabel(set.author)} · {set.createdAt}
                    </div>
                    <div className="verification-metadata">
                      {shipmentLabel(set)}
                      {set.skipped.length
                        ? ` · ${set.skipped.length} left out: ${set.skipped.map((each) => each.reason).join("; ")}`
                        : ""}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </main>
  );
}
