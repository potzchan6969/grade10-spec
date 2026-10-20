import { Footer } from "@grade10/design-system/components/layout/footer";
import { MediaCoverageGrid, SiteHeader } from "@grade10/ui";
import { AUCTION_SITE_HEADER } from "../../auction-lot-details-content";
import { AUCTION_FOOTER } from "../../store-content";
import {
  MEDIA_COVERAGE_COPY,
  MEDIA_COVERAGE_PAGE,
} from "./media-coverage-content";

/**
 * The `/media-coverage` surface as the app assembles it: `SiteHeader`, the
 * `MediaCoverageGrid` block, and `Footer`. No nav item is current — the
 * page's entry is the footer's Company column.
 */
function MediaCoveragePage() {
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
        <MediaCoverageGrid
          content={MEDIA_COVERAGE_PAGE}
          copy={MEDIA_COVERAGE_COPY}
        />
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export { MediaCoveragePage };
