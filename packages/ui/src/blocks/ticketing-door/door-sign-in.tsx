import { Alert } from "@grade10/design-system/components/display/alert";
import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import {
  ArrowsClockwise,
  CalendarBlank,
  Clock,
  LockSimple,
} from "@phosphor-icons/react";
import type { FormEvent } from "react";

type DoorSignInCopy = {
  /** "Open the door" */
  title: string;
  /** "Enter the passcode the door lead gave you. No account needed." */
  description: string;
  /** "Passcode" */
  passcodeLabel: string;
  /** "6 digits" */
  passcodePlaceholder: string;
  /** "This phone’s name" */
  deviceNameLabel: string;
  /** "Every ticket you let in is recorded with it." */
  deviceNameHint: string;
  /** "Open the Door" */
  submit: string;
  /** "Not open yet" */
  notOpenTitle: string;
  /** "until the door opens" — under the countdown. */
  untilOpen: string;
  /** "Check Again" */
  checkAgain: string;
};

/** The event the passcode opens, worded for the card under the heading. */
type DoorSignInEvent = {
  /** "[Show Name]" */
  name: string;
  /** "Sat 12 and Sun 13 Dec 2026, [Venue]" */
  when: string;
};

/**
 * Where getting in stands.
 * - `ready` — the form, untouched or after a fix
 * - `wrong` — the passcode was refused; `message` says how many tries are left
 * - `slowed` — too many tries: the form waits, `lead` in bold then `message`
 * - `notOpen` — the passcode is right but the door opens later; `opensAt`
 *   says when and `countdown` how long until then
 */
type DoorSignInStatus =
  | { kind: "ready" }
  | { kind: "wrong"; message: string }
  | { kind: "slowed"; lead: string; message: string }
  | { kind: "notOpen"; opensAt: string; countdown: string };

type DoorSignInProps = {
  copy: DoorSignInCopy;
  event: DoorSignInEvent;
  status: DoorSignInStatus;
  passcode: string;
  deviceName: string;
  /** "Works from 09:00 Sat 12 Dec to the end of the event." */
  openWindow: string;
  /** The passcode is being checked. */
  submitting?: boolean;
  onPasscodeChange: (passcode: string) => void;
  onDeviceNameChange: (deviceName: string) => void;
  onSubmit: () => void;
  onCheckAgain: () => void;
};

function EventCard({ event }: { event: DoorSignInEvent }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background-subtle p-3">
      <span
        aria-hidden
        className="mt-0.5 inline-flex shrink-0 text-secondary-foreground"
      >
        <CalendarBlank size={18} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-semibold">{event.name}</span>
        <span className="text-xs leading-4 text-secondary-foreground">
          {event.when}
        </span>
      </span>
    </div>
  );
}

/**
 * Getting in at the passcode door: the event's passcode and this phone's
 * name, no account. Answers a wrong passcode on the field, slows the form
 * after too many tries, and says when a door that is not open yet opens.
 */
function DoorSignIn({
  copy,
  event,
  status,
  passcode,
  deviceName,
  openWindow,
  submitting = false,
  onPasscodeChange,
  onDeviceNameChange,
  onSubmit,
  onCheckAgain,
}: DoorSignInProps) {
  if (status.kind === "notOpen") {
    return (
      <div
        className="flex flex-1 flex-col gap-4 px-4 pt-5 pb-4"
        data-slot="door-sign-in"
      >
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {copy.notOpenTitle}
          </h1>
          <p className="text-sm text-secondary-foreground">{status.opensAt}</p>
        </div>
        <EventCard event={event} />
        <div
          className="flex flex-col items-center gap-1 rounded-2xl bg-muted px-4 py-6 text-center"
          role="timer"
        >
          <span aria-hidden className="inline-flex text-secondary-foreground">
            <LockSimple size={20} />
          </span>
          <span className="font-heading text-3xl font-semibold tabular-nums">
            {status.countdown}
          </span>
          <span className="text-xs text-secondary-foreground">
            {copy.untilOpen}
          </span>
        </div>
        <div className="mt-auto">
          <Button
            className="w-full"
            leading={<ArrowsClockwise />}
            loading={submitting}
            onClick={onCheckAgain}
            variant="outline"
          >
            {copy.checkAgain}
          </Button>
        </div>
      </div>
    );
  }

  const slowed = status.kind === "slowed";
  const submit = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!slowed) onSubmit();
  };

  return (
    <form
      className="flex flex-1 flex-col gap-4 px-4 pt-5 pb-4"
      data-slot="door-sign-in"
      noValidate
      onSubmit={submit}
    >
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {copy.title}
        </h1>
        <p className="text-sm text-secondary-foreground">{copy.description}</p>
      </div>
      <EventCard event={event} />
      {slowed ? (
        <Alert
          dismissible={false}
          icon={<Clock size={18} />}
          layout="inline"
          status="warning"
          title={
            <>
              <strong className="font-semibold">{status.lead}</strong>{" "}
              <span className="font-normal">{status.message}</span>
            </>
          }
        />
      ) : null}
      <TextInput
        autoComplete="off"
        disabled={slowed}
        inputMode="numeric"
        label={copy.passcodeLabel}
        message={status.kind === "wrong" ? status.message : undefined}
        onChange={(change) => onPasscodeChange(change.target.value)}
        placeholder={copy.passcodePlaceholder}
        status={status.kind === "wrong" ? "error" : "default"}
        type="password"
        value={passcode}
      />
      <TextInput
        autoComplete="off"
        label={
          <span className="flex flex-col gap-0.5">
            <span>{copy.deviceNameLabel}</span>
            <span className="text-xs font-normal text-secondary-foreground">
              {copy.deviceNameHint}
            </span>
          </span>
        }
        onChange={(change) => onDeviceNameChange(change.target.value)}
        value={deviceName}
      />
      <div className="mt-auto flex flex-col gap-2 pt-4">
        <Button
          className="w-full"
          disabled={slowed}
          loading={submitting}
          type="submit"
        >
          {copy.submit}
        </Button>
        <p className="text-center text-xs text-secondary-foreground">
          {openWindow}
        </p>
      </div>
    </form>
  );
}

export {
  DoorSignIn,
  type DoorSignInCopy,
  type DoorSignInEvent,
  type DoorSignInProps,
  type DoorSignInStatus,
};
