/** ISO 4217 minor-unit exponents, held equal to docs/prds/platform/shared/money-amounts.md. */
const CURRENCY_EXPONENT: Readonly<Record<string, number>> = {
  AED: 2,
  AUD: 2,
  BHD: 3,
  BIF: 0,
  BRL: 2,
  CAD: 2,
  CHF: 2,
  CLP: 0,
  CNY: 2,
  CZK: 2,
  DJF: 0,
  DKK: 2,
  EUR: 2,
  GBP: 2,
  GNF: 0,
  HKD: 2,
  ILS: 2,
  INR: 2,
  IQD: 3,
  ISK: 0,
  JOD: 3,
  JPY: 0,
  KMF: 0,
  KRW: 0,
  KWD: 3,
  LYD: 3,
  MXN: 2,
  MYR: 2,
  NOK: 2,
  NZD: 2,
  OMR: 3,
  PHP: 2,
  PLN: 2,
  PYG: 0,
  RON: 2,
  RWF: 0,
  SEK: 2,
  SGD: 2,
  THB: 2,
  TND: 3,
  TRY: 2,
  TWD: 2,
  UGX: 0,
  USD: 2,
  UYI: 0,
  VND: 0,
  VUV: 0,
  XAF: 0,
  XOF: 0,
  XPF: 0,
  ZAR: 2,
};

/** Every code the table holds, sorted by code. */
export const SUPPORTED_CURRENCY_CODES: readonly string[] =
  Object.keys(CURRENCY_EXPONENT);

export type FormatMoneyOptions = {
  locale?: string;
  currencyDisplay?: "symbol" | "code";
};

const formatterCache = new Map<string, Intl.NumberFormat>();

function resolveLocale(locale?: string): string {
  if (locale) return locale;
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }
  return "en";
}

function getFormatter(
  locale: string,
  currency: string,
  currencyDisplay: "symbol" | "code",
): Intl.NumberFormat {
  const code = currency.toUpperCase();
  const key = `${locale}|${code}|${currencyDisplay}`;
  const cached = formatterCache.get(key);
  if (cached) return cached;

  const exponent = currencyExponent(code);
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    currencyDisplay,
    minimumFractionDigits: 0,
    maximumFractionDigits: exponent,
  });
  formatterCache.set(key, formatter);
  return formatter;
}

/** Default listing currency per grade10-auction admin-listing create defaults. */
export const DEFAULT_LISTING_CURRENCY = "USD";

export function currencyExponent(code: string): number {
  const exponent = CURRENCY_EXPONENT[code.toUpperCase()];
  if (exponent === undefined) {
    throw new Error(
      `Unsupported currency code for Grade10 money handling: ${code}`,
    );
  }
  return exponent;
}

export function fromMinorUnits(minor: number, code: string): string {
  const exponent = currencyExponent(code);
  const major = minor / 10 ** exponent;
  return major.toFixed(exponent);
}

export function toMinorUnits(decimal: string, code: string): number {
  const exponent = currencyExponent(code);
  const normalized = decimal.trim();
  if (!normalized) {
    throw new Error(
      `Unsupported currency code for Grade10 money handling: ${code}`,
    );
  }

  const parts = normalized.split(".");
  if (parts.length > 2) {
    throw new Error(
      `Invalid decimal amount for ${code.toUpperCase()}: ${decimal}`,
    );
  }

  const [wholePart = "0", fractionPart = ""] = parts;
  if (
    !/^\d+$/.test(wholePart) ||
    (fractionPart && !/^\d+$/.test(fractionPart))
  ) {
    throw new Error(
      `Invalid decimal amount for ${code.toUpperCase()}: ${decimal}`,
    );
  }

  if (fractionPart.length > exponent) {
    throw new Error(
      `Invalid decimal amount for ${code.toUpperCase()}: ${decimal}`,
    );
  }

  const paddedFraction = fractionPart.padEnd(exponent, "0");
  const minorText = `${wholePart}${paddedFraction}`.replace(/^0+(?=\d)/, "");
  const minor = Number(minorText || "0");
  if (!Number.isSafeInteger(minor)) {
    throw new Error(
      `Invalid decimal amount for ${code.toUpperCase()}: ${decimal}`,
    );
  }
  return minor;
}

export function formatMoney(
  minor: number,
  code: string,
  options: FormatMoneyOptions = {},
): string {
  const locale = resolveLocale(options.locale);
  const currencyDisplay = options.currencyDisplay ?? "symbol";
  const exponent = currencyExponent(code);
  const major = minor / 10 ** exponent;
  return getFormatter(locale, code, currencyDisplay).format(major);
}

/**
 * A lot amount reads `US$` for USD wherever the locale's own symbol is a
 * bare `$` — auction surfaces disambiguate the dollar. Every other currency
 * keeps the locale's symbol.
 */
export function formatLotMoney(
  minor: number,
  code: string,
  options: FormatMoneyOptions = {},
): string {
  const locale = resolveLocale(options.locale);
  const exponent = currencyExponent(code);
  const major = minor / 10 ** exponent;
  const disambiguateUsd = code.toUpperCase() === "USD";
  return getFormatter(locale, code, "symbol")
    .formatToParts(major)
    .map((part) =>
      part.type === "currency" && disambiguateUsd && part.value === "$"
        ? "US$"
        : part.value,
    )
    .join("");
}

/** Input prefix for a lot amount — `US$` where the locale's symbol is `$`. */
export function formatLotMoneyPrefix(
  code: string,
  options: FormatMoneyOptions = {},
): string {
  const prefix = formatMoneyPrefix(code, {
    ...options,
    currencyDisplay: "symbol",
  });
  return code.toUpperCase() === "USD" && prefix === "$" ? "US$" : prefix;
}

/** Numeric portion only — grouping and fraction digits, no currency symbol. */
export function formatMoneyNumeric(
  minor: number,
  code: string,
  locale?: string,
): string {
  const resolvedLocale = resolveLocale(locale);
  const exponent = currencyExponent(code);
  const major = minor / 10 ** exponent;
  return major.toLocaleString(resolvedLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: exponent,
  });
}

/** Currency symbol (or code when display is code) for input prefixes. */
export function formatMoneyPrefix(
  code: string,
  options: FormatMoneyOptions = {},
): string {
  const locale = resolveLocale(options.locale);
  const currencyDisplay = options.currencyDisplay ?? "symbol";
  const parts = getFormatter(locale, code, currencyDisplay).formatToParts(0);
  return (
    parts.find((part) => part.type === "currency")?.value ?? code.toUpperCase()
  );
}

export function splitFormattedMoney(
  minor: number,
  code: string,
  locale?: string,
): { prefix: string; amount: string } {
  const resolvedLocale = resolveLocale(locale);
  const exponent = currencyExponent(code);
  const major = minor / 10 ** exponent;
  const parts = getFormatter(resolvedLocale, code, "symbol").formatToParts(
    major,
  );

  let prefix = "";
  let amount = "";
  for (const part of parts) {
    if (part.type === "currency") {
      prefix += part.value;
      continue;
    }
    if (
      part.type === "integer" ||
      part.type === "group" ||
      part.type === "decimal" ||
      part.type === "fraction"
    ) {
      amount += part.value;
      continue;
    }
    if (part.type === "literal" && amount.length === 0) {
      prefix += part.value;
    } else {
      amount += part.value;
    }
  }

  return { prefix, amount };
}

/** Parse a currency input field to minor units; null when empty or invalid. */
export function parseMoneyInputToMinor(
  value: string,
  code: string,
): number | null {
  const normalized = value.replaceAll(",", "").trim();
  if (!normalized) return null;

  try {
    const minor = toMinorUnits(normalized, code);
    return minor > 0 ? minor : null;
  } catch {
    return null;
  }
}
