import { Badge } from "@grade10/design-system/components/display/badge";
import { changesForSection } from "../api/derive";
import { ROLE_LABEL, STAGE_LABEL, stageNumber } from "../api/stage-view";
import { handOf, STAGES } from "../api/stages";
import { useBlockScopeMaybe } from "./block-scope";

/**
 * The pip a 🚧 line wears: the further stage of whichever in-flight change
 * delivers the section it sits in, and nothing once every change that ever
 * delivered it has archived — an archived change carries no row in
 * `changesForSection` at all, so there is nothing here to special-case.
 *
 * The stage number is what the pip shows, so no colour carries the meaning
 * alone; the hover names the change and its hand.
 */
export function StagePip({ slug }: { slug: string }) {
  const scope = useBlockScopeMaybe();
  if (!scope) return null;
  // Archived is skipped explicitly rather than left to `snapshot.changes`
  // never carrying one: `stageOf` answers `archived` for a `ChangeEntry`
  // whose own `status` says so, so a fixture — or a reader added later — that
  // does carry one still wears no pip for it.
  const changes = changesForSection(scope.index, scope.pagePath, slug).filter(
    (change) => change.status !== "archived",
  );
  if (changes.length === 0) return null;

  const furthest = changes.reduce((held, change) =>
    STAGES.indexOf(change.stage) > STAGES.indexOf(held.stage) ? change : held,
  );
  const artifacts = scope.index.snapshot.schemas[furthest.schema] ?? [];
  const roles = handOf(furthest, furthest.stage, artifacts);
  // `change-hand.tsx`'s own vocabulary: `@handle` where one is named, `<role>
  // open` where it names nobody — the same words the card and the hands
  // table use for the same fact.
  const hand = roles
    .map((role) => {
      const handle = furthest.hands?.[role];
      return handle
        ? `@${handle.replace(/^@/, "")}`
        : `${ROLE_LABEL[role]} open`;
    })
    .join(", ");
  const title = `${furthest.title} — ${STAGE_LABEL[furthest.stage]}${hand ? ` · ${hand}` : ""}`;

  return (
    <Badge
      aria-label={title}
      className="ml-1.5 align-middle"
      size="sm"
      title={title}
      variant="outline"
    >
      {stageNumber(furthest.stage)}
    </Badge>
  );
}
