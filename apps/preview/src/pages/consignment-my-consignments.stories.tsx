import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { MyConsignmentList, type MyConsignmentsState } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import {
  MY_CONSIGNMENT_STORY_ID,
  MY_CONSIGNMENTS,
  MY_CONSIGNMENTS_COPY,
} from "./consignment-mine-content";
import { PageHeader, VaultPageShell } from "./vault-shared";
import { navigateToStory } from "./workbench-story-nav";

/**
 * Your consignments as the site assembles it: the page chrome, then the
 * shared list. Open goes to the record story; a failed read retries into the
 * list, and signing in reads it.
 */
function MyConsignmentsPage({ initial }: { initial: MyConsignmentsState }) {
  const [state, setState] = useState(initial);
  const read = () => setState({ status: "ready", data: MY_CONSIGNMENTS });
  return (
    <VaultPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href="#account">Account</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Your consignments</BreadcrumbItem>
      </Breadcrumbs>
      <PageHeader
        description="What you sell through Grade10: where each item stands, what it sold for and when you are paid."
        title="Your consignments"
      />
      <MyConsignmentList
        copy={MY_CONSIGNMENTS_COPY}
        onOpen={() => navigateToStory(MY_CONSIGNMENT_STORY_ID)}
        onRetry={read}
        onSignIn={read}
        state={state}
      />
    </VaultPageShell>
  );
}

const meta = {
  title: "Pages/Consignment/My Consignments",
  component: MyConsignmentsPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { initial: { status: "ready", data: MY_CONSIGNMENTS } },
} satisfies Meta<typeof MyConsignmentsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The consignor's consignments, newest first. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Your consignments" }),
    ).toBeVisible();
    expect(canvas.getByText("Consignment CN-2026-0042")).toBeVisible();
    expect(canvas.getByText("Owed to you: HK$8,500.00")).toBeInTheDocument();
    expect(canvas.getAllByRole("button", { name: "Open" })).toHaveLength(3);
  },
};

/** Nothing handed to Grade10 yet. */
export const Empty: Story = {
  args: { initial: { status: "ready", data: [] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Nothing consigned yet")).toBeVisible();
  },
};

export const Loading: Story = { args: { initial: { status: "loading" } } };

/** The read refused; its retry reads the list. */
export const Refused: Story = {
  args: { initial: { status: "error" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
    expect(canvas.getByText("Consignment CN-2026-0042")).toBeVisible();
  },
};

/** Signed out: the invitation to sign in, and nothing read. */
export const SignedOut: Story = {
  args: { initial: { status: "signedOut" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Sign in to see your consignments")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
    expect(canvas.getByText("Consignment CN-2026-0042")).toBeVisible();
  },
};
