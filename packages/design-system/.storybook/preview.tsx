import type { Decorator, Preview } from "@storybook/react-vite";
import "./tailwind.css";

/* Toolbar-driven theming: toggle the two orthogonal class dimensions
 * (color theme + light/dark) directly on the preview <html>, mirroring the
 * runtime CSS contract. No providers needed — primitives just read the vars. */
const withTheme: Decorator = (Story, context) => {
  const { colorTheme, mode } = context.globals;
  const root = document.documentElement;
  root.classList.remove("theme-default", "theme-acetrader");
  root.classList.add(`theme-${colorTheme}`);
  root.classList.toggle("dark", mode === "dark");
  return <Story />;
};

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: { disable: true }, // body bg comes from the theme tokens
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  initialGlobals: {
    colorTheme: "default",
    mode: "light",
  },
  globalTypes: {
    colorTheme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "default", title: "Default" },
          { value: "acetrader", title: "AceTrader" },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      description: "Light / dark",
      toolbar: {
        title: "Mode",
        icon: "contrast",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
