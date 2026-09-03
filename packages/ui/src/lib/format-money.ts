/** ISO 4217 minor-unit exponents Grade10 recognizes. */
const CURRENCY_EXPONENT: Readonly<Record<string, number>> = {
  AED: 2,
  AUD: 2,
  BRL: 2,
  CAD: 2,
  CHF: 2,
  CNY: 2,
  EUR: 2,
  GBP: 2,
  HKD: 2,
  IDR: 2,
  JPY: 0,
  KRW: 0,
  KWD: 3,
  MXN: 2,
  MYR: 2,
  NZD: 2,
  PHP: 2,
  SGD: 2,
  THB: 2,
  TWD: 2,
  USD: 2,
  VND: 0,
};

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
export const DEFAULT_LISTING_CURRENCY = "HKD";

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
