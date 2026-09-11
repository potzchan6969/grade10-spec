import { Footer } from "@grade10/design-system/components/layout/footer";
import { LISTING_LOT_GRID_CLASS, SiteHeader } from "@grade10/ui";
import type { ReactNode } from "react";
import { AUCTION_SITE_HEADER } from "./auction-lot-details-content";
import { STORE_FOOTER } from "./store-content";

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
      <SiteHeader {...AUCTION_SITE_HEADER} />
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
