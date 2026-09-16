import type { Meta } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
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

export { winnerOrderMeta, winnerOrderRevealed, winnerOrderSettled };
