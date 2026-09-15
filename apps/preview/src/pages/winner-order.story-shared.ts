import type { Meta } from "@storybook/react-vite";
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

export { winnerOrderMeta };
