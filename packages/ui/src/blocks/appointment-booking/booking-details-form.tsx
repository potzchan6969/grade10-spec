import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { RadioListItem } from "@grade10/design-system/components/forms/radio-list-item";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { type FormEvent, type ReactNode, useState } from "react";
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
  notes: string;
  /** Marks an optional field and an optional question: `Optional`. */
  optional: string;
  nameMissing: string;
  emailMissing: string;
  emailInvalid: string;
  answerMissing: string;
  submit: string;
};

type BookingDetailsFormProps = {
  copy: BookingDetailsFormCopy;
  questions: readonly BookingQuestion[];
  /** Seeds the fields, so a refused time keeps what the collector typed. */
  initialValues?: Partial<BookingDetailsValues>;
  pending?: boolean;
  error?: ReactNode;
  onSubmit: (values: BookingDetailsValues) => void;
  className?: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  answers: Readonly<Record<string, string>>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NO_ERRORS: FieldErrors = { answers: {} };

/**
 * Name, email, phone, the service's questions in order, and notes. Refuses to
 * report while a name, an address or a required answer is missing, naming
 * each; reports every text trimmed and answers keyed by question id.
 */
function BookingDetailsForm({
  copy,
  questions,
  initialValues,
  pending = false,
  error,
  onSubmit,
  className,
}: BookingDetailsFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? "");
  const [notes, setNotes] = useState(initialValues?.notes ?? "");
  const [answers, setAnswers] = useState<BookingAnswers>(
    initialValues?.answers ?? {},
  );
  const [errors, setErrors] = useState<FieldErrors>(NO_ERRORS);

  function answer(id: string, value: string) {
    setAnswers((held) => ({ ...held, [id]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const values = collect({ name, email, phone, notes, answers }, questions);
    const found = validate(values, questions, copy);
    setErrors(found);
    if (found.name || found.email || Object.keys(found.answers).length > 0) {
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
        <Text as="h2" size="lg" weight="medium">
          {copy.title}
        </Text>
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
          onChange={(event) => setEmail(event.target.value)}
          status={errors.email ? "error" : "default"}
          type="email"
          value={email}
        />
        <TextInput
          autoComplete="tel"
          inputMode="tel"
          label={`${copy.phone} (${copy.optional})`}
          name="phone"
          onChange={(event) => setPhone(event.target.value)}
          type="tel"
          value={phone}
        />
        {questions.map((question) => (
          <QuestionField
            answer={answers[question.id] ?? ""}
            error={errors.answers[question.id]}
            key={question.id}
            onAnswer={(value) => answer(question.id, value)}
            optional={copy.optional}
            question={question}
          />
        ))}
        <TextInput
          label={`${copy.notes} (${copy.optional})`}
          name="notes"
          onChange={(event) => setNotes(event.target.value)}
          value={notes}
        />
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
  answer,
  error,
  optional,
  onAnswer,
}: {
  question: BookingQuestion;
  answer: string;
  error?: string;
  optional: string;
  onAnswer: (value: string) => void;
}) {
  const label = question.required
    ? question.label
    : `${question.label} (${optional})`;
  if (question.kind === "choice") {
    return (
      <VStack data-slot="booking-question" gap="xs" hAlign="stretch">
        <RadioList
          aria-invalid={error ? true : undefined}
          label={label}
          onValueChange={(value) => onAnswer(String(value))}
          value={answer}
        >
          {(question.options ?? []).map((option) => (
            <RadioListItem key={option} value={option}>
              {option}
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
  return (
    <TextInput
      data-slot="booking-question"
      label={label}
      message={error}
      name={`question-${question.id}`}
      onChange={(event) => onAnswer(event.target.value)}
      status={error ? "error" : "default"}
      value={answer}
    />
  );
}

/** Trims every text and keeps only the answers the service asks for. */
function collect(
  raw: BookingDetailsValues,
  questions: readonly BookingQuestion[],
): BookingDetailsValues {
  const answers: Record<string, string> = {};
  for (const question of questions) {
    const value = raw.answers[question.id]?.trim() ?? "";
    if (value !== "") answers[question.id] = value;
  }
  return {
    name: raw.name.trim(),
    email: raw.email.trim().toLowerCase(),
    phone: raw.phone.trim(),
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
    if (question.required && values.answers[question.id] === undefined) {
      answers[question.id] = copy.answerMissing;
    }
  }
  return {
    name: values.name === "" ? copy.nameMissing : undefined,
    email:
      values.email === ""
        ? copy.emailMissing
        : EMAIL.test(values.email)
          ? undefined
          : copy.emailInvalid,
    answers,
  };
}

export type { BookingDetailsFormCopy, BookingDetailsFormProps };
export { BookingDetailsForm };
