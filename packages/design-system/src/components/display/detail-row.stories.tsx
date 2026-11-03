import type { Meta, StoryObj } from "@storybook/react-vite";
import { DetailRow } from "./detail-row";

const meta = {
  title: "Design System/Display/DetailRow",
  component: DetailRow,
  tags: ["autodocs"],
  args: {
    label: "Grade",
    children: "PSA 10 Gem Mint",
  },
} satisfies Meta<typeof DetailRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_eb38107e-95a9-45ff-8c73-ade08dc391bc" },
  },
};

export const ComposedValue: Story = {
  parameters: {
    verification: { caseId: "vc_294c9335-d8cb-4f34-8b1f-8ae4d0c6c79c" },
  },
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
