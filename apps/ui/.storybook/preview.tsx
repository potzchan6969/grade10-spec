import type { Preview } from "@storybook/react-vite";
import type { ReactNode } from "react";

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

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story, context) => (
      <MotionBoundary paused={context.parameters.pauseMotion === true}>
        <Story />
      </MotionBoundary>
    ),
  ],
};

export default preview;
