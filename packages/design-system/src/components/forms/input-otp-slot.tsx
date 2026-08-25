import type { InputStatus } from "@grade10/design-system/components/forms/input";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * One box of a verification-code row: a 44×48 rounded square drawn around a
 * digit. Figma models three axes on the set (`Status/Input OTP Slot`), of which
 * one is a cva axis: `status` owns the resting border tone, `state=focus` is a
 * boolean `focused` prop (the resting border is what makes the slot differ from
 * an ordinary box, and focus paints the ring), and `isDisabled` is the plain
 * disabled boolean. The digit is the set's TEXT component property.
 *
 * Figma's default digit `"0"` is the placeholder glyph for an empty slot, not a
 * filled value — omit `digit` to render it in the secondary tone. A filled slot
 * passes the entered character and paints it in the foreground tone.
 *
 * Border tones from Figma (`2595:158`), Grade10 theme:
 * - default resting → `border`
 * - default focus → `ring` at 2px
 * - error resting → `destructive-border` (red-500 @ 50%)
 * - error focus → `destructive-ring` (red-400) at 2px
 * - success resting/focus → `success-ring` (green-300); focus adds 2px weight
 *
 * Resting and focus border utilities are mutually exclusive — applying both lets
 * Tailwind source order pick the colour, which breaks the focus tones.
 *
 * The set's Figma description carries only this attribution, not a
 * description: based on https://ui.shadcn.com/docs/components/base/input-otp
 */
const inputOtpSlotVariants = cva("bg-control", {
  variants: {
    status: {
      default: "border border-border",
      error: "border border-destructive-border",
      success: "border border-success-ring",
    },
  },
  defaultVariants: {
    status: "default",
  },
});

function inputOtpSlotFocusBorder(status: InputStatus) {
  return cn(
    "border-2",
    status === "error"
      ? "border-destructive-ring"
      : status === "success"
        ? "border-success-ring"
        : "border-ring",
  );
}

type InputOtpSlotProps = React.ComponentProps<"div"> &
  VariantProps<typeof inputOtpSlotVariants> & {
    /** The entered digit. Omit it and the placeholder glyph renders. */
    digit?: string | null;
    /** Empty-slot glyph. Figma's `digit` default is `"0"`. */
    placeholder?: string;
    /** Paints the focus ring instead of the resting border — Figma's `state=focus`. */
    focused?: boolean;
    /** Figma's `isDisabled`. Dims the glyph; the tone border stays. */
    disabled?: boolean;
  };

function InputOtpSlot({
  className,
  digit,
  placeholder = "0",
  focused = false,
  disabled = false,
  status = "default",
  ...props
}: InputOtpSlotProps) {
  const filled = digit != null && digit !== "";

  return (
    <div
      data-slot="input-otp-slot"
      data-status={status}
      data-focused={focused || undefined}
      data-disabled={disabled || undefined}
      data-filled={filled || undefined}
      className={cn(
        "flex h-12 w-11 shrink-0 items-center justify-center rounded-lg bg-input font-medium text-lg transition-colors",
        focused
          ? inputOtpSlotFocusBorder(status ?? "default")
          : inputOtpSlotVariants({ status }),
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "text-lg leading-7 font-medium",
          disabled
            ? "text-disabled-foreground"
            : filled
              ? "text-foreground"
              : "text-secondary-foreground",
        )}
      >
        {filled ? digit : placeholder}
      </span>
    </div>
  );
}

export type { InputOtpSlotProps };
export { InputOtpSlot, inputOtpSlotVariants };
