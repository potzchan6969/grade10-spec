import { Footer } from "@grade10/design-system/components/layout/footer";
import { PressArticle, SiteHeader } from "@grade10/ui";
import { AUCTION_SITE_HEADER } from "../../auction-lot-details-content";
import { AUCTION_FOOTER } from "../../store-content";
import { PRESS_ARTICLE } from "./press-article-content";

/**
 * The `/press-releases/{slug}` article surface as the app assembles it:
 * `SiteHeader`, the `PressArticle` block, and `Footer`. No nav item is
 * current — the article's entry is the footer's Company column.
 */
function PressArticlePage() {
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
        <PressArticle content={PRESS_ARTICLE} />
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export { PressArticlePage };
