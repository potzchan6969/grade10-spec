import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FIXTURE_TIME_ZONE, NAMED_AT, NAMED_COLLECTOR_COPY } from "./fixtures";
import { GradingNamedCollector } from "./grading-named-collector";

const meta = {
  title: "Grading Submission/GradingNamedCollector",
  component: GradingNamedCollector,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: NAMED_COLLECTOR_COPY,
    locale: "en",
    timeZone: FIXTURE_TIME_ZONE,
    onSave: fn(),
    onChange: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof GradingNamedCollector>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nobody named: the field and the save, which carries the name typed. */
export const NobodyNamed: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Their name"), "Wong Siu Ming");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    expect(args.onSave).toHaveBeenCalledWith("Wong Siu Ming");
  },
};

/** An empty name reports nothing. */
export const NameEmpty: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(args.onSave).not.toHaveBeenCalled();
  },
};

/** While the shop answers, no save is offered. */
export const Saving: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Save" })).toBeDisabled();
  },
};

/** One person, with the day they were named, and the two acts. */
export const Named: Story = {
  args: { named: { name: "Wong Siu Ming", namedAt: NAMED_AT } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Named on 15 Jun 2026")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Change" }));
    expect(args.onChange).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Remove" }));
    expect(args.onRemove).toHaveBeenCalled();
  },
};

/** A refused naming reads the refusal under the field. */
export const Refused: Story = {
  args: {
    error:
      "These cards were collected on 20 September, so nobody can be named.",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "These cards were collected on 20 September, so nobody can be named.",
      ),
    ).toBeInTheDocument();
    expect(args.onSave).not.toHaveBeenCalled();
  },
};
