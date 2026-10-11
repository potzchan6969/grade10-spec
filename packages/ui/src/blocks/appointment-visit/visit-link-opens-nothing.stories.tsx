import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { BOOK_HREF, LINK_OPENS_NOTHING_COPY, MINE_HREF } from "./fixtures";
import { VisitLinkOpensNothing } from "./visit-link-opens-nothing";

const meta = {
  title: "Appointment Visit/VisitLinkOpensNothing",
  component: VisitLinkOpensNothing,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: LINK_OPENS_NOTHING_COPY,
    mineHref: MINE_HREF,
    bookHref: BOOK_HREF,
  },
} satisfies Meta<typeof VisitLinkOpensNothing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "This link doesn’t open a visit" }),
    ).toBeVisible();
    expect(canvas.getByRole("link", { name: "My visits" })).toHaveAttribute(
      "href",
      MINE_HREF,
    );
  },
};
