import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

/** Enough A–Z names to exceed the Select popup's capped height. */
const LONG_LIST_OPTIONS = Array.from({ length: 52 }, (_, index) => {
  const letter = String.fromCharCode(65 + Math.floor(index / 2));
  return `${letter} Option ${index + 1}`;
});

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// A trigger with no associated Label needs its own accessible name; a
// placeholder or selected value does not contribute one. The WithLabel story
// is named by its Label instead.
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger aria-label="Market" className="w-48">
        <SelectValue placeholder="Select a market" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="btc">BTC / USD</SelectItem>
          <SelectItem value="eth">ETH / USD</SelectItem>
          <SelectItem value="sol">SOL / USD</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="eth">
      <SelectTrigger aria-label="Market" className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="btc">BTC / USD</SelectItem>
          <SelectItem value="eth">ETH / USD</SelectItem>
          <SelectItem value="sol">SOL / USD</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Small: Story = {
  render: () => (
    <Select defaultValue="btc">
      <SelectTrigger aria-label="Market" size="sm" className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="btc">BTC / USD</SelectItem>
          <SelectItem value="eth">ETH / USD</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger aria-label="Market" className="w-48">
        <SelectValue placeholder="Select a market" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Crypto</SelectLabel>
          <SelectItem value="btc">BTC / USD</SelectItem>
          <SelectItem value="eth">ETH / USD</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Equities</SelectLabel>
          <SelectItem value="aapl">AAPL</SelectItem>
          <SelectItem value="nvda">NVDA</SelectItem>
          <SelectItem value="tsla" disabled>
            TSLA (halted)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select defaultValue="btc" disabled>
      <SelectTrigger aria-label="Market" className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="btc">BTC / USD</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex w-48 flex-col gap-2">
      <Label htmlFor="market">Market</Label>
      <Select>
        <SelectTrigger id="market" className="w-48">
          <SelectValue placeholder="Select a market" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="btc">BTC / USD</SelectItem>
          <SelectItem value="eth">ETH / USD</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

/**
 * Typeahead on a list taller than the capped popup scrolls the highlighted
 * match into view (`winner-order-SC-175`, `winner-order-SC-178`).
 */
export const LongListTypeahead: Story = {
  render: () => (
    <Select defaultValue={LONG_LIST_OPTIONS[0]}>
      <SelectTrigger aria-label="Country or region" className="w-64">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {LONG_LIST_OPTIONS.map((name) => (
          <SelectItem key={name} label={name} value={name}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(page.getByLabelText("Country or region"));
    await waitFor(() => {
      expect(page.getAllByRole("option").length).toBeGreaterThan(20);
    });

    await userEvent.keyboard("z");
    await waitFor(() => {
      const highlighted = canvasElement.ownerDocument.querySelector(
        '[data-slot="select-item"][data-highlighted]',
      );
      expect(highlighted).not.toBeNull();
      expect(
        highlighted?.textContent?.trim().toLowerCase().startsWith("z"),
      ).toBe(true);

      const popup = canvasElement.ownerDocument.querySelector(
        '[data-slot="select-content"]',
      );
      expect(popup).toBeInstanceOf(HTMLElement);
      if (!(popup instanceof HTMLElement)) {
        throw new Error("expected select content");
      }
      expect(popup.scrollHeight).toBeGreaterThan(popup.clientHeight);
      expect(popup.scrollTop).toBeGreaterThan(0);
    });

    await userEvent.keyboard("z");
    await waitFor(() => {
      const highlighted = canvasElement.ownerDocument.querySelector(
        '[data-slot="select-item"][data-highlighted]',
      );
      expect(highlighted).not.toBeNull();
      expect(highlighted?.textContent?.trim()).toBe("Z Option 52");
    });
  },
};
