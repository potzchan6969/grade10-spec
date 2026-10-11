import { Alert } from "@grade10/design-system/components/display/alert";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { FactCard } from "../page-blocks/fact-card";
import type { VisitFullDayShop } from "./types";

type VisitFullDayCopy = {
  /** Why today offers nothing here: full, closed, or every time passed. */
  title: string;
  earliestEach: string;
  noFreeYet: string;
  /** Walking in today, drawn only when given. */
  walkIn?: { title: string; body: string; seeWait: string };
};

type VisitFullDayProps = {
  copy: VisitFullDayCopy;
  shops: readonly VisitFullDayShop[];
  /** The shop's wait page, linked under walking in. */
  waitHref?: string;
  /** Picks a shop's earliest time, by the shop's id. */
  onPick: (shopId: string) => void;
};

/** Today offers nothing here: the earliest time at each shop and, today,
 * walking in. */
function VisitFullDay({ copy, shops, waitHref, onPick }: VisitFullDayProps) {
  return (
    <FactCard copy={{ title: copy.title }} slot="booking-full-day">
      <VStack gap="sm" hAlign="stretch">
        <Text as="span" size="sm" tone="secondary">
          {copy.earliestEach}
        </Text>
        {shops.map((shop) => (
          <Button
            disabled={!shop.earliest}
            key={shop.id}
            onClick={() => shop.earliest && onPick(shop.id)}
            size="md"
            type="button"
            variant="outline"
          >
            {`${shop.name} · ${shop.earliest ?? copy.noFreeYet}`}
          </Button>
        ))}
        {copy.walkIn ? (
          <Alert
            description={
              <VStack gap="xs">
                <span>{copy.walkIn.body}</span>
                {waitHref ? (
                  <Link href={waitHref}>{copy.walkIn.seeWait}</Link>
                ) : null}
              </VStack>
            }
            title={copy.walkIn.title}
          />
        ) : null}
      </VStack>
    </FactCard>
  );
}

export type { VisitFullDayCopy, VisitFullDayProps };
export { VisitFullDay };
