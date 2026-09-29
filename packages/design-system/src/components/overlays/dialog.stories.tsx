import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
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

/** How far a focused control paints past its own box: the widest outer
 * `box-shadow` it computes once its focus transition ends. */
async function ringOf(control: HTMLElement) {
  control.focus();
  await Promise.all(control.getAnimations().map((motion) => motion.finished));
  const reach = [
    ...getComputedStyle(control).boxShadow.matchAll(
      /(-?[\d.]+)px (-?[\d.]+)px ([\d.]+)px (-?[\d.]+)px(?! inset)/g,
    ),
  ].map(
    ([, x, y, blur, spread]) =>
      Math.max(Math.abs(Number(x)), Math.abs(Number(y))) +
      Number(blur) +
      Number(spread),
  );
  return Math.max(0, ...reach);
}

/**
 * Controls flush against the body's edges keep their whole focus ring. The
 * body scrolls, so it clips at its own edge; the ring has to fit inside that
 * edge on every side, and the controls still span the header's column.
 */
export const FullWidthControls: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Button className="w-full" size="md" variant="outline">
            Continue With Google
          </Button>
          <DialogDescription>
            Or have a sign-in link sent to your email.
          </DialogDescription>
          <Button className="w-full" size="md">
            Send Link
          </Button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const dialog = await within(canvasElement.ownerDocument.body).findByRole(
      "dialog",
    );
    await Promise.all(dialog.getAnimations().map((motion) => motion.finished));
    const slot = (name: string) => {
      const node = dialog.querySelector(`[data-slot="${name}"]`);
      if (node === null) throw new Error(`The dialog renders no ${name}`);
      return node.getBoundingClientRect();
    };
    const button = (name: string) =>
      within(dialog).getByRole("button", { name });
    const clip = slot("dialog-body");
    const column = slot("dialog-header");
    const first = button("Continue With Google");
    const last = button("Send Link");
    const top = first.getBoundingClientRect();
    const bottom = last.getBoundingClientRect();
    const ring = await ringOf(first);

    expect(ring).toBeGreaterThan(0);
    expect(await ringOf(last)).toBe(ring);
    expect(top.left).toBeCloseTo(column.left, 1);
    expect(top.right).toBeCloseTo(column.right, 1);
    expect(top.top - ring).toBeGreaterThanOrEqual(clip.top);
    expect(top.left - ring).toBeGreaterThanOrEqual(clip.left);
    expect(top.right + ring).toBeLessThanOrEqual(clip.right);
    expect(bottom.bottom + ring).toBeLessThanOrEqual(clip.bottom);
  },
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
