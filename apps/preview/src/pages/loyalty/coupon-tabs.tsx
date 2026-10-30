import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { type CouponItem, CouponList } from "@grade10/ui";
import type { ReactNode } from "react";
import { COUPON_LIST_COPY, COUPONS_PAGE_COPY } from "./loyalty-content";

const isOpen = (coupon: CouponItem) => coupon.status === "open";

const couponState = (
  data: readonly CouponItem[],
  empty: { message: string; description: string },
) =>
  data.length > 0
    ? { status: "ready" as const, data }
    : { status: "empty" as const, ...empty };

/**
 * The wallet's two ledgers, wherever coupons are listed: Available holds
 * what can still be spent — with the page's promo under it — Used &
 * Expired holds the record. Each tab falls back to its own empty line; a
 * wallet with no coupons at all draws no tab bar, so callers check
 * `coupons.length` first.
 */
function CouponTabs({
  coupons,
  promo,
}: {
  coupons: readonly CouponItem[];
  promo?: ReactNode;
}) {
  return (
    <Tabs defaultValue="available">
      <TabsList
        className="w-full justify-start border-b border-border"
        variant="list"
      >
        <TabsTrigger value="available">
          {COUPONS_PAGE_COPY.availableTab}
        </TabsTrigger>
        <TabsTrigger value="history">
          {COUPONS_PAGE_COPY.historyTab}
        </TabsTrigger>
      </TabsList>
      <TabsContent className="pt-4" value="available">
        <CouponList
          copy={COUPON_LIST_COPY}
          promo={promo}
          state={couponState(coupons.filter(isOpen), {
            message: COUPONS_PAGE_COPY.noAvailable,
            description: COUPONS_PAGE_COPY.noAvailableDescription,
          })}
        />
      </TabsContent>
      <TabsContent className="pt-4" value="history">
        <CouponList
          copy={COUPON_LIST_COPY}
          state={couponState(
            coupons.filter((coupon) => !isOpen(coupon)),
            {
              message: COUPONS_PAGE_COPY.noHistory,
              description: COUPONS_PAGE_COPY.noHistoryDescription,
            },
          )}
        />
      </TabsContent>
    </Tabs>
  );
}

export { CouponTabs, isOpen };
