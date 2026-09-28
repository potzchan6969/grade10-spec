import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { SiteHeader } from "@grade10/ui";
import { AUCTION_SITE_HEADER } from "./auction-lot-details-content";
import { NOT_FOUND_COPY } from "./not-found-content";
import { AUCTION_FOOTER } from "./store-content";

type NotFoundPageProps = {
  onBackToHome?: () => void;
};

/**
 * The site’s not-found surface as the app assembles it: `SiteHeader`, static
 * title and description, Back to Home, and `Footer`. No nav item is current.
 */
function NotFoundPage({ onBackToHome }: NotFoundPageProps) {
  return (
    <div className="flex min-h-svh w-full flex-col bg-background">
      <SiteHeader
        {...AUCTION_SITE_HEADER}
        navItems={AUCTION_SITE_HEADER.navItems.map((item) => ({
          ...item,
          current: false,
        }))}
      />
      <main className="flex w-full flex-1 items-center justify-center">
        <VStack
          className="mx-auto w-full max-w-lg px-4 py-20 text-center"
          gap="lg"
          hAlign="center"
        >
          <VStack className="w-full" gap="sm" hAlign="center">
            <h2 className="text-4xl font-bold leading-none text-foreground sm:text-5xl">
              {NOT_FOUND_COPY.title}
            </h2>
            <p className="text-base leading-6 text-secondary-foreground">
              {NOT_FOUND_COPY.description}
            </p>
          </VStack>
          <Button onClick={onBackToHome} size="md">
            {NOT_FOUND_COPY.backToHome}
          </Button>
        </VStack>
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export type { NotFoundPageProps };
export { NotFoundPage };
