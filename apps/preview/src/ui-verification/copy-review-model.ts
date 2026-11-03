import { flatten } from "@grade10/ui-verification/copy-catalog";
import {
  blocksApproval,
  type CopyIssue,
} from "@grade10/ui-verification/copy-checks";

export interface Person {
  subject: string;
  email?: string;
}

export interface CopyCell {
  layer: string;
  locale: string;
  namespace: string;
  key: string;
}

export interface CopyReviewRecord extends CopyCell {
  id: string;
  valueHash: string;
  reviewer: Person;
  createdAt: string;
}

export interface CopyProposal extends CopyCell {
  id: string;
  baseValue: string | null;
  baseHash: string;
  value: string;
  issues: CopyIssue[];
  proposer: Person;
  createdAt: string;
}

export interface CopyDecision {
  id: string;
  proposalId: string;
  verdict: "approved" | "changes-requested";
  comment: string;
  approver: Person;
  createdAt: string;
}

export interface CopyChangeset {
  id: string;
  proposalIds: string[];
  skipped: { proposalId: string; reason: string }[];
  shipment:
    | {
        kind: "pull-request";
        repo: string;
        number: number;
        url: string;
        branch: string;
      }
    | { kind: "files"; paths: string[] };
  status?: {
    pullRequest?: { state: "open" | "closed" | "merged" };
    site?: { pin: string; includesMerge: boolean } | null;
    error?: string;
  } | null;
  author: Person;
  createdAt: string;
}

export interface CopyRecords {
  reviews: CopyReviewRecord[];
  proposals: CopyProposal[];
  decisions: CopyDecision[];
  changesets: CopyChangeset[];
}

export const EMPTY_RECORDS: CopyRecords = {
  reviews: [],
  proposals: [],
  decisions: [],
  changesets: [],
};

type Tree = Record<string, unknown>;
/** One layer of the catalog: locale, then namespace, then its message tree. */
export type CatalogLayer = Record<string, Record<string, Tree>>;

export interface CopyRow {
  id: string;
  layer: string;
  namespace: string;
  key: string;
  /** The English this key translates, or undefined when none answers it. */
  reference: string | undefined;
  /** Each locale the layer speaks; null where the locale lacks the key. */
  values: Record<string, string | null>;
}

const LOCALE_ORDER = ["en", "zh-Hant", "zh-Hans", "ko"];
const byLocale = (left: string, right: string) =>
  (LOCALE_ORDER.indexOf(left) + 1 || 99) -
    (LOCALE_ORDER.indexOf(right) + 1 || 99) || left.localeCompare(right);

export function layerLocales(layer: CatalogLayer): string[] {
  return Object.keys(layer).sort(byLocale);
}

/** Every key a layer answers, one row each, with the English it translates. */
export function catalogRows(
  layerName: string,
  layer: CatalogLayer,
  shared: CatalogLayer,
): CopyRow[] {
  const locales = layerLocales(layer);
  const flat = new Map<string, Record<string, unknown>>();
  for (const locale of locales)
    for (const [namespace, tree] of Object.entries(layer[locale] ?? {}))
      flat.set(`${locale}/${namespace}`, flatten(tree));
  const english = (namespace: string, key: string) => {
    const own = flat.get(`en/${namespace}`)?.[key];
    if (typeof own === "string") return own;
    const fallback = shared.en?.[namespace];
    const value = fallback ? flatten(fallback)[key] : undefined;
    return typeof value === "string" ? value : undefined;
  };

  const rows = new Map<string, CopyRow>();
  for (const locale of locales)
    for (const namespace of Object.keys(layer[locale] ?? {}))
      for (const key of Object.keys(flat.get(`${locale}/${namespace}`) ?? {})) {
        const id = `${layerName}/${namespace}/${key}`;
        if (!rows.has(id))
          rows.set(id, {
            id,
            layer: layerName,
            namespace,
            key,
            reference: english(namespace, key),
            values: Object.fromEntries(
              locales.map((each) => {
                const value = flat.get(`${each}/${namespace}`)?.[key];
                return [each, typeof value === "string" ? value : null];
              }),
            ),
          });
      }
  return [...rows.values()].sort((left, right) =>
    left.id.localeCompare(right.id),
  );
}

export type CellState =
  | "todo"
  | "reviewed"
  | "proposed"
  | "check-failed"
  | "changes-requested"
  | "approved"
  | "shipping"
  | "closed"
  | "waiting-for-pin";

export const CELL_STATE_LABELS: Readonly<Record<CellState, string>> = {
  todo: "Not reviewed",
  reviewed: "Reviewed",
  proposed: "Edit waiting for approval",
  "check-failed": "Edit failed a check",
  "changes-requested": "Changes requested",
  approved: "Edit approved",
  shipping: "Edit shipping",
  closed: "Pull request closed",
  "waiting-for-pin": "Merged, not on the site yet",
};

export interface CellStatus {
  state: CellState;
  /** The edit the state is about, when one is. */
  proposal?: CopyProposal;
  decision?: CopyDecision;
  changeset?: CopyChangeset;
}

export const cellKey = (cell: CopyCell) =>
  `${cell.layer}/${cell.locale}/${cell.namespace}/${cell.key}`;

export interface RecordIndex {
  reviews: Map<string, CopyReviewRecord[]>;
  proposals: Map<string, CopyProposal[]>;
  decision: Map<string, CopyDecision>;
  changeset: Map<string, CopyChangeset>;
}

function push<T>(map: Map<string, T[]>, key: string, value: T) {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

export function indexRecords(records: CopyRecords): RecordIndex {
  const index: RecordIndex = {
    reviews: new Map(),
    proposals: new Map(),
    decision: new Map(),
    changeset: new Map(),
  };
  for (const review of records.reviews)
    push(index.reviews, cellKey(review), review);
  for (const proposal of [...records.proposals].sort((left, right) =>
    left.createdAt.localeCompare(right.createdAt),
  ))
    push(index.proposals, cellKey(proposal), proposal);
  for (const decision of records.decisions) {
    const held = index.decision.get(decision.proposalId);
    if (!held || held.createdAt <= decision.createdAt)
      index.decision.set(decision.proposalId, decision);
  }
  for (const set of records.changesets)
    for (const id of set.proposalIds) index.changeset.set(id, set);
  return index;
}

/**
 * Where one catalog value stands. An edit counts while the catalog still holds
 * the value it was proposed against; once its own value is in the catalog it
 * has landed, and waits only for the site's pin.
 */
export function cellStatus(
  index: RecordIndex,
  cell: CopyCell,
  value: string | null,
  hash: string,
): CellStatus {
  const key = cellKey(cell);
  const proposals = index.proposals.get(key) ?? [];
  const open = proposals.filter((each) => each.baseHash === hash).at(-1);
  if (open) {
    const decision = index.decision.get(open.id);
    const changeset = index.changeset.get(open.id);
    if (changeset) {
      const pull = changeset.status?.pullRequest?.state;
      return {
        state: pull === "closed" ? "closed" : "shipping",
        proposal: open,
        decision,
        changeset,
      };
    }
    if (!decision)
      return {
        state: blocksApproval(open.issues) ? "check-failed" : "proposed",
        proposal: open,
      };
    return {
      state: decision.verdict === "approved" ? "approved" : "changes-requested",
      proposal: open,
      decision,
    };
  }
  const landed = proposals
    .filter((each) => each.value === value && index.changeset.has(each.id))
    .at(-1);
  if (landed) {
    const changeset = index.changeset.get(landed.id);
    const site = changeset?.status?.site;
    return {
      state: site && !site.includesMerge ? "waiting-for-pin" : "reviewed",
      proposal: landed,
      changeset,
    };
  }
  const reviewed = (index.reviews.get(key) ?? []).some(
    (review) => review.valueHash === hash,
  );
  return { state: reviewed ? "reviewed" : "todo" };
}

export const personLabel = (person: Person) => person.email ?? person.subject;
