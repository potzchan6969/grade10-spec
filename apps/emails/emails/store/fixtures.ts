/**
 * The order every Shopify letter preview is written over: order `#1042` for
 * two trading cards shipped to Hong Kong, one booster pack of it refunded in
 * part.
 *
 * Money is minor units, as the shop carries it; the letters print it through
 * `format.ts`. The order id and token are samples: the link has the shape the
 * order page answers to.
 */

const orderId = "6f1c2e7a-3b8d-4c9e-9a1f-2d5b7e8c4a10";
const orderToken = "8f2c1a7e9d4b6035";
const image = "/static/product.fixture.png";

export const storeOrder = {
  name: "#1042",
  orderUrl: `https://grade10.com/orders/${orderId}#${orderToken}`,
  checkoutUrl: "https://grade10.com/checkouts/1d2e3f4a5b6c7d8e",
  paymentUrl: "https://grade10.com/checkouts/1d2e3f4a5b6c7d8e/payment",
  customMessage: "我們為你保留了這批卡，請於七日內完成付款。",
  /** `amountMinor` is the line total, for every quantity on the line. */
  lines: [
    {
      title: "1997 Pocket Monsters Checklist Carddass",
      imageUrl: image,
      quantity: 1,
      refundedQuantity: 0,
      amountMinor: 240000,
    },
    {
      title: "1997 Pocket Monsters Carddass Booster Pack",
      imageUrl: image,
      quantity: 2,
      refundedQuantity: 1,
      amountMinor: 36000,
    },
  ],
  subtotalMinor: 276000,
  discountMinor: 10000,
  shippingMinor: 6000,
  totalMinor: 272000,
  refundMinor: 18000,
  address: [
    "Chan Tai Man",
    "Flat 12B, 8 Tai Po Road",
    "Sham Shui Po",
    "Hong Kong",
  ],
  tracking: {
    company: "SF Express",
    number: "SF1234567890",
    url: "https://www.sf-express.com/hk/tc/dynamic_function/waybill/#search/bill-number/SF1234567890",
  },
};
