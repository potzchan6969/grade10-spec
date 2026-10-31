import { CheckboxButton } from "@grade10/design-system/components/forms/checkbox-button";
import { cn } from "@grade10/design-system/lib/utils";
import { WarningCircle } from "@phosphor-icons/react";
import { type ReactNode, useId } from "react";

type TicketAgreementCheckCopy = {
  /** `Agreement`: the section's name. */
  label: string;
  /** Under the statement: what agreeing means for this buyer. A guest:
   * `We keep your tickets and points in a Grade10 account for …`; signed in:
   * `Your tickets and the points from this order go to your Grade10
   * account.` */
  detail: string;
  /** Under the box once Pay was pressed unticked: `Tick the box to agree
   * before you pay.` */
  required: string;
};

type TicketAgreementCheckProps = {
  copy: TicketAgreementCheckCopy;
  /**
   * What the tick agrees to, its links included: a guest agrees to the Terms
   * of Sale and Grade10's Terms and Privacy Policy, a signed-in buyer to the
   * Terms of Sale only.
   */
  statement: ReactNode;
  checked: boolean;
  /** Pay was pressed unticked: the box and its card turn the error tone and
   * say so. */
  invalid?: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
};

/** The tick needed to pay, in a card the whole of which ticks it: what it
 * agrees to and what that means for the buyer's tickets and points. */
function TicketAgreementCheck({
  copy,
  statement,
  checked,
  invalid = false,
  disabled = false,
  onCheckedChange,
  className,
}: TicketAgreementCheckProps) {
  const statementId = useId();
  const detailId = useId();
  const errorId = useId();
  const showError = invalid && !checked;

  return (
    <section
      aria-label={copy.label}
      className={cn("flex flex-col gap-2", className)}
      data-slot="agreement-check"
    >
      {/* biome-ignore lint/a11y/noLabelWithoutControl: the checkbox inside is the control */}
      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-2xl border bg-background p-4",
          showError ? "border-destructive" : "border-border",
        )}
      >
        <CheckboxButton
          aria-describedby={showError ? `${detailId} ${errorId}` : detailId}
          aria-invalid={showError || undefined}
          aria-labelledby={statementId}
          checked={checked}
          className={cn("mt-0.5", showError && "border-destructive")}
          disabled={disabled}
          onCheckedChange={(next) => onCheckedChange(next === true)}
        />
        <span className="flex min-w-0 flex-col gap-1">
          <span
            className="text-sm leading-5 text-foreground [&_a]:text-foreground [&_a]:underline"
            id={statementId}
          >
            {statement}
          </span>
          <span
            className="text-sm leading-5 text-secondary-foreground"
            id={detailId}
          >
            {copy.detail}
          </span>
        </span>
      </label>
      {showError ? (
        <p
          className="m-0 flex items-center gap-1.5 text-sm leading-5 text-destructive"
          id={errorId}
          role="alert"
        >
          <span aria-hidden className="inline-flex flex-none">
            <WarningCircle size={16} />
          </span>
          {copy.required}
        </p>
      ) : null}
    </section>
  );
}

export type { TicketAgreementCheckCopy, TicketAgreementCheckProps };
export { TicketAgreementCheck };
