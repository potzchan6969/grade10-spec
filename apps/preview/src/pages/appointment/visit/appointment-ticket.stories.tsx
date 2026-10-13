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
  title: "Appointment/Visit/Ticket",
  component: AppointmentTicketPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { state: "waiting" },
} satisfies Meta<typeof AppointmentTicketPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** In line: Leave the line asks first, then the ticket says it left. */
export const Waiting: Story = {
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

export const Next: Story = { args: { state: "next" } };

export const Called: Story = { args: { state: "called" } };

/** No signal: the last place it knew, and leaving waits for it. */
export const Offline: Story = {
  args: { state: "offline" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Leave the line" }),
    ).toBeDisabled();
  },
};

export const Missed: Story = { args: { state: "missed" } };

export const Left: Story = { args: { state: "left" } };

export const Seen: Story = { args: { state: "seen" } };

export const Closed: Story = { args: { state: "closed" } };

export const Loading: Story = { args: { state: "loading" } };

export const NotFound: Story = { args: { state: "notFound" } };
