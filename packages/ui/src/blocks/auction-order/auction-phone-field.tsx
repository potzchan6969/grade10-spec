import {
  Input,
  InputShell,
  type InputStatus,
  InputStatusIcon,
} from "@grade10/design-system/components/forms/input";
import { cn } from "@grade10/design-system/lib/utils";
import { Globe } from "@phosphor-icons/react";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import type { ReactNode } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import PhoneInput, {
  type Country,
  getCountryCallingCode,
  parsePhoneNumber,
} from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

type AuctionPhoneFieldProps = {
  label?: ReactNode;
  message?: ReactNode;
  status?: InputStatus;
  disabled?: boolean;
  /** E.164 when parseable; otherwise the last accepted value. */
  value?: string;
  onChange: (value: string) => void;
  /** Selected calling country — required for soft readiness. */
  country?: Country;
  onCountryChange?: (country: Country | undefined) => void;
  defaultCountry?: Country;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  /** Country list search placeholder. */
  countrySearchPlaceholder?: string;
};

/**
 * Soft readiness: a country is selected and the value carries national digits.
 * Unusual formats are accepted; E.164 is preferred when the library parses it.
 */
function auctionPhoneSoftReady(
  value: string | undefined,
  country: Country | undefined,
): boolean {
  if (!country) return false;
  if (!value?.trim()) return false;
  const digits = value.replace(/\D/g, "");
  if (!digits) return false;
  try {
    const parsed = parsePhoneNumber(value, country);
    if (parsed?.nationalNumber) return parsed.nationalNumber.length > 0;
  } catch {
    // Fall through — unusual formats still need digits beyond the calling code.
  }
  const callingLen = String(getCountryCallingCode(country)).length;
  return digits.length > callingLen;
}

/** Confirm export: E.164 when validly parseable; otherwise the entered value. */
function auctionPhoneConfirmValue(
  value: string,
  country: Country | undefined,
): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const parsed = country
      ? parsePhoneNumber(trimmed, country)
      : parsePhoneNumber(trimmed);
    if (parsed?.isValid() && parsed.number) return parsed.number;
  } catch {
    // Keep the unusual string.
  }
  return trimmed;
}

function FlagIcon({ country }: { country?: Country }) {
  if (!country) {
    return (
      <span className="inline-flex size-4 text-secondary-foreground">
        <Globe aria-hidden size={16} />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="inline-flex h-3.5 min-w-5 items-center justify-center text-base leading-none"
    >
      {getUnicodeFlagIcon(country)}
    </span>
  );
}

type CountryOption = {
  value?: Country;
  label: string;
  divider?: boolean;
};

type CountrySelectProps = {
  value?: Country;
  onChange: (country?: Country) => void;
  options: CountryOption[];
  disabled?: boolean;
  readOnly?: boolean;
  searchPlaceholder?: string;
  /** Current phone value — when it already carries the calling code, hide the
   *  duplicate beside the flag. */
  phoneValue?: string;
};

function CountrySelect({
  value,
  onChange,
  options,
  disabled,
  readOnly,
  searchPlaceholder = "e.g. United States",
  phoneValue,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter((option) => {
      if (option.divider || !option.value) return false;
      if (!q) return true;
      const calling = `+${getCountryCallingCode(option.value)}`;
      return (
        option.label.toLowerCase().includes(q) ||
        calling.includes(q) ||
        option.value.toLowerCase().includes(q)
      );
    });
  }, [options, query]);

  const calling =
    value != null ? `+${getCountryCallingCode(value)}` : undefined;
  const phoneDigits = phoneValue?.replace(/\D/g, "") ?? "";
  const callingDigits = calling?.slice(1) ?? "";
  // Flag-only once the typed value already carries this calling code.
  const showCalling =
    calling != null &&
    !(callingDigits.length > 0 && phoneDigits.startsWith(callingDigits));

  return (
    <div
      className={cn(
        "relative flex h-full shrink-0 items-center",
        // Without a calling code there is no divider — keep the same gap the
        // input shell uses between leading chrome and the value.
        !value && "mr-2",
      )}
      data-slot="auction-phone-country"
      ref={rootRef}
    >
      <button
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={
          value
            ? `${en[value] ?? value}${calling ? ` ${calling}` : ""}`
            : "Select country calling code"
        }
        className={cn(
          "inline-flex touch-manipulation items-center text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          value
            ? showCalling
              ? "h-full min-h-10 gap-1.5 pr-2"
              : "h-full min-h-10 pr-2"
            : "relative size-4 shrink-0 justify-center before:absolute before:-inset-3",
          (disabled || readOnly) && "pointer-events-none",
        )}
        disabled={disabled || readOnly}
        onClick={() => setOpen((held) => !held)}
        type="button"
      >
        <FlagIcon country={value} />
        {showCalling ? (
          <span className="tabular-nums text-foreground">{calling}</span>
        ) : null}
      </button>
      {value ? (
        <span
          aria-hidden
          className="mr-2 h-5 w-px shrink-0 bg-border"
          data-slot="auction-phone-divider"
        />
      ) : null}
      {open ? (
        <div
          className="absolute top-[calc(100%+6px)] left-0 z-50 flex max-h-72 w-72 flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-md"
          id={listId}
          role="listbox"
        >
          <div className="border-b border-border p-2">
            <input
              className="h-9 w-full rounded-lg border border-border bg-input px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder={searchPlaceholder}
              ref={searchRef}
              type="search"
              value={query}
            />
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto py-1">
            {filtered.map((option) => {
              if (!option.value) return null;
              const optionCalling = `+${getCountryCallingCode(option.value)}`;
              const selected = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    aria-selected={selected}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-accent",
                      selected && "bg-accent",
                    )}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    role="option"
                    type="button"
                  >
                    <FlagIcon country={option.value} />
                    <span className="min-w-0 flex-1 truncate">
                      {option.label}
                    </span>
                    <span className="shrink-0 tabular-nums text-secondary-foreground">
                      {optionCalling}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

type PhoneNumberInputProps = {
  value?: string;
  onChange: (value: string) => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  className?: string;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-describedby"?: string;
};

function PhoneNumberInput({
  value,
  onChange,
  onFocus,
  onBlur,
  disabled,
  readOnly,
  placeholder,
  id,
  name,
  autoComplete,
  className,
  ...rest
}: PhoneNumberInputProps) {
  return (
    <Input
      {...rest}
      autoComplete={autoComplete ?? "tel"}
      className={cn("min-w-0 flex-1", className)}
      disabled={disabled}
      id={id}
      inputMode="tel"
      name={name}
      onBlur={onBlur}
      onChange={(event) => onChange(event.currentTarget.value)}
      onFocus={onFocus}
      placeholder={placeholder}
      readOnly={readOnly}
      type="tel"
      value={value ?? ""}
    />
  );
}

/**
 * Country-aware phone field for auction address forms.
 * Soft rule only: country + digits; prefers E.164; does not refuse unusual formats.
 */
function AuctionPhoneField({
  label,
  message,
  status = "default",
  disabled,
  value,
  onChange,
  country: countryProp,
  onCountryChange,
  defaultCountry,
  placeholder = "+852 12345678",
  className,
  id,
  name,
  countrySearchPlaceholder = "e.g. United States",
}: AuctionPhoneFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = message ? `${inputId}-message` : undefined;
  const [country, setCountry] = useState<Country | undefined>(
    countryProp || defaultCountry,
  );

  const resolvedCountry = countryProp || country;

  function handleCountryChange(next: Country | undefined) {
    setCountry(next);
    onCountryChange?.(next);
  }

  function handleChange(next?: string) {
    if (!next) {
      onChange("");
      return;
    }
    try {
      const parsed = parsePhoneNumber(next);
      if (parsed?.isValid() && parsed.number) {
        onChange(parsed.number);
        return;
      }
    } catch {
      // Keep the unusual string.
    }
    onChange(next);
  }

  return (
    <InputShell
      className={className}
      disabled={disabled}
      htmlFor={inputId}
      label={label}
      message={message}
      messageId={messageId}
      status={status}
      boxClassName={resolvedCountry ? undefined : "pl-3"}
      trailing={<InputStatusIcon status={status} />}
    >
      <PhoneInput
        className="flex min-w-0 flex-1 items-center"
        {...(resolvedCountry ? { country: resolvedCountry } : {})}
        countrySelectComponent={CountrySelect}
        countrySelectProps={{
          searchPlaceholder: countrySearchPlaceholder,
          phoneValue: value,
        }}
        {...(defaultCountry ? { defaultCountry } : {})}
        disabled={disabled}
        inputComponent={PhoneNumberInput}
        labels={en}
        numberInputProps={{
          id: inputId,
          name,
          "aria-invalid": status === "error" || undefined,
          "aria-describedby": messageId,
          placeholder,
        }}
        onChange={handleChange}
        onCountryChange={handleCountryChange}
        smartCaret
        value={value || undefined}
      />
    </InputShell>
  );
}

export type { AuctionPhoneFieldProps };
export { AuctionPhoneField, auctionPhoneConfirmValue, auctionPhoneSoftReady };
