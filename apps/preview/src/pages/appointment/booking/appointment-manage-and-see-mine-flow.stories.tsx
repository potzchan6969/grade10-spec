import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { BookingManageCard, BookingSlotPicker } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  APPOINTMENTS_COPY,
  COMPLETED_VISIT_RECORD,
  GRADING_VISIT_RECORD,
  MANAGE_CARD_COPY,
  SLOT_PICKER_COPY,
  slotsForVisitDay,
  VISIT_DAYS,
  VISIT_MAX_MONTH,
  VISIT_MIN_MONTH,
  VISIT_NOW_MS,
  VISIT_RECORD,
  VISIT_TIME_ZONE,
  VISIT_TODAY_DATE,
} from "../../vault-content";
import {
  MANAGE_AND_SEE_MINE_CASES,
  MANAGE_AND_SEE_MINE_DESCRIPTION,
  MANAGED_VISIT_RECORD,
} from "./appointment-booking-flow-content";

const meta = {
  title: "Appointment/Booking/Flows/Manage And See Mine",
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-appointment-booking-US-02"],
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const TIME_ZONE_LABEL = "Asia/Hong Kong time";
const noop = () => {};

type ManageStep = keyof typeof MANAGE_AND_SEE_MINE_CASES;

const CASES: ReadonlyArray<readonly [string, ManageStep]> = [
  [MANAGE_AND_SEE_MINE_CASES.live, "live"],
  [MANAGE_AND_SEE_MINE_CASES.moving, "moving"],
  [MANAGE_AND_SEE_MINE_CASES.cancelled, "cancelled"],
  [MANAGE_AND_SEE_MINE_CASES.mine, "mine"],
];

/** The collector's step on the link, or the list of their visits when signed in. */
function ManageStepBody({ step }: { step: ManageStep }) {
  if (step === "mine") {
    return (
      <VStack gap="lg" hAlign="stretch">
        <VStack gap="sm" hAlign="stretch">
          <Text as="h2" size="lg" weight="medium">
            {APPOINTMENTS_COPY.upcomingHeading}
          </Text>
          <BookingManageCard
            copy={MANAGE_CARD_COPY}
            now={VISIT_NOW_MS}
            onCancel={noop}
            onMove={noop}
            record={GRADING_VISIT_RECORD}
            timeZoneLabel={TIME_ZONE_LABEL}
          />
          <BookingManageCard
            copy={MANAGE_CARD_COPY}
            now={VISIT_NOW_MS}
            onCancel={noop}
            onMove={noop}
            record={VISIT_RECORD}
            timeZoneLabel={TIME_ZONE_LABEL}
          />
        </VStack>
        <VStack gap="sm" hAlign="stretch">
          <Text as="h2" size="lg" weight="medium">
            {APPOINTMENTS_COPY.pastHeading}
          </Text>
          <BookingManageCard
            copy={MANAGE_CARD_COPY}
            now={VISIT_NOW_MS}
            onCancel={noop}
            onMove={noop}
            record={COMPLETED_VISIT_RECORD}
            timeZoneLabel={TIME_ZONE_LABEL}
          />
        </VStack>
      </VStack>
    );
  }
  return (
    <VStack gap="lg" hAlign="stretch">
      <BookingManageCard
        copy={MANAGE_CARD_COPY}
        now={VISIT_NOW_MS}
        onCancel={noop}
        onMove={noop}
        record={
          step === "cancelled"
            ? { ...MANAGED_VISIT_RECORD, state: "cancelled" }
            : MANAGED_VISIT_RECORD
        }
        timeZoneLabel={TIME_ZONE_LABEL}
      />
      {step === "moving" ? (
        <BookingSlotPicker
          copy={SLOT_PICKER_COPY}
          days={{ status: "ready", data: VISIT_DAYS }}
          month="2026-09"
          maxMonth={VISIT_MAX_MONTH}
          minMonth={VISIT_MIN_MONTH}
          onMonthChange={noop}
          onSelectDay={noop}
          onSelectSlot={noop}
          selectedDate="2026-09-03"
          selectedStart={MANAGED_VISIT_RECORD.start}
          slots={{
            status: "ready",
            data: slotsForVisitDay("2026-09-03"),
          }}
          timeZone={VISIT_TIME_ZONE}
          timeZoneLabel={TIME_ZONE_LABEL}
          today={VISIT_TODAY_DATE}
        />
      ) : null}
    </VStack>
  );
}

/** A visit from the mail, moved, cancelled, and listed once the collector is signed in. */
export const ManageAndSeeMine: Story = {
  render: () => (
    <FlowContainer
      cases={CASES}
      description={<p>{MANAGE_AND_SEE_MINE_DESCRIPTION}</p>}
    >
      {(step) => <ManageStepBody step={step} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [index, [title]] of CASES.entries()) {
      if (index > 0) {
        await userEvent.click(canvas.getByRole("button", { name: "Next" }));
      }
      expect(canvas.getByText(title)).toBeVisible();
    }
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    for (const [title] of CASES) {
      expect(canvas.getByText(title)).toBeInTheDocument();
    }
  },
};
