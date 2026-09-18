import {
  InputShell,
  type InputStatus,
  InputStatusIcon,
} from "@grade10/design-system/components/forms/input";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { useId } from "react";

type TextareaProps = React.ComponentProps<"textarea"> & {
  /** Rendered above the field. Omit it and no label renders. */
  label?: ReactNode;
  /** Helper or validation text below the field. */
  message?: ReactNode;
  /** The field's tone. Told to the component, never derived by it. */
  status?: InputStatus;
  /** Puts a spinner in the trailing slot, replacing the status icon. */
  loading?: boolean;
};

/**
 * A labelled multi-line text field with a status tone and an optional message.
 *
 * Same contract as TextInput for label, message, status, loading and disabled.
 * The field box uses a taller, rounded rectangle rather than the single-line
 * pill — multiline content cannot sit in `radius-full` / `h-10`.
 *
 * No Figma component set yet in Grade10 DS 2026. Geometry and tokens follow
 * Text Input's fill, stroke and focus ring; the set should be drawn before
 * Code Connect is published. Until then this is a code-first primitive.
 */
function Textarea({
  className,
  id,
  label,
  message,
  status = "default",
  loading = false,
  disabled,
  rows = 4,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = message ? `${inputId}-message` : undefined;

  const showStatus = loading || status === "error" || status === "success";

  return (
    <InputShell
      boxClassName="relative h-auto min-h-24 gap-0 rounded-(--radius-2xl) p-0"
      className={className}
      disabled={disabled}
      htmlFor={inputId}
      label={label}
      message={message}
      messageId={messageId}
      status={status}
      trailing={
        showStatus ? (
          <span className="pointer-events-none absolute top-3 right-3">
            <InputStatusIcon loading={loading} status={status} />
          </span>
        ) : undefined
      }
    >
      <textarea
        aria-describedby={messageId}
        aria-invalid={status === "error" || undefined}
        className={cn(
          "w-full min-w-0 resize-y bg-transparent px-4 py-3 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:text-foreground",
          showStatus && "pr-10",
        )}
        data-slot="textarea"
        disabled={disabled}
        id={inputId}
        rows={rows}
        {...props}
      />
    </InputShell>
  );
}

export type { TextareaProps };
export { Textarea };
