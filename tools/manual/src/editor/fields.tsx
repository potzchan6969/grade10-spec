import { InputShell } from "@grade10/design-system/components/forms/input";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { cn } from "@grade10/design-system/lib/utils";
import { useId } from "react";

/** The three controls every form in the editor is built from. They are thin
 * wrappers on the design system so a field here looks like a field anywhere. */

type FieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  problem?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
};

function labelOf(label: string, required?: boolean) {
  return required ? (
    <span>
      {label}{" "}
      <span aria-hidden className="text-destructive">
        *
      </span>
      <span className="sr-only">(required)</span>
    </span>
  ) : (
    label
  );
}

export function TextField({
  label,
  value,
  onChange,
  problem,
  hint,
  required,
  placeholder,
  suggestions = [],
  numeric = false,
}: FieldProps & { suggestions?: string[]; numeric?: boolean }) {
  const listId = useId();
  const hasList = suggestions.length > 0;

  return (
    <>
      <TextInput
        autoComplete="off"
        inputMode={numeric ? "numeric" : undefined}
        label={labelOf(label, required)}
        list={hasList ? listId : undefined}
        message={problem ?? hint}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        status={problem ? "error" : "default"}
        value={value}
      />
      {hasList ? (
        <datalist id={listId}>
          {suggestions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      ) : null}
    </>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  problem,
  hint,
  required,
  allowEmpty = false,
}: FieldProps & { options: readonly string[]; allowEmpty?: boolean }) {
  const id = useId();

  return (
    <InputShell
      htmlFor={id}
      label={labelOf(label, required)}
      message={problem ?? hint}
      messageId={`${id}-message`}
      status={problem ? "error" : "default"}
    >
      <select
        className="w-full cursor-pointer appearance-none bg-transparent text-foreground text-sm outline-none"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {allowEmpty ? <option value="">— none —</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </InputShell>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  problem,
  rows = 12,
  className,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  problem?: string;
  rows?: number;
  className?: string;
}) {
  const id = useId();

  return (
    <div className="flex min-h-0 w-full flex-col gap-2">
      <label
        className="font-medium text-secondary-foreground text-sm"
        htmlFor={id}
      >
        {label}
      </label>
      <textarea
        className={cn(
          "w-full flex-1 resize-y rounded-(--radius-2xl) border bg-input px-3 py-2.5 font-mono text-foreground text-sm leading-relaxed outline-none transition-[border-color,box-shadow] focus-visible:ring-1 focus-visible:ring-inset",
          problem
            ? "border-destructive-ring focus-visible:border-destructive-ring focus-visible:ring-destructive-ring"
            : "border-border focus-visible:border-ring focus-visible:ring-ring",
          className,
        )}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        spellCheck={false}
        value={value}
      />
      {problem ? (
        <span className="text-destructive text-xs">{problem}</span>
      ) : null}
    </div>
  );
}
