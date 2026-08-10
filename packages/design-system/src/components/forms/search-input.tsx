import {
  Input,
  InputShell,
} from "@grade10/design-system/components/forms/input";
import { SearchIcon, XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useId } from "react";

type SearchInputProps = React.ComponentProps<"input"> & {
  /** Rendered above the field. Figma's `showLabel`, as the absence of a value. */
  label?: ReactNode;
  /** Presence renders the clear button — Figma's `clear` boolean. */
  onClear?: () => void;
};

/**
 * A search field: a leading magnifier, and a clear button when the consumer
 * gives it something to do.
 *
 * It takes no `status`, `message` or `loading` because the Figma set
 * (`2132:2782`, `Search Input`) draws none of them — its tonal axis is `type`
 * with `default` and `placeholder` only, so a search field cannot currently be
 * invalid. Whether that is a gap in the design is an open question on
 * `add-input-components`; a component may not offer what the design does not
 * define, so nothing is invented here.
 */
function SearchInput({
  className,
  id,
  label,
  disabled,
  onClear,
  ...props
}: SearchInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <InputShell
      className={className}
      label={label}
      disabled={disabled}
      htmlFor={inputId}
      leading={<SearchIcon className="shrink-0 text-secondary-foreground" />}
      trailing={
        onClear && !disabled ? (
          <button
            type="button"
            data-slot="input-clear"
            aria-label="Clear search"
            onClick={onClear}
            className="flex shrink-0 cursor-pointer items-center text-secondary-foreground transition-colors hover:text-foreground"
          >
            <XIcon />
          </button>
        ) : null
      }
    >
      <Input id={inputId} type="search" disabled={disabled} {...props} />
    </InputShell>
  );
}

export type { SearchInputProps };
export { SearchInput };
