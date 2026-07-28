import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a market" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="btc">BTC / USD</SelectItem>
          <SelectItem value="eth">ETH / USD</SelectItem>
          <SelectItem value="sol">SOL / USD</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="eth">
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="btc">BTC / USD</SelectItem>
          <SelectItem value="eth">ETH / USD</SelectItem>
          <SelectItem value="sol">SOL / USD</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Small: Story = {
  render: () => (
    <Select defaultValue="btc">
      <SelectTrigger size="sm" className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="btc">BTC / USD</SelectItem>
          <SelectItem value="eth">ETH / USD</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a market" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Crypto</SelectLabel>
          <SelectItem value="btc">BTC / USD</SelectItem>
          <SelectItem value="eth">ETH / USD</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Equities</SelectLabel>
          <SelectItem value="aapl">AAPL</SelectItem>
          <SelectItem value="nvda">NVDA</SelectItem>
          <SelectItem value="tsla" disabled>
            TSLA (halted)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select defaultValue="btc" disabled>
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="btc">BTC / USD</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex w-48 flex-col gap-2">
      <Label htmlFor="market">Market</Label>
      <Select>
        <SelectTrigger id="market" className="w-48">
          <SelectValue placeholder="Select a market" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="btc">BTC / USD</SelectItem>
          <SelectItem value="eth">ETH / USD</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
