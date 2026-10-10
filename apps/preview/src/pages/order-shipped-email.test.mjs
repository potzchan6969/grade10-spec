import { createElement } from "react";
import { render } from "react-email";
import { describe, expect, it } from "vitest";
import OrderShippedEmail from "../../../emails/emails/auction/order/order-shipped";

const ORDER_URL = "https://grade10.test/orders/winner-4092";
const TRACKING_URL = "https://harborparcel.test/track/HP-4092-713";
const TRACKING_NUMBER = "HP-4092-713";

async function renderShipment(trackingUrl) {
  return render(
    createElement(OrderShippedEmail, {
      brandName: "Grade10",
      lotTitle: "1999 Pokémon Base Set Charizard PSA 9",
      orderUrl: ORDER_URL,
      trackingUrl,
      primaryImageUrl: null,
      carrierName: "Harbor Parcel",
      trackingNumber: TRACKING_NUMBER,
      shippedAt: "2026-10-09 14:30 HKT",
      deliveryAddress: "41 Copper Lane, Unit 3, Hong Kong",
    }),
  );
}

function anchorsFrom(markup) {
  return Array.from(
    markup.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g),
    ([, href, label]) => ({ href: href ?? "", label: label ?? "" }),
  );
}

describe("OrderShippedEmail", () => {
  it.each([
    ["missing tracker URL", undefined],
    ["whitespace tracker URL", " \t "],
  ])(
    "uses View order when the %s is not usable",
    async (_case, trackingUrl) => {
      const markup = await renderShipment(trackingUrl);

      expect(
        (markup.match(/Harbor Parcel: HP-4092-713/g) ?? []).length,
      ).toBeGreaterThanOrEqual(2);
      expect(markup).toContain("41 Copper Lane, Unit 3, Hong Kong");
      expect(markup).toContain("Shipped 2026-10-09 14:30 HKT");

      const anchors = anchorsFrom(markup);
      const viewOrder = anchors.find((anchor) =>
        anchor.label.includes("View order"),
      );
      const destinations = anchors.map(({ href }) =>
        href.replaceAll("&amp;", "&"),
      );

      expect(viewOrder?.href).toContain(ORDER_URL);
      expect(anchors.some(({ label }) => label.includes(TRACKING_NUMBER))).toBe(
        false,
      );
      expect(
        destinations.every(
          (href) =>
            href.startsWith(ORDER_URL) ||
            href.startsWith("https://grade10.com"),
        ),
      ).toBe(true);
    },
  );

  it("uses the recorded tracker as primary and Winner Order as secondary", async () => {
    const markup = await renderShipment(TRACKING_URL);
    const anchors = anchorsFrom(markup);
    const trackShipment = anchors.find((anchor) =>
      anchor.label.includes("Track shipment"),
    );
    const viewOrder = anchors.find((anchor) =>
      anchor.label.includes("View order"),
    );

    expect(trackShipment?.href).toContain(TRACKING_URL);
    expect(viewOrder?.href).toContain(ORDER_URL);
    expect(markup).toContain("Harbor Parcel: HP-4092-713");
  });
});
