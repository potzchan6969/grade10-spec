import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { useState } from "react";
import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteLoading,
} from "./autocomplete";

type Suggestion = { id: string; label: string };

type SuggestionGroup = {
  value: string;
  label: string;
  items: Suggestion[];
};

const DEVICE_GROUPS: SuggestionGroup[] = [
  {
    value: "iphone",
    label: "iPhone",
    items: [
      { id: "iphone-17-pro", label: "iPhone 17 Pro" },
      { id: "iphone-air", label: "iPhone Air" },
      { id: "iphone-17", label: "iPhone 17" },
    ],
  },
  {
    value: "ipad",
    label: "iPad",
    items: [
      { id: "ipad-pro", label: "iPad Pro" },
      { id: "ipad-air", label: "iPad Air" },
      { id: "ipad", label: "iPad" },
    ],
  },
];

const TAGS: Suggestion[] = [
  { id: "feature", label: "feature" },
  { id: "fix", label: "fix" },
  { id: "bug", label: "bug" },
  { id: "docs", label: "docs" },
];

/**
 * Figma composition `Autocomplete` (`6554:6126`) — Search Input plus Dropdown
 * Menu with group labels (`6554:5962`) and empty state.
 */
const meta = {
  title: "Components/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

function GroupsExample() {
  const [value, setValue] = useState("");

  return (
    <Autocomplete
      items={DEVICE_GROUPS}
      itemToStringValue={(item) => item.label}
      mode="none"
      onValueChange={setValue}
      openOnInputClick
      value={value}
    >
      <AutocompleteInput
        aria-label="Search devices"
        onClear={() => setValue("")}
        placeholder="Search..."
      />
      <AutocompleteContent>
        <AutocompleteEmpty>No results found.</AutocompleteEmpty>
        <AutocompleteList>
          {(group: SuggestionGroup) => (
            <AutocompleteGroup key={group.value} items={group.items}>
              <AutocompleteGroupLabel>{group.label}</AutocompleteGroupLabel>
              <AutocompleteCollection>
                {(item: Suggestion) => (
                  <AutocompleteItem key={item.id} value={item}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </AutocompleteCollection>
            </AutocompleteGroup>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}

/** Grouped suggestions — Figma Autocomplete with iPhone / iPad labels. */
export const Groups: Story = {
  render: () => <GroupsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search devices" });
    await userEvent.click(field);
    const popup = within(document.body);
    expect(await popup.findByRole("listbox")).toBeInTheDocument();
    expect(popup.getByText("iPhone", { selector: "[data-slot=autocomplete-group-label]" })).toBeInTheDocument();
    expect(popup.getByText("iPad", { selector: "[data-slot=autocomplete-group-label]" })).toBeInTheDocument();
    expect(
      popup.getByRole("option", { name: "iPhone 17 Pro" }),
    ).toBeInTheDocument();
  },
};

function EmptyExample() {
  const [value, setValue] = useState("zzz");
  const [open, setOpen] = useState(true);

  return (
    <Autocomplete
      items={TAGS}
      itemToStringValue={(item) => item.label}
      onOpenChange={setOpen}
      onValueChange={setValue}
      open={open}
      value={value}
    >
      <AutocompleteInput
        aria-label="Search tags"
        onClear={() => setValue("")}
        placeholder="Search..."
      />
      <AutocompleteContent>
        <AutocompleteEmpty>No results found.</AutocompleteEmpty>
        <AutocompleteList>
          {(item: Suggestion) => (
            <AutocompleteItem key={item.id} value={item}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}

/** Empty list — Figma Autocomplete empty copy. */
export const Empty: Story = {
  render: () => <EmptyExample />,
  play: async () => {
    expect(
      await within(document.body).findByText("No results found."),
    ).toBeInTheDocument();
  },
};

function LoadingExample() {
  const [value, setValue] = useState("xyz");
  const [open, setOpen] = useState(true);

  return (
    <Autocomplete
      items={[]}
      onOpenChange={setOpen}
      onValueChange={setValue}
      open={open}
      value={value}
    >
      <AutocompleteInput
        aria-label="Search tags"
        onClear={() => setValue("")}
        placeholder="Search..."
      />
      <AutocompleteContent aria-busy="true">
        <AutocompleteLoading />
        <AutocompleteList />
      </AutocompleteContent>
    </Autocomplete>
  );
}

/** Loading — Figma Autocomplete right column (spinner + Searching…). */
export const Loading: Story = {
  render: () => <LoadingExample />,
  play: async () => {
    expect(
      await within(document.body).findByText("Searching..."),
    ).toBeInTheDocument();
  },
};

function FlatExample() {
  const [value, setValue] = useState("");

  return (
    <Autocomplete
      items={TAGS}
      itemToStringValue={(item) => item.label}
      onValueChange={setValue}
      value={value}
    >
      <AutocompleteInput
        aria-label="Search tags"
        onClear={() => setValue("")}
        placeholder="Search..."
      />
      <AutocompleteContent>
        <AutocompleteEmpty>No results found.</AutocompleteEmpty>
        <AutocompleteList>
          {(item: Suggestion) => (
            <AutocompleteItem key={item.id} value={item}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}

export const Default: Story = {
  render: () => <FlatExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search tags" });
    await userEvent.type(field, "f");
    const popup = within(document.body);
    expect(
      await popup.findByRole("option", { name: "feature" }),
    ).toBeInTheDocument();
    expect(popup.getByRole("option", { name: "fix" })).toBeInTheDocument();
  },
};
