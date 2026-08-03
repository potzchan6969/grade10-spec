import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../forms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-60">
      <CardHeader>
        <CardTitle>Predictions</CardTitle>
        <CardDescription>Preview card from the design system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Get started</Button>
      </CardContent>
    </Card>
  ),
};

/** `padding={false}` is Figma's un-padded shell — for media or a nested grid
 * that supplies its own insets. */
export const WithoutPadding: Story = {
  render: () => (
    <Card className="w-60" padding={false}>
      <img
        alt=""
        className="aspect-video w-full object-cover"
        src="https://github.com/shadcn.png"
      />
    </Card>
  ),
};
