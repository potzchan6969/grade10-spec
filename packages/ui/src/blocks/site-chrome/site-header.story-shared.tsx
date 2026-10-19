import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { getMessages } from "@grade10/i18n";
import type { StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  SiteHeader,
  type SiteHeaderProps,
  type SiteHeaderSession,
} from "./site-header";

const { auctionRecord, chrome, common, locale } = getMessages("grade10", "en");

/** TBC — provisional docs host for collector Help. Keep in sync with Nav
 * `HELP_HREF` and preview chrome. */
const HELP_HREF = "https://grade10.mintlify.io/";

export const LOCALES = [
  { value: "en", label: locale.en },
  { value: "zh-Hant", label: locale["zh-Hant"] },
  { value: "zh-Hans", label: locale["zh-Hans"] },
];

/** Auction-first primary nav: no Store, no Store Locator (shop not open yet), no Grade. Help after Auction. */
export const AUCTION_NAV_ITEMS = [
  { label: "Auction", href: "#auction", current: true },
  { label: "Help", href: HELP_HREF, external: true },
];

export const COPY = {
  locale: locale.en,
  account: chrome.accountLabel,
  cart: chrome.cartLabel,
  search: chrome.searchLabel,
  signIn: chrome.signIn,
  menu: chrome.menu,
  menuTitle: chrome.menuTitle,
  language: chrome.language,
  accountMenuLabel: chrome.accountMenuLabel,
  profile: chrome.profile,
  myOrders: chrome.myOrders,
  myAuctions: auctionRecord.title,
  membership: chrome.membership,
  signOut: common.signOut,
};

/** Signed-in address shown above the account menu items. */
export const ACCOUNT_EMAIL = "collector@example.com";

export const GRADE10_LOGO = <G10LogoMono className="h-5 w-auto @4xl:h-7" />;

export const SITE_HEADER_BASE_ARGS = {
  copy: COPY,
  accountEmail: ACCOUNT_EMAIL,
  promo: null,
  logo: GRADE10_LOGO,
  logoHref: "/",
  utilityLinks: [] as SiteHeaderProps["utilityLinks"],
  navItems: AUCTION_NAV_ITEMS,
  locales: LOCALES,
  locale: "en",
} satisfies Partial<SiteHeaderProps>;

const SESSION_EVENT = "site-header-story:session";

/**
 * The header with its session held in state, so a play function can re-render
 * the same tree with `switchSession` the way an application does when its
 * session answers.
 */
export function SessionSwitch(props: SiteHeaderProps) {
  const [session, setSession] = useState(props.session);
  useEffect(() => setSession(props.session), [props.session]);
  useEffect(() => {
    const onSession = (event: Event) =>
      setSession((event as CustomEvent<SiteHeaderSession>).detail);
    window.addEventListener(SESSION_EVENT, onSession);
    return () => window.removeEventListener(SESSION_EVENT, onSession);
  }, []);
  return <SiteHeader {...props} session={session} />;
}

function switchSession(session: SiteHeaderSession) {
  window.dispatchEvent(new CustomEvent(SESSION_EVENT, { detail: session }));
}

const ACCOUNT_ENTRY_NAMES = ["Account", "Sign In"];

function controlBoxes(header: HTMLElement) {
  return [...header.querySelectorAll<HTMLElement>("button, a")]
    .map((control) => ({
      name: control.getAttribute("aria-label") ?? control.textContent,
      box: control.getBoundingClientRect().toJSON(),
    }))
    .filter(({ name }) => !ACCOUNT_ENTRY_NAMES.includes(name ?? ""));
}

/**
 * Play for the pending session, wide or `compact` at 375px. Needs `onCartClick`
 * and the story's other handlers as spies, and `SessionSwitch` as the render.
 * It ends on the pending header again, because the manual's cards embed the
 * story in story mode, which runs this play.
 */
export const pendingSessionPlay =
  (compact: boolean): NonNullable<StoryObj<typeof SiteHeader>["play"]> =>
  async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const header =
      canvasElement.querySelector<HTMLElement>('[data-slot="nav"]');
    const controls = canvasElement.querySelector<HTMLElement>(
      '[data-slot="nav-controls"]',
    );
    const skeleton = canvasElement.querySelector<HTMLElement>(
      '[data-slot="skeleton"]',
    );
    if (header === null || controls === null || skeleton === null) {
      throw new Error("A pending SiteHeader must render a skeleton in its nav");
    }

    await step(
      "shared-ui-site-chrome-SC-45 - The placeholder holds the account entry's place",
      async () => {
        const cart = canvas.getByRole("button", { name: "Cart" });
        expect(skeleton.parentElement).toBe(controls);
        expect(skeleton.nextElementSibling).toContainElement(cart);
        expect(canvas.queryByRole("button", { name: "Sign In" })).toBeNull();
        expect(canvas.queryByRole("button", { name: "Account" })).toBeNull();
        expect(canvas.queryByRole("menu")).toBeNull();
        if (compact) {
          expect(canvas.getByRole("button", { name: "Menu" })).toBeVisible();
          expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
        } else {
          expect(canvas.getByRole("link", { name: "Auction" })).toBeVisible();
          expect(canvas.getByRole("button", { name: "English" })).toBeVisible();
        }
      },
    );

    await step(
      "shared-ui-site-chrome-SC-48 - The placeholder is silent to assistive technology",
      async () => {
        expect(canvas.queryByRole("status")).toBeNull();
        expect(canvas.queryByRole("status", { name: "Loading" })).toBeNull();
        expect(
          [...canvasElement.querySelectorAll('[aria-busy="true"]')].filter(
            (node) => node.closest('[aria-hidden="true"]') === null,
          ),
        ).toEqual([]);
        expect(skeleton).toHaveAttribute("aria-hidden", "true");
      },
    );

    await step(
      "shared-ui-site-chrome-SC-46 - The placeholder cannot be pressed or focused",
      async () => {
        const doc = canvasElement.ownerDocument;
        const cart = canvas.getByRole("button", { name: "Cart" });
        expect(skeleton).not.toHaveAttribute("tabindex");
        await userEvent.click(skeleton);
        const stops = header.querySelectorAll("button, a").length;
        for (let pass = 0; pass < stops && doc.activeElement !== cart; pass++) {
          await userEvent.tab();
          expect(skeleton.contains(doc.activeElement)).toBe(false);
        }
        expect(cart).toHaveFocus();
        for (const handler of Object.values(args)) {
          if (typeof handler === "function" && "mock" in handler) {
            expect(handler).not.toHaveBeenCalled();
          }
        }
      },
    );

    await step(
      "shared-ui-site-chrome-SC-47 - The placeholder takes the account icon's footprint",
      async () => {
        const placeholder = skeleton.getBoundingClientRect();
        expect([placeholder.width, placeholder.height]).toEqual([40, 40]);
        expect(
          Number.parseFloat(getComputedStyle(skeleton).borderTopLeftRadius),
        ).toBeGreaterThanOrEqual(20);
        const others = controlBoxes(header);

        switchSession("signed-in");
        const account = await canvas.findByRole("button", { name: "Account" });

        const icon = account.getBoundingClientRect();
        expect([icon.x, icon.y, icon.width, icon.height]).toEqual([
          placeholder.x,
          placeholder.y,
          placeholder.width,
          placeholder.height,
        ]);
        expect(controlBoxes(header)).toEqual(others);

        switchSession("pending");
        await waitFor(() =>
          expect(
            canvasElement.querySelector('[data-slot="skeleton"]'),
          ).not.toBeNull(),
        );
        (
          canvasElement.ownerDocument.activeElement as HTMLElement | null
        )?.blur();
      },
    );
  };
