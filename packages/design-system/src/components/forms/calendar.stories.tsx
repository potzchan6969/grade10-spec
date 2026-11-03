import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Calendar } from "./calendar";

const TODAY = new Date(2026, 9, 6);
const SELECTED = new Date(2026, 9, 7);
const MONTH = new Date(2026, 9, 1);

const meta = {
  title: "Design System/Forms/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "react-day-picker wrapped in Grade10 chrome. Sunday-first weeks. Caption is previous, month/year, and next in one row. `captionLayout`: both dropdowns, month dropdown with a fixed year, or a single label. A menu lists only months or years inside the start/end bound; a single remaining choice is a label. Overflow days are selectable and do not move the caption. No Figma set yet — Storybook-first.",
      },
    },
  },
  argTypes: {
    captionLayout: {
      control: "select",
      options: ["dropdown", "dropdown-months", "label"],
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

function OctoberCalendar({
  captionLayout,
  onMonthChange,
}: {
  captionLayout?: "dropdown" | "dropdown-months" | "label";
  onMonthChange?: (month: Date) => void;
}) {
  const [month, setMonth] = useState(MONTH);
  const [selected, setSelected] = useState<Date | undefined>(SELECTED);
  return (
    <Calendar
      captionLayout={captionLayout}
      mode="single"
      month={month}
      onMonthChange={(next) => {
        setMonth(next);
        onMonthChange?.(next);
      }}
      onSelect={setSelected}
      selected={selected}
      today={TODAY}
    />
  );
}

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_3da1eea1-3c5d-4624-b6ed-d2fac6f0ecb3" },
  },
  name: "Dropdown month and year",
  args: {
    onMonthChange: fn(),
  },
  render: (args) => <OctoberCalendar onMonthChange={args.onMonthChange} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("grid")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: /Sunday, September 27th, 2026/ }),
    ).toBeVisible();
    expect(canvas.getByRole("gridcell", { selected: true })).toHaveTextContent(
      "7",
    );
    expect(
      canvas.getByRole("button", { name: /October 6th, 2026/ }),
    ).toHaveAttribute("data-today", "true");
    expect(canvas.getByRole("combobox", { name: /month/i })).toBeVisible();
    expect(canvas.getByRole("combobox", { name: /year/i })).toBeVisible();
    expect(canvas.getByRole("combobox", { name: /month/i })).toHaveTextContent(
      "Oct",
    );
    await userEvent.click(canvas.getByRole("combobox", { name: /month/i }));
    const monthList = await within(canvasElement.ownerDocument.body).findByRole(
      "listbox",
    );
    // The popup fades in over 100ms, and it is not visible until it has.
    await waitFor(() => {
      expect(
        within(monthList).getByRole("option", { name: "October" }),
      ).toBeVisible();
    });
    expect(within(monthList).queryByRole("option", { name: "Oct" })).toBeNull();
    await userEvent.keyboard("{Escape}");
    expect(
      canvas.getByRole("button", { name: /previous month/i }),
    ).toHaveAccessibleName();
    expect(
      canvas.getByRole("button", { name: /next month/i }),
    ).toHaveAccessibleName();

    await userEvent.click(
      canvas.getByRole("button", { name: /Monday, September 28th, 2026/ }),
    );
    expect(args.onMonthChange).not.toHaveBeenCalled();
    expect(canvas.getByRole("combobox", { name: /month/i })).toHaveTextContent(
      "Oct",
    );
    expect(canvas.getByRole("gridcell", { selected: true })).toHaveTextContent(
      "28",
    );

    await userEvent.click(canvas.getByRole("button", { name: /next month/i }));
    expect(args.onMonthChange).toHaveBeenCalled();
    expect(canvas.getByRole("combobox", { name: /month/i })).toHaveTextContent(
      "Nov",
    );
    expect(canvas.queryByRole("gridcell", { selected: true })).toBeNull();

    await userEvent.click(
      canvas.getByRole("button", { name: /previous month/i }),
    );
    expect(canvas.getByRole("combobox", { name: /month/i })).toHaveTextContent(
      "Oct",
    );
    expect(canvas.getByRole("gridcell", { selected: true })).toHaveTextContent(
      "28",
    );

    await userEvent.click(canvas.getByRole("button", { name: /next month/i }));
    const firstCell = canvas.getByRole("button", {
      name: /Sunday, November 1st, 2026/,
    });
    firstCell.focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(canvas.getByRole("combobox", { name: /month/i })).toHaveTextContent(
      "Nov",
    );
    expect(firstCell).toHaveFocus();
  },
};

export const DropdownMonth: Story = {
  parameters: {
    verification: { caseId: "vc_83b12a82-a203-48bc-9d4d-ec47606bbce9" },
  },
  name: "Dropdown month, fixed year",
  render: () => <OctoberCalendar captionLayout="dropdown-months" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("combobox", { name: /month/i })).toBeVisible();
    expect(canvas.queryByRole("combobox", { name: /year/i })).toBeNull();
    expect(canvas.getByText("2026")).toBeVisible();
  },
};

export const BoundedCaption: Story = {
  parameters: {
    verification: { caseId: "vc_c0c9f7f4-4937-4084-ad93-1bda47dd7f3c" },
  },
  name: "Bounded month and year",
  render: () => {
    const [month, setMonth] = useState(MONTH);
    const [selected, setSelected] = useState<Date | undefined>(SELECTED);
    return (
      <Calendar
        endMonth={new Date(2026, 11, 1)}
        mode="single"
        month={month}
        onMonthChange={setMonth}
        onSelect={setSelected}
        selected={selected}
        startMonth={new Date(2026, 8, 1)}
        today={TODAY}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("combobox", { name: /month/i })).toHaveTextContent(
      "Oct",
    );
    expect(canvas.queryByRole("combobox", { name: /year/i })).toBeNull();
    expect(canvas.getByText("2026")).toBeVisible();
    await userEvent.click(canvas.getByRole("combobox", { name: /month/i }));
    const monthList = await within(canvasElement.ownerDocument.body).findByRole(
      "listbox",
    );
    const list = within(monthList);
    expect(
      list.getAllByRole("option").map((option) => option.textContent),
    ).toEqual(["September", "October", "November", "December"]);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(
        within(canvasElement.ownerDocument.body).queryByRole("listbox"),
      ).toBeNull();
    });
  },
};

export const Label: Story = {
  parameters: {
    verification: { caseId: "vc_5f56a795-973b-4aea-ace3-9992f34d6d12" },
  },
  name: "Label",
  render: () => <OctoberCalendar captionLayout="label" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("combobox")).toBeNull();
    expect(canvas.getByRole("status")).toHaveTextContent("October 2026");
  },
};

export const DisabledDays: Story = {
  parameters: {
    verification: { caseId: "vc_7bb06d50-b9bc-4509-8bd7-242149f7e0b7" },
  },
  name: "Disabled days",
  render: () => (
    <Calendar
      disabled={{ dayOfWeek: [0] }}
      mode="single"
      month={MONTH}
      selected={SELECTED}
      today={TODAY}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sunday = canvas.getByRole("button", { name: /October 4th, 2026/ });
    expect(sunday).toBeDisabled();
    expect(sunday).toHaveClass("line-through");
    expect(sunday).toHaveAttribute("data-disabled", "true");
  },
};
