import { formatHkd, SCAN_IMAGE, SHOP_NAME } from "./vault-content";

type IntakeService = "vault" | "grading" | "auction-listing" | "store-listing";

/** Collector-facing list filter buckets. */
type IntakeListFilter = "in-progress" | "completed" | "all";

type IntakeItemRow = {
  itemId: string;
  name: string;
  gradeLabel: string;
  declaredHkd: number;
  status: string;
  note: string;
  scanSrcs: readonly string[];
  submissionId: string;
  service: IntakeService;
  intakeMethod: "In-Person Drop-off";
  shop: string;
  handedInAt: number;
  /** True when the item has left active intake (vaulted, handed to grading, etc.). */
  completed: boolean;
};

/** Storybook ids for intake item-card assemblies (workbench deep links). */
const INTAKE_ITEM_CARD_IN_SCANNING_STORY_ID =
  "pages-submissions-item-card--in-scanning";
const INTAKE_ITEM_CARD_VAULTED_STORY_ID =
  "pages-submissions-item-card--vaulted";
const INTAKE_ITEM_CARD_GRADING_STORY_ID =
  "pages-submissions-item-card--grading-in-transit";

function intakeItemCardStoryId(item: IntakeItemRow): string {
  if (item.service === "grading") return INTAKE_ITEM_CARD_GRADING_STORY_ID;
  if (item.completed || item.status === "Vaulted") {
    return INTAKE_ITEM_CARD_VAULTED_STORY_ID;
  }
  return INTAKE_ITEM_CARD_IN_SCANNING_STORY_ID;
}

const SERVICE_LABELS: Record<IntakeService, string> = {
  vault: "Vault",
  grading: "Grading",
  "auction-listing": "Auction Listing",
  "store-listing": "Store Listing",
};

const LIST_FILTER_LABELS: Record<IntakeListFilter, string> = {
  "in-progress": "In progress",
  completed: "Completed",
  all: "All",
};

const HAND_IN_METHOD_SHORT = "In-person";

const SUBMISSION_A = "SUB-2026-99482";
const SUBMISSION_B = "SUB-2026-99110";
const HANDED_IN_A = Date.UTC(2026, 8, 14, 4, 30);
const HANDED_IN_B = Date.UTC(2026, 8, 10, 6, 0);

function handInLine(item: IntakeItemRow): string {
  const when = new Intl.DateTimeFormat("en-HK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Hong_Kong",
  }).format(new Date(item.handedInAt));
  return `${HAND_IN_METHOD_SHORT} · ${item.shop} · ${when}`;
}

function isVaulted(item: IntakeItemRow): boolean {
  return item.status === "Vaulted";
}

function filterItems(
  items: readonly IntakeItemRow[],
  filter: IntakeListFilter,
): IntakeItemRow[] {
  switch (filter) {
    case "in-progress":
      return items.filter((item) => !item.completed);
    case "completed":
      return items.filter((item) => item.completed);
    case "all":
      return [...items];
  }
}

/** Group consecutive items that share a submission (list should be sorted by hand-in). */
function groupBySubmission(
  items: readonly IntakeItemRow[],
): { submissionId: string; handedInAt: number; items: IntakeItemRow[] }[] {
  const groups: {
    submissionId: string;
    handedInAt: number;
    items: IntakeItemRow[];
  }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.submissionId === item.submissionId) {
      last.items.push(item);
    } else {
      groups.push({
        submissionId: item.submissionId,
        handedInAt: item.handedInAt,
        items: [item],
      });
    }
  }
  return groups;
}

function sortByHandInDesc(items: readonly IntakeItemRow[]): IntakeItemRow[] {
  return [...items].sort((a, b) => {
    if (b.handedInAt !== a.handedInAt) return b.handedInAt - a.handedInAt;
    return a.itemId.localeCompare(b.itemId);
  });
}

type ItemSeed = {
  itemId: string;
  name: string;
  gradeLabel: string;
  declaredHkd: number;
  status: string;
  note: string;
  scanSrcs: readonly string[];
  completed: boolean;
};

function rowFromSeed(
  seed: ItemSeed,
  batch: {
    submissionId: string;
    service: IntakeService;
    handedInAt: number;
  },
): IntakeItemRow {
  return {
    ...seed,
    submissionId: batch.submissionId,
    service: batch.service,
    intakeMethod: "In-Person Drop-off",
    shop: SHOP_NAME,
    handedInAt: batch.handedInAt,
  };
}

const VAULT_BATCH = {
  submissionId: SUBMISSION_A,
  service: "vault" as const,
  handedInAt: HANDED_IN_A,
};

const GRADING_BATCH = {
  submissionId: SUBMISSION_B,
  service: "grading" as const,
  handedInAt: HANDED_IN_B,
};

const VAULT_IN_PROGRESS_ITEMS: readonly IntakeItemRow[] = [
  rowFromSeed(
    {
      itemId: "ITM-99482-01",
      name: "1997 Pocket Monsters Carddass Charizard",
      gradeLabel: "PSA 10 (#63261275)",
      declaredHkd: 85_000,
      status: "In Scanning",
      note: "Slab case in pristine condition. No scratches.",
      scanSrcs: [SCAN_IMAGE, SCAN_IMAGE],
      completed: false,
    },
    VAULT_BATCH,
  ),
  rowFromSeed(
    {
      itemId: "ITM-99482-02",
      name: "1887 Victoria sovereign",
      gradeLabel: "Raw / Ungraded",
      declaredHkd: 6_200,
      status: "In Scanning",
      note: "Coin in original capsule. Surface marks noted on reverse.",
      scanSrcs: [SCAN_IMAGE],
      completed: false,
    },
    VAULT_BATCH,
  ),
  rowFromSeed(
    {
      itemId: "ITM-99482-03",
      name: "Amazing Spider-Man #300",
      gradeLabel: "CGC 9.8 (#44129001)",
      declaredHkd: 18_500,
      status: "Received",
      note: "Inner well clean. Outer label slightly yellowed.",
      scanSrcs: [SCAN_IMAGE, SCAN_IMAGE],
      completed: false,
    },
    VAULT_BATCH,
  ),
];

const VAULT_COMPLETED_ITEMS: readonly IntakeItemRow[] =
  VAULT_IN_PROGRESS_ITEMS.map((item) => ({
    ...item,
    status: "Vaulted",
    completed: true,
  }));

const GRADING_IN_PROGRESS_ITEMS: readonly IntakeItemRow[] = [
  rowFromSeed(
    {
      itemId: "ITM-99110-01",
      name: "1997 Pocket Monsters Carddass Charizard",
      gradeLabel: "Raw / Ungraded",
      declaredHkd: 85_000,
      status: "In Transit",
      note: "Batch sealed for PSA Regular. No surface issues on intake.",
      scanSrcs: [SCAN_IMAGE, SCAN_IMAGE],
      completed: false,
    },
    GRADING_BATCH,
  ),
  rowFromSeed(
    {
      itemId: "ITM-99110-04",
      name: "2023 Pikachu SAR",
      gradeLabel: "Raw / Ungraded",
      declaredHkd: 42_000,
      status: "In Transit",
      note: "Corners sharp. Sleeve intact at hand-in.",
      scanSrcs: [SCAN_IMAGE],
      completed: false,
    },
    GRADING_BATCH,
  ),
];

/** Mixed open vault + grading hand-ins for the default list story. */
const IN_PROGRESS_ITEMS: readonly IntakeItemRow[] = sortByHandInDesc([
  ...VAULT_IN_PROGRESS_ITEMS,
  ...GRADING_IN_PROGRESS_ITEMS,
]);

const COMPLETED_ITEMS: readonly IntakeItemRow[] = VAULT_COMPLETED_ITEMS;

/** Distinct open submissions still in intake — drives the portfolio alert. */
function activeIntakeSubmissionCount(
  items: readonly IntakeItemRow[] = IN_PROGRESS_ITEMS,
): number {
  const open = items.filter((item) => !item.completed);
  return new Set(open.map((item) => item.submissionId)).size;
}

export type { IntakeItemRow, IntakeListFilter, IntakeService };
export {
  activeIntakeSubmissionCount,
  COMPLETED_ITEMS,
  filterItems,
  formatHkd,
  GRADING_IN_PROGRESS_ITEMS,
  groupBySubmission,
  handInLine,
  IN_PROGRESS_ITEMS,
  INTAKE_ITEM_CARD_GRADING_STORY_ID,
  INTAKE_ITEM_CARD_IN_SCANNING_STORY_ID,
  INTAKE_ITEM_CARD_VAULTED_STORY_ID,
  intakeItemCardStoryId,
  isVaulted,
  LIST_FILTER_LABELS,
  SERVICE_LABELS,
  sortByHandInDesc,
  VAULT_COMPLETED_ITEMS,
  VAULT_IN_PROGRESS_ITEMS,
};
