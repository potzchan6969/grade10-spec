import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  navigateToStory,
  TICKETING_STORY_IDS,
} from "../../workbench-story-nav";
import { T, t } from "../ticketing-words";
import { ReviewPage } from "./checkout-pages";

/**
 * The Promo code field on Check Your Order, the PromoPhone board: a code
 * applied, refused, too many wrong tries, and the last use taken at Pay.
 * Try SPRING20, CREW4, AUTUMN10, GROUP4 or anything else.
 */
const meta = {
  title: "Ticketing/Buying/Screens/Check Your Order/Promo",
  component: ReviewPage,
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-ticketing-buying-US-01"],
  },
  args: {
    onBack: () => navigateToStory(TICKETING_STORY_IDS.details),
    onEdit: () => navigateToStory(TICKETING_STORY_IDS.details),
    onPay: fn(),
  },
} satisfies Meta<typeof ReviewPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const field = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole("textbox", { name: T.promo.label });
const applyButton = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole("button", { name: T.promo.apply });

/** SPRING20 typed and applied: its line takes 20% off the General passes
 * and the total drops. */
export const PromoApplied: Story = {
  parameters: {
    verification: { caseId: "vc_1b165c3a-27df-4e34-88e0-b0f51f7f00af" },
  },
  name: "Promo applied",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(field(canvasElement), "spring20");
    await userEvent.click(applyButton(canvasElement));
    await expect(
      await canvas.findByText(t(T.promo.applied, { code: "SPRING20" })),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", {
        name: t(T.review.pay, { amount: "HK$960.00" }),
      }),
    ).toBeVisible();
  },
};

/** Remove takes the code off and the field comes back. */
export const PromoRemoved: Story = {
  parameters: {
    verification: { caseId: "vc_89d48a2d-2e2a-47a7-94e4-3d115c0d80c4" },
  },
  name: "Promo removed",
  args: { code: "SPRING20" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", {
        name: t(T.promo.removeLabel, { code: "SPRING20" }),
      }),
    );
    await expect(field(canvasElement)).toBeVisible();
  },
};

/** A code nobody made: the reason under the field. */
export const CodeNotFound: Story = {
  parameters: {
    verification: { caseId: "vc_b1059152-6d50-404d-bb10-af19faeaa1e6" },
  },
  name: "Code not found",
  play: async ({ canvasElement }) => {
    await userEvent.type(field(canvasElement), "SPRNG20");
    await userEvent.click(applyButton(canvasElement));
    await expect(
      await within(canvasElement).findByText(T.promo.errors.notFound),
    ).toBeVisible();
  },
};

/** A code that has ended. */
export const CodeExpired: Story = {
  parameters: {
    verification: { caseId: "vc_7f53e534-7f6e-4bc8-86db-f0ba67bbb101" },
  },
  name: "Code ended",
  play: async ({ canvasElement }) => {
    await userEvent.type(field(canvasElement), "AUTUMN10");
    await userEvent.click(applyButton(canvasElement));
    await expect(
      await within(canvasElement).findByText(
        t(T.promo.errors.expired, { code: "AUTUMN10", date: "31 Oct 2026" }),
      ),
    ).toBeVisible();
  },
};

/** A code whose conditions the order does not meet. */
export const ConditionsNotMet: Story = {
  parameters: {
    verification: { caseId: "vc_b14f2871-441f-4a62-bc1c-e4c950cb5167" },
  },
  name: "Conditions not met",
  play: async ({ canvasElement }) => {
    await userEvent.type(field(canvasElement), "GROUP4");
    await userEvent.click(applyButton(canvasElement));
    await expect(
      await within(canvasElement).findByText(
        t(T.promo.errors.minTickets, { code: "GROUP4", count: 4 }),
      ),
    ).toBeVisible();
  },
};

/** Too many wrong codes: the wait, and Apply waits with it. */
export const TooManyTries: Story = {
  parameters: {
    verification: { caseId: "vc_7ed45ec6-08a5-4550-8145-3499fdb90d6d" },
  },
  name: "Too many tries",
  args: {
    promoStatus: {
      kind: "tooManyTries",
      message: t(T.promo.errors.tooManyTries, { minutes: 10 }),
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        t(T.promo.errors.tooManyTries, { minutes: 10 }),
      ),
    ).toBeVisible();
  },
};

/** CREW4 makes the order free: Get Tickets, no points. */
export const FreeWithCode: Story = {
  parameters: {
    verification: { caseId: "vc_86e94be0-dd0b-4550-9f86-278b30c5009e" },
  },
  name: "Free with CREW4",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(field(canvasElement), "CREW4");
    await userEvent.click(applyButton(canvasElement));
    await expect(
      await canvas.findByRole("button", { name: T.review.getTickets }),
    ).toBeVisible();
    await expect(
      canvas.getAllByText(t(T.promo.freeWith, { code: "CREW4" })).length,
    ).toBeGreaterThan(0);
  },
};

/** Pay found SPRING20's last use gone: pay the full total, or take the
 * code off. */
export const UsedUpAtPay: Story = {
  parameters: {
    verification: { caseId: "vc_26d167f5-be17-4de7-abd7-e48ffc7a2a55" },
  },
  name: "Code used up at Pay",
  args: { code: "SPRING20", codeUsedUp: true, defaultAgreed: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(t(T.promo.usedUpAtPay.title, { code: "SPRING20" })),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: T.promo.usedUpAtPay.removeCode }),
    );
    await expect(field(canvasElement)).toBeVisible();
  },
};
