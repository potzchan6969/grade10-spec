import type { Preview } from "@storybook/react-vite";
import basePreview from "../.storybook/preview";
import { ManualDocsContainer } from "./manual-link";

/* Themes, frames, and decorators come from the base preview. The sidebar reads
 * like the manual (`docs/governance/storybook.md`): Start Here, the manual's
 * domains in `docs/prds/manual.yaml` order, then the design system; inside a
 * feature, its screens, then Flows, Prototypes, Parts and Blocks.
 *
 * Storybook evaluates this comparator on its own, so it imports nothing and
 * carries no types; `pnpm storybook:check` holds `roots` to the manual. */
const preview: Preview = {
  ...basePreview,
  parameters: {
    ...basePreview.parameters,
    docs: { ...basePreview.parameters?.docs, container: ManualDocsContainer },
    options: {
      ...basePreview.parameters?.options,
      storySort: (a, b) => {
        const roots = [
          "Start Here",
          "Account",
          "Store",
          "Loyalty",
          "Auction",
          "Vault",
          "Grading",
          "Consignment",
          "Appointment",
          "Doc Sign",
          "Finance",
          "Site",
          "Analytics",
          "Auth",
          "Commerce",
          "Design System",
        ];
        const kinds = ["Flows", "Prototypes", "Parts", "Blocks"];
        const left = a.title.split("/");
        const right = b.title.split("/");
        const rank = (list, item) =>
          list.includes(item) ? list.indexOf(item) : list.length;
        if (left[0] !== right[0]) {
          const order = rank(roots, left[0]) - rank(roots, right[0]);
          return order || left[0].localeCompare(right[0]);
        }
        for (let i = 1; i < Math.max(left.length, right.length); i++) {
          if (left[i] === right[i]) continue;
          if (left[i] === undefined) return -1;
          if (right[i] === undefined) return 1;
          if (i === 2 && left[0] !== "Design System") {
            const order =
              kinds.indexOf(left[i]) + 1 - (kinds.indexOf(right[i]) + 1);
            if (order) return order;
          }
          return left[i].localeCompare(right[i], undefined, { numeric: true });
        }
        return 0;
      },
    },
  },
};

export default preview;
