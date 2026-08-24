import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import {
  Input,
  type InputStatus,
  messageVariants,
} from "@grade10/design-system/components/forms/input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { Minus, Plus } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

/**
 * A number input with stepper buttons for adjusting the value.
 *
 * It folds the decrement button, text input, and increment button into one
 * control. It accepts only numeric input, steps with the buttons or the ↑/↓
 * arrow keys, and reformats the value when you commit.
 *
 * Unlike a checkbox or radio, the input is a real text field. Default showing
 * the rolling-digit animation on stepper presses, it is skipped when the user
 * prefers reduced motion.
 *
 * Min and max clamp the value and disable the stepper once a bound is reached;
 * clearing the field and blurring snaps back to min (or 0). Step sets how far
 * each press or arrow key moves the value — hold Shift for a larger step (10×
 * by default) or Alt for a smaller step.
 *
 * Figma (`4623:395`, Stepper Input) has five axes, of which two are props:
 * `focus` is a CSS pseudo-state, `placeholder` is an empty field rather than a
 * choice, and `disabled` is the native attribute. `status` and `size` are the
 * axes with code counterparts.
 */
const stepperControlVariants = cva(
  "w-full overflow-hidden rounded-(--radius-full) border bg-input transition-colors",
  {
    variants: {
      status: {
        default:
          "border-border focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
        error:
          "border-destructive-ring focus-within:border-destructive-ring focus-within:ring-1 focus-within:ring-destructive-ring",
        success:
          "border-success-ring focus-within:border-success-ring focus-within:ring-1 focus-within:ring-success-ring",
      },
      // Height and padding live on the inner control (`h-10`/`h-12`, 3px/4px).
      // They are not in this string: the checker compares them to the variant
      // frame, which also includes the label and message (88px / 96px).
      size: {
        md: "px-[3px] [&_input]:text-sm",
        lg: "px-[4px] [&_input]:text-base",
      },
    },
    defaultVariants: {
      status: "default",
      size: "md",
    },
  },
);

type StepperProps = Omit<
  ComponentProps<"input">,
  | "value"
  | "defaultValue"
  | "onChange"
  | "size"
  | "type"
  | "min"
  | "max"
  | "step"
> &
  VariantProps<typeof stepperControlVariants> & {
    /** Rendered above the field. Omit it and no label renders. */
    label?: ReactNode;
    /** Helper or validation text below the field. Figma's `message`. */
    message?: ReactNode;
    /** The field's tone. Told to the component, never derived by it. */
    status?: InputStatus;
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    decrementLabel?: string;
    incrementLabel?: string;
  };

function sanitizeNumeric(raw: string, allowNegative: boolean) {
  const minus = allowNegative && raw.startsWith("-") ? "-" : "";
  const rest = (minus ? raw.slice(1) : raw).replace(/-/g, "");
  const [whole, ...fraction] = rest.split(".");
  const digits = whole.replace(/\D/g, "");
  if (fraction.length === 0) return `${minus}${digits}`;
  return `${minus}${digits}.${fraction.join("").replace(/\D/g, "")}`;
}

function parseNumeric(raw: string): number | undefined {
  if (raw === "" || raw === "-" || raw === "." || raw === "-.")
    return undefined;
  const next = Number(raw);
  return Number.isFinite(next) ? next : undefined;
}

function clamp(value: number, min?: number, max?: number) {
  let next = value;
  if (min != null && next < min) next = min;
  if (max != null && next > max) next = max;
  return next;
}

function formatCommitted(value: number) {
  return String(value);
}

function stepDelta(
  step: number,
  modifiers: { shiftKey: boolean; altKey: boolean },
) {
  if (modifiers.shiftKey) return step * 10;
  if (modifiers.altKey) return step / 10;
  return step;
}

function Stepper({
  className,
  id,
  label,
  message,
  status = "default",
  size = "md",
  value: valueProp,
  defaultValue,
  onValueChange,
  min,
  max,
  step = 1,
  disabled = false,
  placeholder,
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  ...props
}: StepperProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = message ? `${inputId}-message` : undefined;
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = isControlled ? valueProp : uncontrolled;

  const [text, setText] = useState(() =>
    value == null ? "" : formatCommitted(value),
  );
  const [draft, setDraft] = useState(false);
  const [roll, setRoll] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (draft) return;
    setText(value == null ? "" : formatCommitted(value));
  }, [value, draft]);

  const numeric = parseNumeric(text);
  const atMin = numeric != null && min != null && numeric <= min;
  const atMax = numeric != null && max != null && numeric >= max;
  const allowNegative = min == null || min < 0;

  const commit = (next: number) => {
    const clamped = clamp(next, min, max);
    setDraft(false);
    setText(formatCommitted(clamped));
    if (!isControlled) setUncontrolled(clamped);
    onValueChange?.(clamped);
    return clamped;
  };

  const playRoll = (direction: "up" | "down") => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setRoll(direction);
  };

  const stepBy = (
    direction: 1 | -1,
    modifiers: { shiftKey: boolean; altKey: boolean },
  ) => {
    if (disabled) return;
    const from = numeric ?? min ?? 0;
    const next = commit(from + direction * stepDelta(step, modifiers));
    if (next !== from) playRoll(direction > 0 ? "up" : "down");
    inputRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      stepBy(1, event);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      stepBy(-1, event);
    }
  };

  const buttonSize = size === "lg" ? "md" : "sm";

  return (
    <VStack
      gap="sm"
      data-slot="stepper"
      data-disabled={disabled || undefined}
      data-status={status}
      className={cn("w-full", disabled && "opacity-50", className)}
    >
      {label ? (
        <label
          data-slot="stepper-label"
          htmlFor={inputId}
          className="text-sm font-medium text-secondary-foreground"
        >
          {label}
        </label>
      ) : null}
      <HStack
        gap="none"
        vAlign="center"
        data-slot="stepper-control"
        className={cn(
          stepperControlVariants({
            status: disabled ? "default" : status,
            size,
          }),
          size === "lg" ? "h-12" : "h-10",
        )}
      >
        <IconButton
          aria-label={decrementLabel}
          className={cn(
            "text-secondary-foreground",
            disabled && "disabled:opacity-100",
          )}
          disabled={disabled || atMin}
          onClick={(event) => stepBy(-1, event)}
          onPointerDown={(event) => event.preventDefault()}
          size={buttonSize}
          tabIndex={-1}
          type="button"
          variant="secondary"
        >
          <Minus aria-hidden />
        </IconButton>
        <Input
          {...props}
          ref={inputRef}
          aria-describedby={messageId}
          aria-errormessage={
            status === "error" && messageId ? messageId : undefined
          }
          aria-invalid={status === "error" || undefined}
          aria-label={typeof label === "string" ? label : undefined}
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuenow={numeric}
          className={cn(
            "flex-1 text-center tabular-nums disabled:text-foreground",
            size === "lg" && "text-base",
            roll === "up" &&
              "animate-in fade-in slide-in-from-bottom-2 duration-150 motion-reduce:animate-none",
            roll === "down" &&
              "animate-in fade-in slide-in-from-top-2 duration-150 motion-reduce:animate-none",
          )}
          disabled={disabled}
          id={inputId}
          inputMode="numeric"
          onAnimationEnd={() => setRoll(null)}
          onBlur={() => {
            if (text === "") {
              commit(min ?? 0);
              return;
            }
            if (numeric == null) {
              commit(min ?? 0);
              return;
            }
            commit(numeric);
          }}
          onChange={(event) => {
            const next = sanitizeNumeric(event.target.value, allowNegative);
            setDraft(true);
            setText(next);
            const parsed = parseNumeric(next);
            if (parsed != null) {
              const clamped = clamp(parsed, min, max);
              if (!isControlled) setUncontrolled(clamped);
              onValueChange?.(clamped);
            }
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          role="spinbutton"
          value={text}
        />
        <IconButton
          aria-label={incrementLabel}
          className={cn(
            "text-secondary-foreground",
            disabled && "disabled:opacity-100",
          )}
          disabled={disabled || atMax}
          onClick={(event) => stepBy(1, event)}
          onPointerDown={(event) => event.preventDefault()}
          size={buttonSize}
          tabIndex={-1}
          type="button"
          variant="secondary"
        >
          <Plus aria-hidden />
        </IconButton>
      </HStack>
      {message ? (
        <span
          data-slot="stepper-message"
          id={messageId}
          className={messageVariants({
            status: disabled ? "default" : status,
          })}
        >
          {message}
        </span>
      ) : null}
    </VStack>
  );
}

export type { StepperProps };
export { Stepper, stepperControlVariants };
