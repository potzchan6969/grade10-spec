import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationLink } from "./navigation-link";
import { NavigationList } from "./navigation-list";

const meta = {
  title: "Components/NavigationList",
  component: NavigationList,
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NavigationList>
      <NavigationLink active href="#store">
        Store
      </NavigationLink>
      <NavigationLink href="#auction">Auction</NavigationLink>
      <NavigationLink href="#grade">Grade</NavigationLink>
      <NavigationLink href="#locator">Store Locator</NavigationLink>
    </NavigationList>
  ),
};
