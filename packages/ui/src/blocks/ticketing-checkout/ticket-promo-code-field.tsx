import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { cn } from "@grade10/design-system/lib/utils";
import { WarningCircle } from "@phosphor-icons/react";
import { useId, useState } from "react";
import {
  TicketDiscountLine,
  type TicketDiscountLineProps,
} from "./ticket-discount-line";
import type { TicketPromoCodeFieldStatus } from "./types";

type TicketPromoCodeFieldCopy = {
  /** `Promo code`: the field's label and the group's name. */
  label: string;
  /** `Enter a code`. */
  placeholder: string;
  /** `Apply`. */
  apply: string;
};

type TicketPromoCodeFieldProps = {
  copy: TicketPromoCodeFieldCopy;
  /** What the field starts with: a share link's `?code=`, or what was typed
   * before a refusal. */
  defaultValue?: string;
  /** What the field says under itself; idle says nothing. */
  status?: TicketPromoCodeFieldStatus;
  /** A code is on the order: its line, with Remove, stands in the field's
   * place, since an order takes one code. */
  applied?: Omit<TicketDiscountLineProps, "className">;
  /** Apply, or Enter in the field, with what was typed, trimmed. An empty
   * field applies nothing. */
  onApply: (code: string) => void;
  className?: string;
};

/** The Promo code field under the order lines, always shown: a code, Apply,
 * and the reason a code was refused under it. Too many wrong tries keeps
 * Apply waiting for the wait the sentence names. */
function TicketPromoCodeField({
  copy,
  defaultValue = "",
  status = { kind: "idle" },
  applied,
  onApply,
  className,
}: TicketPromoCodeFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const messageId = useId();

  if (applied) return <TicketDiscountLine {...applied} className={className} />;

  const refused = status.kind === "refused" || status.kind === "tooManyTries";
  const waiting = status.kind === "tooManyTries";
  const applying = status.kind === "applying";

  const apply = () => {
    const code = value.trim();
    if (!code || waiting || applying) return;
    onApply(code);
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: the board names this row a group, not a fieldset with a legend
    <div
      aria-label={copy.label}
      className={cn(
        "flex flex-col gap-2 border-b border-border-subtle py-3",
        className,
      )}
      data-slot="promo-code-field"
      role="group"
    >
      <div className="flex items-end gap-2">
        <TextInput
          aria-errormessage={refused ? messageId : undefined}
          autoCapitalize="characters"
          autoComplete="off"
          className="min-w-0 flex-1"
          label={copy.label}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            apply();
          }}
          placeholder={copy.placeholder}
          spellCheck={false}
          status={refused ? "error" : "default"}
          value={value}
        />
        <Button
          className="flex-none"
          disabled={waiting}
          loading={applying}
          onClick={apply}
          size="md"
          type="button"
          variant="outline"
        >
          {copy.apply}
        </Button>
      </div>
      {refused ? (
        <p
          className="m-0 flex items-start gap-1.5 text-sm leading-5 text-destructive"
          id={messageId}
          role="alert"
        >
          <span aria-hidden className="mt-0.5 inline-flex flex-none">
            <WarningCircle size={16} />
          </span>
          {status.message}
        </p>
      ) : null}
    </div>
  );
}

export type { TicketPromoCodeFieldCopy, TicketPromoCodeFieldProps };
export { TicketPromoCodeField };
