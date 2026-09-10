import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "react-router";
import {
  capabilityTitle,
  followOnsForProduct,
  type ManualIndex,
  type ProductFollowOn,
  routeForSpec,
} from "../api/derive";
import { useArchive } from "../api/use-archive";
import { FollowOnGroup } from "../blocks/follow-on-group";

/**
 * What the changes about this domain's capabilities said would come next,
 * gathered from the pages that each show their own.
 *
 * The reading is the capability block's, one level up: every bullet stays
 * under the change that wrote it and is dated by it, because a follow-on is
 * one author's intent on one day. What the domain adds is the capability each
 * change was about — the reader has not chosen one yet, and a bullet with
 * nothing against it would read as the whole domain's.
 *
 * Nothing is drawn where nothing was named: this section is derived, not
 * authored, so an empty one would be a heading no page asked for.
 */
export function ProductFollowOns({
  index,
  id,
}: {
  index: ManualIndex;
  id: string;
}) {
  const state = useArchive();
  const followOns = followOnsForProduct(
    index,
    id,
    state.status === "ready" ? state.archive.changes : [],
  );

  if (followOns.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-1 font-heading font-bold text-lg" id="pending-spec">
        Pending spec
      </h2>
      <Text as="p" className="mb-3" size="sm" tone="secondary">
        Named as next by the changes about this domain's capabilities — what
        each author expected to follow, on the day they wrote it. Not a plan,
        and nothing here is scheduled.
      </Text>

      <ul className="space-y-4">
        {followOns.map((followOn) => (
          <FollowOnGroup
            about={<AboutCapabilities followOn={followOn} index={index} />}
            followOn={followOn}
            key={followOn.change.id}
          />
        ))}
      </ul>

      {state.status === "unavailable" ? (
        <Text as="p" className="mt-3" size="xs" tone="secondary">
          Shipped changes are not listed — archive unavailable, {state.reason}.
        </Text>
      ) : null}
    </section>
  );
}

/** The capabilities of this domain the change was about, each a way into the
 * page that shows the change's own follow-ons beside its requirements. */
function AboutCapabilities({
  index,
  followOn,
}: {
  index: ManualIndex;
  followOn: ProductFollowOn;
}) {
  return (
    <span className="flex flex-wrap items-baseline gap-1">
      {followOn.specs.map((specId) => (
        <Badge
          key={specId}
          render={
            <Link to={routeForSpec(index, specId)}>
              {capabilityTitle(index, specId)}
            </Link>
          }
          size="sm"
          variant="outline"
        />
      ))}
    </span>
  );
}
