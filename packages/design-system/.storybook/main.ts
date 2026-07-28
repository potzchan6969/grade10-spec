import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // No vite.config.ts in this package, so add the Tailwind v4 plugin here.
  viteFinal: async (config) => {
    config.plugins = config.plugins ?? [];
    config.plugins.push(tailwindcss());
    return config;
  },
};

export default config;
