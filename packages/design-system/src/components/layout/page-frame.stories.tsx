import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageFrame } from "./page-frame";

const Section = ({ children }: { children: string }) => (
  <div className="rounded-md bg-muted px-3 py-8 text-sm text-muted-foreground">
    {children}
  </div>
);

const meta = {
  title: "Design System/Layout/PageFrame",
  component: PageFrame,
  tags: ["autodocs"],
  args: {
    children: (
      <>
        <Section>Breadcrumbs</Section>
        <Section>Header</Section>
        <Section>Content</Section>
      </>
    ),
  },
  argTypes: {
    size: { control: "select", options: ["default", "narrow"] },
  },
} satisfies Meta<typeof PageFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default column: 1280px wide, 24px under the nav, 32px from `sm`. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_d281d248-41a1-4fb1-888f-bd29ec20df6d" },
  },
};

/** `narrow` caps the column at 1024px for a page with a single content column. */
export const Narrow: Story = {
  parameters: {
    verification: { caseId: "vc_18261155-45a7-4aeb-9edf-d639664fcb57" },
  },
  args: { size: "narrow" },
};

/** A caller adds its bottom padding through `className`; the frame owns none. */
export const WithBottomPadding: Story = {
  parameters: {
    verification: { caseId: "vc_1b8dcf18-989c-493d-a371-7fcd5f5a6fb7" },
  },
  args: { className: "pb-16" },
};
