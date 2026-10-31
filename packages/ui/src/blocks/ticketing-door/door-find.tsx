import { Badge } from "@grade10/design-system/components/display/badge";
import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft } from "@phosphor-icons/react";
import { type FormEvent, useId } from "react";
import type { DoorLayout } from "./types";

type DoorFindCopy = {
  /** "Find by reference" on a phone; "Find a ticket" in the console. */
  title: string;
  /**
   * "The six characters on the ticket or in the email." on a phone; "A
   * reference, or the buyer’s exact email. Email search is console only." in
   * the console.
   */
  description: string;
  /** "Reference" — the field's name on a phone. */
  fieldLabel: string;
  /** "Scan" — back to the camera, on a phone. */
  back: string;
  /** "Admit" */
  admit: string;
};

/**
 * One ticket on the order found.
 * - `admit` — it can be let in now
 * - `blocked` — it cannot, and `label` says why in a short chip: "In today"
 */
type DoorFindTicket = {
  id: string;
  /** First name on a phone, full name in the console. */
  name: string;
  /** "General Pass (Two-Day), Adult, Fast Pass: 2 left" */
  pass: string;
  /** "TK7Q2M-1" */
  code: string;
  /** "Day 1 of 2 left today", or "Let in 10:31 by Gate A phone 1". */
  entry: string;
  action:
    | { kind: "admit"; pending?: boolean }
    | { kind: "blocked"; label: string };
};

/**
 * Where the search stands.
 * - `idle` — nothing asked yet
 * - `searching` — the reference is being looked up
 * - `notFound` — `message` says so on the field
 * - `found` — `heading` names the order and its tickets follow
 */
type DoorFindResult =
  | { status: "idle" }
  | { status: "searching" }
  | { status: "notFound"; message: string }
  | {
      status: "found";
      heading: string;
      tickets: readonly DoorFindTicket[];
    };

type DoorFindProps = {
  layout: DoorLayout;
  copy: DoorFindCopy;
  query: string;
  result: DoorFindResult;
  /** A sentence under the tickets: "Only first names show here…" */
  note?: string;
  onQueryChange: (query: string) => void;
  onSubmit: () => void;
  onAdmit: (ticketId: string) => void;
  /** Back to scanning, on a phone. */
  onBack?: () => void;
};

/**
 * Finding a ticket by hand when a code will not read: by the order's
 * reference on a phone, by reference or exact email in the console. Answers
 * each ticket on the order with Admit, or why it cannot be let in.
 */
function DoorFind({
  layout,
  copy,
  query,
  result,
  note,
  onQueryChange,
  onSubmit,
  onAdmit,
  onBack,
}: DoorFindProps) {
  const phone = layout === "phone";
  const idBase = useId();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };
  const notFound = result.status === "notFound";

  return (
    <div
      className={cn(
        "flex flex-col",
        phone
          ? "flex-1 gap-4 px-4 pt-3 pb-4"
          : "gap-3 rounded-2xl border border-border bg-background p-4",
      )}
      data-slot="door-find"
    >
      {phone && onBack ? (
        <div>
          <Button
            className="-ml-2"
            leading={<CaretLeft />}
            onClick={onBack}
            size="sm"
            variant="ghost"
          >
            {copy.back}
          </Button>
        </div>
      ) : null}
      {phone ? (
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {copy.title}
          </h1>
          <p className="text-sm text-secondary-foreground">
            {copy.description}
          </p>
        </div>
      ) : null}
      <form noValidate onSubmit={submit}>
        <TextInput
          autoCapitalize="characters"
          autoComplete="off"
          label={
            phone ? (
              copy.fieldLabel
            ) : (
              <span className="flex flex-col gap-0.5">
                <span>{copy.title}</span>
                <span className="text-xs font-normal text-secondary-foreground">
                  {copy.description}
                </span>
              </span>
            )
          }
          loading={result.status === "searching"}
          message={notFound ? result.message : undefined}
          onChange={(change) => onQueryChange(change.target.value)}
          spellCheck={false}
          status={notFound ? "error" : "default"}
          value={query}
        />
      </form>
      {result.status === "found" ? (
        <section aria-label={result.heading} className="flex flex-col">
          {phone ? (
            <p className="pb-1 text-xs text-secondary-foreground">
              {result.heading}
            </p>
          ) : null}
          <ul className="flex flex-col">
            {result.tickets.map((ticket) => (
              <li
                className="flex items-center gap-3 border-t border-border py-3 first:border-t-0"
                key={ticket.id}
              >
                {phone ? (
                  <span
                    className="flex min-w-0 flex-1 flex-col"
                    id={`${idBase}-${ticket.id}`}
                  >
                    <span className="text-sm font-semibold">{ticket.name}</span>
                    <span className="text-xs text-secondary-foreground">
                      {ticket.pass}
                    </span>
                    <span className="font-mono text-xs text-secondary-foreground">
                      {ticket.code}
                    </span>
                    <span className="text-xs text-secondary-foreground">
                      {ticket.entry}
                    </span>
                  </span>
                ) : (
                  <span
                    className="flex min-w-0 flex-1 flex-col text-sm"
                    id={`${idBase}-${ticket.id}`}
                  >
                    <span>
                      <strong className="font-semibold">{ticket.name}</strong>
                      <span className="text-secondary-foreground">
                        {" "}
                        {ticket.pass}
                      </span>
                    </span>
                    <span className="flex gap-2 text-xs text-secondary-foreground">
                      <span className="font-mono">{ticket.code}</span>
                      <span>{ticket.entry}</span>
                    </span>
                  </span>
                )}
                {ticket.action.kind === "admit" ? (
                  <Button
                    aria-describedby={`${idBase}-${ticket.id}`}
                    loading={ticket.action.pending}
                    onClick={() => onAdmit(ticket.id)}
                    size="sm"
                  >
                    {copy.admit}
                  </Button>
                ) : (
                  <Badge variant="outline">{ticket.action.label}</Badge>
                )}
              </li>
            ))}
          </ul>
          {note ? (
            <p className="pt-2 text-xs text-secondary-foreground">{note}</p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

export {
  DoorFind,
  type DoorFindCopy,
  type DoorFindProps,
  type DoorFindResult,
  type DoorFindTicket,
};
