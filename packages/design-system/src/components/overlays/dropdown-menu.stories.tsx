import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
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
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open menu
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** `inset` aligns unadorned items with those that carry an indicator. */
export const WithSubmenu: Story = {
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
        <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const CheckboxItems: Story = { render: () => <CheckboxItemsExample /> };

function RadioItemsExample() {
  const [range, setRange] = React.useState("7d");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Range
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>Time range</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={range}
          onValueChange={(value) => setRange(value)}
        >
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

export const RadioItems: Story = { render: () => <RadioItemsExample /> };
