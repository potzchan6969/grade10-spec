import {
  BookingActionBar,
  BookingDetailsForm,
  type BookingDetailsValues,
  BookingLocationPicker,
  BookingNotice,
  BookingPayNotice,
  BookingServicePicker,
  type BookingSlot,
  BookingSlotPicker,
  BookingStepDots,
  BookingSummary,
  BookingSummaryBar,
  VisitBookedPass,
  VisitFullDay,
  VisitRefusedBook,
} from "@grade10/ui";
import { CircleNotch, Warning } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { AppointmentPageShell } from "../../vault-shared";
import {
  BOARD_MAX_MONTH,
  BOARD_MIN_MONTH,
  BOARD_SERVICES,
  BOARD_SHOPS,
  BOARD_TODAY,
  BOARD_ZONE,
  boardDays,
  boardSlots,
  DETAILS_COPY,
  hkSlot,
  ME,
  SLOT_COPY,
  SPECIAL_HOURS,
  SUMMARY_COPY,
  WORDS,
} from "./book-visit-board";

type Step = "service" | "location" | "time" | "details";
type Phase = "flow" | "booked" | "confirming" | "expired";
type Refusal = "taken" | "held" | "heldOut" | "tries" | null;

type Scenario =
  | "normal"
  | "time just taken"
  | "full day"
  | "already booked signed out"
  | "too many tries today"
  | "slow network"
  | "signed in, no phone on account"
  | "service needs a phone"
  | "paid service"
  | "booking for someone else"
  | "confirming payment"
  | "paid and booked"
  | "payment not completed";

type Moment = {
  step: Step;
  phase: Phase;
  service?: string;
  shop?: string;
  date?: string;
  slot?: BookingSlot;
  signedIn: boolean;
  accountPhone: string;
  phoneRequired: boolean;
  refusal: Refusal;
  busy: boolean;
  gone: readonly number[];
  bookedFor?: string;
};

const TAKEN = hkSlot("2026-10-22", "15:00");

/** Each scenario is one moment of the same booking. */
function preset(scenario: Scenario): Moment {
  const base: Moment = {
    step: "service",
    phase: "flow",
    signedIn: true,
    accountPhone: ME.phone,
    phoneRequired: false,
    refusal: null,
    busy: false,
    gone: [],
  };
  const typed: Moment = {
    ...base,
    step: "details",
    service: "drop",
    shop: "central",
    date: "2026-10-22",
    slot: TAKEN,
  };
  const paid: Moment = {
    ...typed,
    service: "bulk",
    slot: hkSlot("2026-10-22", "15:00", 45),
  };
  switch (scenario) {
    case "time just taken":
      return {
        ...typed,
        step: "time",
        slot: undefined,
        gone: [TAKEN.start],
        refusal: "taken",
      };
    case "full day":
      return { ...typed, step: "time", date: "2026-10-17", slot: undefined };
    case "already booked signed out":
      return { ...typed, signedIn: false, refusal: "heldOut" };
    case "too many tries today":
      return { ...typed, signedIn: false, refusal: "tries" };
    case "slow network":
      return { ...typed, busy: true };
    case "signed in, no phone on account":
      return { ...typed, accountPhone: "" };
    case "service needs a phone":
      return { ...typed, signedIn: false, phoneRequired: true };
    case "paid service":
      return paid;
    case "booking for someone else":
      return { ...typed, bookedFor: "Ben Chan" };
    case "confirming payment":
      return { ...paid, phase: "confirming" };
    case "paid and booked":
      return { ...paid, phase: "booked" };
    case "payment not completed":
      return { ...paid, phase: "expired" };
    default:
      return base;
  }
}

const dayName = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  })
    .format(new Date(`${date}T12:00:00Z`))
    .replace(",", "");

const timeOf = (at: number) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: BOARD_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(at);

const dateOf = (at: number) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: BOARD_ZONE }).format(at);

const LINK =
  "font-semibold text-foreground underline decoration-border-strong underline-offset-[3px]";

function BookVisitPage({ scenario = "normal" }: { scenario?: Scenario }) {
  const [moment, setMoment] = useState<Moment>(() => preset(scenario));
  const [month, setMonth] = useState(BOARD_MIN_MONTH);
  const [need, setNeed] = useState<Step | null>(null);
  const [invalid, setInvalid] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const set = (next: Partial<Moment>) =>
    setMoment((held) => ({ ...held, ...next }));

  const service = BOARD_SERVICES.find((one) => one.id === moment.service);
  const shops = BOARD_SHOPS.filter((shop) => service?.shops.includes(shop.id));
  const shop = BOARD_SHOPS.find((one) => one.id === moment.shop);
  const length = service
    ? Number.parseInt(String(service.durationLabel), 10)
    : 30;
  const flow: Step[] = ["service", "location", "time", "details"];
  const at = flow.indexOf(moment.step);
  const go = (step: Step) => {
    setNeed(null);
    setInvalid(0);
    set({ step, refusal: moment.refusal === "taken" ? null : moment.refusal });
  };
  const ready: Record<Step, boolean> = {
    service: !!service,
    location: !!shop,
    time: !!moment.slot,
    details: true,
  };
  const next = () => {
    if (!ready[moment.step]) return setNeed(moment.step);
    const following = flow[at + 1];
    if (following) go(following);
  };
  const when = moment.slot
    ? `${dayName(dateOf(moment.slot.start))}, ${timeOf(moment.slot.start)}`
    : "";

  if (moment.phase !== "flow" && service && shop && moment.slot) {
    return (
      <AppointmentPageShell>
        <After
          moment={moment}
          onAgain={() =>
            setMoment({
              ...preset("normal"),
              step: "time",
              service: service.id,
              shop: shop.id,
            })
          }
          service={service}
          shop={shop}
          when={when}
        />
      </AppointmentPageShell>
    );
  }

  const submit = (values: BookingDetailsValues) => {
    if (moment.refusal === "heldOut" || moment.refusal === "tries") {
      setAttempt((count) => count + 1);
      return;
    }
    set({
      bookedFor: values.bookedFor,
      phase: service?.pay ? "confirming" : "booked",
    });
  };

  const summary = {
    busy: moment.busy,
    copy: SUMMARY_COPY,
    end: moment.slot?.end,
    extraRows: [
      ...(moment.bookedFor
        ? [{ label: WORDS.forLabel, value: moment.bookedFor }]
        : []),
      ...(service?.pay
        ? [{ label: WORDS.payNow, value: service.pay.line }]
        : []),
    ],
    footer: WORDS.changeRule,
    location: shop?.name,
    notes: service?.notes ?? [],
    onChangeLocation:
      moment.step !== "location" ? () => go("location") : undefined,
    onChangeService:
      moment.step !== "service" ? () => go("service") : undefined,
    onChangeWhen: moment.step !== "time" ? () => go("time") : undefined,
    service: service?.name,
    start: moment.slot?.start,
    timeZone: BOARD_ZONE,
  };

  const primary =
    moment.step !== "details"
      ? WORDS.continue
      : moment.busy
        ? WORDS.stillTrying
        : service?.pay
          ? WORDS.payContinue
          : `Book ${when}`;

  return (
    <AppointmentPageShell>
      <div className="mx-auto grid w-full max-w-[70rem] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,23.75rem)]">
        {service ? (
          <BookingSummaryBar
            {...summary}
            className="sticky top-0 z-[5] lg:hidden"
            line={[service.name, shop?.name, when].filter(Boolean).join(" · ")}
          />
        ) : null}
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-4">
            <h1 className="m-0 text-xl leading-snug font-bold">
              {WORDS.title}
            </h1>
            <BookingStepDots
              busy={moment.busy}
              copy={{ label: WORDS.stepsLabel, doneAria: WORDS.doneAria }}
              current={moment.step}
              onStep={go}
              steps={flow.map((id) => ({ id, label: WORDS.steps[id] }))}
            />
          </div>

          {moment.step === "service" ? (
            <section className="flex flex-col gap-5">
              <h2 className="m-0 text-[17px] leading-6 font-bold">
                {WORDS.svcQ}
              </h2>
              {(["grading", "vault"] as const).map((group) => (
                <BookingServicePicker
                  copy={{ title: WORDS.groups[group] }}
                  footer={
                    group === "grading" ? (
                      <>
                        {WORDS.more100}{" "}
                        <a className={LINK} href="#contact">
                          {WORDS.messageUs}
                        </a>
                      </>
                    ) : undefined
                  }
                  heading="group"
                  key={group}
                  onSelect={(id) => {
                    setNeed(null);
                    const picked = BOARD_SERVICES.find((one) => one.id === id);
                    set({
                      service: id,
                      shop: picked?.shops.includes(moment.shop ?? "")
                        ? moment.shop
                        : undefined,
                    });
                  }}
                  selectedId={moment.service}
                  services={{
                    status: "ready",
                    data: BOARD_SERVICES.filter((one) => one.group === group),
                  }}
                />
              ))}
            </section>
          ) : null}

          {moment.step === "location" && service ? (
            <BookingLocationPicker
              copy={{ title: WORDS.shopQ }}
              description={`${shops.length} shops run ${service.name}.`}
              locations={{ status: "ready", data: shops }}
              onSelect={(id) => {
                setNeed(null);
                set({ shop: id });
              }}
              selectedId={moment.shop}
            />
          ) : null}

          {moment.step === "time" && service && shop ? (
            <BookingSlotPicker
              copy={SLOT_COPY}
              dayPanel={
                moment.date === "2026-10-17" ? (
                  <VisitFullDay
                    copy={{
                      title: `${dayName(moment.date)} is full at ${shop.name}.`,
                      earliestEach: WORDS.earliestEach,
                      noFreeYet: WORDS.noFreeYet,
                    }}
                    onPick={(id) => {
                      const pick = BOARD_SHOPS.find((one) => one.id === id);
                      if (!pick) return;
                      const slot = hkSlot(
                        pick.earliestAt.date,
                        pick.earliestAt.time,
                        length,
                      );
                      set({ shop: id, date: pick.earliestAt.date, slot });
                    }}
                    shops={shops.map((one) => ({
                      id: one.id,
                      name: String(one.name),
                      earliest: one.earliestAt.label.replace(/^today/, "Today"),
                    }))}
                  />
                ) : undefined
              }
              days={{ status: "ready", data: boardDays(month) }}
              earliest={{
                label: `Earliest: ${shop.earliestAt.label}`,
                pressed:
                  moment.slot?.start ===
                  hkSlot(shop.earliestAt.date, shop.earliestAt.time).start,
                onPick: () =>
                  set({
                    date: shop.earliestAt.date,
                    slot: hkSlot(
                      shop.earliestAt.date,
                      shop.earliestAt.time,
                      length,
                    ),
                    refusal: null,
                  }),
              }}
              footer="Book at least 2 hours ahead, up to 60 days ahead."
              layout="responsive"
              maxMonth={BOARD_MAX_MONTH}
              minMonth={BOARD_MIN_MONTH}
              month={month}
              note={moment.date ? SPECIAL_HOURS[moment.date] : undefined}
              notice={
                moment.refusal === "taken" ? (
                  <BookingNotice
                    body={WORDS.takenBody}
                    title={`${timeOf(TAKEN.start)} on ${dayName(dateOf(TAKEN.start))} was just taken.`}
                  />
                ) : undefined
              }
              onMonthChange={setMonth}
              onSelectDay={(date) => set({ date, slot: undefined })}
              onSelectSlot={(slot) => {
                setNeed(null);
                set({ slot, refusal: null });
              }}
              selectedDate={moment.date}
              selectedStart={moment.slot?.start}
              slots={{
                status: "ready",
                data: moment.date
                  ? boardSlots(moment.date, length, moment.gone)
                  : [],
              }}
              timeZone={BOARD_ZONE}
              today={BOARD_TODAY}
            />
          ) : null}

          {moment.step === "details" && service ? (
            <BookingDetailsForm
              account={
                <p className="m-0 flex flex-wrap items-center gap-x-2 text-sm leading-5 text-(--gray-700)">
                  <span>
                    {moment.signedIn ? WORDS.signedIn : WORDS.signInLine}
                  </span>
                  <button
                    className={`${LINK} min-h-11 cursor-pointer bg-transparent p-0`}
                    disabled={moment.busy}
                    onClick={() => set({ signedIn: !moment.signedIn })}
                    type="button"
                  >
                    {moment.signedIn ? WORDS.notYou : WORDS.signIn}
                  </button>
                </p>
              }
              copy={DETAILS_COPY}
              footer={
                <>
                  {service.pay ? (
                    <BookingPayNotice
                      amount={service.pay.amount}
                      copy={{ title: WORDS.payNow, via: WORDS.payVia }}
                      refund={service.pay.refund}
                    />
                  ) : null}
                  <p className="m-0 text-[13px] leading-[18px] text-(--gray-700)">
                    {WORDS.consent}{" "}
                    <a className={LINK} href="#privacy">
                      {WORDS.privacy}
                    </a>
                  </p>
                  {moment.refusal === "heldOut" ? (
                    <VisitRefusedBook
                      attempt={attempt}
                      copy={{
                        title: `This email already has a ${service.name}.`,
                        body: "We’ve sent its link there. Sign in to see it here.",
                        action: WORDS.signIn,
                      }}
                      onAction={() => set({ signedIn: true, refusal: null })}
                      refusal="heldOut"
                    />
                  ) : moment.refusal === "tries" ? (
                    <VisitRefusedBook
                      actionHref="tel:+85223456789"
                      attempt={attempt}
                      copy={{
                        title: "Too many tries today",
                        body: "This email has tried to book 10 times today. Try again tomorrow, or call Central on 2345 6789.",
                        action: "Call 2345 6789",
                      }}
                      refusal="tries"
                    />
                  ) : null}
                </>
              }
              formId="book-visit-details"
              hideSubmit
              initialValues={
                moment.signedIn
                  ? {
                      ...ME,
                      phone: moment.accountPhone,
                      bookedFor: moment.bookedFor,
                      answers: { cards: "12", company: "PSA" },
                    }
                  : {
                      name: ME.name,
                      email: ME.email,
                      answers: { cards: "12", company: "PSA" },
                    }
              }
              key={`${moment.signedIn}:${service.id}`}
              onInvalid={setInvalid}
              onSubmit={submit}
              pending={moment.busy}
              phoneRequired={moment.phoneRequired}
              questions={service.questions}
              questionsTitle={
                service.group === "grading"
                  ? WORDS.aboutCards
                  : WORDS.aboutItems
              }
              summarized={moment.signedIn}
            />
          ) : null}

          <BookingActionBar
            back={
              at > 0
                ? {
                    label: WORDS.back,
                    onClick: () => go(flow[at - 1] ?? "service"),
                  }
                : undefined
            }
            busy={moment.busy}
            error={
              need && need !== "details"
                ? WORDS.need[need]
                : moment.step === "details" && invalid > 0
                  ? invalid === 1
                    ? "Check the field marked above."
                    : `Check the ${invalid} fields marked above.`
                  : undefined
            }
            note={
              moment.step !== "details"
                ? undefined
                : moment.busy
                  ? WORDS.slowNote
                  : service?.pay
                    ? WORDS.payHold
                    : undefined
            }
            noteLive={moment.busy}
            primary={
              moment.step === "details"
                ? { label: primary, form: "book-visit-details" }
                : { label: primary, onClick: next }
            }
          />
        </div>
        <BookingSummary
          {...summary}
          className="hidden lg:sticky lg:top-6 lg:flex"
        />
      </div>
    </AppointmentPageShell>
  );
}

/** After the flow: booked, confirming the payment, or the payment not done. */
function After({
  moment,
  service,
  shop,
  when,
  onAgain,
}: {
  moment: Moment;
  service: (typeof BOARD_SERVICES)[number];
  shop: (typeof BOARD_SHOPS)[number];
  when: string;
  onAgain: () => void;
}) {
  const slot = moment.slot ?? TAKEN;
  if (moment.phase === "confirming" || moment.phase === "expired") {
    const confirming = moment.phase === "confirming";
    return (
      <section
        aria-busy={confirming || undefined}
        className="flex max-w-[560px] flex-col gap-3 pt-2 pb-6"
      >
        <span
          aria-hidden
          className={`grid size-10 place-items-center rounded-full ${confirming ? "bg-muted text-(--gray-700)" : "bg-warning-muted text-(--yellow-700)"}`}
        >
          {confirming ? (
            <span aria-hidden className="inline-flex animate-spin">
              <CircleNotch size={20} />
            </span>
          ) : (
            <Warning size={20} />
          )}
        </span>
        {confirming ? (
          <span className="inline-flex h-5.5 items-center self-start rounded-full bg-muted px-2.5 text-[11px] font-bold text-(--gray-700)">
            {WORDS.confirmingPhase}
          </span>
        ) : null}
        <h1 className="m-0 text-2xl leading-[30px] font-bold">
          {confirming ? WORDS.confirmingTitle : WORDS.expiredTitle}
        </h1>
        <p
          className="m-0 text-[15px] leading-[22px] text-(--gray-700)"
          role="status"
        >
          {confirming
            ? `${when} at ${shop.name}. This takes a few seconds, so keep this page open.`
            : `Your ${timeOf(slot.start)} time on ${dayName(dateOf(slot.start))} was released. Nothing was charged.`}
        </p>
        <p className="m-0 text-sm leading-5 text-secondary-foreground">
          {confirming
            ? `We email ${ME.email} once it is confirmed.`
            : WORDS.expiredNote}
        </p>
        {confirming ? null : (
          <button
            className="mt-2 h-11 cursor-pointer self-start rounded-full bg-primary px-5 text-[15px] font-semibold text-primary-foreground"
            onClick={onAgain}
            type="button"
          >
            {WORDS.bookAgain}
          </button>
        )}
      </section>
    );
  }
  return (
    <VisitBookedPass
      before={[
        "Bring the cards in sleeves.",
        `We hold your time until ${timeOf(slot.start + 15 * 60_000)}. Running late? Tell us from your visit page.`,
        "Grading fees are paid at the counter",
      ]}
      confirmation={{
        answers: [
          { key: "cards", label: "How many cards?", answer: "12" },
          { key: "company", label: "Grading company", answer: "PSA" },
          { key: "phone", label: "Phone", answer: "+852 9123 4567" },
        ],
        calendarHref: "data:text/calendar,BEGIN:VCALENDAR",
        manageHref: "#manage",
        record: {
          id: "bk_board",
          service: service.name,
          location: shop.name,
          address: shop.address,
          timeZone: BOARD_ZONE,
          start: slot.start,
          end: slot.end,
          state: "booked",
        },
      }}
      copy={{
        confirmation: {
          title: "You are booked",
          body: `We emailed ${ME.email}.`,
          service: "Service",
          location: "Shop",
          when: "Time",
          beforeYouCome: "Before you come",
          answers: "What you told us",
          manage: "Change or cancel",
          calendar: "Add to calendar",
        },
        pass: {
          title: "Booked",
          nameLabel: "Booked for",
          note: "At the counter, give your phone or email.",
        },
        brand: "Grade10",
        directions: "Directions",
        until: `You can change or cancel until ${timeOf(slot.start)} on ${dayName(dateOf(slot.start))}.`,
        before: "Before you come",
        getThere: "How to get there",
        another: "Book another visit",
        calendarSaved: "Calendar file saved",
      }}
      directionsHref="https://maps.google.com/?q=18+Queen%27s+Road+Central+Hong+Kong"
      getThere={[
        { label: "Shop", value: shop.name },
        ...(shop.address ? [{ label: "Where", value: shop.address }] : []),
        ...(shop.mtr ? [{ label: "Directions", value: shop.mtr }] : []),
        ...(shop.phone
          ? [
              {
                label: "Shop phone",
                value: (
                  <a className={LINK} href="tel:+85223456789">
                    {shop.phone}
                  </a>
                ),
              },
            ]
          : []),
      ]}
      name={moment.bookedFor || ME.name}
      onAgain={onAgain}
      paid={
        service.pay
          ? {
              label: "Paid",
              value: service.pay.amount,
              refund: service.pay.refund,
            }
          : undefined
      }
      receipt={
        service.pay
          ? `Paid ${service.pay.amount}. Your receipt is in that email.`
          : undefined
      }
      when={`${when} to ${timeOf(slot.end)} HKT`}
    />
  );
}

const meta = {
  title: "Appointment/Booking/Screens/Book Visit",
  component: BookVisitPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { scenario: "normal" },
} satisfies Meta<typeof BookVisitPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** At the first step: a pick only selects, Continue moves on, and Continue
 * with nothing picked says what is missing. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Book a visit" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "Choose a service to continue.",
    );
    await userEvent.click(
      canvas.getByRole("radio", { name: /^Grading drop-off/ }),
    );
    expect(
      canvas.getByRole("heading", { level: 2, name: "What do you need?" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(
      canvas.getByRole("heading", { level: 2, name: "Pick a shop" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("radio", { name: /^Central/ }));
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await userEvent.click(
      canvas.getByRole("button", { name: /Earliest: today, 16:30/ }),
    );
    expect(
      canvas.getByRole("heading", { level: 2, name: "Pick a time" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(
      canvas.getByRole("heading", { level: 2, name: "Your details" }),
    ).toBeVisible();
  },
};

export const TimeJustTaken: Story = {
  args: { scenario: "time just taken" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "15:00 on Thu 22 Oct was just taken.",
    );
    expect(canvas.queryByRole("button", { name: "15:00" })).toBeNull();
  },
};

export const FullDay: Story = {
  args: { scenario: "full day" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Sat 17 Oct is full at Central.")).toBeVisible();
  },
};

export const AlreadyBookedSignedOut: Story = {
  args: { scenario: "already booked signed out" },
};

export const TooManyTriesToday: Story = {
  args: { scenario: "too many tries today" },
};

export const SlowNetwork: Story = {
  args: { scenario: "slow network" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("status")).toHaveTextContent(
      "Keep this page open. We won’t book you twice.",
    );
    expect(canvas.getByRole("button", { name: "Back" })).toBeDisabled();
  },
};

export const SignedInNoPhone: Story = {
  args: { scenario: "signed in, no phone on account" },
};

export const ServiceNeedsAPhone: Story = {
  args: { scenario: "service needs a phone" },
};

export const PaidService: Story = {
  args: { scenario: "paid service" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("group", { name: "Pay now" })).toBeVisible();
    expect(canvas.getByText("We hold this time for 30 minutes")).toBeVisible();
  },
};

export const BookingForSomeoneElse: Story = {
  args: { scenario: "booking for someone else" },
};

export const ConfirmingPayment: Story = {
  args: { scenario: "confirming payment" },
};

export const PaidAndBooked: Story = {
  args: { scenario: "paid and booked" },
};

export const PaymentNotCompleted: Story = {
  args: { scenario: "payment not completed" },
};

/** At 390px the summary folds into the bar and the month into a strip. */
export const Phone: Story = {
  args: { scenario: "full day" },
  globals: { viewport: { value: "mobile1" } },
};
