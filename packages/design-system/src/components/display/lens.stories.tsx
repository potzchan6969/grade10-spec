import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Lens } from "./lens";

const IMAGE = new URL("./lens-card.fixture.png", import.meta.url).href;

const meta = {
  title: "Design System/Display/Lens",
  component: Lens,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Magnify the card",
    instructions:
      "Move the pointer over the image or use the arrow keys to magnify; Escape hides the magnifier.",
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Lens>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The lens follows the pointer and hides when it leaves. */
export const Default: Story = {
  args: {
    children: (
      <img
        alt="Graded Mew ex card, PSA 10"
        className="block w-full object-contain"
        src={IMAGE}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const lens = canvasElement.querySelector<HTMLElement>('[data-slot="lens"]');
    if (!lens) throw new Error("Lens root was not rendered");

    expect(
      canvasElement.querySelector('[data-slot="lens-magnifier"]'),
    ).not.toBeInTheDocument();

    await userEvent.pointer({ target: lens });
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="lens-magnifier"]'),
      ).toBeInTheDocument(),
    );
  },
};

/**
 * `magnified` renders different content inside the lens — a higher-resolution
 * copy of the image under it.
 */
export const MagnifiedSource: Story = {
  args: {
    children: (
      <img
        alt="Graded Mew ex card, PSA 10"
        className="block w-full object-contain"
        src={`${IMAGE}?frame`}
      />
    ),
    magnified: (
      <img
        alt=""
        className="block size-full object-contain"
        src={`${IMAGE}?zoom`}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lens = canvas.getByRole("group", { name: /^Magnify the card/ });

    await userEvent.pointer({ target: lens });
    await waitFor(() =>
      expect(
        canvasElement.querySelector('img[src$="?zoom"]'),
      ).toBeInTheDocument(),
    );
  },
};

/** Focused, the lens appears centered and steps with the arrow keys; Escape hides it. */
export const Keyboard: Story = {
  args: {
    children: (
      <img
        alt="Graded Mew ex card, PSA 10"
        className="block w-full object-contain"
        src={IMAGE}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lens = canvas.getByRole("group", { name: /^Magnify the card/ });

    lens.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="lens-magnifier"]'),
      ).toBeInTheDocument(),
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="lens-magnifier"]'),
      ).not.toBeInTheDocument(),
    );
  },
};
