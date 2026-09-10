import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../forms/button";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Floating inset drawer. Default edge is `right`; pass `swipeDirection` for other edges.",
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoBody() {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Title</DrawerTitle>
        <DrawerDescription>
          Supporting text for the drawer. Swipe the panel or press Escape to
          dismiss.
        </DrawerDescription>
      </DrawerHeader>
      <DrawerBody>
        <p>Body content sits here at the base text size.</p>
      </DrawerBody>
      <DrawerFooter>
        <DrawerClose render={<Button size="md" className="w-full" />}>
          Confirm
        </DrawerClose>
      </DrawerFooter>
    </>
  );
}

/** Default Grade10 edge — trailing inset panel. */
export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <DemoBody />
      </DrawerContent>
    </Drawer>
  ),
};

export const FromBottom: Story = {
  render: () => (
    <Drawer swipeDirection="down" showSwipeHandle>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open bottom drawer
      </DrawerTrigger>
      <DrawerContent>
        <DemoBody />
      </DrawerContent>
    </Drawer>
  ),
};

export const FromLeft: Story = {
  render: () => (
    <Drawer swipeDirection="left">
      <DrawerTrigger render={<Button variant="outline" />}>
        Open left drawer
      </DrawerTrigger>
      <DrawerContent>
        <DemoBody />
      </DrawerContent>
    </Drawer>
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader showCloseButton={false}>
          <DrawerTitle>Title</DrawerTitle>
          <DrawerDescription>
            Dismiss with Escape or an outside press.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p>Body content sits here at the base text size.</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose render={<Button size="md" />}>Confirm</DrawerClose>
          <DrawerClose render={<Button variant="outline" size="md" />}>
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/** Nested drawer stacks and scales the parent back. */
export const Nested: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Title</DrawerTitle>
          <DrawerDescription>
            Open a nested drawer from the footer.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p>Body content sits here at the base text size.</p>
        </DrawerBody>
        <DrawerFooter>
          <Drawer>
            <DrawerTrigger
              render={<Button variant="outline" size="md" className="w-full" />}
            >
              Open nested drawer
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Nested title</DrawerTitle>
                <DrawerDescription>Nested drawer content.</DrawerDescription>
              </DrawerHeader>
              <DrawerBody>
                <p>Body content sits here at the base text size.</p>
              </DrawerBody>
              <DrawerFooter>
                <DrawerClose render={<Button size="md" className="w-full" />}>
                  Confirm
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
