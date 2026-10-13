import { Alert } from "@grade10/design-system/components/display/alert";
import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { FactCard } from "../page-blocks/fact-card";
import type { VisitWaitService, VisitWaitShop } from "./types";

/** A notice over the wait: closed today, or walk-ins paused. */
type VisitWaitNoticeCopy = { title: string; body?: string };

type VisitWaitBodyCopy = {
  walkIn: string;
  shop: string;
  /** The address and the way in, one line. */
  place: string;
  /** Open now, closed now, or closed today. */
  status: string;
  /** Today's hours, beside the status. */
  hours?: string;
  closed?: VisitWaitNoticeCopy;
  paused?: VisitWaitNoticeCopy;
  waitNow: string;
  /** A booked-only service's link; its accessible name names the service. */
  book: string;
  openToday: string;
  /** How walking in works, said while the shop runs today. */
  how: string;
  /** When the wait was read, and in which zone. */
  updated: string;
  bookTime: string;
};

type VisitWaitBodyProps = {
  copy: VisitWaitBodyCopy;
  /** The shop is open now. */
  open: boolean;
  /** The shop is closed today: the other shops open today replace the wait. */
  closedToday: boolean;
  services: readonly VisitWaitService[];
  otherShops: readonly VisitWaitShop[];
  /** Book a time, at no service in particular. */
  bookHref: string;
};

/**
 * The door poster's page: the walk-in wait for each service now, today's
 * hours and Book a time. Nobody joins the line from it — joining happens at
 * the counter — so a photo of the poster cannot hold a place.
 */
function VisitWaitBody({
  copy,
  open,
  closedToday,
  services,
  otherShops,
  bookHref,
}: VisitWaitBodyProps) {
  return (
    <VStack data-slot="wait-page" gap="lg" hAlign="stretch">
      <VStack gap="sm">
        <Text as="span" size="sm" tone="secondary">
          {copy.walkIn}
        </Text>
        <Text as="h2" size="xl" weight="bold">
          {copy.shop}
        </Text>
        <Text as="p" tone="secondary">
          {copy.place}
        </Text>
        <HStack gap="sm" vAlign="center">
          <Badge variant={open ? "success" : "default"}>{copy.status}</Badge>
          {copy.hours ? (
            <Text as="span" size="sm">
              {copy.hours}
            </Text>
          ) : null}
        </HStack>
      </VStack>

      {copy.closed ? (
        <Alert
          description={copy.closed.body}
          role="status"
          status="warning"
          title={copy.closed.title}
        />
      ) : null}
      {copy.paused ? (
        <Alert
          description={copy.paused.body}
          role="status"
          status="warning"
          title={copy.paused.title}
        />
      ) : null}

      {closedToday ? (
        otherShops.length > 0 ? (
          <FactCard
            copy={{ title: copy.openToday }}
            rows={otherShops.map((shop) => ({
              label: shop.name,
              value: shop.hours,
            }))}
            slot="wait-other-shops"
          />
        ) : null
      ) : (
        <FactCard
          copy={{ title: copy.waitNow }}
          rows={services.map((row) => ({
            label: row.name,
            value: (
              <VStack gap="none">
                <Text as="span" size="sm" tone="secondary">
                  {row.sub}
                </Text>
                {row.wait ? (
                  <HStack gap="sm" wrap>
                    <Text as="span" weight="medium">
                      {row.wait.estimate}
                    </Text>
                    <Text as="span" size="sm" tone="secondary">
                      {row.wait.waiting}
                    </Text>
                  </HStack>
                ) : row.book ? (
                  <Link aria-label={row.book.label} href={row.book.href}>
                    {copy.book}
                  </Link>
                ) : null}
              </VStack>
            ),
          }))}
          slot="wait-services"
        />
      )}

      {closedToday ? null : (
        <Text as="p" size="sm">
          {copy.how}
        </Text>
      )}
      <Text as="p" size="sm" tone="secondary">
        {copy.updated}
      </Text>
      <Link href={bookHref}>{copy.bookTime}</Link>
    </VStack>
  );
}

export type { VisitWaitBodyCopy, VisitWaitBodyProps, VisitWaitNoticeCopy };
export { VisitWaitBody };
