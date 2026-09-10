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
import { type OpenMark, openMarksForProduct } from "../api/open-marks";
import { useArchive } from "../api/use-archive";
import { FollowOnGroup } from "../blocks/follow-on-group";
import { InlineMarkdown } from "../blocks/inline-markdown";

/**
 * What this domain has not settled, pooled from its pages: every line a page
 * marked ❓ or `TBC`, where it sits, and then what the changes about its
 * capabilities said would come next.
 *
 * The marks are the pages' own words, linked to the section that carries
 * them — the page is the record, this is the way in. The follow-ons keep the
 * capability block's reading one level up: every bullet under the change that
 * wrote it, dated by it, with the capability each change was about, because
 * a reader arriving at the domain has not chosen one yet.
 *
 * Nothing is drawn where nothing is open: this section is derived, not
 * authored, so an empty one would be a heading no page asked for.
 */
export function ProductPendingSpec({
  index,
  id,
}: {
  index: ManualIndex;
  id: string;
}) {
  const state = useArchive();
  const marks = openMarksForProduct(index, id);
  const followOns = followOnsForProduct(
    index,
    id,
    state.status === "ready" ? state.archive.changes : [],
  );

  if (marks.length === 0 && followOns.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-1 font-heading font-bold text-lg" id="pending-spec">
        Pending spec
      </h2>
      <Text as="p" className="mb-3" size="sm" tone="secondary">
        What the pages of this domain leave unconfirmed — every ❓ and TBC,
        where it sits — and what the changes about its capabilities named as
        next. Not a plan, and nothing here is scheduled.
      </Text>

      {marks.length > 0 ? <OpenMarks marks={marks} /> : null}

      {followOns.length > 0 ? (
        <>
          <Text
            as="h3"
            className={marks.length > 0 ? "mt-6 mb-2" : "mb-2"}
            size="sm"
            weight="medium"
          >
            Named as next by a change
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
        </>
      ) : null}

      {state.status === "unavailable" ? (
        <Text as="p" className="mt-3" size="xs" tone="secondary">
          Shipped changes are not listed — archive unavailable, {state.reason}.
        </Text>
      ) : null}
    </section>
  );
}

/** The pages' own open lines, page by page, each a way into the section that
 * carries it. */
function OpenMarks({ marks }: { marks: OpenMark[] }) {
  const byPage = new Map<string, OpenMark[]>();
  for (const mark of marks) {
    const list = byPage.get(mark.page.path) ?? [];
    list.push(mark);
    byPage.set(mark.page.path, list);
  }

  return (
    <ul className="space-y-4">
      {[...byPage.values()].map((list) => {
        const { page } = list[0];
        const title = page.ast?.frontmatter.title ?? page.path;
        return (
          <li key={page.path}>
            <Text as="span" size="sm" weight="medium">
              <Link className="hover:underline" to={page.route ?? "#"}>
                {title}
              </Link>
            </Text>
            <ul className="mt-1 ml-4 list-disc space-y-1 marker:text-border-strong">
              {list.map((mark, at) => (
                <li key={`${mark.where?.anchor ?? ""}:${at}`}>
                  <Text as="span" size="sm">
                    <InlineMarkdown text={mark.text} />
                  </Text>
                  {mark.where ? (
                    <Link
                      className="ml-2 text-secondary-foreground text-xs hover:text-foreground hover:underline"
                      to={`${page.route ?? ""}#${mark.where.anchor}`}
                    >
                      {mark.where.title}
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
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
