import {
  Input,
  InputShell,
} from "@grade10/design-system/components/forms/input";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useId } from "react";

type SearchInputProps = React.ComponentProps<"input"> & {
  /** Rendered above the field. Figma's `showLabel`, as the absence of a value. */
  label?: ReactNode;
  /** Presence makes the trailing X a control — Figma's `clear` boolean. */
  onClear?: () => void;
};

function hasSearchValue(
  value: SearchInputProps["value"],
  defaultValue: SearchInputProps["defaultValue"],
) {
  const resolved = value ?? defaultValue;
  if (resolved == null) return false;
  return String(resolved).length > 0;
}

/**
 * A search field: a leading magnifier, and a trailing X when the field has a
 * value.
 *
 * It takes no `status`, `message` or `loading` because the Figma set
 * (`2132:2782`, `Search Input`) draws none of them — its tonal axis is `type`
 * with `default` and `placeholder` only, so a search field cannot currently be
 * invalid. `type=default` is a filled value (X visible, including while
 * disabled); `type=placeholder` is an empty value. Whether a search field
 * should be able to show an error is an open question on `add-input-components`;
 * a component may not offer what the design does not define, so nothing is
 * invented here.
 */
function SearchInput({
  className,
  id,
  label,
  disabled,
  onClear,
  value,
  defaultValue,
  ...props
}: SearchInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const filled = hasSearchValue(value, defaultValue);

  const clearIcon = (
    <span className="text-secondary-foreground">
      <X aria-hidden size={16} weight="bold" />
    </span>
  );

  return (
    <InputShell
      boxClassName={
        disabled
          ? "opacity-50 text-foreground [&_svg]:text-secondary-foreground"
          : undefined
      }
      className={className}
      disabled={disabled}
      htmlFor={inputId}
      label={label}
      leading={
        <span className="shrink-0 text-secondary-foreground">
          <MagnifyingGlass aria-hidden size={16} weight="bold" />
        </span>
      }
      trailing={
        filled ? (
          onClear && !disabled ? (
            <button
              aria-label="Clear search"
              className="flex shrink-0 cursor-pointer items-center text-secondary-foreground transition-colors hover:text-foreground"
              data-slot="input-clear"
              onClick={onClear}
              type="button"
            >
              {clearIcon}
            </button>
          ) : (
            clearIcon
          )
        ) : null
      }
    >
      <Input
        {...props}
        className="[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden disabled:text-foreground"
        disabled={disabled}
        id={inputId}
        type="search"
        {...(value !== undefined
          ? { value }
          : defaultValue !== undefined
            ? { defaultValue }
            : {})}
      />
    </InputShell>
  );
}

export type { SearchInputProps };
export { SearchInput };
