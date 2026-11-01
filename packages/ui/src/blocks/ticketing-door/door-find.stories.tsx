import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DoorFind } from "./door-find";
import { DoorPhoneFrame } from "./door-phone-frame";
import {
  findConsoleCopy,
  findPhoneCopy,
  findTickets,
  frameCopy,
} from "./fixtures";

const NOTE =
  "Only first names show here. Ask for the buyer’s name if you’re unsure.";

const meta = {
  title: "Ticketing/Door/Blocks/DoorFind",
  component: DoorFind,
  tags: ["autodocs"],
  decorators: [
    (Story, { args }) =>
      args.layout === "phone" ? (
        <DoorPhoneFrame
          className="h-[844px] min-h-0 w-[390px] border border-border"
          copy={frameCopy}
          mode="signedIn"
          onFindByReference={fn()}
          onOpenMenu={fn()}
          title="Gate A phone 1"
        >
          <Story />
        </DoorPhoneFrame>
      ) : (
        <div className="w-[420px]">
          <Story />
        </div>
      ),
  ],
  args: {
    layout: "phone",
    copy: findPhoneCopy,
    query: "TK7Q2M",
    result: {
      status: "found",
      heading: "3 tickets on order TK7Q2M",
      tickets: findTickets,
    },
    note: NOTE,
    onQueryChange: fn(),
    onSubmit: fn(),
    onAdmit: fn(),
    onBack: fn(),
  },
} satisfies Meta<typeof DoorFind>;

export default meta;
type Story = StoryObj<typeof meta>;

/** By reference only on a phone: first names, Admit each. */
export const Found: Story = {
  name: "Find by reference",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const order = canvas.getByRole("region", {
      name: "3 tickets on order TK7Q2M",
    });
    await expect(within(order).getAllByRole("listitem")).toHaveLength(3);
    await expect(within(order).getByText("In today")).toBeVisible();
    const [admitAlex] = within(order).getAllByRole("button", { name: "Admit" });
    await expect(admitAlex).toHaveAccessibleDescription(/Alex/);
    await userEvent.click(admitAlex);
    await expect(args.onAdmit).toHaveBeenCalledWith("t1");
    await userEvent.click(canvas.getByRole("button", { name: "Scan" }));
    await expect(args.onBack).toHaveBeenCalledOnce();
  },
};

/** Nothing asked yet; Enter sends the reference. */
export const Empty: Story = {
  args: { query: "", result: { status: "idle" } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByLabelText("Reference");
    await userEvent.type(field, "T{Enter}");
    await expect(args.onQueryChange).toHaveBeenCalledWith("T");
    await expect(args.onSubmit).toHaveBeenCalledOnce();
  },
};

/** The reference is being looked up. */
export const Searching: Story = {
  args: { result: { status: "searching" } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole("list"),
    ).not.toBeInTheDocument();
  },
};

/** No order with that reference for this event. */
export const NotFound: Story = {
  name: "Reference not found",
  args: {
    query: "TK7Q2N",
    result: {
      status: "notFound",
      message:
        "No order with that reference for this event. Check each character, or send them to the help desk.",
    },
  },
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByLabelText("Reference");
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(field).toHaveAccessibleDescription(
      /No order with that reference/,
    );
  },
};

/** The console finds by reference or the buyer's exact email, full names. */
export const Console: Story = {
  name: "Console, by email",
  args: {
    layout: "console",
    copy: findConsoleCopy,
    query: "alex.chan@example.com",
    note: undefined,
    onBack: undefined,
    result: {
      status: "found",
      heading: "3 tickets for alex.chan@example.com",
      tickets: [
        {
          ...findTickets[0],
          name: "Alex Chan",
          pass: "General Pass (Two-Day), Adult",
          entry: "day 1 of 2 left",
        },
        { ...findTickets[1], name: "Ben Chan", entry: "in at 10:31" },
        { ...findTickets[2], name: "Chloe Chan", entry: "day 1 of 2 left" },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(/Find a ticket/)).toHaveValue(
      "alex.chan@example.com",
    );
    await expect(canvas.getAllByRole("button", { name: "Admit" })).toHaveLength(
      2,
    );
  },
};
