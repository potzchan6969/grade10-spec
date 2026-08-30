import { Footer } from "@grade10/design-system/components/layout/footer";
import type { ReactNode } from "react";
import { STORE_FOOTER } from "../../pages/store-content";
import { WorkbenchAccountNav } from "../../pages/workbench-account-nav";
import { AUCTION_NAV } from "./auction-nav";

export const PDP_GRID_CLASS = "pdp-grid w-full items-start gap-12";
export const GALLERY_COLUMN_CLASS = "pdp-gallery w-full min-w-0";
export const SIDEBAR_COLUMN_CLASS =
  "pdp-sidebar w-full min-w-0 lg:sticky lg:top-6 lg:self-start";

type PageShellProps = {
  children: ReactNode;
  header?: ReactNode;
};

function PageShell({ children, header }: PageShellProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <WorkbenchAccountNav {...AUCTION_NAV} promo={AUCTION_NAV.promo} />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 pb-16">
        <div className="flex flex-col gap-12 pt-6">
          {header}
          <div className={PDP_GRID_CLASS}>{children}</div>
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

export { PageShell };
