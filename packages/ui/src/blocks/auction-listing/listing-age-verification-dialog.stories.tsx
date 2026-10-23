import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";
import {
  ListingAgeVerificationDialog,
  type ListingAgeVerificationDialogCopy,
} from "./listing-age-verification-dialog";

const COPY: ListingAgeVerificationDialogCopy = {
  title: "Confirm your age",
  body: "You must be 18 or older to bid. Enter your date of birth to continue.",
  monthPlaceholder: "Month",
  dayPlaceholder: "Day",
  yearPlaceholder: "Year",
  birthMonthLabel: "Birth month",
  birthDayLabel: "Birth day",
  birthYearLabel: "Birth year",
  underAgeError: "You must be 18 or older to bid.",
  cancel: "Cancel",
  confirm: "Confirm",
};

const meta = {
  title: "Auction/Bidding/Blocks/ListingAgeVerificationDialog",
  component: ListingAgeVerificationDialog,
  parameters: { layout: "centered" },
  args: {
    copy: COPY,
    open: true,
    onOpenChange: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof ListingAgeVerificationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

async function pick(dialog: HTMLElement, field: string, option: string) {
  await userEvent.click(within(dialog).getByRole("button", { name: field }));
  await userEvent.click(
    await screen.findByRole("menuitemradio", { name: option }),
  );
}

async function enterAdultBirthDate() {
  const dialog = await screen.findByRole("dialog", {
    name: "Confirm your age",
  });
  await pick(dialog, "Birth month", "May");
  await pick(dialog, "Birth day", "4");
  await pick(dialog, "Birth year", "1990");
  return dialog;
}

/** Confirm reports the date and leaves closing to the consumer, who closes it once the verification lands. */
export const ConfirmLeavesTheDialogOpen: Story = {
  parameters: {
    verification: { caseId: "vc_19294d3c-a1af-4c3d-903a-2474a0921f97" },
  },
  play: async ({ args }) => {
    const dialog = await enterAdultBirthDate();
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Confirm" }),
    );
    expect(args.onConfirm).toHaveBeenCalledTimes(1);
    expect(args.onOpenChange).not.toHaveBeenCalled();
    expect(dialog).toBeInTheDocument();
  },
};

/** While the verification runs Confirm draws busy, and a second press does nothing. */
export const ConfirmPending: Story = {
  parameters: {
    verification: { caseId: "vc_e8a063c2-80e3-4edb-a923-ee0f91f889b6" },
  },
  render: function Render(args) {
    const [pending, setPending] = useState(false);
    return (
      <ListingAgeVerificationDialog
        {...args}
        confirmPending={pending}
        onConfirm={() => {
          args.onConfirm();
          setPending(true);
        }}
      />
    );
  },
  play: async ({ args }) => {
    const dialog = await enterAdultBirthDate();
    const confirm = within(dialog).getByRole("button", { name: "Confirm" });
    await userEvent.click(confirm);
    await waitFor(() => expect(confirm).toHaveAttribute("aria-busy", "true"));
    confirm.click();
    expect(args.onConfirm).toHaveBeenCalledTimes(1);
  },
};

/** A refused verification shows under the fields, and Confirm presses again. */
export const ConfirmRefused: Story = {
  parameters: {
    verification: { caseId: "vc_80830786-5f6b-421a-a2af-1506a8dc72a8" },
  },
  args: { confirmFailed: "We couldn't verify your age. Try again." },
  play: async ({ args }) => {
    const dialog = await enterAdultBirthDate();
    expect(within(dialog).getByRole("alert")).toHaveTextContent(
      "We couldn't verify your age. Try again.",
    );
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Confirm" }),
    );
    expect(args.onConfirm).toHaveBeenCalledTimes(1);
  },
};
