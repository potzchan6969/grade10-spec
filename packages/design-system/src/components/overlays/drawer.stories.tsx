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
  title: "Design System/Overlays/Drawer",
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
  parameters: {
    verification: { caseId: "vc_59617e35-ba09-4ef6-89e3-0a907dc9f70a" },
  },
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
  parameters: {
    verification: { caseId: "vc_0e613fee-2225-4791-bdc3-1175cc5dad6d" },
  },
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
  parameters: {
    verification: { caseId: "vc_c659fa2f-aacd-42cf-b0fb-b2e55e327432" },
  },
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
  parameters: {
    verification: { caseId: "vc_2a0043fd-6758-48a7-bbb8-9f0221a2b241" },
  },
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
  parameters: {
    verification: { caseId: "vc_9cca03b4-854c-402e-91b4-38a96b7846a0" },
  },
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
