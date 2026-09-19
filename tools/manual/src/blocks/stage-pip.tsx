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
  const changes = changesForSection(scope.index, scope.pagePath, slug);
  if (changes.length === 0) return null;

  const furthest = changes.reduce((held, change) =>
    STAGES.indexOf(change.stage) > STAGES.indexOf(held.stage) ? change : held,
  );
  const artifacts = scope.index.snapshot.schemas[furthest.schema] ?? [];
  const roles = handOf(furthest, furthest.stage, artifacts);
  const hand = roles
    .map((role) => furthest.hands?.[role] ?? ROLE_LABEL[role])
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
