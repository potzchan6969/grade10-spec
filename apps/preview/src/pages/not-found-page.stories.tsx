import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { NOT_FOUND_COPY } from "./not-found-content";
import { NotFoundPage } from "./not-found-page";

/**
 * The site’s not-found surface: chrome, static catalog copy, and Back to
 * home. Words match `@grade10/i18n` English `notFound` and `common.backToHome`.
 */
const meta = {
  title: "Pages/Not Found",
  component: NotFoundPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    onBackToHome: fn(),
  },
} satisfies Meta<typeof NotFoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 2,
        name: NOT_FOUND_COPY.title,
      }),
    ).toBeVisible();
    expect(canvas.getByText(NOT_FOUND_COPY.description)).toBeVisible();
    const backToHome = canvas.getByRole("button", {
      name: NOT_FOUND_COPY.backToHome,
    });
    expect(backToHome).toBeVisible();
    await userEvent.click(backToHome);
    expect(args.onBackToHome).toHaveBeenCalledOnce();
  },
};
