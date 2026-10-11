import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { MyConsignmentRecord, type MyConsignmentState } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import {
  MY_CONSIGNMENT,
  MY_CONSIGNMENT_COPY,
  MY_CONSIGNMENT_ENDED,
  MY_CONSIGNMENTS_STORY_ID,
} from "./consignment-mine-content";
import { VaultPageShell } from "./vault-shared";
import { navigateToStory, storyHref } from "./workbench-story-nav";

/**
 * One consignment as the site assembles it: the page chrome, then the shared
 * record. The way back goes to the list story; a failed read retries into
 * the record, and signing in reads it.
 */
function MyConsignmentPage({ initial }: { initial: MyConsignmentState }) {
  const [state, setState] = useState(initial);
  const read = () => setState({ status: "ready", data: MY_CONSIGNMENT });
  return (
    <VaultPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href="#account">Account</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem href={storyHref(MY_CONSIGNMENTS_STORY_ID)}>
          Your consignments
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Consignment</BreadcrumbItem>
      </Breadcrumbs>
      <MyConsignmentRecord
        copy={MY_CONSIGNMENT_COPY}
        onBack={() => navigateToStory(MY_CONSIGNMENTS_STORY_ID)}
        onRetry={read}
        onSignIn={read}
        state={state}
      />
    </VaultPageShell>
  );
}

const meta = {
  title: "Pages/Consignment/My Consignment",
  component: MyConsignmentPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { initial: { status: "ready", data: MY_CONSIGNMENT } },
} satisfies Meta<typeof MyConsignmentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One consignment on sale: where it stands, its items, its terms. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Consignment CN-2026-0042" }),
    ).toBeVisible();
    expect(canvas.getByText("Charizard Base Set")).toBeVisible();
    expect(canvas.getByRole("region", { name: "Your terms" })).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Your consignments" }),
    ).toBeVisible();
  },
};

/** Ended unsold: the status warns and the rail stops at On sale. */
export const Ended: Story = {
  args: { initial: { status: "ready", data: MY_CONSIGNMENT_ENDED } },
};

/** A reference that is not the consignor's. */
export const NotFound: Story = {
  args: { initial: { status: "notFound" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("We could not find that consignment"),
    ).toBeVisible();
  },
};

export const Loading: Story = { args: { initial: { status: "loading" } } };

/** The read refused; its retry reads the record. */
export const Refused: Story = {
  args: { initial: { status: "error" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
    expect(canvas.getByText("Charizard Base Set")).toBeVisible();
  },
};

/** Signed out: the invitation to sign in. */
export const SignedOut: Story = {
  args: { initial: { status: "signedOut" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Sign in to see your consignments")).toBeVisible();
  },
};
