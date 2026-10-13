import { IconProvider } from "@grade10/design-system/components/providers/icon-provider";
import type { Decorator, Preview } from "@storybook/react-vite";
import "../src/bones/registry";
import "./tailwind.css";

Element.prototype.scrollIntoView = () => {};
const nativeFocus = HTMLElement.prototype.focus;
HTMLElement.prototype.focus = function focus(options?: FocusOptions) {
  nativeFocus.call(this, { ...options, preventScroll: true });
};

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
      // Titles A to Z, each file's stories in the order it declares them. The
      // workbench (`pnpm storybook`) orders by the manual instead.
      storySort: (a, b) =>
        a.title === b.title
          ? 0
          : a.title.localeCompare(b.title, undefined, { numeric: true }),
    },
    // 'todo' - show a11y violations in the test UI only
    // 'error' - fail CI on a11y violations
    // 'off' - skip a11y checks entirely
    // Colour contrast waits on the designer's palette decision, so that one
    // rule is off; every other rule fails the run.
    a11y: {
      test: "error",
      config: { rules: [{ id: "color-contrast", enabled: false }] },
    },
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
