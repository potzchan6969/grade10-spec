import { Button } from "@acetrader/pred-spec-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Shared/Button",
	component: Button,
	args: {
		children: "Continue",
		tone: "primary",
	},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

export const Danger: Story = {
	args: {
		tone: "danger",
	},
};
