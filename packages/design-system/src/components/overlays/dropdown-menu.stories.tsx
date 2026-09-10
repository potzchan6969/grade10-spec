import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { userEvent, within } from "storybook/test";
import { Button } from "../forms/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Open menu",
    });
    await userEvent.click(trigger);
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open menu
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuItem
            trailing={<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            trailing={<DropdownMenuShortcut>⌘,</DropdownMenuShortcut>}
          >
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          trailing={<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>}
          variant="destructive"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** `inset` aligns unadorned items with those that carry an indicator. */
export const WithSubmenu: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Open menu",
    });
    await userEvent.click(trigger);
    const subTrigger = await within(document.body).findByRole("menuitem", {
      name: "Share",
    });
    await userEvent.hover(subTrigger);
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open menu
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuItem inset>New prediction</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger inset>Share</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem>Embed</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Export CSV</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem inset>Archive</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

function CheckboxItemsExample() {
  const [columns, setColumns] = React.useState({
    market: true,
    odds: true,
    volume: false,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
          {(Object.keys(columns) as (keyof typeof columns)[]).map((key) => (
            <DropdownMenuCheckboxItem
              key={key}
              checked={columns[key]}
              onCheckedChange={(checked) =>
                setColumns((prev) => ({ ...prev, [key]: checked }))
              }
              closeOnClick={false}
            >
              <span className="capitalize">{key}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const CheckboxItems: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Columns",
    });
    await userEvent.click(trigger);
  },
  render: () => <CheckboxItemsExample />,
};

function RadioItemsExample() {
  const [range, setRange] = React.useState("7d");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Range
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuRadioGroup
          value={range}
          onValueChange={(value) => setRange(value)}
        >
          <DropdownMenuLabel>Time range</DropdownMenuLabel>
          <DropdownMenuRadioItem value="24h">
            Last 24 hours
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="7d">Last 7 days</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="30d">
            Last 30 days
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const RadioItems: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Range",
    });
    await userEvent.click(trigger);
  },
  render: () => <RadioItemsExample />,
};

/** Figma Dropdown Menu with group labels (`6554:5963`). */
export const WithGroups: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Devices",
    });
    await userEvent.click(trigger);
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Devices
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>iPhone</DropdownMenuLabel>
          <DropdownMenuItem>iPhone 17 Pro</DropdownMenuItem>
          <DropdownMenuItem>iPhone Air</DropdownMenuItem>
          <DropdownMenuItem>iPhone 17</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>iPad</DropdownMenuLabel>
          <DropdownMenuItem>iPad Pro</DropdownMenuItem>
          <DropdownMenuItem>iPad Air</DropdownMenuItem>
          <DropdownMenuItem>iPad</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
