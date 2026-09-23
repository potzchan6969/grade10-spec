import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The two text contracts, held to WCAG AA in every theme.
 *
 * `--<tone>-foreground` is the tone a status reads as on the page, so it is
 * measured on `--background` and `--muted`. `--<tone>-on` is the text a solid
 * `--<tone>` fill carries, so it is measured on that fill. One token per
 * contract is what keeps an AA pass on a fill from silencing a tone: before
 * the split, darkening the four status foregrounds to clear the badge left
 * every warning line on the page reading as body text.
 */

const SRC = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const AA = 4.5;

type Rgb = [number, number, number];

function toLinear(channel: number) {
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function toSrgb(channel: number) {
  const v =
    channel <= 0.0031308
      ? 12.92 * channel
      : 1.055 * channel ** (1 / 2.4) - 0.055;
  return Math.min(1, Math.max(0, v));
}

function oklch(L: number, C: number, hue: number): Rgb {
  const h = (hue * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    toSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** Oklab chroma — how far a colour sits from the neutral axis. */
function chroma([r, g, b]: Rgb) {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return Math.hypot(a, bb);
}

function fromHex(hex: string): Rgb {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  return [0, 2, 4].map(
    (i) => Number.parseInt(full.slice(i, i + 2), 16) / 255,
  ) as Rgb;
}

function luminance([r, g, b]: Rgb) {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrast(text: Rgb, base: Rgb) {
  const a = luminance(text);
  const b = luminance(base);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function block(file: string, selector: string) {
  const css = readFileSync(path.join(SRC, file), "utf8");
  const escaped = selector.replace(/[.:]/g, "\\$&");
  const head = css.search(new RegExp(`^${escaped}\\s*\\{`, "m"));
  if (head < 0) throw new Error(`${file}: no ${selector} block`);
  let depth = 0;
  let end = css.indexOf("{", head);
  for (let i = end; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const declarations = new Map<string, string>();
  for (const m of css
    .slice(head, end)
    .matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    declarations.set(m[1], m[2].replace(/\/\*[\s\S]*?\*\//g, "").trim());
  }
  return declarations;
}

function resolve(
  name: string,
  table: Map<string, string>,
  seen: string[] = [],
): Rgb {
  if (seen.includes(name)) throw new Error(`cycle at ${name}`);
  const value = table.get(name);
  if (value == null) throw new Error(`${name} is not defined`);
  const alias = /^var\((--[a-z0-9-]+)\)$/.exec(value);
  if (alias) return resolve(alias[1], table, [...seen, name]);
  if (value.startsWith("#")) return fromHex(value);
  const fn = /^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)$/.exec(value);
  if (fn) return oklch(Number(fn[1]), Number(fn[2]), Number(fn[3]));
  const mix =
    /^color-mix\(in oklab,\s*(.+?)\s+([\d.]+)%,\s*transparent\)$/s.exec(value);
  if (mix) {
    // A transparent tint reads against the page it sits on, never on its own.
    const base = resolve("--background", table, [...seen, name]);
    const over = /^var\((--[a-z0-9-]+)\)$/.exec(mix[1].trim());
    const top = over
      ? resolve(over[1], table, [...seen, name])
      : fromHex(mix[1].trim());
    const ratio = Number(mix[2]) / 100;
    return top.map((c, i) => c * ratio + base[i] * (1 - ratio)) as Rgb;
  }
  throw new Error(`${name}: cannot resolve ${value}`);
}

const PRIMITIVES = block("theme.css", ":root");
const THEMES = [
  ["default :root", block("themes/default.css", ":root")],
  ["default .dark", block("themes/default.css", ".dark")],
  ["grade10", block("themes/grade10.css", ".theme-grade10")],
] as const;
const BASE = new Map([...PRIMITIVES, ...block("themes/default.css", ":root")]);
const STATUS = ["success", "info", "warning", "destructive"] as const;

function pairs(): [string, string][] {
  const rows: [string, string][] = [
    ["--primary-foreground", "--background-inverse"],
    ["--primary-on", "--primary"],
    ["--foreground", "--background"],
    ["--foreground", "--muted"],
    ["--foreground", "--accent"],
    ["--muted-foreground", "--background"],
    ["--secondary-foreground", "--background"],
  ];
  for (const tone of STATUS) {
    rows.push([`--${tone}-foreground`, "--background"]);
    rows.push([`--${tone}-foreground`, "--muted"]);
    rows.push([`--${tone}-on`, `--${tone}`]);
  }
  return rows;
}

describe.each(THEMES)("%s", (_label, theme) => {
  const table = new Map([...BASE, ...theme]);
  it.each(pairs())("%s on %s clears AA", (text, base) => {
    expect(
      contrast(resolve(text, table), resolve(base, table)),
    ).toBeGreaterThanOrEqual(AA);
  });

  // Clearing AA on the page is not enough: a neutral passes it and then reads
  // as body text, which is how the four tones lost their meaning.
  it.each(STATUS)("--%s-foreground carries its own hue", (tone) => {
    expect(chroma(resolve(`--${tone}-foreground`, table))).toBeGreaterThan(
      0.02,
    );
  });
});

function tsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return tsxFiles(full);
    return entry.name.endsWith(".tsx") && !entry.name.endsWith(".stories.tsx")
      ? [full]
      : [];
  });
}

// A link is page text in the brand's accent. The default sheet is stock
// shadcn and states no link tone, so the pair is held where the token is.
describe.each(THEMES)("%s link", (_label, theme) => {
  const table = new Map([...BASE, ...theme]);
  it.each([
    ["--link-foreground", "--background"],
    ["--link-foreground", "--muted"],
  ])("%s on %s clears AA", (text, base) => {
    expect(
      contrast(resolve(text, table), resolve(base, table)),
    ).toBeGreaterThanOrEqual(AA);
  });
});

describe("the two contracts stay apart", () => {
  it.each(["primary", ...STATUS])(
    "no component puts the %s text tone on the %s fill",
    (tone) => {
      const offenders = tsxFiles(path.join(SRC, "components")).filter((file) =>
        readFileSync(file, "utf8")
          .split("\n")
          .some(
            (line) =>
              line.includes(`bg-${tone} `) &&
              line.includes(`text-${tone}-foreground`),
          ),
      );
      expect(offenders).toEqual([]);
    },
  );

  // grade10's accent foreground is the orange fill, 2.8:1 on the page and on
  // the accent tint alike, so no control reads in it.
  it("no component sets its text in the accent foreground", () => {
    const offenders = tsxFiles(path.join(SRC, "components")).filter((file) =>
      readFileSync(file, "utf8").includes("text-accent-foreground"),
    );
    expect(offenders).toEqual([]);
  });
});
