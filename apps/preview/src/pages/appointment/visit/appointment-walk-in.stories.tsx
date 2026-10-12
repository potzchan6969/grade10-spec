import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { EmptyPanel, VisitWaitBody } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AppointmentPageShell } from "../../vault-shared";
import {
  BOOK_HREF,
  OTHER_SHOPS,
  PAUSED_SERVICES,
  SHOP,
  WAIT_COPY,
  WAIT_SERVICES,
} from "./appointment-visit-content";

type WalkInState = "open" | "paused" | "closedToday" | "loading" | "notFound";

function WalkInBody({ state }: { state: WalkInState }) {
  if (state === "loading") {
    return <Skeleton className="h-96 w-full" data-slot="wait-loading" />;
  }
  if (state === "notFound") {
    return (
      <EmptyPanel
        actions={
          <HStack gap="md">
            <Button size="md" variant="outline">
              Try again
            </Button>
            <Link href={BOOK_HREF}>Book a time</Link>
          </HStack>
        }
        copy={{
          title: "This shop’s wait could not be read",
          description: "Check the address on the poster, or book a time.",
        }}
        slot="wait-error"
      />
    );
  }
  if (state === "paused") {
    return (
      <VisitWaitBody
        bookHref={BOOK_HREF}
        closedToday={false}
        copy={{
          ...WAIT_COPY,
          paused: {
            title: "Walk-ins are paused",
            body: "We’re seeing booked visits only for now. Book a time and we’ll see you then. Walk-ins start again at 14:00.",
          },
        }}
        open
        otherShops={[]}
        services={PAUSED_SERVICES}
      />
    );
  }
  if (state === "closedToday") {
    return (
      <VisitWaitBody
        bookHref={BOOK_HREF}
        closedToday
        copy={{
          ...WAIT_COPY,
          status: "Closed today",
          hours: "Thu 3 Sep",
          closed: {
            title: `${SHOP} is closed today`,
            body: "Typhoon signal 8. We open again Fri 4 Sep, 10:00.",
          },
        }}
        open={false}
        otherShops={OTHER_SHOPS}
        services={WAIT_SERVICES}
      />
    );
  }
  return (
    <VisitWaitBody
      bookHref={BOOK_HREF}
      closedToday={false}
      copy={WAIT_COPY}
      open
      otherShops={[]}
      services={WAIT_SERVICES}
    />
  );
}

/** The door poster's page, opened from the address it shows. */
function AppointmentWalkInPage({ state }: { state: WalkInState }) {
  return (
    <AppointmentPageShell>
      <div className="w-full max-w-2xl">
        <WalkInBody state={state} />
      </div>
    </AppointmentPageShell>
  );
}

const meta = {
  title: "Appointment/Visit/Walk In",
  component: AppointmentWalkInPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { state: "open" },
} satisfies Meta<typeof AppointmentWalkInPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Open: the wait for each service now, and Book for a booked-only one. */
export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: SHOP })).toBeVisible();
    expect(canvas.getByText("About 15 to 25 min")).toBeVisible();
    expect(
      canvas.getByRole("link", {
        name: "Book a time for Store/Auction Listing",
      }),
    ).toBeVisible();
  },
};

/** Walk-ins paused: every service offers booking instead. */
export const Paused: Story = { args: { state: "paused" } };

/** Closed today: the other shops open today replace the wait. */
export const ClosedToday: Story = {
  args: { state: "closedToday" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("region", { name: "Open today" })).toBeVisible();
  },
};

export const Loading: Story = { args: { state: "loading" } };

/** A poster address that names no shop. */
export const NotFound: Story = { args: { state: "notFound" } };
