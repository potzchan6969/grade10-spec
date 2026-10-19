import { Alert } from "@grade10/design-system/components/display/alert";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import {
  BookingConfirmation,
  BookingLocationPicker,
  BookingManageCard,
  type BookingSlot,
  BookingSlotPicker,
  FactCard,
  NoteList,
} from "@grade10/ui";
import { useState } from "react";
import {
  DROP_OFF_BOOKED_STORY_IDS,
  DROP_OFF_BULK_VISIT,
  DROP_OFF_CARDS_LEAVE_LINE,
  DROP_OFF_COPY,
  DROP_OFF_DAYS,
  DROP_OFF_MAX_MONTH,
  DROP_OFF_MIN_MONTH,
  DROP_OFF_MOVED_VISIT,
  DROP_OFF_NOW,
  DROP_OFF_SHOP,
  DROP_OFF_SHOP_LINES,
  DROP_OFF_TIME_ZONE,
  DROP_OFF_TIME_ZONE_LABEL,
  DROP_OFF_TODAY,
  DROP_OFF_VISIT,
  type DropOffBookedState,
  type DropOffBookState,
  dropOffSlots,
} from "./drop-off-content";

const noop = () => undefined;

const SLOT_COPY = {
  dayTitle: "Choose a day",
  timeTitle: "Choose a time",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  timesIn: DROP_OFF_COPY.days.timesIn,
  pickADay: DROP_OFF_COPY.days.pick,
  noTimes: DROP_OFF_COPY.days.nothingFree,
};

const SHOP_LOCATIONS = { status: "ready", data: [DROP_OFF_SHOP] } as const;
const DAYS = { status: "ready", data: DROP_OFF_DAYS } as const;

/** The calendar and the day's times; the times read in the shop's zone. */
function DayPicker({
  selectedDate,
  selectedStart,
  slots = [],
  onSelectSlot = noop,
}: {
  selectedDate?: string;
  selectedStart?: number;
  slots?: readonly BookingSlot[];
  onSelectSlot?: () => void;
}) {
  return (
    <BookingSlotPicker
      copy={SLOT_COPY}
      days={DAYS}
      maxMonth={DROP_OFF_MAX_MONTH}
      minMonth={DROP_OFF_MIN_MONTH}
      month={DROP_OFF_MIN_MONTH}
      onMonthChange={noop}
      onSelectDay={noop}
      onSelectSlot={() => onSelectSlot()}
      selectedDate={selectedDate}
      selectedStart={selectedStart}
      slots={{ status: "ready", data: slots }}
      timeZone={DROP_OFF_TIME_ZONE}
      timeZoneLabel={DROP_OFF_TIME_ZONE_LABEL}
      today={DROP_OFF_TODAY}
    />
  );
}

/** Book the drop-off: the list, the shop, the day, the batch it makes and the time. */
function DropOffBookPanel({
  state,
  onContinue,
}: {
  state: DropOffBookState;
  onContinue?: () => void;
}) {
  const [ticked, setTicked] = useState(false);
  const { lead, batchLine, times, refusal, joins, resized } = DROP_OFF_COPY;
  const slots = dropOffSlots("2026-10-20");

  if (state === "statement")
    return (
      <FactCard
        actions={
          <Button disabled={!ticked} onClick={onContinue}>
            {DROP_OFF_COPY.statement.choose}
          </Button>
        }
        copy={{ title: DROP_OFF_COPY.statement.title }}
        lead={DROP_OFF_COPY.statement.body}
      >
        <CheckboxListInput
          checked={ticked}
          onCheckedChange={(value) => setTicked(value === true)}
          size="sm"
        >
          {DROP_OFF_COPY.statement.tick}
        </CheckboxListInput>
      </FactCard>
    );

  if (state === "lead" || state === "bulk-lead")
    return (
      <FactCard
        actions={<Button onClick={onContinue}>{lead.continue}</Button>}
        copy={{ title: lead.title }}
        lead={state === "bulk-lead" ? DROP_OFF_COPY.bulk.lead : undefined}
        rows={[
          {
            label: lead.cards,
            value: state === "bulk-lead" ? "24" : "12",
          },
          {
            label: lead.visit,
            value:
              state === "bulk-lead"
                ? DROP_OFF_COPY.bulk.note
                : "About 20 minutes",
          },
          { label: lead.paid, value: lead.paidValue },
        ]}
      />
    );

  if (state === "shop")
    return (
      <div className="flex flex-col gap-4">
        <BookingLocationPicker
          copy={{ title: DROP_OFF_COPY.shop.title }}
          locations={SHOP_LOCATIONS}
          onSelect={noop}
          selectedId={DROP_OFF_SHOP.id}
        />
        <Text size="sm">{DROP_OFF_SHOP_LINES.durations}</Text>
        <Text size="sm" tone="secondary">
          {DROP_OFF_COPY.shop.more}
        </Text>
        <Text size="sm" tone="secondary">
          {DROP_OFF_SHOP_LINES.alreadyBooked}
        </Text>
        <div>
          <Button onClick={onContinue}>{DROP_OFF_COPY.shop.choose}</Button>
        </div>
      </div>
    );

  if (state === "days") return <DayPicker />;

  if (state === "batch-line" || state === "batch-line-past-cut-off")
    return (
      <div className="flex flex-col gap-4">
        <DayPicker
          selectedDate={state === "batch-line" ? "2026-10-20" : "2026-10-24"}
          slots={dropOffSlots(
            state === "batch-line" ? "2026-10-20" : "2026-10-24",
          )}
        />
        <div className="flex flex-col gap-2 rounded-xl border border-border p-4">
          <Text weight="medium">{batchLine.title}</Text>
          <Text size="sm" tone="secondary">
            {state === "batch-line" ? batchLine.hand : batchLine.pastCutOff}
          </Text>
        </div>
      </div>
    );

  if (state === "times")
    return (
      <div className="flex flex-col gap-4">
        <DayPicker
          selectedDate="2026-10-20"
          selectedStart={slots[0]?.start}
          slots={slots}
        />
        <Text size="sm" tone="secondary">
          {times.zone}
        </Text>
        <div>
          <Button onClick={onContinue}>{times.book}</Button>
        </div>
      </div>
    );

  if (state === "nothing-free")
    return <DayPicker selectedDate="2026-10-21" slots={[]} />;

  if (state === "diary-refuses")
    return (
      <div className="flex flex-col gap-4">
        <Alert
          description={refusal.body}
          status="error"
          title={refusal.title}
        />
        <DayPicker
          selectedDate="2026-10-20"
          selectedStart={slots[1]?.start}
          slots={slots.slice(1)}
        />
      </div>
    );

  if (state === "joins-visit")
    return (
      <FactCard
        actions={<Button onClick={onContinue}>{joins.join}</Button>}
        copy={{ title: joins.title }}
        rows={[
          { label: DROP_OFF_COPY.booked.when, value: joins.visit },
          { label: DROP_OFF_COPY.lead.cards, value: joins.list },
        ]}
      />
    );

  return (
    <div className="flex flex-col gap-4">
      <Alert
        description={resized.body}
        status="warning"
        title={resized.title}
      />
      <DayPicker
        selectedDate="2026-10-20"
        selectedStart={dropOffSlots("2026-10-20", 45)[0]?.start}
        slots={dropOffSlots("2026-10-20", 45)}
      />
    </div>
  );
}

/** Drop-off booked: the visit, what to bring, and the list it belongs to. */
function DropOffBookedPanel({
  state,
  onContinue,
  onOpenList,
}: {
  state: DropOffBookedState;
  onContinue?: () => void;
  onOpenList?: () => void;
}) {
  const copy = DROP_OFF_COPY.booked;
  const record =
    state === "bulk"
      ? DROP_OFF_BULK_VISIT
      : state === "moved"
        ? DROP_OFF_MOVED_VISIT
        : state === "visit-detached"
          ? { ...DROP_OFF_VISIT, state: "cancelled" as const }
          : DROP_OFF_VISIT;
  const notes =
    state === "fee-with-cover"
      ? DROP_OFF_COPY.beforeYouCome.map((note) =>
          note.id === "signature"
            ? {
                ...note,
                content: `${note.content} ${DROP_OFF_COPY.feeWithCover}`,
              }
            : note,
        )
      : state === "cards-leave"
        ? DROP_OFF_COPY.beforeYouCome.map((note) =>
            note.id === "leave"
              ? { ...note, content: DROP_OFF_CARDS_LEAVE_LINE }
              : note,
          )
        : DROP_OFF_COPY.beforeYouCome;

  return (
    <div className="flex flex-col gap-6">
      {state === "moved" ? (
        <Alert
          description={DROP_OFF_COPY.moved.body}
          status="success"
          title={DROP_OFF_COPY.moved.title}
        />
      ) : null}
      {state === "vault-line" ? (
        <Alert
          description={DROP_OFF_COPY.vault.body}
          title={DROP_OFF_COPY.vault.title}
        />
      ) : null}
      {state === "joined" ? (
        <Alert
          description={DROP_OFF_COPY.joins.list}
          title={DROP_OFF_COPY.joins.title}
        />
      ) : null}
      {state === "visit-detached" ? (
        <Alert
          actions={
            <Button onClick={onContinue}>
              {DROP_OFF_COPY.detached.bookAgain}
            </Button>
          }
          description={DROP_OFF_COPY.detached.body}
          status="warning"
          title={DROP_OFF_COPY.detached.title}
        />
      ) : (
        <BookingConfirmation
          calendarHref="#add-to-calendar"
          copy={copy}
          description={
            <NoteList copy={{ label: copy.beforeYouCome }} notes={notes} />
          }
          manageHref="#manage-visit"
          record={record}
          timeZoneLabel={DROP_OFF_TIME_ZONE_LABEL}
        />
      )}
      {state !== "visit-detached" ? (
        <BookingManageCard
          copy={DROP_OFF_COPY.manage}
          now={DROP_OFF_NOW}
          onCancel={noop}
          onMove={noop}
          record={record}
          timeZoneLabel={DROP_OFF_TIME_ZONE_LABEL}
        />
      ) : null}
      <div>
        <Button onClick={onOpenList} variant="outline">
          {copy.openList}
        </Button>
      </div>
    </div>
  );
}

/** One step of a flow: a booking step or the booked view, by its state. */
function DropOffStep({
  state,
  onContinue,
  onOpenList,
}: {
  state: DropOffBookState | DropOffBookedState;
  onContinue?: () => void;
  onOpenList?: () => void;
}) {
  if (state in DROP_OFF_BOOKED_STORY_IDS)
    return (
      <DropOffBookedPanel
        onContinue={onContinue}
        onOpenList={onOpenList}
        state={state as DropOffBookedState}
      />
    );
  return (
    <DropOffBookPanel
      onContinue={onContinue}
      state={state as DropOffBookState}
    />
  );
}

export { DropOffBookedPanel, DropOffBookPanel, DropOffStep };
