import { Footer } from "@grade10/design-system/components/layout/footer";
import type { ReactNode } from "react";
import { STORE_FOOTER } from "../../pages/store-content";
import { WorkbenchAccountNav } from "../../pages/workbench-account-nav";
import { AUCTION_NAV } from "./auction-nav";

export const PDP_GRID_CLASS = "pdp-grid w-full items-start gap-12";
export const GALLERY_COLUMN_CLASS = "pdp-gallery w-full min-w-0 pt-6";
export const SIDEBAR_COLUMN_CLASS =
  "pdp-sidebar w-full min-w-0 pt-6 lg:sticky lg:top-0 lg:max-h-svh lg:overflow-y-auto";

type PageShellProps = {
  children: ReactNode;
};

function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <WorkbenchAccountNav {...AUCTION_NAV} promo={AUCTION_NAV.promo} />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 pb-16">
        <div className={PDP_GRID_CLASS}>{children}</div>
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

export { PageShell };
