import { Footer } from "@grade10/design-system/components/layout/footer";
import { PressReleaseList, SiteHeader } from "@grade10/ui";
import { AUCTION_SITE_HEADER } from "../../auction-lot-details-content";
import { AUCTION_FOOTER } from "../../store-content";
import { PRESS_COPY, PRESS_PAGE } from "./press-content";

/**
 * The `/press-releases` surface as the app assembles it: `SiteHeader`, the
 * `PressReleaseList` block, and `Footer`. No nav item is current — the
 * page's entry is the footer's Company column.
 */
function PressPage() {
  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <SiteHeader
        {...AUCTION_SITE_HEADER}
        navItems={AUCTION_SITE_HEADER.navItems.map((item) => ({
          ...item,
          current: false,
        }))}
      />
      <main className="w-full flex-1">
        <PressReleaseList content={PRESS_PAGE} copy={PRESS_COPY} />
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export { PressPage };
