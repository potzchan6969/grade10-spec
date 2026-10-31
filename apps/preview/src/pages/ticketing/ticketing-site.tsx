import { Footer } from "@grade10/design-system/components/layout/footer";
import { SiteHeader } from "@grade10/ui";
import type { ReactNode } from "react";
import { AUCTION_SITE_HEADER } from "../auction-lot-details-content";
import { AUCTION_FOOTER } from "../store-content";
import { BUYER } from "./ticketing-words";

/** Who the site header shows: a guest sees Sign In, a buyer their account. */
export type TicketingSession = "signed-out" | "signed-in" | "pending";

/**
 * A ticketing page as the site mounts it: the site header with Shows
 * current, the page, and the footer.
 */
export function TicketingSite({
  session,
  children,
}: {
  session: TicketingSession;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <SiteHeader
        {...AUCTION_SITE_HEADER}
        accountEmail={session === "signed-in" ? BUYER.email : undefined}
        navItems={AUCTION_SITE_HEADER.navItems.map((item) => ({
          ...item,
          current: item.href === "/shows",
        }))}
        session={session}
      />
      <main className="w-full flex-1">{children}</main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}
