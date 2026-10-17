import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { STORE_LOCATOR_PROPS } from "./fixtures";
import { StoreLocator } from "./store-locator";

const meta = {
  title: "Store/Store Locator/Blocks/StoreLocator",
  component: StoreLocator,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: STORE_LOCATOR_PROPS,
} satisfies Meta<typeof StoreLocator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Scenarios: shared-ui-store-locator-SC-02 - Supplied shop facts render;
 * shared-ui-store-locator-SC-03 - No separate directions control. The name,
 * each address line and each hours row appear as supplied, in words no
 * catalog holds, and the map is the only control, a link to the supplied
 * destination.
 */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: args.copy.heading }),
    ).toBeVisible();
    expect(
      canvas.getByRole("heading", { level: 2, name: args.copy.hoursHeading }),
    ).toBeVisible();
    expect(canvas.getByText(args.name)).toBeVisible();
    for (const line of args.addressLines) {
      expect(canvas.getByText(line)).toBeVisible();
    }
    for (const row of args.hours) {
      expect(canvas.getByText(row.day)).toBeVisible();
      expect(canvas.getByText(row.hours)).toBeVisible();
    }
    expect(canvas.getAllByRole("link")).toHaveLength(1);
    expect(canvas.queryAllByRole("button")).toHaveLength(0);
    expect(
      canvas.getByRole("link", { name: args.copy.openMap }),
    ).toHaveAttribute("href", args.mapsHref);
    expect(canvasElement.querySelector("iframe")).toHaveAttribute(
      "title",
      args.copy.mapTitle,
    );
  },
};

/**
 * Scenario: shared-ui-store-locator-SC-05 - The map is one keyboard stop.
 * Tab stops once on the map's link, named by the copy, which opens the
 * destination in a new browsing context; the frame takes no focus.
 */
export const KeyboardReachesTheMapOnce: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: args.copy.openMap });
    await userEvent.tab();
    expect(link).toHaveFocus();
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await userEvent.tab();
    expect(canvasElement.contains(document.activeElement)).toBe(false);
    const frame = canvasElement.querySelector("iframe") as HTMLIFrameElement;
    expect(frame.inert).toBe(true);
    expect(frame).toHaveAttribute("aria-hidden", "true");
    expect(frame).toHaveAttribute("tabindex", "-1");
  },
};

/** One column on a phone, the map above the shop's facts. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const map = canvasElement.querySelector(
      '[data-slot="store-locator-map"]',
    ) as HTMLElement;
    const details = canvasElement.querySelector(
      '[data-slot="store-locator-details"]',
    ) as HTMLElement;
    expect(map.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      details.getBoundingClientRect().top,
    );
  },
};
