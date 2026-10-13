export const LOAN_AND_MONEY_MANUAL_PATH = "vault/loan-and-money";

/** Draft words for the loan and its money, as the collector reads them. */
export const LOAN_COPY = {
  item: "1999 Charizard",
  meta: "Loan · Reference K7HQ4R",
  offer: {
    title: "Our offer",
    description: "Open until 12 October, 18:00 HKT.",
    rowsLabel: "The offer’s figures",
    lead: "HK$8,000.00 over 30 days at 6% for the term.",
    rows: [
      { label: "Loan", value: "HK$8,000.00" },
      { label: "Interest for the term", value: "HK$480.00" },
      { label: "Late day cost", value: "HK$100.00 per started day" },
    ],
    total: "Total to repay: HK$8,480.00.",
    accept: "Accept this offer",
    decline: "Decline this offer",
  },
  accepted: {
    title: "Accepted",
    lead: "You accepted this offer on 13 October. We confirm the payout when you bring the item to the shop.",
    rows: [
      { label: "Loan", value: "HK$8,000.00" },
      { label: "Total to repay", value: "HK$8,480.00" },
      { label: "Term", value: "30 days from the day the loan is paid out" },
    ],
  },
  owed: {
    title: "What is owed",
    rowsLabel: "The balance",
    rows: [
      { label: "Outstanding", value: "HK$8,480.00 of HK$8,480.00" },
      { label: "Repaid so far", value: "HK$0.00" },
      { label: "Due date", value: "1 December 2026" },
    ],
    book: "Book a visit to repay and collect",
  },
  reminders: {
    title: "Reminders",
    free: "A reminder costs nothing.",
    items: [
      { id: "week", content: "7 days before the due date" },
      { id: "day", content: "1 day before the due date" },
      { id: "overdue", content: "Every 7 days once overdue" },
    ],
  },
  howToPay: {
    title: "How to pay",
    lead: "Use your case reference as the transfer reference, so we can match the payment to your case.",
    rowsLabel: "Where to send the money",
    rows: [
      { label: "FPS ID", value: "[fpsId]" },
      { label: "Account name", value: "[bankAccount]" },
      { label: "Reference", value: "K7HQ4R" },
    ],
    counter: "Or pay by card or cash at the shop.",
    daily: "After the due date, HK$100.00 is added for each day late.",
  },
  repayment: {
    title: "Repayments",
    lead: "Outstanding HK$4,480.00 of HK$8,480.00.",
    rowsLabel: "Each repayment",
    rows: [
      {
        label: "3 November 2026",
        value: "HK$4,000.00 by bank transfer · balance after HK$4,480.00",
      },
    ],
    note: "Each repayment is shown here with the balance after it.",
  },
  settled: {
    title: "Loan settled",
    lead: "Repaid in full on 10 November 2026. Your item is ready to collect.",
    rowsLabel: "The loan",
    rows: [
      { label: "Outstanding", value: "Nothing" },
      { label: "Custody", value: "Nothing outstanding" },
    ],
    pickup: "Book a pickup visit",
    askBack: "Ask for it back",
  },
};
