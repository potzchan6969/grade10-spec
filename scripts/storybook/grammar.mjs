/** The sidebar's words, shared by the check and the coverage report. */
export const START_HERE = "Start Here";
export const DESIGN_SYSTEM = "Design System";
export const KINDS = ["Screens", "Prototypes", "Parts", "Blocks"];
/** Where a domain slug is not its Title Case words. */
const ACRONYMS = { kyc: "KYC" };

export const titleCase = (slug) =>
  ACRONYMS[slug] ??
  slug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
