import { Text } from "@grade10/design-system/components/display/text";
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
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import {
  AuctionPhoneField,
  auctionPhoneConfirmValue,
  auctionPhoneSoftReady,
} from "@grade10/ui";
import { Info } from "@phosphor-icons/react";
import { type FormEvent, type ReactNode, useId, useState } from "react";
import type { Country } from "react-phone-number-input";
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
  /** Shown under notes when the answers are for the desk only. */
  notesHint?: string;
  /** Marks an optional field and an optional question: `Optional`. */
  optional: string;
  nameMissing: string;
  emailMissing: string;
  emailInvalid: string;
  phoneMissing: string;
  answerMissing: string;
  /** Shown in a select before an option is picked. */
  choose: string;
  submit: string;
};

type BookingDetailsFormProps = {
  copy: BookingDetailsFormCopy;
  questions: readonly BookingQuestion[];
  /** Intro under the title — usually the service's description. */
  description?: ReactNode;
  /** Seeds the fields, so a refused time keeps what the collector typed. */
  initialValues?: Partial<BookingDetailsValues>;
  /** Locks email to the seeded value — native disabled, still submitted. */
  emailDisabled?: boolean;
  pending?: boolean;
  error?: ReactNode;
  onSubmit: (values: BookingDetailsValues) => void;
  className?: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  answers: Readonly<Record<string, string>>;
};

type Answer = string | readonly string[];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NO_ERRORS: FieldErrors = { answers: {} };

/**
 * Name, email, phone, the service's questions in order, and notes. Refuses to
 * report while a name, an address or a required answer is missing, naming
 * each; reports every text trimmed and answers keyed by question key.
 */
function BookingDetailsForm({
  copy,
  questions,
  description,
  initialValues,
  emailDisabled = false,
  pending = false,
  error,
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
  const [errors, setErrors] = useState<FieldErrors>(NO_ERRORS);

  function answer(key: string, value: Answer) {
    setAnswers((held) => ({ ...held, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
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
      },
      questions,
    );
    const found = validate(values, questions, copy);
    setErrors(found);
    if (
      found.name ||
      found.email ||
      found.phone ||
      Object.keys(found.answers).length > 0
    ) {
      return;
    }
    onSubmit(values);
  }

  return (
    <form
      className={className}
      data-slot="booking-details-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <VStack gap="md" hAlign="stretch">
        <VStack gap="xs" hAlign="stretch">
          <Text as="h2" size="lg" weight="medium">
            {copy.title}
          </Text>
          {description ? (
            <Text as="p" size="sm" tone="secondary">
              {description}
            </Text>
          ) : null}
        </VStack>
        <TextInput
          autoComplete="name"
          label={copy.name}
          message={errors.name}
          name="name"
          onChange={(event) => setName(event.target.value)}
          status={errors.name ? "error" : "default"}
          value={name}
        />
        <TextInput
          autoComplete="email"
          inputMode="email"
          label={copy.email}
          message={errors.email}
          name="email"
          onChange={
            emailDisabled ? undefined : (event) => setEmail(event.target.value)
          }
          disabled={emailDisabled}
          status={errors.email ? "error" : "default"}
          type="email"
          value={email}
        />
        <AuctionPhoneField
          country={phoneCountry ? (phoneCountry as Country) : undefined}
          countrySearchPlaceholder={copy.countrySearchPlaceholder}
          defaultCountry="HK"
          label={`${copy.phone} (${copy.optional})`}
          message={errors.phone}
          name="phone"
          onChange={setPhone}
          onCountryChange={(next) => setPhoneCountry(next ?? "")}
          placeholder={copy.phonePlaceholder}
          status={errors.phone ? "error" : "default"}
          value={phone}
        />
        {questions.map((question) => (
          <QuestionField
            answer={answers[question.key]}
            choose={copy.choose}
            error={errors.answers[question.key]}
            key={question.key}
            onAnswer={(value) => answer(question.key, value)}
            optional={copy.optional}
            question={question}
          />
        ))}
        {copy.notes ? (
          <VStack gap="xs" hAlign="stretch">
            <TextInput
              label={`${copy.notes} (${copy.optional})`}
              name="notes"
              onChange={(event) => setNotes(event.target.value)}
              value={notes}
            />
            {copy.notesHint ? (
              <Text as="p" size="sm" tone="muted">
                {copy.notesHint}
              </Text>
            ) : null}
          </VStack>
        ) : null}
        {error ? (
          <Text as="p" data-slot="booking-details-error" size="sm" tone="error">
            {error}
          </Text>
        ) : null}
        <Button loading={pending} size="md" type="submit">
          {copy.submit}
        </Button>
      </VStack>
    </form>
  );
}

function QuestionField({
  question,
  answer = "",
  choose,
  error,
  optional,
  onAnswer,
}: {
  question: BookingQuestion;
  answer?: Answer;
  choose: string;
  error?: string;
  optional: string;
  onAnswer: (value: Answer) => void;
}) {
  const selectId = useId();
  const options = question.options ?? [];
  const label = questionLabel(question, optional);
  const fieldLabel = <QuestionLabel hint={question.hint} label={label} />;
  if (question.kind === "radio") {
    return (
      <VStack data-slot="booking-question" gap="xs" hAlign="stretch">
        <RadioList
          aria-invalid={error ? true : undefined}
          label={fieldLabel}
          onValueChange={(value) => onAnswer(String(value))}
          value={String(answer)}
        >
          {options.map((option) => (
            <RadioListItem key={option} value={option}>
              {optionText(question, option)}
            </RadioListItem>
          ))}
        </RadioList>
        {error ? (
          <Text as="span" size="sm" tone="error">
            {error}
          </Text>
        ) : null}
      </VStack>
    );
  }
  if (question.kind === "checkboxes") {
    const selected = new Set(answer);
    return (
      <VStack data-slot="booking-question" gap="xs" hAlign="stretch">
        <CheckboxList label={fieldLabel}>
          {options.map((option) => (
            <CheckboxListInput
              checked={selected.has(option)}
              key={option}
              onCheckedChange={(checked) => {
                onAnswer(toggled(options, selected, option, checked === true));
              }}
            >
              {optionText(question, option)}
            </CheckboxListInput>
          ))}
        </CheckboxList>
        {error ? (
          <Text as="span" size="sm" tone="error">
            {error}
          </Text>
        ) : null}
      </VStack>
    );
  }
  if (question.kind === "select") {
    return (
      <VStack data-slot="booking-question" gap="xs" hAlign="stretch">
        <VStack gap="xs" hAlign="stretch">
          <label
            className="text-sm font-medium text-secondary-foreground"
            htmlFor={selectId}
          >
            {fieldLabel}
          </label>
          <Select
            onValueChange={(value) => {
              if (typeof value === "string") onAnswer(value);
            }}
            value={answer === "" ? null : String(answer)}
          >
            <SelectTrigger
              aria-invalid={error ? true : undefined}
              aria-label={question.label}
              className="w-full"
              id={selectId}
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
        </VStack>
        {error ? (
          <Text as="span" size="sm" tone="error">
            {error}
          </Text>
        ) : null}
      </VStack>
    );
  }
  if (question.kind === "long_text") {
    return (
      <Textarea
        data-slot="booking-question"
        label={fieldLabel}
        message={error}
        name={`question-${question.key}`}
        onChange={(event) => onAnswer(event.target.value)}
        placeholder={question.placeholder}
        status={error ? "error" : "default"}
        value={String(answer)}
      />
    );
  }
  if (question.kind === "number") {
    return (
      <NumberInput
        data-slot="booking-question"
        label={fieldLabel}
        message={error}
        min={0}
        name={`question-${question.key}`}
        onChange={(event) => onAnswer(event.target.value)}
        placeholder={question.placeholder}
        prefix={question.prefix}
        status={error ? "error" : "default"}
        value={String(answer)}
      />
    );
  }
  return (
    <TextInput
      data-slot="booking-question"
      label={fieldLabel}
      message={error}
      name={`question-${question.key}`}
      onChange={(event) => onAnswer(event.target.value)}
      placeholder={question.placeholder}
      status={error ? "error" : "default"}
      value={String(answer)}
    />
  );
}

function QuestionLabel({ hint, label }: { hint?: string; label: string }) {
  if (!hint) return label;
  return (
    <HStack className="min-w-0" gap="xs" vAlign="center">
      <span>{label}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            aria-label={hint}
            className="relative inline-flex shrink-0 cursor-pointer text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 after:absolute after:-inset-3 after:content-['']"
            closeOnClick={false}
          >
            <Info aria-hidden size={12} />
          </TooltipTrigger>
          <TooltipContent>{hint}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </HStack>
  );
}

function optionText(question: BookingQuestion, option: string) {
  return question.optionLabels?.[option] ?? option;
}

function questionLabel(question: BookingQuestion, optional: string) {
  return question.required ? question.label : `${question.label} (${optional})`;
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
  };
}

function validate(
  values: BookingDetailsValues,
  questions: readonly BookingQuestion[],
  copy: BookingDetailsFormCopy,
): FieldErrors {
  const answers: Record<string, string> = {};
  for (const question of questions) {
    if (question.required && values.answers[question.key] === undefined) {
      answers[question.key] = copy.answerMissing;
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
    phone: values.phone === "" || phoneReady ? undefined : copy.phoneMissing,
    answers,
  };
}

export type { BookingDetailsFormCopy, BookingDetailsFormProps };
export { BookingDetailsForm };
