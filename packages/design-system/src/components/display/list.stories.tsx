import type { Meta, StoryObj } from "@storybook/react-vite";
import { List, ListItem } from "./list";

const meta = {
  title: "Design System/Display/List",
  component: List,
  tags: ["autodocs"],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = ["Apple", "Banana", "Orange"];

/** Figma turns the divider off on the last item rather than dropping it from
 * the list, because the hairline belongs to the item. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_3a9c155f-6da3-4fde-9f6a-618a557c7d82" },
  },
  render: () => (
    <List className="w-60">
      {ROWS.map((row, index) => (
        <ListItem
          key={row}
          description="Description"
          divider={index < ROWS.length - 1}
        >
          {row}
        </ListItem>
      ))}
    </List>
  ),
};

/** Omit `description` and the second line is not rendered. */
export const WithoutDescriptions: Story = {
  parameters: {
    verification: { caseId: "vc_0afd66b4-a682-491e-9939-86897d88280b" },
  },
  render: () => (
    <List className="w-60">
      {ROWS.map((row, index) => (
        <ListItem key={row} divider={index < ROWS.length - 1}>
          {row}
        </ListItem>
      ))}
    </List>
  ),
};

export const SingleItem: Story = {
  parameters: {
    verification: { caseId: "vc_de611577-eb11-40ea-8ad8-533f11a3a7f0" },
  },
  render: () => (
    <List className="w-60">
      <ListItem description="Description" divider={false}>
        Label
      </ListItem>
    </List>
  ),
};
