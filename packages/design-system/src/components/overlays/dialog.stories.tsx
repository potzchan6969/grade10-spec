import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../forms/button";
import { Input } from "../forms/input";
import { Label } from "../forms/label";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogSubtext,
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
          <DialogTitle>Title</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Short supporting copy for the action. Keep it to one or two
            sentences.
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="md" />}>
            Cancel
          </DialogClose>
          <DialogClose render={<Button size="md" />}>Confirm</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Optional muted line under the title; body prose stays in `DialogBody`. */
export const WithSubtext: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
          <DialogSubtext>
            Optional short line under the title. Use for a brief hint.
          </DialogSubtext>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Body copy sits here at the base text size. Use it for the detail the
            reader needs before they confirm.
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="md" />}>
            Cancel
          </DialogClose>
          <DialogClose render={<Button size="md" />}>Confirm</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Keep titles short and action-oriented; a long Title Case title truncates. */
export const LongTitle: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete This Prediction and Every Wager Tied to It
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="md" />}>
            Cancel
          </DialogClose>
          <DialogClose render={<Button variant="destructive" size="md" />}>
            Delete
          </DialogClose>
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
          <DialogTitle>Round Settled</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Payouts have been credited to your balance.
          </DialogDescription>
        </DialogBody>
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
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Changes are visible to everyone on the leaderboard.
          </DialogDescription>
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
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="md" />}>
            Cancel
          </DialogClose>
          <DialogClose render={<Button size="md" />}>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Set `showCloseButton={false}` on the header when the footer already offers a way out. */
export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader showCloseButton={false}>
          <DialogTitle>Delete Prediction</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="md" />}>
            Cancel
          </DialogClose>
          <DialogClose render={<Button variant="destructive" size="md" />}>
            Delete
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Tall body content scrolls between the pinned header and footer. */
export const ScrollableBody: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {Array.from({ length: 24 }, (_, index) => {
            const label = `Paragraph ${index + 1}`;
            return (
              <p key={label}>
                {label}. The body owns overflow so the title and actions stay in
                view.
              </p>
            );
          })}
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="md" />}>
            Cancel
          </DialogClose>
          <DialogClose render={<Button size="md" />}>Accept</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
