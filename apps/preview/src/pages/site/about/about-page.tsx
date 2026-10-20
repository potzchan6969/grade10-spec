import { Footer } from "@grade10/design-system/components/layout/footer";
import { AboutPageBody, SiteHeader } from "@grade10/ui";
import { AUCTION_SITE_HEADER } from "../../auction-lot-details-content";
import { AUCTION_FOOTER } from "../../store-content";
import { ABOUT_PAGE } from "./about-content";

/**
 * The `/about` surface as the app assembles it: `SiteHeader`, the
 * `AboutPageBody` block, and `Footer`. No nav item is current — About's
 * entry is the footer's Company column.
 */
function AboutPage() {
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
        <AboutPageBody content={ABOUT_PAGE} />
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export { AboutPage };
