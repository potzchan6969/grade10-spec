import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Button } from "@grade10/design-system/components/forms/button";
import { VisitTicketBody, type VisitTone } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { AppointmentPageShell } from "../../vault-shared";
import {
  BOOK_HREF,
  TICKET_COPY,
  TICKET_FACTS,
  TICKET_RECONNECTING_COPY,
} from "./appointment-visit-content";

type TicketPhase = keyof typeof TICKET_COPY;
type TicketState = TicketPhase | "offline" | "loading" | "notFound";

const TONE: Record<TicketPhase, VisitTone> = {
  waiting: "plain",
  next: "warn",
  called: "ink",
  seen: "ok",
  missed: "warn",
  left: "plain",
  closed: "plain",
};

const LIVE: ReadonlySet<TicketPhase> = new Set(["waiting", "next", "called"]);

/** One ticket in its phase, Leave the line asking before it leaves. */
function Ticket({ phase, offline }: { phase: TicketPhase; offline: boolean }) {
  const [asking, setAsking] = useState(false);
  const [left, setLeft] = useState(false);
  const shown: TicketPhase = left ? "left" : phase;
  const live = LIVE.has(shown);
  const copy = TICKET_COPY[shown];
  return (
    <VisitTicketBody
      asking={asking}
      bookHref={BOOK_HREF}
      copy={
        offline
          ? {
              ...copy,
              phase: "As of 11:58",
              estimate: undefined,
              line: "The wait shows again once you’re back online.",
            }
          : copy
      }
      facts={TICKET_FACTS}
      failed={false}
      live={live}
      offline={offline}
      onAsk={() => setAsking(true)}
      onKeep={() => setAsking(false)}
      onLeave={() => {
        setAsking(false);
        setLeft(true);
      }}
      pending={false}
      reconnecting={
        offline
          ? { copy: TICKET_RECONNECTING_COPY, busy: false, onRetry: () => {} }
          : undefined
      }
      step={live ? shown : undefined}
      ticket="W-014"
      tone={offline ? "plain" : TONE[shown]}
    />
  );
}

function TicketBody({ state }: { state: TicketState }) {
  if (state === "loading") {
    return <Skeleton className="h-96 w-full" data-slot="ticket-loading" />;
  }
  if (state === "notFound") {
    return (
      <EmptyState
        actions={
          <Button render={<a href={BOOK_HREF} />} size="md">
            Book a time
          </Button>
        }
        data-slot="ticket-not-found"
        description="Ask at the counter and staff show your ticket again."
        title="This link doesn’t open a ticket"
      />
    );
  }
  if (state === "offline") return <Ticket offline phase="waiting" />;
  return <Ticket offline={false} phase={state} />;
}

/** A walk-in's ticket on their own phone. */
function AppointmentTicketPage({ state }: { state: TicketState }) {
  return (
    <AppointmentPageShell>
      <div className="w-full max-w-2xl">
        <TicketBody state={state} />
      </div>
    </AppointmentPageShell>
  );
}

const meta = {
  title: "Appointment/Visit/Screens/Ticket",
  component: AppointmentTicketPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { state: "waiting" },
} satisfies Meta<typeof AppointmentTicketPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** In line: Leave the line asks first, then the ticket says it left. */
export const Waiting: Story = {
  parameters: {
    verification: { caseId: "vc_ecc511f7-7161-49a6-8747-13fd3fe86ed9" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("3rd in line")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Leave the line" }),
    );
    await userEvent.click(
      within(canvas.getByRole("region", { name: "Leave the line?" })).getByRole(
        "button",
        { name: "Leave the line" },
      ),
    );
    expect(canvas.getByText("You left the line")).toBeVisible();
  },
};

export const Next: Story = {
  parameters: {
    verification: { caseId: "vc_a05f2d52-ac74-4596-87cd-0e1a1ebfc95a" },
  },
  args: { state: "next" },
};

export const Called: Story = {
  parameters: {
    verification: { caseId: "vc_a17cd0ca-c1f0-41b5-9332-fc10e4fd5e11" },
  },
  args: { state: "called" },
};

/** No signal: the last place it knew, and leaving waits for it. */
export const Offline: Story = {
  parameters: {
    verification: { caseId: "vc_54ae3f1c-3c8e-4677-b994-5d56e40b05a2" },
  },
  args: { state: "offline" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Leave the line" }),
    ).toBeDisabled();
  },
};

export const Missed: Story = {
  parameters: {
    verification: { caseId: "vc_96b9a005-50e0-492e-ba0d-79cc06f4b10f" },
  },
  args: { state: "missed" },
};

export const Left: Story = {
  parameters: {
    verification: { caseId: "vc_e41b1f8f-733d-455d-b062-6766a672c381" },
  },
  args: { state: "left" },
};

export const Seen: Story = {
  parameters: {
    verification: { caseId: "vc_79fc88ba-66fe-4448-b46b-ae4a7f8a09f2" },
  },
  args: { state: "seen" },
};

export const Closed: Story = {
  parameters: {
    verification: { caseId: "vc_50cb8bf0-ae29-48e2-a116-75b2d7dee4b5" },
  },
  args: { state: "closed" },
};

export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_3f535112-5320-47b1-8f3c-4a7731e2ee33" },
  },
  args: { state: "loading" },
};

export const NotFound: Story = {
  parameters: {
    verification: { caseId: "vc_4dbb37a7-429f-4fb3-9598-3fbba9eafdc6" },
  },
  args: { state: "notFound" },
};
