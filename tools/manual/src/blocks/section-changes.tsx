import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "react-router";
import { changesForSection } from "../api/derive";
import { STAGE_LABEL } from "../api/stage-view";
import { handOf, taskTotals } from "../api/stages";
import type { ChangeEntry, SchemaArtifact } from "../api/types";
import { useBlockScopeMaybe } from "./block-scope";
import { Hands } from "./change-hand";
import { InlineMarkdown } from "./inline-markdown";

/**
 * What is in flight against one section of a page: the changes whose proposal
 * linked this heading, one line each, right under it. The page's prose says
 * what the section will be; this says who is delivering it, its stage and its
 * hand, and how far along it is.
 */
export function SectionChanges({ slug }: { slug: string }) {
  const scope = useBlockScopeMaybe();
  if (!scope) return null;
  const changes = changesForSection(scope.index, scope.pagePath, slug);
  if (changes.length === 0) return null;

  return (
    <div className="my-3 space-y-1">
      {changes.map((change) => (
        <SectionChange
          artifacts={scope.index.snapshot.schemas[change.schema] ?? []}
          change={change}
          key={change.id}
        />
      ))}
    </div>
  );
}

function SectionChange({
  change,
  artifacts,
}: {
  change: ChangeEntry;
  artifacts: SchemaArtifact[];
}) {
  const { done, total } = taskTotals(change);
  const roles = handOf(change, change.stage, artifacts);
  return (
    <Link
      className="flex flex-wrap items-baseline gap-x-2 rounded-(--radius-lg) border border-border-subtle bg-background-subtle px-3 py-1.5 transition-colors hover:border-border-strong hover:bg-muted"
      to={`/in-flight/${change.id}`}
    >
      <span aria-hidden>🚧</span>
      <Text as="span" className="min-w-0 flex-1" size="sm">
        <InlineMarkdown text={change.title} />
      </Text>
      <Badge size="sm" variant="outline">
        {STAGE_LABEL[change.stage]}
      </Badge>
      <Hands change={change} roles={roles} />
      {total > 0 ? (
        <Text
          as="span"
          className="shrink-0 font-mono"
          size="xs"
          tone="secondary"
        >
          {done}/{total} tasks
        </Text>
      ) : (
        <Text as="span" className="shrink-0" size="xs" tone="secondary">
          being planned
        </Text>
      )}
    </Link>
  );
}
