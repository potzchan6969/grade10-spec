import {
  type InputStatus,
  messageVariants,
} from "@grade10/design-system/components/forms/input";
import { InputOtpSlot } from "@grade10/design-system/components/forms/input-otp-slot";
import { cn } from "@grade10/design-system/lib/utils";
import {
  OTPInput,
  OTPInputContext,
  REGEXP_ONLY_DIGITS,
  type RenderProps,
} from "input-otp";
import {
  type ReactNode,
  type RefObject,
  useContext,
  useEffect,
  useId,
  useRef,
} from "react";

const slotKeys = [
  "slot-1",
  "slot-2",
  "slot-3",
  "slot-4",
  "slot-5",
  "slot-6",
] as const;

type OtpInputProps = Omit<
  React.ComponentProps<typeof OTPInput>,
  "maxLength" | "render" | "children" | "containerClassName" | "placeholder"
> & {
  /** Rendered above the row. Omit it and no label renders — Figma's
   * `showLabel`, expressed as the absence of a value. */
  label?: ReactNode;
  /** Helper or validation text below the row. Figma's `message`. */
  message?: ReactNode;
  /** The field's tone. Told to the component, never derived by it. */
  status?: InputStatus;
  /** Greys every slot and the label and message. Figma's `isDisabled`. */
  disabled?: boolean;
  /** How many slots to draw. Figma draws six. */
  length?: number;
  /**
   * Optional empty-slot glyph. Defaults to blank — Figma's set paints `"0"` as
   * a design stand-in, but product OTP fields leave empty slots empty.
   */
  placeholder?: string;
  /** Pins the focus ring on mount — Figma's `state=focus` uses slot 3. */
  defaultFocusedIndex?: number;
  /** Initial caret slot on mount — Figma's `state=focus` uses slot 3. */
  focusedIndex?: number;
};

function otpSelectionRange(
  input: HTMLInputElement,
  index: number,
  maxLength: number,
): [number, number] {
  const length = input.value.length;
  const caret = Math.min(index, length);
  const selectionEnd =
    index < length ? index + 1 : Math.min(caret + 1, maxLength);
  return [caret, selectionEnd];
}

/** input-otp's onFocus always moves the caret to the end when the value is full. */
function focusInputSlot(
  input: HTMLInputElement,
  index: number,
  maxLength: number,
) {
  const [caret, selectionEnd] = otpSelectionRange(input, index, maxLength);

  const applySelection = () => {
    input.setSelectionRange(caret, selectionEnd);
    document.dispatchEvent(new Event("selectionchange"));
  };

  if (document.activeElement === input) {
    applySelection();
    return;
  }

  input.focus();
  applySelection();
  requestAnimationFrame(applySelection);
  setTimeout(applySelection, 0);
  setTimeout(applySelection, 10);
}

function OtpInputSlots({
  disabled,
  inputRef,
  length,
  placeholder,
  status,
}: {
  disabled?: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  length: number;
  placeholder: string;
  status: InputStatus;
}) {
  const inputContext = useContext(OTPInputContext) as RenderProps;

  return (
    <>
      {inputContext.slots.map((slot, index) => (
        <InputOtpSlot
          key={slotKeys[index]}
          digit={slot.char}
          placeholder={placeholder ? (slot.placeholderChar ?? placeholder) : ""}
          status={status}
          focused={slot.isActive}
          disabled={disabled}
          data-otp-index={index}
          className={cn(
            "relative z-10 pointer-events-auto",
            !disabled && "cursor-text",
          )}
          onPointerDown={(event) => {
            if (disabled) return;
            event.preventDefault();
            event.stopPropagation();
            const input = inputRef.current;
            if (!input) return;
            focusInputSlot(input, index, length);
          }}
        />
      ))}
    </>
  );
}

/**
 * One-time password input with a labeled row of six digit fields and
 * validation message. Based on shadcn/ui input-otp.
 *
 * A labelled, editable row of verification-code slots with a status tone and an
 * optional message. The row length is a prop here, not fixed at six.
 *
 * Editing is delegated to `input-otp`, the same engine shadcn/ui uses: one native
 * input owns the value and caret, and each `InputOtpSlot` mirrors a character.
 * Figma models three axes on this set, of which one is a prop: `state` is which
 * slot carries the focus ring, `status` is the tone shared with the slots and
 * message, and `isDisabled` is the plain disabled boolean. An empty row is blank
 * boxes — not a `"0"` placeholder — until the user types.
 */
function OtpInput({
  className,
  label,
  message,
  status = "default",
  disabled = false,
  length = 6,
  placeholder = "",
  defaultFocusedIndex,
  focusedIndex,
  id,
  defaultValue = "",
  value,
  onChange,
  onComplete,
  name,
  ...rest
}: OtpInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = message ? `${inputId}-message` : undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const placeholderValue = placeholder ? placeholder.repeat(length) : undefined;
  const isControlled = value !== undefined;
  const initialFocusedIndex = focusedIndex ?? defaultFocusedIndex;

  useEffect(() => {
    if (initialFocusedIndex == null || disabled) return;
    const input = inputRef.current;
    if (!input) return;
    focusInputSlot(input, initialFocusedIndex, length);
  }, [disabled, initialFocusedIndex, length]);

  return (
    <div
      data-slot="otp-input"
      data-status={status}
      data-disabled={disabled || undefined}
      className={cn("flex w-full flex-col gap-2", className)}
    >
      {label ? (
        <label
          data-slot="input-label"
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium text-secondary-foreground",
            disabled && "opacity-50",
          )}
        >
          {label}
        </label>
      ) : null}
      <OTPInput
        ref={inputRef}
        id={inputId}
        name={name}
        maxLength={length}
        pattern={REGEXP_ONLY_DIGITS}
        placeholder={placeholderValue}
        disabled={disabled}
        onChange={onChange}
        onComplete={onComplete}
        containerClassName={cn(
          "relative flex w-full gap-2",
          // The library paints an absolute input over the slots; let slots receive clicks.
          "[&_[data-input-otp]]:!pointer-events-none",
        )}
        className="disabled:cursor-not-allowed"
        aria-invalid={status === "error" || undefined}
        aria-describedby={messageId}
        {...(isControlled ? { value } : { defaultValue })}
        {...rest}
      >
        <OtpInputSlots
          disabled={disabled}
          inputRef={inputRef}
          length={length}
          placeholder={placeholder}
          status={status}
        />
      </OTPInput>
      {message ? (
        <span
          data-slot="input-message"
          id={messageId}
          className={cn(
            messageVariants({ status: disabled ? "default" : status }),
            disabled && "opacity-50",
          )}
        >
          {message}
        </span>
      ) : null}
    </div>
  );
}

export type { OtpInputProps };
export { OtpInput };
