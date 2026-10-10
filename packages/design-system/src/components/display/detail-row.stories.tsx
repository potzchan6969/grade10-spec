import type { Meta, StoryObj } from "@storybook/react-vite";
import { DetailRow } from "./detail-row";

const meta = {
  title: "Components/DetailRow",
  component: DetailRow,
  tags: ["autodocs"],
  args: {
    label: "Grade",
    children: "PSA 10 Gem Mint",
  },
} satisfies Meta<typeof DetailRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ComposedValue: Story = {
  args: {
    label: "Certificate",
    children: (
      <span>
        #12345678{" "}
        <button className="text-primary underline" type="button">
          Verify
        </button>
      </span>
    ),
  },
};
