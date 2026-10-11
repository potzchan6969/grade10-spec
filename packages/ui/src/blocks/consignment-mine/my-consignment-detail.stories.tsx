import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  MINE_DETAIL,
  MINE_DETAIL_COPY,
  MINE_DETAIL_ENDED,
  MINE_DETAIL_FRESH,
} from "./fixtures";
import { MyConsignmentDetail } from "./my-consignment-detail";

const meta = {
  title: "Consignment Mine/MyConsignmentDetail",
  component: MyConsignmentDetail,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: MINE_DETAIL_COPY, detail: MINE_DETAIL },
  decorators: [
    (Story) => (
      <VStack gap="lg" hAlign="stretch">
        <Story />
      </VStack>
    ),
  ],
} satisfies Meta<typeof MyConsignmentDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

/** On sale: items, pinned terms, a payout, documents and emails. */
export const OnSale: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Consignment CN-2026-0042" }),
    ).toBeVisible();
    expect(canvas.getByText("Shown as Kowloon Cards")).toBeInTheDocument();
    expect(
      canvas.getByText("HK$5,525.00 on 4 Oct 2026 to FPS 9876"),
    ).toBeInTheDocument();
    expect(canvas.queryByText("Ended unsold")).toBeNull();
  },
};

/** Just received: every section says it has nothing yet. */
export const Fresh: Story = {
  args: { detail: MINE_DETAIL_FRESH },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No document yet.")).toBeInTheDocument();
    expect(canvas.getByText("No email yet.")).toBeInTheDocument();
    expect(
      canvas.getByText("You are not named on the store."),
    ).toBeInTheDocument();
  },
};

/** Ended unsold: the rail says so under the stage it stopped at. */
export const Ended: Story = {
  args: { detail: MINE_DETAIL_ENDED },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Ended unsold").length).toBeGreaterThan(0);
  },
};
