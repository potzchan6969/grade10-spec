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
  const mailLink = modal.getByRole("button", { name: "Open Mail App" });
  expect(mailLink).toHaveAttribute(
    "href",
    expect.stringMatching(/^mailto:support@grade10\.com\?subject=/),
  );
}

type StoryWithin = ReturnType<typeof within>;

/** Soft phone + Country/Region + required locality for Add Address plays. */
async function fillWinnerOrderAddAddress(
  page: StoryWithin,
  form: StoryWithin,
  values: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    phone?: string;
    phoneCountry?: string;
    country?: string;
  },
) {
  await userEvent.type(form.getByLabelText(/First name/i), values.firstName);
  await userEvent.type(form.getByLabelText(/Last name/i), values.lastName);

  await userEvent.click(
    form.getByRole("button", { name: "Select country calling code" }),
  );
  const phoneSearch = await waitFor(() => {
    const input = page.getByPlaceholderText("e.g. United States");
    expect(input).toBeVisible();
    return input;
  });
  await userEvent.clear(phoneSearch);
  await userEvent.type(phoneSearch, values.phoneCountry ?? "Hong Kong");
  await userEvent.click(
    await waitFor(() => {
      const option = page.getByRole("option", {
        name: new RegExp(values.phoneCountry ?? "Hong Kong", "i"),
      });
      expect(option).toBeVisible();
      return option;
    }),
  );
  const phone = form.getByPlaceholderText("+852 12345678");
  await userEvent.clear(phone);
  await userEvent.type(phone, values.phone ?? "91234567");

  const country = form.getByRole("combobox", { name: /Country\/Region/i });
  await userEvent.click(country);
  await userEvent.type(country, values.country ?? "Hong Kong");
  await userEvent.click(
    await waitFor(() => {
      const option = page.getByRole("option", {
        name: values.country ?? "Hong Kong",
      });
      expect(option).toBeVisible();
      return option;
    }),
  );

  await userEvent.type(form.getByLabelText(/City/i), values.city);
  await userEvent.type(form.getByLabelText(/Address line 1/i), values.street);
  await userEvent.type(form.getByLabelText(/Postal code/i), values.postalCode);
}

export {
  fillWinnerOrderAddAddress,
  winnerOrderContactSheet,
  winnerOrderMeta,
  winnerOrderRevealed,
  winnerOrderSettled,
};
