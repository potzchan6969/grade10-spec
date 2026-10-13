import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxList } from "@grade10/design-system/components/forms/checkbox-list";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { NumberInput } from "@grade10/design-system/components/forms/number-input";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { RadioListItem } from "@grade10/design-system/components/forms/radio-list-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@grade10/design-system/components/forms/select";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { Textarea } from "@grade10/design-system/components/forms/textarea";
import { cn } from "@grade10/design-system/lib/utils";
import {
  AuctionPhoneField,
  auctionPhoneConfirmValue,
  auctionPhoneSoftReady,
} from "@grade10/ui";
import { WarningCircle } from "@phosphor-icons/react";
import { type FormEvent, type ReactNode, useId, useState } from "react";
import type { Country } from "react-phone-number-input";
import { INK_2 } from "./booking-look";
import type {
  BookingAnswers,
  BookingDetailsValues,
  BookingQuestion,
} from "./types";

type BookingDetailsFormCopy = {
  title: string;
  name: string;
  email: string;
  phone: string;
  phonePlaceholder?: string;
  countrySearchPlaceholder?: string;
  /** Omit it and the built-in notes field is not rendered. */
  notes?: string;
  /** The line under the notes label: `Anything the shop should know.` */
  notesHint?: string;
  /** The line under the email label: `We send the confirmation here.` */
  emailHint?: string;
  /** The line under an optional phone's label. */
  phoneHint?: string;
  /** The line under a required phone's label. */
  phoneRequiredHint?: string;
  /** Marks an optional field and an optional question: `optional`. */
  optional: string;
  nameMissing: string;
  emailMissing: string;
  emailInvalid: string;
  phoneMissing: string;
  /** Shown when a required phone is left empty; falls back to `phoneMissing`. */
  phoneRequired?: string;
  /** Leads the summary of seeded details: `Booking as`. */
  bookingAs?: string;
  answerMissing: string;
  /** A required checkbox question left empty: `Choose at least one.` */
  chooseOne?: string;
  /** A required select left empty: `Choose a {label}.` */
  chooseX?: string;
  /** Shown in a select before an option is picked. */
  choose: string;
  submit: string;
  /** Booking for someone else; omit it and the choice is not offered. */
  forOther?: {
    label: string;
    name: string;
    hint?: string;
    missing: string;
  };
};

type BookingDetailsFormProps = {
  copy: BookingDetailsFormCopy;
  questions: readonly BookingQuestion[];
  /** Intro under the title — usually the service's description. */
  description?: ReactNode;
  /** Under the title instead of the description: who is signed in, with the
   * way to switch or sign in. */
  account?: ReactNode;
  /** Heads the service's questions: `About your cards`. */
  questionsTitle?: ReactNode;
  /** Seeds the fields, so a refused time keeps what the collector typed. */
  initialValues?: Partial<BookingDetailsValues>;
  /** Locks email to the seeded value — native disabled, still submitted. */
  emailDisabled?: boolean;
  /** Refuses an empty phone, and drops the `Optional` mark from its label. */
  phoneRequired?: boolean;
  /**
   * Shows a seeded name, email and phone as a read-only summary instead of
   * their fields; a phone the seed lacks keeps its field.
   */
  summarized?: boolean;
  /** A booking is in flight: every field reads only. */
  pending?: boolean;
  error?: ReactNode;
  /** Names the form, so a press outside it (the action bar's) submits it. */
  formId?: string;
  /** Leaves the submit press to the consumer: the action bar draws it. */
  hideSubmit?: boolean;
  /** Under the fields: the pay notice, the consent line, a refusal. */
  footer?: ReactNode;
  /** A press found fields to fix: how many. Zero once all are fine. */
  onInvalid?: (count: number) => void;
  onSubmit: (values: BookingDetailsValues) => void;
  className?: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  bookedFor?: string;
  answers: Readonly<Record<string, string>>;
};

type Answer = string | readonly string[];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NO_ERRORS: FieldErrors = { answers: {} };

/** The board's 44px, 8px-round field box over the design system's input. */
const FIELD_BOX =
  "gap-0 [&_[data-slot=input-box]]:h-11 [&_[data-slot=input-box]]:rounded-lg [&_[data-slot=input-box]]:px-3 [&_[data-slot=input-box]]:bg-card [&_[data-slot=input-box]]:border-border-strong [&_input]:text-base";

const SECTION_RULE = "flex flex-col gap-3 border-t border-border pt-4";

const GRID =
  "grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4";

function countErrors(found: FieldErrors) {
  return (
    [found.name, found.email, found.phone, found.bookedFor].filter(Boolean)
      .length + Object.keys(found.answers).length
  );
}

/**
 * Name, email, phone, the service's questions in order, notes, and who comes
 * in. Refuses to report while a name, an address, a required phone or a
 * required answer is missing, naming each; reports every text trimmed and
 * answers keyed by question key. Summarized, a seeded name, email and phone
 * read as a card nobody edits here.
 */
function BookingDetailsForm({
  copy,
  questions,
  description,
  account,
  questionsTitle,
  initialValues,
  emailDisabled = false,
  phoneRequired = false,
  summarized = false,
  pending = false,
  error,
  formId,
  hideSubmit = false,
  footer,
  onInvalid,
  onSubmit,
  className,
}: BookingDetailsFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? "");
  const [phoneCountry, setPhoneCountry] = useState<string | undefined>(
    initialValues?.phoneCountry ?? "HK",
  );
  const [notes, setNotes] = useState(initialValues?.notes ?? "");
  const [answers, setAnswers] = useState<BookingAnswers>(
    initialValues?.answers ?? {},
  );
  const [forOther, setForOther] = useState(!!initialValues?.bookedFor);
  const [bookedFor, setBookedFor] = useState(initialValues?.bookedFor ?? "");
  const [errors, setErrors] = useState<FieldErrors>(NO_ERRORS);
  const ids = useId();
  const editing =
    !summarized ||
    !initialValues?.name?.trim() ||
    !EMAIL.test(initialValues?.email?.trim() ?? "");
  const phoneField = editing || !initialValues?.phone;

  function answer(key: string, value: Answer) {
    setAnswers((held) => ({ ...held, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    const phoneCountryValue = phoneCountry
      ? (phoneCountry as Country)
      : undefined;
    const values = collect(
      {
        name,
        email,
        phone: auctionPhoneConfirmValue(phone, phoneCountryValue),
        phoneCountry: phoneCountry ?? "",
        notes,
        answers,
        ...(copy.forOther && forOther ? { bookedFor } : {}),
      },
      questions,
    );
    const found = validate(values, questions, copy, phoneRequired);
    setErrors(found);
    const count = countErrors(found);
    onInvalid?.(count);
    if (count > 0) return;
    onSubmit(values);
  }

  const optionalMark = (
    <span className="font-normal text-secondary-foreground">{`(${copy.optional})`}</span>
  );

  return (
    <form
      className={className}
      data-slot="booking-details-form"
      id={formId}
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-0.5">
          <h2 className="m-0 text-[17px] leading-6 font-bold">{copy.title}</h2>
          {account ??
            (description ? (
              <p className={cn("m-0 text-sm leading-5", INK_2)}>
                {description}
              </p>
            ) : null)}
        </div>
        {editing ? null : (
          <div
            className="flex flex-col gap-0.5 rounded-xl border border-border bg-background-subtle p-4"
            data-slot="booking-details-summary"
          >
            {copy.bookingAs ? (
              <span className="text-[13px] leading-[18px] text-secondary-foreground">
                {copy.bookingAs}
              </span>
            ) : null}
            <span className="text-base leading-6 font-semibold">{name}</span>
            <span className={cn("text-sm leading-5", INK_2)}>{email}</span>
            {phone && !phoneField ? (
              <span className={cn("text-sm leading-5 tabular-nums", INK_2)}>
                {phone}
              </span>
            ) : null}
          </div>
        )}
        {editing || phoneField ? (
          <div className={GRID}>
            {editing ? (
              <>
                <Field error={errors.name} id={`${ids}-name`} label={copy.name}>
                  {(describedBy) => (
                    <TextInput
                      aria-describedby={describedBy}
                      autoComplete="name"
                      className={FIELD_BOX}
                      id={`${ids}-name`}
                      name="name"
                      onChange={(event) => setName(event.target.value)}
                      readOnly={pending}
                      status={errors.name ? "error" : "default"}
                      value={name}
                    />
                  )}
                </Field>
                <Field
                  error={errors.email}
                  hint={copy.emailHint}
                  id={`${ids}-email`}
                  label={copy.email}
                >
                  {(describedBy) => (
                    <TextInput
                      aria-describedby={describedBy}
                      autoComplete="email"
                      className={FIELD_BOX}
                      disabled={emailDisabled}
                      id={`${ids}-email`}
                      inputMode="email"
                      name="email"
                      onChange={
                        emailDisabled
                          ? undefined
                          : (event) => setEmail(event.target.value)
                      }
                      readOnly={pending}
                      status={errors.email ? "error" : "default"}
                      type="email"
                      value={email}
                    />
                  )}
                </Field>
              </>
            ) : null}
            {phoneField ? (
              <Field
                error={errors.phone}
                hint={phoneRequired ? copy.phoneRequiredHint : copy.phoneHint}
                id={`${ids}-phone`}
                label={copy.phone}
                mark={phoneRequired ? undefined : optionalMark}
              >
                {() => (
                  <AuctionPhoneField
                    className={FIELD_BOX}
                    country={
                      phoneCountry ? (phoneCountry as Country) : undefined
                    }
                    countrySearchPlaceholder={copy.countrySearchPlaceholder}
                    defaultCountry="HK"
                    disabled={pending}
                    id={`${ids}-phone`}
                    name="phone"
                    onChange={setPhone}
                    onCountryChange={(next) => setPhoneCountry(next ?? "")}
                    placeholder={copy.phonePlaceholder}
                    status={errors.phone ? "error" : "default"}
                    value={phone}
                  />
                )}
              </Field>
            ) : null}
          </div>
        ) : null}
        {questions.length > 0 ? (
          // biome-ignore lint/a11y/useSemanticElements: a fieldset would draw its own legend; the heading names the group
          <div
            aria-labelledby={questionsTitle ? `${ids}-q` : undefined}
            className={questionsTitle ? SECTION_RULE : "flex flex-col gap-3"}
            role="group"
          >
            {questionsTitle ? (
              <h3
                className="m-0 text-[15px] leading-5 font-bold"
                id={`${ids}-q`}
              >
                {questionsTitle}
              </h3>
            ) : null}
            <div className={GRID}>
              {questions.map((question) => (
                <QuestionField
                  answer={answers[question.key]}
                  choose={copy.choose}
                  error={errors.answers[question.key]}
                  key={question.key}
                  onAnswer={(value) => answer(question.key, value)}
                  optional={optionalMark}
                  pending={pending}
                  question={question}
                />
              ))}
            </div>
          </div>
        ) : null}
        {copy.notes ? (
          <div className={SECTION_RULE}>
            <Field
              hint={copy.notesHint}
              id={`${ids}-notes`}
              label={copy.notes}
              mark={optionalMark}
            >
              {(describedBy) => (
                <Textarea
                  aria-describedby={describedBy}
                  className="[&_[data-slot=input-box]]:min-h-22 [&_[data-slot=input-box]]:rounded-lg [&_[data-slot=input-box]]:border-border-strong [&_textarea]:text-base"
                  id={`${ids}-notes`}
                  name="notes"
                  onChange={(event) => setNotes(event.target.value)}
                  readOnly={pending}
                  rows={3}
                  value={notes}
                />
              )}
            </Field>
          </div>
        ) : null}
        {copy.forOther ? (
          <div className="flex flex-col gap-2">
            <label className="flex min-h-11 cursor-pointer items-center gap-2.5 self-start text-base leading-[22px]">
              <input
                checked={forOther}
                className="size-5 flex-none accent-foreground"
                disabled={pending}
                onChange={(event) => setForOther(event.target.checked)}
                type="checkbox"
              />
              {copy.forOther.label}
            </label>
            {forOther ? (
              <div className="max-w-[420px] animate-in slide-in-from-top-1 duration-200">
                <Field
                  error={errors.bookedFor}
                  hint={copy.forOther.hint}
                  id={`${ids}-other`}
                  label={copy.forOther.name}
                >
                  {(describedBy) => (
                    <TextInput
                      aria-describedby={describedBy}
                      className={FIELD_BOX}
                      id={`${ids}-other`}
                      name="bookedFor"
                      onChange={(event) => setBookedFor(event.target.value)}
                      readOnly={pending}
                      status={errors.bookedFor ? "error" : "default"}
                      value={bookedFor}
                    />
                  )}
                </Field>
              </div>
            ) : null}
          </div>
        ) : null}
        {footer}
        {error ? (
          <p
            className="m-0 text-sm text-destructive"
            data-slot="booking-details-error"
          >
            {error}
          </p>
        ) : null}
        {hideSubmit ? null : (
          <Button loading={pending} size="md" type="submit">
            {copy.submit}
          </Button>
        )}
      </div>
    </form>
  );
}

/** A label, the line under it, the control, and what is wrong with it. */
function Field({
  id,
  label,
  mark,
  hint,
  error,
  children,
}: {
  id: string;
  label: ReactNode;
  mark?: ReactNode;
  hint?: ReactNode;
  error?: string;
  children: (describedBy: string | undefined) => ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex min-w-0 flex-col gap-1.5" data-slot="booking-field">
      <label className="text-sm leading-5 font-semibold" htmlFor={id}>
        {label}
        {mark ? <> {mark}</> : null}
      </label>
      {hint ? (
        <span
          className="text-[13px] leading-[18px] text-secondary-foreground"
          id={hintId}
        >
          {hint}
        </span>
      ) : null}
      {children(describedBy)}
      {error ? <FieldError id={errorId} message={error} /> : null}
    </div>
  );
}

function FieldError({ id, message }: { id?: string; message: string }) {
  return (
    <span
      className="flex animate-in items-start gap-1.5 text-[13px] leading-[18px] text-destructive slide-in-from-top-1 duration-200"
      id={id}
    >
      <WarningCircle aria-hidden className="mt-0.5 shrink-0" size={14} />
      {message}
    </span>
  );
}

function QuestionField({
  question,
  answer = "",
  choose,
  error,
  optional,
  pending,
  onAnswer,
}: {
  question: BookingQuestion;
  answer?: Answer;
  choose: string;
  error?: string;
  optional: ReactNode;
  pending: boolean;
  onAnswer: (value: Answer) => void;
}) {
  const id = useId();
  const options = question.options ?? [];
  const mark = question.required ? undefined : optional;
  const hintId = question.hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const groupLabel = (
    <span className="flex flex-col gap-0.5">
      <span className="text-sm leading-5 font-semibold text-foreground">
        {question.label}
        {mark ? <> {mark}</> : null}
      </span>
      {question.hint ? (
        <span
          className="text-[13px] leading-[18px] font-normal text-secondary-foreground"
          id={hintId}
        >
          {question.hint}
        </span>
      ) : null}
    </span>
  );
  if (question.kind === "radio") {
    return (
      <div
        className="flex min-w-0 flex-col gap-1.5"
        data-slot="booking-question"
      >
        <RadioList
          aria-describedby={
            [hintId, errorId].filter(Boolean).join(" ") || undefined
          }
          aria-invalid={error ? true : undefined}
          aria-label={question.label}
          disabled={pending}
          label={groupLabel}
          onValueChange={(value) => onAnswer(String(value))}
          value={String(answer)}
        >
          {options.map((option) => (
            <RadioListItem key={option} value={option}>
              {optionText(question, option)}
            </RadioListItem>
          ))}
        </RadioList>
        {error ? <FieldError id={errorId} message={error} /> : null}
      </div>
    );
  }
  if (question.kind === "checkboxes") {
    const selected = new Set(answer);
    return (
      <div
        className="flex min-w-0 flex-col gap-1.5"
        data-slot="booking-question"
      >
        <CheckboxList label={groupLabel}>
          {options.map((option) => (
            <CheckboxListInput
              checked={selected.has(option)}
              disabled={pending}
              key={option}
              onCheckedChange={(checked) => {
                onAnswer(toggled(options, selected, option, checked === true));
              }}
            >
              {optionText(question, option)}
            </CheckboxListInput>
          ))}
        </CheckboxList>
        {error ? <FieldError id={errorId} message={error} /> : null}
      </div>
    );
  }
  return (
    <div className="contents" data-slot="booking-question">
      <Field
        error={error}
        hint={question.hint}
        id={id}
        label={question.label}
        mark={mark}
      >
        {(describedBy) =>
          question.kind === "select" ? (
            <Select
              disabled={pending}
              onValueChange={(value) => {
                if (typeof value === "string") onAnswer(value);
              }}
              value={answer === "" ? null : String(answer)}
            >
              <SelectTrigger
                aria-describedby={describedBy}
                aria-invalid={error ? true : undefined}
                aria-label={question.label}
                className="h-11 w-full rounded-lg"
                id={id}
              >
                <SelectValue placeholder={question.placeholder ?? choose} />
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                aria-label={question.label}
              >
                {options.map((option) => (
                  <SelectItem
                    key={option}
                    label={optionText(question, option)}
                    value={option}
                  >
                    {optionText(question, option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : question.kind === "long_text" ? (
            <Textarea
              aria-describedby={describedBy}
              className="[&_[data-slot=input-box]]:rounded-lg [&_[data-slot=input-box]]:border-border-strong [&_textarea]:text-base"
              id={id}
              name={`question-${question.key}`}
              onChange={(event) => onAnswer(event.target.value)}
              placeholder={question.placeholder}
              readOnly={pending}
              status={error ? "error" : "default"}
              value={String(answer)}
            />
          ) : question.kind === "number" ? (
            <NumberInput
              aria-describedby={describedBy}
              className={FIELD_BOX}
              id={id}
              max={question.max}
              min={question.min ?? 0}
              name={`question-${question.key}`}
              onChange={(event) => onAnswer(event.target.value)}
              placeholder={question.placeholder}
              prefix={question.prefix}
              readOnly={pending}
              status={error ? "error" : "default"}
              value={String(answer)}
            />
          ) : (
            <TextInput
              aria-describedby={describedBy}
              className={FIELD_BOX}
              id={id}
              name={`question-${question.key}`}
              onChange={(event) => onAnswer(event.target.value)}
              placeholder={question.placeholder}
              readOnly={pending}
              status={error ? "error" : "default"}
              value={String(answer)}
            />
          )
        }
      </Field>
    </div>
  );
}

function optionText(question: BookingQuestion, option: string) {
  return question.optionLabels?.[option] ?? option;
}

/** The ticked options in the order the service lists them. */
function toggled(
  options: readonly string[],
  selected: ReadonlySet<string>,
  option: string,
  on: boolean,
) {
  const next = new Set(selected);
  if (on) next.add(option);
  else next.delete(option);
  return options.filter((item) => next.has(item));
}

function isAnswered(answer: Answer | undefined): answer is Answer {
  return answer !== undefined && answer.length > 0;
}

/** Trims every text and keeps only the answers the service asks for. */
function collect(
  raw: BookingDetailsValues,
  questions: readonly BookingQuestion[],
): BookingDetailsValues {
  const answers: Record<string, Answer> = {};
  for (const question of questions) {
    const held = raw.answers[question.key];
    const value = typeof held === "string" ? held.trim() : held;
    if (isAnswered(value)) answers[question.key] = value;
  }
  return {
    name: raw.name.trim(),
    email: raw.email.trim().toLowerCase(),
    phone: raw.phone,
    phoneCountry: raw.phoneCountry,
    notes: raw.notes.trim(),
    answers,
    ...(raw.bookedFor === undefined ? {} : { bookedFor: raw.bookedFor.trim() }),
  };
}

function validate(
  values: BookingDetailsValues,
  questions: readonly BookingQuestion[],
  copy: BookingDetailsFormCopy,
  phoneRequired: boolean,
): FieldErrors {
  const answers: Record<string, string> = {};
  for (const question of questions) {
    const held = values.answers[question.key];
    const missing = held === undefined;
    if (question.required && missing) {
      answers[question.key] = question.error ?? missingWords(question, copy);
    } else if (
      !missing &&
      question.kind === "number" &&
      !inBounds(String(held), question)
    ) {
      answers[question.key] = question.error ?? copy.answerMissing;
    }
  }
  const phoneCountry = values.phoneCountry
    ? (values.phoneCountry as Country)
    : undefined;
  const phoneReady = auctionPhoneSoftReady(values.phone, phoneCountry);
  return {
    name: values.name === "" ? copy.nameMissing : undefined,
    email:
      values.email === ""
        ? copy.emailMissing
        : EMAIL.test(values.email)
          ? undefined
          : copy.emailInvalid,
    phone:
      values.phone === ""
        ? phoneRequired
          ? (copy.phoneRequired ?? copy.phoneMissing)
          : undefined
        : phoneReady
          ? undefined
          : copy.phoneMissing,
    bookedFor:
      values.bookedFor !== undefined && values.bookedFor === ""
        ? copy.forOther?.missing
        : undefined,
    answers,
  };
}

/** What a required question left empty is told, by its kind. */
function missingWords(
  question: BookingQuestion,
  copy: BookingDetailsFormCopy,
): string {
  if (question.kind === "checkboxes" && copy.chooseOne) return copy.chooseOne;
  if (question.kind === "select" && copy.chooseX) {
    return copy.chooseX.replace("{label}", question.label.toLowerCase());
  }
  return copy.answerMissing;
}

/** A number answer inside the question's bounds; none set means any. */
function inBounds(raw: string, question: BookingQuestion): boolean {
  if (question.min === undefined && question.max === undefined) return true;
  if (!/^-?\d+(\.\d+)?$/.test(raw)) return false;
  const value = Number(raw);
  return (
    (question.min === undefined || value >= question.min) &&
    (question.max === undefined || value <= question.max)
  );
}

export type { BookingDetailsFormCopy, BookingDetailsFormProps };
export { BookingDetailsForm };
