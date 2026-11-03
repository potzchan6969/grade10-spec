import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BookingServicePicker } from "./booking-service-picker";
import {
  BOARD_SERVICES,
  BOARD_VAULT_SERVICES,
  CONSULTATION_SERVICE,
  GRADING_SERVICE,
  SERVICE_PICKER_COPY,
  VAULTING_SERVICE,
} from "./fixtures";

const { common } = getMessages("grade10", "en");

const meta = {
  title: "Appointment/Booking/Blocks/BookingServicePicker",
  component: BookingServicePicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: SERVICE_PICKER_COPY,
    services: {
      status: "ready",
      data: [GRADING_SERVICE, VAULTING_SERVICE, CONSULTATION_SERVICE],
    },
    onSelect: fn(),
  },
} satisfies Meta<typeof BookingServicePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Activating a service reports its id; the picker marks nothing on its own. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_88773cea-f1a8-4e30-b78d-075923456d88" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Grading Submission")).toBeVisible();
    expect(canvas.getByText("Vault Drop-Off")).toBeVisible();
    expect(canvas.getByText("Store/Auction Listing")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("radio", { name: /Store\/Auction Listing/ }),
    );
    expect(args.onSelect).toHaveBeenCalledWith("svc_consultation");
  },
};

export const Selected: Story = {
  parameters: {
    verification: { caseId: "vc_e02275ed-0b13-453c-be3b-5135caad55eb" },
  },
  args: { selectedId: "svc_grading" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("radio", { name: /Grading Submission/ }),
    ).toBeChecked();
    expect(
      canvas.getByRole("radio", { name: /Vault Drop-Off/ }),
    ).not.toBeChecked();
  },
};

/** A fresh pick reports once; picking the ticked service again reports again,
 * so Back then Continue is never stuck. */
export const Repick: Story = {
  parameters: {
    verification: { caseId: "vc_bdc8ac79-5c9e-4020-acfc-f4ab5fe07546" },
  },
  args: { selectedId: "svc_grading" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("radio", { name: /Vault Drop-Off/ }),
    );
    expect(args.onSelect).toHaveBeenCalledTimes(1);
    expect(args.onSelect).toHaveBeenLastCalledWith("svc_vault_drop_off");
    await userEvent.click(
      canvas.getByRole("radio", { name: /Grading Submission/ }),
    );
    expect(args.onSelect).toHaveBeenCalledTimes(2);
    expect(args.onSelect).toHaveBeenLastCalledWith("svc_grading");
  },
};

export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_17813516-81ba-4a2f-9416-1c7125533866" },
  },
  args: { services: { status: "loading" } },
};

export const Failed: Story = {
  parameters: {
    verification: { caseId: "vc_f49eca97-a8c8-40e7-a043-58f427ebfc4d" },
  },
  args: {
    services: {
      status: "error",
      message: "The services could not be read.",
      action: { label: common.retry, onAction: fn() },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("The services could not be read."),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: common.retry })).toBeVisible();
  },
};

/** One group of the step under its quieter heading: who each service suits,
 * what a paid one charges, and its price and bring lines under the rule. */
export const GradingGroup: Story = {
  parameters: {
    verification: { caseId: "vc_678afeaa-64fa-41b8-9e36-43d5da6f2fa3" },
  },
  args: {
    copy: { title: "Grading" },
    heading: "group",
    services: { status: "ready", data: BOARD_SERVICES },
    selectedId: "svc_drop",
    footer: (
      <>
        More than 100 cards?{" "}
        <a className="font-semibold text-foreground underline" href="#contact">
          Message us first
        </a>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 3, name: "Grading" }),
    ).toBeVisible();
    expect(canvas.getByText("Deposit HK$100.00")).toBeVisible();
    expect(
      canvas.getByRole("radio", { name: /Grading drop-off/ }),
    ).toBeChecked();
    expect(
      canvas.getByRole("link", { name: "Message us first" }),
    ).toBeVisible();
  },
};

export const VaultGroup: Story = {
  parameters: {
    verification: { caseId: "vc_d5c410c2-d1a9-4766-86d8-d8f29075fef0" },
  },
  args: {
    copy: { title: "Vault" },
    heading: "group",
    services: { status: "ready", data: BOARD_VAULT_SERVICES },
  },
};
