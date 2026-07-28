import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../forms/button";
import { Input } from "../forms/input";
import { Label } from "../forms/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm your prediction</DialogTitle>
          <DialogDescription>
            This locks in your position. You can’t change it after the round
            closes.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <DialogClose render={<Button />}>Confirm</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** `DialogFooter` can supply its own close button instead. */
export const WithFooterClose: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Round settled</DialogTitle>
          <DialogDescription>
            Payouts have been credited to your balance.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit profile
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Changes are visible to everyone on the leaderboard.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="display-name">Display name</Label>
            <Input id="display-name" defaultValue="satoshi" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <DialogClose render={<Button />}>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Set `showCloseButton={false}` when the footer already offers a way out. */
export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete prediction</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <DialogClose render={<Button variant="destructive" />}>
            Delete
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
