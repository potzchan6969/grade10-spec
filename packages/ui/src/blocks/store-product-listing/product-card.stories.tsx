import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { PRODUCT_CARD_CART_COPY } from "./fixtures";
import { ProductCard } from "./product-card";

const IMAGE = new URL("./product-card.fixture.png", import.meta.url).href;

/** The words every tile renders the same, supplied once. */
const copy = PRODUCT_CARD_CART_COPY;

const defaults = {
  copy,
  imageSrc: IMAGE,
  imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  tags: ["Pokémon", "M4", "JP"],
  name: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  price: "HK$105",
  onClick: () => {},
  /** The listing's tile sells, so its stories wire the handler that draws the cart. */
  onCartQuantityChange: () => {},
};

const meta = {
  title: "Store/Product Listing/Blocks/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  args: defaults,
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const well: Decorator[] = [
  (Story) => (
    <div className="w-[260px]">
      <Story />
    </div>
  ),
];

/** Figma `soldOut=false` — available product at list price. */
export const Default: Story = {
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(growsOnHover(photo(canvasElement))).toBe(true);
    expect(canvas.queryByRole("button", { name: /wishlist/i })).toBeNull();
    expect(canvas.queryByText("SALE")).not.toBeInTheDocument();
    expect(canvas.queryByText("Pokémon")).toBeNull();
    expect(canvas.queryByText("M4")).toBeNull();
    expect(canvas.queryByText("JP")).toBeNull();
  },
};

/** Strikethrough original price and SALE badge when a discount is supplied. */
export const OnSale: Story = {
  args: { originalPrice: "HK$123" },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("SALE")).toBeInTheDocument();
    expect(canvas.getByText("HK$123")).toBeInTheDocument();
    expect(canvas.getByText("HK$105").className).toContain("text-success");
    expect(canvas.getByText("HK$105").className).toContain("font-medium");
  },
};

/** The tile's photo, inside its well. */
function photo(canvasElement: HTMLElement) {
  return canvasElement.querySelector(
    '[data-slot="product-card-image-well"] img',
  ) as HTMLImageElement;
}

/** The photo's own press target, which is no stop and names nothing. */
function photoTarget(canvasElement: HTMLElement) {
  return canvasElement.querySelector(
    '[data-slot="product-card-image"] > :first-child',
  ) as HTMLElement;
}

/** The name's own underline, as drawn. */
const underline = (element: HTMLElement) =>
  getComputedStyle(element).textDecorationLine;

/**
 * Whether a pointer over `element` underlines it: some style rule the page
 * holds, read with its nesting resolved, draws an underline under `:hover`
 * on a selector the element matches. The simulated pointer of a play test
 * does not set the browser's own hover state, so the rule is read instead.
 */
function underlinedOnHover(element: HTMLElement) {
  const visit = (rules: CSSRuleList, parent: string): boolean =>
    Array.from(rules).some((rule) => {
      if (rule instanceof CSSStyleRule) {
        const selector = parent
          ? rule.selectorText.replaceAll("&", parent)
          : rule.selectorText;
        if (
          selector.includes(":hover") &&
          rule.style.textDecorationLine === "underline" &&
          element.matches(selector.replaceAll(":hover", ""))
        ) {
          return true;
        }
        return visit(rule.cssRules, selector);
      }
      return "cssRules" in rule
        ? visit((rule as CSSGroupingRule).cssRules, parent)
        : false;
    });
  /* A sheet from another origin, such as a web font's, cannot be read. */
  const readable = (sheet: CSSStyleSheet) => {
    try {
      return sheet.cssRules;
    } catch {
      return null;
    }
  };
  return Array.from(document.styleSheets).some((sheet) => {
    const rules = readable(sheet);
    return rules != null && visit(rules, "");
  });
}

/** Whether the photo grows on hover: the transition that scales it is on. */
const growsOnHover = (img: HTMLImageElement) =>
  getComputedStyle(img).transitionProperty.includes("scale");

/**
 * Presses a link with a modifier key held, or none, and says whether the
 * press's default was prevented by then. The listener runs after the tile's
 * own handler, then stops the story's frame from following the link.
 */
async function pressLink(
  link: HTMLElement,
  modifier?: "Control" | "Meta" | "Shift" | "Alt",
) {
  let prevented: boolean | undefined;
  window.addEventListener(
    "click",
    (event) => {
      prevented = event.defaultPrevented;
      event.preventDefault();
    },
    { once: true },
  );
  /* One session, so the key held down is still down when the link is
     pressed. */
  const user = userEvent.setup();
  if (modifier) await user.keyboard(`{${modifier}>}`);
  await user.click(link);
  if (modifier) await user.keyboard(`{/${modifier}}`);
  return prevented;
}

/** Scenario: shared-ui-store-product-listing-SC-88 - A sold-out tile stays
 * inert where it sells. Figma `soldOut=true`: the SOLD OUT badge, no cart
 * action, and a tile given a callback, an address and a cart handler draws no
 * link and no button; pressing the name and the photo reports nothing, and
 * the dim photo takes no hover. */
export const SoldOut: Story = {
  args: {
    soldOut: true,
    href: "/store/products/abyss-eye-booster-box",
    onClick: fn(),
    onCartQuantityChange: fn(),
  },
  decorators: well,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(copy.soldOut)).toBeVisible();
    expect(canvas.queryAllByRole("button")).toHaveLength(0);
    expect(canvas.queryAllByRole("link")).toHaveLength(0);
    expect(canvasElement.querySelector("a")).toBeNull();
    await userEvent.click(canvas.getByText(defaults.name));
    await userEvent.click(photo(canvasElement));
    expect(args.onClick).not.toHaveBeenCalled();
    expect(getComputedStyle(photo(canvasElement)).opacity).toBe("0.5");
    expect(growsOnHover(photo(canvasElement))).toBe(false);
  },
};

/** Scenario: shared-ui-store-product-listing-SC-89 - No activation without a
 * callback or an address. The name and the photo report nothing and are no
 * control; the cart control is still there, and the name takes no underline
 * and no focus. */
export const Inert: Story = {
  args: { onClick: undefined, href: undefined, onCartQuantityChange: fn() },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByText(defaults.name);
    await userEvent.click(name);
    await userEvent.click(photo(canvasElement));
    expect(canvas.queryAllByRole("link")).toHaveLength(0);
    expect(
      canvas.queryAllByRole("button", { name: defaults.name }),
    ).toHaveLength(0);
    expect(canvas.getByRole("button", { name: copy.cart })).toBeInTheDocument();
    expect(underline(name)).toBe("none");
    expect(underlinedOnHover(name)).toBe(false);
    name.focus();
    expect(name).not.toHaveFocus();
  },
};

/** Scenario: shared-ui-store-product-listing-SC-100 - A tile given its
 * address alone is a link. The name is the one link named for the product,
 * to that address, and the photo's link carries the same address. */
export const AddressOnly: Story = {
  args: {
    onClick: undefined,
    href: "/store/products/abyss-eye-booster-box",
  },
  decorators: well,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [name] = canvas.getAllByRole("link", { name: defaults.name });
    expect(canvas.getAllByRole("link", { name: defaults.name })).toHaveLength(
      1,
    );
    expect(name).toHaveAttribute("href", args.href);
    expect(name).toHaveTextContent(defaults.name);
    expect(photoTarget(canvasElement)).toHaveAttribute("href", args.href);
  },
};

/** Scenario: shared-ui-store-product-listing-SC-98 - A tile has one stop to
 * open, on a tile that does not sell: Tab stops on the name alone, no cart
 * control is drawn, and Enter on the name reports once. */
export const NamedOnceNotSelling: Story = {
  args: { onClick: fn(), onCartQuantityChange: undefined },
  decorators: well,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole("button", { name: defaults.name });
    expect(
      canvasElement.querySelector('[data-slot="product-card-cart-control"]'),
    ).toBeNull();
    await userEvent.tab();
    expect(name).toHaveFocus();
    await userEvent.tab();
    expect(canvasElement.contains(document.activeElement)).toBe(false);
    name.focus();
    await userEvent.keyboard("{Enter}");
    expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** Figma `inCart=true` — cart control with the supplied count. */
export const InCart: Story = {
  args: { inCart: true, cartCount: "1" },
  decorators: well,
};

/** The rungs Figma draws, at the designed 260px width. */
export const States: Story = {
  render: (args) => (
    <div className="flex items-start gap-10">
      <div className="w-[260px]">
        <ProductCard {...args} />
      </div>
      <div className="w-[260px]">
        <ProductCard {...args} cartCount="1" inCart />
      </div>
      <div className="w-[260px]">
        <ProductCard {...args} originalPrice={undefined} soldOut />
      </div>
    </div>
  ),
};

/** Set annotation: quantity on the cart button when already in the cart. */
export const AddedToCart: Story = {
  args: { inCart: true, cartCount: "3" },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("×3")).toBeInTheDocument();
  },
};

/** Boneyard capture target — keep `loading` at Figma's 260px card width. */
export const BoneyardCapture: Story = {
  args: { loading: true, name: "", price: "" },
  decorators: well,
};

/**
 * Scenarios: shared-ui-store-product-listing-SC-87 - The product name
 * activates the tile; shared-ui-store-product-listing-SC-98 - A tile has one
 * stop to open; shared-ui-store-product-listing-SC-99 - The name shows that
 * it opens; shared-ui-store-product-listing-SC-51 - Keyboard reveals the cart
 * control. Tab stops on the cart control, shown when focused, then on the
 * name, and on nothing else in the tile; one control is named for the
 * product, and Enter then Space on it each report once. The name is
 * underlined on hover and on keyboard focus, never at rest.
 */
export const NamedOnce: Story = {
  decorators: well,
  args: { onCartQuantityChange: () => {}, onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole("button", { name: defaults.name });
    const cart = canvas.getByRole("button", { name: copy.cart });
    expect(canvas.getAllByRole("button", { name: defaults.name })).toHaveLength(
      1,
    );
    expect(underline(name)).toBe("none");

    await userEvent.tab();
    expect(cart).toHaveFocus();
    const control = cart.closest(".cart-control") as HTMLElement;
    await waitFor(() => expect(getComputedStyle(control).opacity).toBe("1"));
    await userEvent.tab();
    expect(name).toHaveFocus();
    expect(underline(name)).toBe("underline");
    await userEvent.tab();
    expect(canvasElement.contains(document.activeElement)).toBe(false);

    name.focus();
    await userEvent.keyboard("{Enter}");
    expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(" ");
    expect(args.onClick).toHaveBeenCalledTimes(2);

    name.blur();
    expect(underline(name)).toBe("none");
    expect(underlinedOnHover(name)).toBe(true);
  },
};

/**
 * Scenario: shared-ui-store-product-listing-SC-56 - The control stops at the
 * maximum. At the supplied ceiling the increment reports nothing and is
 * exposed as unavailable.
 */
export const AtCartMaximum: Story = {
  args: {
    inCart: true,
    cartCount: "2",
    maxCartQuantity: 2,
    onCartQuantityChange: fn(),
  },
  decorators: well,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: `2. ${copy.adjustQuantity}` }),
    );

    const increment = canvas.getByRole("button", {
      name: copy.increaseQuantity,
    });
    expect(increment).toBeDisabled();

    await userEvent.click(increment, { pointerEventsCheck: 0 });
    expect(args.onCartQuantityChange).not.toHaveBeenCalled();
  },
};

/**
 * Scenario: shared-ui-store-product-listing-SC-57 - Below the maximum the
 * control counts on.
 */
export const BelowCartMaximum: Story = {
  args: {
    inCart: true,
    cartCount: "1",
    maxCartQuantity: 2,
    onCartQuantityChange: fn(),
  },
  decorators: well,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: `1. ${copy.adjustQuantity}` }),
    );

    await userEvent.click(
      canvas.getByRole("button", { name: copy.increaseQuantity }),
    );
    expect(args.onCartQuantityChange).toHaveBeenCalledTimes(1);
    expect(args.onCartQuantityChange).toHaveBeenCalledWith(2);
  },
};

/**
 * Scenario: shared-ui-store-product-listing-SC-58 - No maximum supplied, so
 * the control keeps a ceiling of none.
 */
export const NoCartMaximum: Story = {
  args: {
    inCart: true,
    cartCount: "3",
    onCartQuantityChange: fn(),
  },
  decorators: well,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: `3. ${copy.adjustQuantity}` }),
    );

    const increment = canvas.getByRole("button", {
      name: copy.increaseQuantity,
    });
    expect(increment).toBeEnabled();

    await userEvent.click(increment);
    expect(args.onCartQuantityChange).toHaveBeenCalledTimes(1);
    expect(args.onCartQuantityChange).toHaveBeenCalledWith(4);
  },
};

/**
 * Scenario: shared-ui-store-product-listing-SC-59 - Decrement still works at
 * the maximum, so a shopper who reaches it can go back down.
 */
export const DecrementAtCartMaximum: Story = {
  args: {
    inCart: true,
    cartCount: "2",
    maxCartQuantity: 2,
    onCartQuantityChange: fn(),
  },
  decorators: well,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: `2. ${copy.adjustQuantity}` }),
    );

    await userEvent.click(
      canvas.getByRole("button", { name: copy.decreaseQuantity }),
    );
    expect(args.onCartQuantityChange).toHaveBeenCalledTimes(1);
    expect(args.onCartQuantityChange).toHaveBeenCalledWith(1);
  },
};

/**
 * Scenario: shared-ui-store-product-listing-SC-60 - A remaining count is
 * displayed as supplied, in the consumer's own words.
 */
export const RemainingCount: Story = {
  args: { remainingLabel: "Only 3 left" },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Only 3 left")).toHaveLength(1);
    expect(canvas.queryByText(/\d+ left/i)).toHaveTextContent("Only 3 left");
  },
};

/** A refused cart change: the control holds the cart's quantity and the tile
 * says why beneath it, still pressable. */
export const CartRefused: Story = {
  args: {
    inCart: true,
    cartCount: "2",
    cartFailed: "The cart could not be changed. Try again.",
  },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "The cart could not be changed. Try again.",
    );
    expect(
      canvas.getByRole("button", { name: `2. ${copy.adjustQuantity}` }),
    ).toBeEnabled();
  },
};

/**
 * Scenario: shared-ui-store-product-listing-SC-61 - No remaining count
 * supplied, so the card says nothing about what is left.
 */
export const NoRemainingCount: Story = {
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText(/left/i)).not.toBeInTheDocument();
  },
};

/**
 * Scenario: shared-ui-store-product-listing-SC-62 - A sold-out product says
 * nothing about what is left, because there is nothing left to run out of.
 */
export const SoldOutWithRemainingCount: Story = {
  args: { soldOut: true, remainingLabel: "Only 3 left" },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Only 3 left")).not.toBeInTheDocument();
    expect(canvas.getByText(copy.soldOut)).toBeInTheDocument();
  },
};

/** Scenario: shared-ui-store-product-listing-SC-97 - A sold-out tile opens
 * where it does not sell: given an activation handler and no cart handler.
 * Its dim photo grows on hover like an available one. Pressing the name, then
 * the photo, reports each; the name is the stop and the photo is none. The
 * suite's grade10-site-store-cross-sell-US1-TC6-1 credits this story with a
 * sold-out pick's place, its words and its activation. */
export const SoldOutOpensWhereNothingSells: Story = {
  args: {
    soldOut: true,
    onClick: fn(),
    onCartQuantityChange: undefined,
  },
  decorators: well,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(copy.soldOut)).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="product-card-cart-control"]'),
    ).toBeNull();
    const controls = canvas.getAllByRole("button", { name: defaults.name });
    expect(controls).toHaveLength(1);
    const [nameControl] = controls;
    await userEvent.tab();
    expect(nameControl).toHaveFocus();
    expect(photoTarget(canvasElement)).toHaveAttribute("tabindex", "-1");
    expect(getComputedStyle(photo(canvasElement)).opacity).toBe("0.5");
    expect(growsOnHover(photo(canvasElement))).toBe(true);
    await userEvent.click(nameControl);
    await userEvent.click(photoTarget(canvasElement));
    expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

/** shared-ui-store-product-listing-SC-93: a tile given its product's
 * address is a link to it, photo and name alike. A plain press is reported
 * and the link's own navigation gives way to it; a press with a modifier key
 * on either link is the browser's and reports nothing. */
export const OpensAsALink: Story = {
  args: {
    href: "/store/products/abyss-eye-booster-box",
    onClick: fn(),
    onCartQuantityChange: undefined,
  },
  decorators: well,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByRole("link", { name: defaults.name })).toHaveLength(
      1,
    );
    const links = [
      photoTarget(canvasElement),
      canvas.getByRole("link", { name: defaults.name }),
    ];
    for (const link of links) {
      expect(link).toHaveAttribute("href", args.href);
    }
    expect(canvas.queryAllByRole("button")).toHaveLength(0);

    for (const link of links) {
      for (const modifier of ["Control", "Meta", "Shift", "Alt"] as const) {
        expect(await pressLink(link, modifier)).toBe(false);
      }
    }
    expect(args.onClick).not.toHaveBeenCalled();

    expect(await pressLink(links[1])).toBe(true);
    expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** A sold-out tile given its address on a surface that does not sell: both
 * links open it, and its dim photo grows on hover like an available one. */
export const SoldOutOpensAsALink: Story = {
  args: {
    soldOut: true,
    href: "/store/products/abyss-eye-booster-box",
    onClick: fn(),
    onCartQuantityChange: undefined,
  },
  decorators: well,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole("link", { name: defaults.name });
    expect(canvas.getAllByRole("link", { name: defaults.name })).toHaveLength(
      1,
    );
    expect(photoTarget(canvasElement)).toHaveAttribute("href", args.href);
    expect(getComputedStyle(photo(canvasElement)).opacity).toBe("0.5");
    expect(growsOnHover(photo(canvasElement))).toBe(true);
    await userEvent.click(photoTarget(canvasElement));
    await userEvent.click(name);
    expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

/** shared-ui-store-product-listing-SC-92: a tile drawn without a cart control
 * needs no cart words. */
export const NoCartWords: Story = {
  args: { copy: {}, onCartQuantityChange: undefined },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelector('[data-slot="product-card-image-well"] img'),
    ).toHaveAttribute("src", defaults.imageSrc);
    expect(canvas.getByText(defaults.name)).toBeInTheDocument();
    expect(canvas.getByText(defaults.price)).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="product-card-cart-control"]'),
    ).toBeNull();
    expect(canvas.queryByText(/cart/i)).toBeNull();
  },
};
