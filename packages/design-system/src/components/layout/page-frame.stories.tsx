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
export const Default: Story = {};

/** `narrow` caps the column at 1024px for a page with a single content column. */
export const Narrow: Story = { args: { size: "narrow" } };

/** A caller adds its bottom padding through `className`; the frame owns none. */
export const WithBottomPadding: Story = { args: { className: "pb-16" } };
