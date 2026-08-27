import type { InputStatus } from "@grade10/design-system/components/forms/input";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * One box of a verification-code row: a 44×48 rounded square drawn around a
 * digit. Figma models three axes on the set (`Input OTP Slot`, `2595:158`), of
 * which one is a cva axis: `status` owns the resting border tone, `state=focus`
 * is a boolean `focused` prop (focus paints a 2px ring in place of the resting
 * border), and `isDisabled` is the plain disabled boolean. The digit is the
 * set's TEXT component property.
 *
 * Figma's set paints `"0"` in every empty variant as a design stand-in. In
 * product use an empty slot is blank — omit `digit` and leave `placeholder`
 * unset (or pass `""`). Digits bind `Base/foreground` (`2595:140`).
 *
 * Border tones from Figma (`2595:158`), Grade10 theme:
 * - default resting → `Base/border` at 1px
 * - default focus → `Base/ring` at 2px
 * - error resting / focus → `Custom/destructive-ring` (1px / 2px)
 * - success resting / focus → `Custom/success-ring` (1px / 2px)
 *
 * Resting and focus border utilities are mutually exclusive — applying both lets
 * Tailwind source order pick the colour, which breaks the focus tones.
 *
 * Disabled (`2595:144`) is `Opacity/opacity-50` plus a fill swap to
 * `Base/background-subtle` — not a `disabled-foreground` colour swap. The
 * status border stays.
 *
 * The set's Figma description carries only this attribution, not a
 * description: based on https://ui.shadcn.com/docs/components/base/input-otp
 */
const inputOtpSlotVariants = cva("bg-input", {
  variants: {
    status: {
      default: "border border-border",
      error: "border border-destructive-ring",
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
    /** The entered digit. Omit it and the slot stays blank. */
    digit?: string | null;
    /**
     * Optional empty-slot glyph. Defaults to blank — Figma's set `"0"` is a
     * design stand-in, not a product placeholder.
     */
    placeholder?: string;
    /** Paints the focus ring instead of the resting border — Figma's `state=focus`. */
    focused?: boolean;
    /** Figma's `isDisabled`. Opacity + subtle fill; the tone border stays. */
    disabled?: boolean;
  };

function InputOtpSlot({
  className,
  digit,
  placeholder = "",
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
        "flex h-12 w-11 shrink-0 items-center justify-center rounded-(--radius-lg) font-medium text-lg text-foreground transition-[color,background-color,border-color,opacity]",
        focused
          ? inputOtpSlotFocusBorder(status ?? "default")
          : inputOtpSlotVariants({ status }),
        disabled && "bg-background-subtle opacity-50",
        className,
      )}
      {...props}
    >
      {filled || placeholder ? (
        <span className="text-lg leading-7 font-medium text-foreground">
          {filled ? digit : placeholder}
        </span>
      ) : null}
    </div>
  );
}

export type { InputOtpSlotProps };
export { InputOtpSlot, inputOtpSlotVariants };
