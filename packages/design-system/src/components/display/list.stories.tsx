import type { Meta, StoryObj } from "@storybook/react-vite";
import { List, ListItem } from "./list";

const meta = {
  title: "Components/List",
  component: List,
  tags: ["autodocs"],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = ["Apple", "Banana", "Orange"];

/** Figma turns the divider off on the last item rather than dropping it from
 * the list, because the hairline belongs to the item. */
export const Default: Story = {
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
  render: () => (
    <List className="w-60">
      <ListItem description="Description" divider={false}>
        Label
      </ListItem>
    </List>
  ),
};
