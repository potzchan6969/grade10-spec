import type {
  OrderValueLines,
  OrderValueLinesCopy,
  PartyAddress,
} from "./types";

/** Shared between InvoicePdf's and ReceiptPdf's stories — each `*Copy` still carries its own `orderValue: orderValueCopy`. */
const orderValueCopy: OrderValueLinesCopy = {
  winningBid: "Winning Bid",
  buyersPremium: "Buyer’s Premium",
  shippingAndHandling: "Shipping & Handling",
  insurance: "Insurance",
  taxLine: "Tax",
  subtotal: "Subtotal",
  paymentProcessingFee: "Payment Processing Fee",
  orderTotal: "Order Total",
};

const orderValue: OrderValueLines = {
  lot: "2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10",
  winningBid: "2,500.00",
  buyersPremium: "500.00",
  shippingAndHandling: "80.00",
  insurance: "40.00",
  subtotal: "3,120.00",
  paymentProcessingFee: "112.25",
  orderTotal: "3,232.25",
};

const billToAddress: PartyAddress = {
  fullName: "Alexandra Tran",
  companyName: "Tran Collectibles Ltd.",
  addressLine1: "Flat A, 21/F, One Harbour Square",
  addressLine2: "181 Java Road",
  city: "North Point",
  state: "Hong Kong Island",
  postalCode: "999077",
  country: "Hong Kong SAR",
  phone: "+852 9123 4567",
};

const shipToAddress: PartyAddress = {
  fullName: "Alexandra Tran",
  addressLine1: "Flat A, 21/F, One Harbour Square",
  city: "North Point",
  postalCode: "999077",
  country: "Hong Kong SAR",
  phone: "+852 9123 4567",
};

/** Reads one order-value section's lot heading, order-value and summary rows in DOM order — scoped to `pdf-order-value-section`, apart from a receipt's payment breakdown. */
function readRows(canvasElement: HTMLElement) {
  const section = canvasElement.querySelector(
    '[data-slot="pdf-order-value-section"]',
  );
  const nodes = (section ?? canvasElement).querySelectorAll(
    '[data-slot="pdf-lot-heading"], [data-slot="pdf-value-row"], [data-slot="pdf-summary-row"]',
  );
  return Array.from(nodes).map((node) => node.textContent ?? "");
}

/** Reads a receipt's four payment-breakdown rows in DOM order — scoped to `pdf-payment-breakdown`, apart from the order-value summary above it. */
function readBreakdownRows(canvasElement: HTMLElement) {
  const nodes = canvasElement.querySelectorAll(
    '[data-slot="pdf-payment-breakdown"] [data-slot="pdf-summary-row"]',
  );
  return Array.from(nodes).map((node) => node.textContent ?? "");
}

/** Reads one party block's address lines in DOM order. */
function readAddressLines(partyBlock: Element) {
  return Array.from(
    partyBlock.querySelectorAll('[data-slot="pdf-address-line"]'),
  ).map((node) => node.textContent ?? "");
}

export {
  billToAddress,
  orderValue,
  orderValueCopy,
  readAddressLines,
  readBreakdownRows,
  readRows,
  shipToAddress,
};
