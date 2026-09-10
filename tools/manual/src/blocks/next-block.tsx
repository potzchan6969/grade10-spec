import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Text } from "@grade10/design-system/components/display/text";
import { Signpost } from "@phosphor-icons/react";
import { followOnsForSpec } from "../api/derive";
import { useArchive } from "../api/use-archive";
import type { NextBlock } from "../content/grammar";
import { useBlockScope } from "./block-scope";
import { FollowOnGroup } from "./follow-on-group";

/**
 * What the changes about this capability said would come next.
 *
 * Every bullet stays under the change that wrote it, dated by that change,
 * because a follow-on is one author's intent on one day and reads as a
 * commitment the moment it is pooled into a list. The page states the product
 * as it is; this states what was hoped for it, and says who hoped so.
 *
 * The archive rides its own artifact, so the shipped changes arrive after the
 * in-flight ones. The block renders what it has and fills in.
 */
export function NextBlockView({ block }: { block: NextBlock }) {
  const { index } = useBlockScope();
  const state = useArchive();
  const followOns = followOnsForSpec(
    index,
    block.spec,
    state.status === "ready" ? state.archive.changes : [],
  );

  if (followOns.length === 0 && state.status !== "loading") {
    return (
      <div className="my-5 rounded-(--radius-xl) border border-border-subtle bg-background-subtle px-4 py-2.5">
        <Text as="span" size="sm" tone="secondary">
          No change has named a follow-on for {block.spec}.
        </Text>
      </div>
    );
  }

  return (
    <section
      aria-label={`Follow-on changes named against ${block.spec}`}
      className="my-5 rounded-(--radius-xl) border border-border-subtle px-4 py-3"
    >
      <div className="flex items-baseline gap-2">
        <span className="inline-flex translate-y-0.5 text-secondary-foreground">
          <Signpost aria-hidden size={16} />
        </span>
        <Text as="p" size="sm" tone="secondary">
          Named as next by the changes about this capability — what each author
          expected to follow, on the day they wrote it. Not a plan, and nothing
          here is scheduled.
        </Text>
      </div>

      <ul className="mt-3 space-y-4">
        {followOns.map((followOn) => (
          <FollowOnGroup followOn={followOn} key={followOn.change.id} />
        ))}
      </ul>

      {state.status === "loading" ? (
        <Skeleton aria-label="Loading the archive" className="mt-3 h-4 w-40" />
      ) : null}
      {state.status === "unavailable" ? (
        <Text as="p" className="mt-3" size="xs" tone="secondary">
          Shipped changes are not listed — archive unavailable, {state.reason}.
        </Text>
      ) : null}
    </section>
  );
}
