import { Footer } from "@grade10/design-system/components/layout/footer";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { SiteHeader } from "@grade10/ui";
import type { LegalDocument, LegalSurface } from "./legal-content";
import { PRIVACY_DOCUMENT, TERMS_DOCUMENT } from "./legal-content";
import { AUCTION_FOOTER, STORE_SITE_HEADER } from "./store-content";

const DOCUMENTS: Record<LegalSurface, LegalDocument> = {
  terms: TERMS_DOCUMENT,
  privacy: PRIVACY_DOCUMENT,
};

/**
 * A legal document as the site assembles it: `SiteHeader`, the catalog’s
 * title, last-updated lines and sections, and `Footer`. The shell owns the
 * page `h1`, so the document starts at `h2`.
 */
function LegalPage({ surface }: { surface: LegalSurface }) {
  const document = DOCUMENTS[surface];

  return (
    <div className="flex min-h-svh w-full flex-col bg-background">
      <SiteHeader
        {...STORE_SITE_HEADER}
        navItems={STORE_SITE_HEADER.navItems.map((item) => ({
          ...item,
          current: false,
        }))}
      />
      <main className="flex w-full flex-1 justify-center">
        <VStack className="mx-auto w-full max-w-2xl px-4 py-20" gap="none">
          <VStack className="w-full text-center" gap="lg">
            <h2 className="text-4xl font-bold leading-none text-foreground sm:text-5xl lg:text-6xl">
              {document.title}
            </h2>
            <p className="text-base leading-6 text-secondary-foreground">
              <span className="block">{document.lastUpdatedLabel}</span>
              <span className="block">{document.lastUpdatedDate}</span>
            </p>
          </VStack>
          <div className="mt-20 flex w-full flex-col gap-16">
            {document.sections.map((section) => (
              <VStack className="w-full" gap="sm" key={section.id}>
                <h3 className="text-3xl font-semibold leading-9 text-foreground">
                  {section.heading}
                </h3>
                {section.items && section.items.length > 0 ? (
                  <ul className="list-disc space-y-2 pl-6 text-lg leading-7 text-foreground">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.body ? (
                  <p className="text-lg leading-7 text-foreground">
                    {section.body}
                  </p>
                ) : null}
              </VStack>
            ))}
          </div>
        </VStack>
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export { LegalPage };
