import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // No vite.config.ts in this package, so add the Tailwind v4 plugin here.
  viteFinal: async (config) => {
    config.plugins = config.plugins ?? [];
    config.plugins.push(tailwindcss());
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@grade10/ui": join(packageRoot, "src"),
        },
      },
    });
  },
};

export default config;
