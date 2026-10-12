import { IconProvider } from "@grade10/design-system/components/providers/icon-provider";
import {
  brands,
  defaultLocaleOf,
  getMessages,
  isLocale,
  localesOf,
  type Brand,
} from "@grade10/i18n";
import type { Decorator, Preview } from "@storybook/react-vite";
import { type ReactNode, useEffect } from "react";
import "@grade10/ui/bones/registry";
import { interceptWorkbenchStoryLinks } from "../src/pages/workbench-story-nav";
import "./tailwind.css";

Element.prototype.scrollIntoView = () => {};
const nativeFocus = HTMLElement.prototype.focus;
HTMLElement.prototype.focus = function focus(options?: FocusOptions) {
  nativeFocus.call(this, { ...options, preventScroll: true });
};

// Storybook's preview module must export its configuration, not component APIs.
/* eslint-disable react-refresh/only-export-components */
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

function WorkbenchStoryLinkBridge({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.addEventListener("click", interceptWorkbenchStoryLinks);
    return () => {
      document.removeEventListener("click", interceptWorkbenchStoryLinks);
    };
  }, []);
  return children;
}

/* Toolbar-driven color theme, identical to both package workbenches. Light is
 * the only mode — the design system does not ship a dark palette. An assembly
 * must re-theme exactly as its parts do, so the mechanism has to match. */
const withTheme: Decorator = (Story, context) => {
  const { colorTheme } = context.globals;
  const root = document.documentElement;
  root.classList.remove("theme-default", "theme-grade10", "dark");
  root.classList.add(`theme-${colorTheme}`);
  return <Story />;
};

const grade10LocaleNames = getMessages("grade10", "en").locale;
const grade10LocaleItems = localesOf("grade10").map((value) => ({
  value,
  title: grade10LocaleNames[value],
}));

function resolveStoryBrand(value: unknown): Brand {
  return typeof value === "string" && Object.hasOwn(brands, value)
    ? (value as Brand)
    : "grade10";
}

function StoryLocaleDocument({
  enabled,
  locale,
  children,
}: {
  enabled: boolean;
  locale?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    if (enabled && locale) {
      root.lang = locale;
      root.setAttribute("data-ui-verification-locale", locale);
    } else {
      root.lang = "en";
      root.removeAttribute("data-ui-verification-locale");
    }
  }, [enabled, locale]);

  return children;
}

const withLocale: Decorator = (Story, context) => {
  if (context.parameters.localeAware !== true) {
    return (
      <StoryLocaleDocument enabled={false}>
        <Story />
      </StoryLocaleDocument>
    );
  }

  const brand = resolveStoryBrand(
    context.parameters.localeBrand ?? context.globals.brand,
  );
  const requestedLocale = context.globals.locale;
  const locale =
    typeof requestedLocale === "string" && isLocale(brand, requestedLocale)
      ? requestedLocale
      : defaultLocaleOf(brand);
  return (
    <StoryLocaleDocument enabled locale={locale}>
      <Story args={{ ...context.args, brand, locale }} />
    </StoryLocaleDocument>
  );
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
    options: {
      // Titles A to Z, each file's stories in the order it declares them. The
      // workbench (`pnpm storybook`) orders by the manual instead.
      storySort: (a, b) =>
        a.title === b.title
          ? 0
          : a.title.localeCompare(b.title, undefined, { numeric: true }),
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "error",
      // Colour contrast waits on the designer's palette decision, so that
      // one rule is off; every other rule fails the run.
      config: { rules: [{ id: "color-contrast", enabled: false }] },
    },
  },
  initialGlobals: {
    colorTheme: "grade10",
    brand: "grade10",
    locale: "en",
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
    locale: {
      description: "Content language for locale-aware stories",
      toolbar: {
        title: "Locale",
        icon: "globe",
        items: grade10LocaleItems,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    withTheme,
    /* Only stories that opt in with `parameters.localeAware: true` receive
     * the active brand and a locale supported by that brand. Other stories
     * must opt in and render localized content before claiming locale support. */
    withLocale,
    (Story, context) => (
      <IconProvider>
        <MotionBoundary paused={context.parameters.pauseMotion === true}>
          <WorkbenchStoryLinkBridge>
            <Story />
          </WorkbenchStoryLinkBridge>
        </MotionBoundary>
      </IconProvider>
    ),
  ],
};

export default preview;
