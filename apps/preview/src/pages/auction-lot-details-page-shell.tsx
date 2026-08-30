import { Footer } from "@grade10/design-system/components/layout/footer";
import type { ReactNode } from "react";
import { LISTING_LOT_GRID_CLASS } from "@grade10/ui";
import { STORE_FOOTER } from "./store-content";
import { WorkbenchAccountNav } from "./workbench-account-nav";
import { AUCTION_NAV } from "./auction-lot-details-content";

type AuctionLotDetailsPageShellProps = {
  children: ReactNode;
  header?: ReactNode;
};

function AuctionLotDetailsPageShell({
  children,
  header,
}: AuctionLotDetailsPageShellProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <WorkbenchAccountNav {...AUCTION_NAV} promo={AUCTION_NAV.promo} />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 pb-16">
        <div className="flex flex-col gap-12 pt-6">
          {header}
          <div className={LISTING_LOT_GRID_CLASS}>{children}</div>
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

export { AuctionLotDetailsPageShell };
