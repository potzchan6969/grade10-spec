/** The sidebar's words, shared by the check and the coverage report. */
export const START_HERE = "Start Here";
/** A docs entry the manager opens as the workbench's dashboard page. */
export const VERIFICATION_DASHBOARD = "Dashboard";
/** Every MDX page there is, by file: the guide, then the dashboard. */
export const DOCS_PAGES = {
  "apps/preview/src/start-here.mdx": START_HERE,
  "apps/preview/src/ui-verification/dashboard.mdx": VERIFICATION_DASHBOARD,
};
export const DESIGN_SYSTEM = "Design System";
export const KINDS = ["Screens", "Prototypes", "Parts", "Blocks"];
/** A domain's own folder, before its features: journeys walked across them. */
export const FLOWS = "Flows";
/** Where a domain slug is not its Title Case words. */
const ACRONYMS = { kyc: "KYC" };

export const titleCase = (slug) =>
  ACRONYMS[slug] ??
  slug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
