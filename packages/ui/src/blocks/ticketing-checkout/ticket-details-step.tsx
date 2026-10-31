import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Link } from "@grade10/design-system/components/forms/link";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft } from "@phosphor-icons/react";
import { type ReactNode, useRef, useState } from "react";
import { BookingActionBar } from "../appointment-booking/booking-action-bar";

type TicketDetailsStepCopy = {
  /** The way back, at the top and in the bar: `Passes`. */
  back: string;
  /** `Your Details`. */
  title: string;
  /** The buyer section's name: `Buyer`. */
  buyer: string;
  /** A guest's line over the fields: `Have an account?` … */
  haveAccount: string;
  /** … `Sign In`. */
  signIn: string;
  /** `Name on the tickets`. */
  name: string;
  /** `Your full name`. */
  namePlaceholder: string;
  /** Under the name, where one is said: signed in, `Printed on your tickets.
   * Change it if a friend is coming.` */
  nameHint?: string;
  /** `Email`. */
  email: string;
  /** `name@example.com`. */
  emailPlaceholder: string;
  /** Under a guest's email: `Your tickets go here. You check it before
   * paying.` */
  emailHint: string;
  /** Under a signed-in buyer's email: `Your tickets go here. It's your
   * account's email.` */
  accountEmailHint: string;
  /** `Not You?` */
  notYou: string;
  /** `Enter your name`. */
  nameMissing: string;
  /** `Enter an email like name@example.com`. */
  emailInvalid: string;
  /** Over the bar, one field wrong: `Check the field above.` */
  fixOne: string;
  /** Over the bar, both wrong: `Check the 2 fields above.` */
  fixBoth: string;
  /** `Continue`. */
  continue: string;
};

/** Who is buying, as far as the page knows yet. */
type TicketDetailsStepBuyer =
  | { kind: "resolving" }
  | { kind: "guest" }
  /** Signed in: the email is the account's, fixed; Not You? signs out. */
  | { kind: "signedIn"; email: string };

type TicketDetailsStepValues = { name: string; email: string };

type TicketDetailsStepProps = {
  copy: TicketDetailsStepCopy;
  /** Under the title: `[Show Name]: Sat 12 and Sun 13 Dec 2026`. */
  subtitle: string;
  buyer: TicketDetailsStepBuyer;
  /** The fields' first values: the account's usable name, or what the buyer
   * typed before going back. An account whose name is only its email gives
   * none. */
  defaultValues?: Partial<TicketDetailsStepValues>;
  /** Errors the service found in what was sent, beside the block's own. */
  errors?: Partial<Record<keyof TicketDetailsStepValues, string>>;
  /** A refusal above Your Order. */
  notice?: ReactNode;
  /** Your Order: the lines, the total and the points. */
  order: ReactNode;
  /** The bot check's widget, where one is on. */
  botCheck?: ReactNode;
  /** Continue is on its way: it spins and Back stays put. */
  busy?: boolean;
  onBack: () => void;
  onSignIn: () => void;
  onNotYou: () => void;
  /** Continue with a name and, for a guest, an email that read right. */
  onContinue: (values: TicketDetailsStepValues) => void;
  className?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Your Details: a name for the tickets and an email, typed once, then
 * Continue to Check Your Order. A guest may sign in instead; a signed-in
 * buyer's name comes from the account and their email is fixed. Continue
 * names what to fix, field by field, before it goes on.
 */
function TicketDetailsStep({
  copy,
  subtitle,
  buyer,
  defaultValues,
  errors,
  notice,
  order,
  botCheck,
  busy = false,
  onBack,
  onSignIn,
  onNotYou,
  onContinue,
  className,
}: TicketDetailsStepProps) {
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [found, setFound] = useState<Partial<TicketDetailsStepValues>>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const nameError = found.name ?? errors?.name;
  const emailError =
    buyer.kind === "guest" ? (found.email ?? errors?.email) : undefined;
  const wrong = [nameError, emailError].filter(Boolean).length;

  const submit = () => {
    if (busy || buyer.kind === "resolving") return;
    const next: Partial<TicketDetailsStepValues> = {};
    if (!name.trim()) next.name = copy.nameMissing;
    if (buyer.kind === "guest" && !EMAIL.test(email.trim()))
      next.email = copy.emailInvalid;
    setFound(next);
    if (next.name) nameRef.current?.focus();
    else if (next.email) emailRef.current?.focus();
    if (next.name || next.email) return;
    onContinue({
      name: name.trim(),
      email: buyer.kind === "signedIn" ? buyer.email : email.trim(),
    });
  };

  return (
    <div
      className={cn("flex flex-col bg-background", className)}
      data-slot="details-step"
    >
      <div className="flex flex-col gap-5 px-4 pt-2 pb-6">
        <div className="flex flex-col gap-1">
          <Link
            className="min-h-11 self-start no-underline"
            onClick={onBack}
            render={<button type="button" />}
            size="sm"
            variant="secondary"
          >
            <CaretLeft aria-hidden size={16} />
            {copy.back}
          </Link>
          <h1 className="m-0 text-2xl leading-8 font-bold">{copy.title}</h1>
          <p className="m-0 text-sm leading-5 text-secondary-foreground">
            {subtitle}
          </p>
        </div>
        <section aria-label={copy.buyer} className="flex flex-col gap-4">
          {buyer.kind === "resolving" ? (
            <div aria-busy="true" className="flex flex-col gap-3">
              <Skeleton className="w-30" shape="text" />
              <Skeleton className="h-12" shape="line" />
              <Skeleton className="w-18" shape="text" />
              <Skeleton className="h-12" shape="line" />
              <Skeleton className="w-24" shape="text" />
              <Skeleton className="h-12" shape="line" />
            </div>
          ) : (
            <>
              {buyer.kind === "guest" ? (
                <p className="m-0 text-sm leading-5 text-secondary-foreground">
                  {copy.haveAccount}{" "}
                  <Link
                    className="font-medium"
                    onClick={onSignIn}
                    render={<button type="button" />}
                    size="sm"
                  >
                    {copy.signIn}
                  </Link>
                </p>
              ) : null}
              <TextInput
                autoComplete="name"
                disabled={busy}
                label={copy.name}
                message={nameError ?? copy.nameHint}
                name="name"
                onChange={(event) => {
                  setName(event.target.value);
                  if (found.name) setFound({ ...found, name: undefined });
                }}
                placeholder={copy.namePlaceholder}
                ref={nameRef}
                status={nameError ? "error" : "default"}
                value={name}
              />
              {buyer.kind === "guest" ? (
                <TextInput
                  autoComplete="email"
                  disabled={busy}
                  inputMode="email"
                  label={copy.email}
                  message={emailError ?? copy.emailHint}
                  name="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (found.email) setFound({ ...found, email: undefined });
                  }}
                  placeholder={copy.emailPlaceholder}
                  ref={emailRef}
                  status={emailError ? "error" : "default"}
                  type="email"
                  value={email}
                />
              ) : (
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm leading-5 font-medium">
                    {copy.email}
                  </span>
                  <div className="flex min-h-12 items-center justify-between gap-3 rounded-full bg-muted px-4 text-base leading-6">
                    <span className="min-w-0 truncate">{buyer.email}</span>
                    <Link
                      className="flex-none font-medium"
                      onClick={onNotYou}
                      render={<button type="button" />}
                      size="sm"
                    >
                      {copy.notYou}
                    </Link>
                  </div>
                  <span className="text-sm leading-5 text-secondary-foreground">
                    {copy.accountEmailHint}
                  </span>
                </div>
              )}
            </>
          )}
        </section>
        {notice}
        {order}
        {botCheck}
      </div>
      <BookingActionBar
        back={{ label: copy.back, onClick: onBack }}
        busy={busy}
        className="px-4"
        error={
          wrong === 0 ? undefined : wrong === 1 ? copy.fixOne : copy.fixBoth
        }
        primary={{ label: copy.continue, onClick: submit }}
      />
    </div>
  );
}

export type {
  TicketDetailsStepBuyer,
  TicketDetailsStepCopy,
  TicketDetailsStepProps,
  TicketDetailsStepValues,
};
export { TicketDetailsStep };
