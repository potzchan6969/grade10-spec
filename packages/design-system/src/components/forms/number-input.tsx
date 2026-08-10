import {
  Input,
  InputShell,
  type InputStatus,
  InputStatusIcon,
} from "@grade10/design-system/components/forms/input";
import { cn } from "@grade10/design-system/lib/utils";
import { XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useId } from "react";

type NumberInputProps = React.ComponentProps<"input"> & {
  /** Rendered above the field. Figma's `showLabel`, as the absence of a value. */
  label?: ReactNode;
  /** Helper or validation text below the field. */
  message?: ReactNode;
  status?: InputStatus;
  loading?: boolean;
  /** Trailing unit, sitting between the value and the icon slot — Figma's
   * `unit` TEXT property. */
  unit?: ReactNode;
  /** Presence renders the clear button; Figma models this as its `clear`
   * boolean, which on its own could not clear anything. */
  onClear?: () => void;
};

/**
 * A numeric field with an optional unit and clear button.
 *
 * Same four Figma axes as `TextInput`, plus `unit` and `clear`. The clear
 * button is dropped while disabled — a field that cannot be edited cannot be
 * cleared, which is what the design draws.
 */
function NumberInput({
  className,
  id,
  label,
  message,
  status = "default",
  loading = false,
  disabled,
  unit,
  onClear,
  ...props
}: NumberInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = message ? `${inputId}-message` : undefined;

  // One trailing slot, one occupant: the spinner wins, then the status icon,
  // then the clear button.
  const statusIcon = <InputStatusIcon status={status} loading={loading} />;
  const trailing =
    loading || status !== "default" ? (
      statusIcon
    ) : onClear && !disabled ? (
      <button
        type="button"
        data-slot="input-clear"
        aria-label="Clear"
        onClick={onClear}
        className="flex shrink-0 cursor-pointer items-center text-secondary-foreground transition-colors hover:text-foreground"
      >
        <XIcon />
      </button>
    ) : null;

  return (
    <InputShell
      className={className}
      status={status}
      label={label}
      message={message}
      disabled={disabled}
      htmlFor={inputId}
      messageId={messageId}
      trailing={trailing}
    >
      <Input
        id={inputId}
        type="number"
        inputMode="decimal"
        disabled={disabled}
        aria-invalid={status === "error" || undefined}
        aria-describedby={messageId}
        {...props}
      />
      {unit ? (
        <span
          data-slot="input-unit"
          className={cn(
            "shrink-0 text-sm text-secondary-foreground",
            disabled && "text-disabled-foreground",
          )}
        >
          {unit}
        </span>
      ) : null}
    </InputShell>
  );
}

export type { NumberInputProps };
export { NumberInput };
