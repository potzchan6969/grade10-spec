import { Text } from "@grade10/design-system/components/display/text";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { type FollowOn, shippedDate } from "../api/derive";
import { relativeTime } from "../api/time";
import { InlineMarkdown } from "./inline-markdown";

/**
 * One change's bullets under its own name. An in-flight change has a page to
 * open; an archived one has only its record, so it is named and not linked.
 *
 * `about` is what the change's intent landed on, named beside it where the
 * reader has not already chosen one capability — a domain page pools what its
 * capability pages each show alone, and a bullet with no capability against it
 * reads as the whole domain's.
 */
export function FollowOnGroup({
  followOn,
  about,
}: {
  followOn: FollowOn;
  about?: ReactNode;
}) {
  const { change, items } = followOn;
  const archived = change.status === "archived";
  // A shipped change is dated by the day it shipped; one still in flight by
  // the day it was written, which is the day its author looked ahead.
  const when = archived ? shippedDate(change) : change.created || undefined;

  return (
    <li>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <Text as="span" size="sm" weight="medium">
          {archived ? (
            <InlineMarkdown text={change.title} />
          ) : (
            <Link className="hover:underline" to={`/in-flight/${change.id}`}>
              <InlineMarkdown text={change.title} />
            </Link>
          )}
        </Text>
        {when ? (
          <Text as="span" size="xs" tone="secondary">
            {archived ? "shipped" : "written"} {relativeTime(when)}
          </Text>
        ) : null}
        {about}
      </div>
      <ul className="mt-1 ml-4 list-disc space-y-1 marker:text-border-strong">
        {items.map((item) => (
          <li key={item}>
            <Text as="span" size="sm">
              <InlineMarkdown text={item} />
            </Text>
          </li>
        ))}
      </ul>
    </li>
  );
}
