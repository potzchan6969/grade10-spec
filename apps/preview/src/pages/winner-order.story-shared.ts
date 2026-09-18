import type { Meta } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  WINNER_ORDER_STATUS_LABELS,
  type WinnerOrderStatus,
} from "./winner-order-content";
import { WinnerOrderPage } from "./winner-order-page";

/**
 * Shared CSF meta for Winner Order stage folders under My Auctions.
 * Callers must set `title` as a string literal on the file's default export —
 * Storybook's indexer cannot resolve titles returned from helpers.
 */
function winnerOrderMeta(): Omit<Meta<typeof WinnerOrderPage>, "title"> {
  return {
    component: WinnerOrderPage,
    tags: ["autodocs"],
    parameters: {
      layout: "fullscreen",
      docs: {
        description: {
          component:
            "Address-first auction Winner Order preview (Storybook only). Every status uses the Order Details 2-column shell. Not a published `@grade10/ui` export and not the store Order Details contract.",
        },
      },
    },
    argTypes: {
      status: {
        control: "select",
        options: Object.keys(WINNER_ORDER_STATUS_LABELS) as WinnerOrderStatus[],
        labels: WINNER_ORDER_STATUS_LABELS,
      },
    },
    args: {
      status: "awaiting_address",
    },
  };
}

/** Same settle gate as Order Details — wait for first-paint reveal + opacity. */
function winnerOrderRevealed(canvasElement: HTMLElement): boolean {
  const root = canvasElement.querySelector('[data-slot="winner-order-page"]');
  if (root?.getAttribute("data-revealed") !== "true") return false;

  const groups = canvasElement.querySelectorAll(
    '[data-slot="winner-order-reveal"]',
  );
  if (groups.length === 0) return false;
  for (const group of groups) {
    if (Number(getComputedStyle(group).opacity) <= 0.9) return false;
  }
  return true;
}

async function winnerOrderSettled(canvasElement: HTMLElement) {
  await waitFor(() => expect(winnerOrderRevealed(canvasElement)).toBe(true));
}

/** Opens Contact Us and checks the copy-first ready email. */
async function winnerOrderContactSheet(
  canvasElement: HTMLElement,
  expectedSubject: string,
) {
  const canvas = within(canvasElement);
  const page = within(canvasElement.ownerDocument.body);
  expect(canvas.queryByText(/support@grade10.com/)).not.toBeInTheDocument();
  const sidebar = within(canvas.getByRole("complementary"));
  await userEvent.click(sidebar.getByRole("button", { name: "Contact Us" }));
  const dialog = await waitFor(() => {
    const found = page.getByRole("dialog", { name: "Email Grade10" });
    expect(found).toBeVisible();
    return found;
  });
  const modal = within(dialog);
  expect(modal.getByText("support@grade10.com")).toBeVisible();
  expect(modal.getByText(expectedSubject)).toBeVisible();
  expect(modal.getByLabelText("Message")).toBeVisible();
  expect(modal.getByRole("button", { name: "Copy Message" })).toBeVisible();
  expect(
    modal.queryByRole("button", { name: "Copy message" }),
  ).not.toBeInTheDocument();
  const mailLink = modal.getByRole("link", { name: "Open Mail App" });
  expect(mailLink).toHaveAttribute(
    "href",
    expect.stringMatching(/^mailto:support@grade10\.com\?subject=/),
  );
}

export {
  winnerOrderContactSheet,
  winnerOrderMeta,
  winnerOrderRevealed,
  winnerOrderSettled,
};
