import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { SiteHeader } from "@grade10/ui";
import { AUCTION_SITE_HEADER } from "./auction-lot-details-content";
import { AUCTION_RESTRICTED_COPY } from "./auction-restricted-content";
import { AUCTION_FOOTER } from "./store-content";

type AuctionRestrictedPageProps = {
  onBrowseStore?: () => void;
};

/**
 * The auction restriction surface as the app assembles it for a request
 * judged restricted: `SiteHeader` with no Auction nav item and no My
 * Auctions account entry, static title and description, Browse the Store,
 * and `Footer`. No nav item is current.
 */
function AuctionRestrictedPage({ onBrowseStore }: AuctionRestrictedPageProps) {
  const { onMyAuctions: _onMyAuctions, ...header } = AUCTION_SITE_HEADER;
  return (
    <div className="flex min-h-svh w-full flex-col bg-background">
      <SiteHeader
        {...header}
        navItems={header.navItems.filter((item) => item.label !== "Auction")}
      />
      <main className="flex w-full flex-1 items-center justify-center">
        <VStack
          className="mx-auto w-full max-w-lg px-4 py-20 text-center"
          gap="lg"
          hAlign="center"
        >
          <VStack className="w-full" gap="sm" hAlign="center">
            <h2 className="text-4xl font-bold leading-none text-foreground sm:text-5xl">
              {AUCTION_RESTRICTED_COPY.title}
            </h2>
            <p className="text-base leading-6 text-secondary-foreground">
              {AUCTION_RESTRICTED_COPY.description}
            </p>
          </VStack>
          <Button onClick={onBrowseStore} size="md">
            {AUCTION_RESTRICTED_COPY.browseStore}
          </Button>
        </VStack>
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export type { AuctionRestrictedPageProps };
export { AuctionRestrictedPage };
