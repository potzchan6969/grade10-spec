import type { Decorator, Preview } from "@storybook/react-vite";
import { IconProvider } from "../src/components/providers/icon-provider";
import "./tailwind.css";

/* Toolbar-driven color theme on the preview <html>. Light is the only mode —
 * the design system does not ship a dark palette. */
const withTheme: Decorator = (Story, context) => {
  const { colorTheme } = context.globals;
  const root = document.documentElement;
  root.classList.remove("theme-default", "theme-grade10", "dark");
  root.classList.add(`theme-${colorTheme}`);
  return <Story />;
};

const withIcons: Decorator = (Story) => (
  <IconProvider>
    <Story />
  </IconProvider>
);

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: { disable: true }, // body bg comes from the theme tokens
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        method: "alphabetical",
        order: ["Pages", "Components"],
      },
    },
    // 'todo' - show a11y violations in the test UI only
    // 'error' - fail CI on a11y violations
    // 'off' - skip a11y checks entirely
    a11y: { test: "todo" },
  },
  initialGlobals: {
    colorTheme: "grade10",
  },
  globalTypes: {
    colorTheme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "default", title: "Default" },
          { value: "grade10", title: "Grade10" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme, withIcons],
};

export default preview;
