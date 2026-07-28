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
    <Card className="w-80 px-6">
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
