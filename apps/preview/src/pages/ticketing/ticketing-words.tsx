import { getMessages } from "@grade10/i18n";
import { Fragment, type ReactNode } from "react";

/* The ticketing screens read the same English catalog the site does:
 * `@grade10/i18n`'s `ticketing` namespace, the brand lines included. The
 * formatter below stands in for the site's use-intl, for the ICU the
 * namespace uses: `{name}` holes, `plural` (with `=n` and `#`) and
 * `select`. */

const messages = getMessages("grade10", "en");

/** Every ticketing sentence, as the site reads it. */
export const T = messages.ticketing;

type Values = Readonly<Record<string, string | number>>;

const plurals = new Intl.PluralRules("en");

/** The index of the brace that closes the one opened at `start`. */
function closing(text: string, start: number) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return text.length;
}

/** `one {…} other {…}` read into its keys and bodies. */
function branches(text: string) {
  const out = new Map<string, string>();
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf("{", i);
    if (open < 0) break;
    const key = text.slice(i, open).trim();
    const end = closing(text, open);
    out.set(key, text.slice(open + 1, end));
    i = end + 1;
  }
  return out;
}

function format(template: string, values: Values, count?: number): string {
  let out = "";
  let i = 0;
  while (i < template.length) {
    const ch = template[i];
    if (ch === "#" && count !== undefined) {
      out += String(count);
      i++;
      continue;
    }
    if (ch !== "{") {
      out += ch;
      i++;
      continue;
    }
    const end = closing(template, i);
    const inner = template.slice(i + 1, end);
    const [name = "", kind, ...rest] = inner.split(",");
    const key = name.trim();
    const value = values[key];
    if (kind === undefined) {
      out += value === undefined ? `{${key}}` : String(value);
    } else {
      const options = branches(rest.join(","));
      if (kind.trim() === "plural") {
        const n = Number(value);
        const body =
          options.get(`=${n}`) ??
          options.get(plurals.select(n)) ??
          options.get("other") ??
          "";
        out += format(body, values, n);
      } else {
        const body = options.get(String(value)) ?? options.get("other") ?? "";
        out += format(body, values, count);
      }
    }
    i = end + 1;
  }
  return out;
}

/** One catalog sentence with its holes filled. */
export function t(template: string, values: Values = {}): string {
  return format(template, values);
}

/** A catalog sentence whose `<tag>…</tag>` parts the page draws: a link, a
 * bold run. */
export function rich(
  template: string,
  values: Values,
  tags: Readonly<Record<string, (chunk: string) => ReactNode>>,
): ReactNode {
  const text = format(template, values);
  const parts: ReactNode[] = [];
  const pattern = /<(\w+)>(.*?)<\/\1>/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const [whole, tag = "", chunk = ""] = match;
    const index = match.index ?? 0;
    parts.push(text.slice(last, index));
    const draw = tags[tag];
    parts.push(<Fragment key={index}>{draw ? draw(chunk) : chunk}</Fragment>);
    last = index + whole.length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

/** A catalog sentence with its tags dropped: what a screen reader hears. */
export function plain(template: string, values: Values = {}): string {
  return format(template, values).replace(/<\/?\w+>/g, "");
}

/** `HK$1,150.00`: the site formats every amount before a block sees it. */
export function hkd(amount: number): string {
  return `HK$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** `HK$100`: a whole amount, as the Fast Pass prompt words it. */
export function hkdWhole(amount: number): string {
  return `HK$${amount.toLocaleString("en-US")}`;
}

/** The stand-in show every ticketing screen sells. */
export const SHOW = {
  name: "[Show Name]",
  days: "Sat 12 Dec and Sun 13 Dec 2026",
  shortDays: "Sat 12 and Sun 13 Dec 2026",
  start: "10:00",
  end: "19:00",
  venue: "[Venue], Hong Kong",
  about: "[One line about the show: Product]",
  limit: 8,
  fastPassPrice: 100,
  holdMinutes: 15,
} as const;

/** The buyer every journey follows. */
export const BUYER = {
  name: "Alex Chan",
  email: "alex.chan@example.com",
  reference: "TK7Q2M",
} as const;
