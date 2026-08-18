import type { Decorator, Preview } from "@storybook/react-vite";
import type { ReactNode } from "react";
import "@grade10/ui/bones/registry";
import "./tailwind.css";

function MotionBoundary({
  children,
  paused,
}: {
  children: ReactNode;
  paused: boolean;
}) {
  return (
    <div data-storybook-pause-motion={paused || undefined}>
      {paused ? (
        <style>{`
          [data-storybook-pause-motion] *, [data-storybook-pause-motion] *::before, [data-storybook-pause-motion] *::after {
            animation-delay: 0s !important;
            animation-play-state: paused !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `}</style>
      ) : null}
      {children}
    </div>
  );
}

/* Toolbar-driven theming, identical to both package workbenches: toggle the
 * two orthogonal class dimensions on the preview <html>. An assembly must
 * re-theme exactly as its parts do, so the mechanism has to match. */
const withTheme: Decorator = (Story, context) => {
  const { colorTheme, mode } = context.globals;
  const root = document.documentElement;
  root.classList.remove("theme-default", "theme-grade10");
  root.classList.add(`theme-${colorTheme}`);
  root.classList.toggle("dark", mode === "dark");
  return <Story />;
};

const preview: Preview = {
  parameters: {
    /* Matches both package workbenches, so a primitive or compound component
     * frames here exactly as it does in its own. Page stories declare
     * `layout: "fullscreen"` in their own meta. */
    layout: "centered",
    backgrounds: { disable: true }, // body bg comes from the theme tokens
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    /* Read top-down: the assemblies this workbench owns, then the compound
     * components they are built from, then the primitives underneath. */
    options: {
      storySort: {
        method: "alphabetical",
        order: ["Pages", "*", "Components"],
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  initialGlobals: {
    colorTheme: "grade10",
    mode: "dark",
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
  decorators: [
    withTheme,
    (Story, context) => (
      <MotionBoundary paused={context.parameters.pauseMotion === true}>
        <Story />
      </MotionBoundary>
    ),
  ],
};

export default preview;
