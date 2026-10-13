import type { BookingQuestion } from "./types";

const GRADING_QUESTIONS: readonly BookingQuestion[] = [
  {
    key: "quantity",
    label: "Estimated Quantity",
    kind: "select",
    options: ["1–5 cards", "6–20 cards", "21+ cards"],
    required: true,
  },
  {
    key: "company",
    label: "Preferred Grading Company",
    kind: "radio",
    options: ["PSA", "Beckett (BGS)", "CGC", "Undecided / Need Advice"],
    required: true,
  },
  {
    key: "value",
    label: "Estimated Total Value (HKD)",
    kind: "number",
    required: false,
    placeholder: "10,000",
    prefix: "$",
    hint: "For insurance reference",
  },
  {
    key: "notes",
    label: "Additional Notes",
    kind: "long_text",
    required: false,
    placeholder:
      "Any specific cards or requests you’d like us to know in advance?",
  },
];

const VAULT_DROP_OFF_QUESTIONS: readonly BookingQuestion[] = [
  {
    key: "itemType",
    label: "Item Type",
    kind: "checkboxes",
    options: [
      "Graded Slabs (PSA / BGS / CGC)",
      "Ungraded / Raw Cards",
      "Sealed Boxes / Booster Packs",
      "Others",
    ],
    required: true,
  },
  {
    key: "count",
    label: "Estimated Item Count",
    kind: "select",
    options: ["1–5 items", "6–15 items", "16+ items"],
    required: true,
  },
  {
    key: "value",
    label: "Estimated Total Vault Value (HKD)",
    kind: "number",
    required: true,
    placeholder: "50,000",
    prefix: "$",
    hint: "For initial coverage during intake",
  },
];

const CONSULTATION_QUESTIONS: readonly BookingQuestion[] = [
  {
    key: "topic",
    label: "Consultation Topic",
    kind: "select",
    options: [
      "Consignment / Listing items on Auction",
      "Private Sales & Buying Advice",
      "Vault Portfolio Review",
      "Other Enquiries",
    ],
    required: true,
  },
  {
    key: "details",
    label: "Details of Your Collection / Inquiry",
    kind: "long_text",
    required: true,
    placeholder:
      "Briefly describe the key items you’d like to consult on (e.g., 1997 Pokémon Carddass PSA 10, looking to consignment).",
  },
];

export { CONSULTATION_QUESTIONS, GRADING_QUESTIONS, VAULT_DROP_OFF_QUESTIONS };
