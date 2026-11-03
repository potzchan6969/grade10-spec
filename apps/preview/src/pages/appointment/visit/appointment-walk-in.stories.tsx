import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Button } from "@grade10/design-system/components/forms/button";
import { VisitWaitBody } from "@grade10/ui";
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
      <EmptyState
        actions={
          <>
            <Button size="md" variant="secondary">
              Try again
            </Button>
            <Button render={<a href={BOOK_HREF} />} size="md">
              Book a time
            </Button>
          </>
        }
        data-slot="wait-error"
        description="Check the address on the poster, or book a time."
        title="This shop’s wait could not be read"
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
  title: "Appointment/Visit/Screens/Walk In",
  component: AppointmentWalkInPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { state: "open" },
} satisfies Meta<typeof AppointmentWalkInPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Open: the wait for each service now, and Book for a booked-only one. */
export const Open: Story = {
  parameters: {
    verification: { caseId: "vc_4a90e417-91b5-44bb-85de-4fbf0a65381a" },
  },
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
export const Paused: Story = {
  parameters: {
    verification: { caseId: "vc_4adfd95f-6019-47ad-8f0c-20418429f53b" },
  },
  args: { state: "paused" },
};

/** Closed today: the other shops open today replace the wait. */
export const ClosedToday: Story = {
  parameters: {
    verification: { caseId: "vc_2cfae37e-bd3f-403e-b3d3-c2ab5e5a2055" },
  },
  args: { state: "closedToday" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("region", { name: "Open today" })).toBeVisible();
  },
};

export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_4bb12d5e-09dc-4589-9806-9a5f8127f666" },
  },
  args: { state: "loading" },
};

/** A poster address that names no shop. */
export const NotFound: Story = {
  parameters: {
    verification: { caseId: "vc_9f1800ec-ed94-491f-b88b-71d1c54be0f1" },
  },
  args: { state: "notFound" },
};
