import type { Preview } from "@storybook/react-vite";
import basePreview from "../.storybook/preview";

/* Themes, frames, and decorators come from the base preview. Storybook reads
 * `storySort` from this file and does not follow a re-export, so the order is
 * restated here. Appointment follows the booking flow; every other group stays
 * alphabetical. Keep it in step with `../.storybook/preview.tsx`. */
const preview: Preview = {
  ...basePreview,
  parameters: {
    ...basePreview.parameters,
    options: {
      ...basePreview.parameters?.options,
      storySort: {
        method: "alphabetical",
        order: [
          "Pages",
          ["Appointment", ["Book Visit", "Confirmation", "Appointments"]],
          "*",
          "Components",
        ],
      },
    },
  },
};

export default preview;
