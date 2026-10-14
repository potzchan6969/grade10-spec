import { Footer } from "@grade10/design-system/components/layout/footer";
import { Toast } from "@grade10/design-system/components/overlays/toast";
import { OrderDetails, SiteHeader } from "@grade10/ui";
import { useEffect } from "react";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import { navigateToStory } from "../../workbench-story-nav";
import { type OrderAsk, showOrderAskToast } from "../order-ask-toast";
import { RECEIPT_NOTE } from "../order-confirmed-content";
import {
  ORDER_DETAILS_CONTENT,
  ORDER_DETAILS_READ_COPY,
} from "./order-details-content";
import { OrderDetailsNotFound } from "./order-details-states";

/**
 * The public order page an order's private link opens: the order, with no
 * account facts — no points, wallet or account details. Signed out, the
 * placed-on line names the email the receipt went to and a persistent toast
 * offers sign-in — "add this order" on a guest order, "is this your order?"
 * on a member's; a signed-in view shows neither. A wrong secret or unknown
 * order gets the same not-found treatment as any order the collector cannot
 * see.
 */
function OrderLinkPage({
  ask,
  notFound = false,
  signedIn = false,
}: {
  /** What the persistent toast says, if anything. */
  ask?: OrderAsk;
  notFound?: boolean;
  /** A signed-in view: the account header, and no receipt note. */
  signedIn?: boolean;
}) {
  useEffect(() => {
    if (ask && !notFound) showOrderAskToast(ask);
  }, [ask, notFound]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader
        {...STORE_SITE_HEADER}
        session={signedIn ? "signed-in" : "signed-out"}
      />
      <main
        className={
          notFound
            ? "flex w-full flex-1 items-center justify-center"
            : "flex w-full flex-1 flex-col items-center"
        }
      >
        {notFound ? (
          <OrderDetailsNotFound
            breadcrumbs={null}
            description={ORDER_DETAILS_READ_COPY.notFoundLinkDescription}
            onBack={() =>
              navigateToStory("store-home-screens-store-home--default")
            }
            backLabel={ORDER_DETAILS_READ_COPY.backToHome}
            title={ORDER_DETAILS_READ_COPY.notFoundTitle}
          />
        ) : (
          <OrderDetails
            copy={ORDER_DETAILS_CONTENT.copy}
            delivery={ORDER_DETAILS_CONTENT.delivery}
            lines={ORDER_DETAILS_CONTENT.lines}
            needHelp={ORDER_DETAILS_CONTENT.needHelp}
            orderId={ORDER_DETAILS_CONTENT.orderId}
            payment={ORDER_DETAILS_CONTENT.payment}
            placedOn={ORDER_DETAILS_CONTENT.placedOn}
            placedOnDateTime={ORDER_DETAILS_CONTENT.placedOnDateTime}
            placedOnNote={ask && !signedIn ? RECEIPT_NOTE : undefined}
            shippingAddress={ORDER_DETAILS_CONTENT.shippingAddress}
            status={ORDER_DETAILS_CONTENT.status}
            summary={ORDER_DETAILS_CONTENT.summary}
            onTrackOrder={() => undefined}
          />
        )}
      </main>
      <Footer {...STORE_FOOTER} />
      <Toast position="bottom-right" />
    </div>
  );
}

export { OrderLinkPage };
