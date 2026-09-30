import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { FIXTURE_TIME_ZONE, NAMED_AT, NAMED_COLLECTOR_COPY } from "./fixtures";
import {
  GradingNamedCollector,
  type GradingNamedCollectorProps,
} from "./grading-named-collector";

/** The field is the consumer's; the workbench plays that consumer. */
function Consumer({ name, onNameChange, ...args }: GradingNamedCollectorProps) {
  const [typed, setTyped] = useState(name);

  return (
    <GradingNamedCollector
      {...args}
      name={typed}
      onNameChange={(next) => {
        setTyped(next);
        onNameChange(next);
      }}
    />
  );
}

const meta = {
  title: "Grading Submission/GradingNamedCollector",
  component: GradingNamedCollector,
  render: (args) => <Consumer {...args} />,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: NAMED_COLLECTOR_COPY,
    locale: "en",
    name: "",
    timeZone: FIXTURE_TIME_ZONE,
    onNameChange: fn(),
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

/** An empty name reports nothing (shared-ui-grading-submission-SC-43). */
export const NameEmpty: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(args.onSave).not.toHaveBeenCalled();
  },
};

/** While the shop answers, no save is offered
 * (shared-ui-grading-submission-SC-43). */
export const Saving: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Save" })).toBeDisabled();
  },
};

/** One person, with the day they were named, and the two acts, each through
 * its own callback (shared-ui-grading-submission-SC-44). */
export const Named: Story = {
  args: { named: { name: "Wong Siu Ming", namedAt: NAMED_AT } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Wong Siu Ming")).toBeInTheDocument();
    expect(canvas.getByText("Named on 15 Jun 2026")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Change" }));
    expect(args.onChange).toHaveBeenCalledOnce();
    expect(args.onRemove).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Remove" }));
    expect(args.onRemove).toHaveBeenCalledOnce();
    expect(args.onChange).toHaveBeenCalledOnce();
  },
};

/** A Change prefills the person already named, so nothing is retyped: a
 * state reached from props alone (shared-ui-grading-submission-SC-58). */
export const Changing: Story = {
  args: { name: "Wong Siu Ming" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByLabelText("Their name")).toHaveValue("Wong Siu Ming");
  },
};

/** A refused naming reads the refusal under the field, keeps what was typed,
 * and reports no save (shared-ui-grading-submission-SC-45). */
export const Refused: Story = {
  args: {
    name: "Wong Siu Ming",
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
    expect(canvas.getByLabelText("Their name")).toHaveValue("Wong Siu Ming");
    const save = canvas.getByRole("button", { name: "Save" });
    expect(save).toBeDisabled();
    await userEvent.click(save, { pointerEventsCheck: 0 });
    expect(args.onSave).not.toHaveBeenCalled();
  },
};

/** A refusal beside the person named offers neither changing nor removing
 * them: a refused card reports nothing further. */
export const RefusedWhileNamed: Story = {
  args: {
    named: { name: "Wong Siu Ming", namedAt: NAMED_AT },
    error:
      "These cards were collected on 20 September, so nobody can be removed.",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "These cards were collected on 20 September, so nobody can be removed.",
      ),
    ).toBeInTheDocument();
    for (const act of ["Change", "Remove"]) {
      const button = canvas.getByRole("button", { name: act });
      expect(button).toBeDisabled();
      await userEvent.click(button, { pointerEventsCheck: 0 });
    }
    expect(args.onChange).not.toHaveBeenCalled();
    expect(args.onRemove).not.toHaveBeenCalled();
  },
};
