import {
  Input,
  InputShell,
  type InputStatus,
  InputStatusIcon,
} from "@grade10/design-system/components/forms/input";
import { XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useId } from "react";

type NumberInputProps = Omit<React.ComponentProps<"input">, "size"> & {
  /** Rendered above the field. Figma's `showLabel`, as the absence of a value. */
  label?: ReactNode;
  /** Helper or validation text below the field. */
  message?: ReactNode;
  status?: InputStatus;
  /** Field height — `lg` is the 48px rung Stepper Input publishes; the
   * control keeps `text-base` at every viewport there. Code-side axis. */
  size?: "md" | "lg";
  loading?: boolean;
  /** Uneditable text before the value — currency symbol, etc. */
  prefix?: ReactNode;
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
 *
 * `size` is a code-side axis Figma does not draw on this set — `lg` matches
 * Stepper Input's 48px rung.
 */
function NumberInput({
  className,
  id,
  label,
  message,
  status = "default",
  size = "md",
  loading = false,
  disabled,
  prefix,
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
      size={size}
      label={label}
      message={message}
      disabled={disabled}
      htmlFor={inputId}
      messageId={messageId}
      leading={
        prefix ? (
          <span
            data-slot="input-prefix"
            className="shrink-0 text-base text-secondary-foreground md:text-sm"
          >
            {prefix}
          </span>
        ) : undefined
      }
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
          className="shrink-0 text-base text-secondary-foreground md:text-sm"
        >
          {unit}
        </span>
      ) : null}
    </InputShell>
  );
}

export type { NumberInputProps };
export { NumberInput };
