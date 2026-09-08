/**
 * Turns the HTML archify delivers into one SVG the manual can inline: the
 * diagram's own styles scoped to it, ids made unique to it, every node and
 * edge claiming a flow step, and nothing left that only the viewer's scripts
 * could answer.
 */

const NAMESPACE = "http://www.w3.org/2000/svg";

/** Archify variable → manual token. The archify value stays as the fallback,
 * so the file reads on its own. */
export const TOKENS = {
  "--text": "--foreground",
  "--text-muted": "--muted-foreground",
  "--text-dim": "--muted-foreground",
  "--grid": "--border-subtle",
  "--lane-fill": "--background",
  "--lane-stroke": "--border",
  "--mask": "--background",
  "--panel-border": "--border",
  "--arrow": "--muted-foreground",
  "--arrow-emphasis": "--primary",
};

const ROOT_ATTRS = ["viewBox", "role", "aria-labelledby", "data-preset"];
const DROPPED_ATTRS = ["tabindex", "aria-pressed", "data-animate", "lang"];

export function compile(html, name) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`diagram name must be a slug: ${name}`);
  }
  const roots = html.match(/<svg\b[^>]*>[\s\S]*?<\/svg>/g) ?? [];
  if (roots.length !== 1) {
    throw new Error(`${name}: expected one <svg> root, found ${roots.length}`);
  }
  const rules = parseRules(styleOf(html));
  let svg = roots[0].replace(/<!--[\s\S]*?-->/g, "");
  const preset = attribute(svg, "data-preset") ?? "classic";
  const kept = keptRules(rules, classesOf(svg), preset);
  const variables = resolveVariables(rules, kept, preset);

  svg = stampSteps(svg);
  svg = stripInteractivity(svg);
  svg = prefixIds(svg, name);
  svg = rebuildRoot(svg, name, cropped(svg));
  svg = svg.replace(
    /(<svg\b[^>]*>)/,
    `$1\n<style>${sheet(name, kept, variables)}</style>`,
  );
  refuse(svg, name);
  return `${svg.replace(/\n{2,}/g, "\n")}\n`;
}

// --- styles ----------------------------------------------------------------

function styleOf(html) {
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)];
  return styles.map((match) => match[1]).join("\n");
}

/** Top-level rules only; an at-rule block is the viewer's motion and layout. */
function parseRules(css) {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [];
  let at = 0;
  for (;;) {
    const open = text.indexOf("{", at);
    if (open < 0) break;
    const selector = text.slice(at, open).trim();
    let depth = 1;
    let end = open + 1;
    while (end < text.length && depth > 0) {
      if (text[end] === "{") depth += 1;
      else if (text[end] === "}") depth -= 1;
      end += 1;
    }
    const body = text.slice(open + 1, end - 1);
    if (!selector.startsWith("@") && !body.includes("{")) {
      rules.push({ selector, body: body.trim() });
    }
    at = end;
  }
  return rules;
}

function splitSelector(selector) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < selector.length; index += 1) {
    const char = selector[index];
    if (char === "(") depth += 1;
    else if (char === ")") depth -= 1;
    else if (char === "," && depth === 0) {
      parts.push(selector.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(selector.slice(start));
  return parts.map((part) => part.replace(/\s+/g, " ").trim()).filter(Boolean);
}

function classesOf(svg) {
  const names = new Set();
  for (const match of svg.matchAll(/\bclass="([^"]*)"/g)) {
    for (const name of match[1].split(/\s+/)) if (name) names.add(name);
  }
  return names;
}

/** A rule survives when it can match this static SVG as delivered: every
 * class it names is present, its only attribute condition is this preset,
 * and it waits on no pointer or viewer state. */
function keptRules(rules, classes, preset) {
  const kept = [];
  for (const rule of rules) {
    const parts = splitSelector(rule.selector).filter((part) => {
      if (part.includes(":")) return false;
      const attributes = [...part.matchAll(/\[([^\]]*)\]/g)].map((m) => m[1]);
      if (attributes.some((one) => one !== `data-preset="${preset}"`)) {
        return false;
      }
      const named = [...part.matchAll(/\.([A-Za-z0-9_-]+)/g)].map((m) => m[1]);
      return named.length > 0 && named.every((one) => classes.has(one));
    });
    if (parts.length > 0)
      kept.push({ selector: parts.join(", "), body: rule.body });
  }
  return kept;
}

const THEME_PART =
  /^(?::root|(?:\[data-preset="([^"]+)"\])?\[data-theme="(dark|light)"\])$/;

/** Every variable the kept rules read, as the light and dark value archify
 * gives it under this preset — nested references resolved within a theme. */
function resolveVariables(rules, kept, preset) {
  const themes = { light: new Map(), dark: new Map() };
  for (const rule of rules) {
    for (const part of splitSelector(rule.selector)) {
      const match = THEME_PART.exec(part);
      if (!match) continue;
      const [, forPreset, theme] = match;
      if (forPreset && forPreset !== preset) continue;
      const targets = part === ":root" ? ["dark"] : [theme];
      for (const [, key, value] of rule.body.matchAll(
        /(--[A-Za-z0-9-]+)\s*:\s*([^;]+);?/g,
      )) {
        for (const target of targets) themes[target].set(key, value.trim());
      }
    }
  }
  const used = new Set();
  for (const rule of kept) {
    for (const [, key] of rule.body.matchAll(/var\((--[A-Za-z0-9-]+)/g)) {
      used.add(key);
    }
  }
  const resolved = {};
  for (const key of [...used].sort()) {
    resolved[key] = {
      light: resolve(themes.light, key),
      dark: resolve(themes.dark, key),
    };
  }
  return resolved;
}

function resolve(theme, key, depth = 0) {
  const value = theme.get(key);
  if (value === undefined) throw new Error(`archify defines no ${key}`);
  if (depth > 8) throw new Error(`${key} refers to itself`);
  return value.replace(/var\((--[A-Za-z0-9-]+)\)/g, (_, inner) =>
    resolve(theme, inner, depth + 1),
  );
}

function sheet(name, kept, variables) {
  const root = `svg[data-diagram="${name}"]`;
  const declarations = Object.entries(variables).map(
    ([key, { light, dark }]) => {
      const pair = light === dark ? light : `light-dark(${light}, ${dark})`;
      const token = TOKENS[key];
      return `${key}:${token ? `var(${token}, ${pair})` : pair}`;
    },
  );
  const lines = [`${root}{${declarations.join(";")}}`];
  for (const rule of kept) {
    const scoped = splitSelector(rule.selector)
      .map((part) =>
        /^svg\b/.test(part)
          ? part.replace(/^svg(?:\[[^\]]*\])*/, root)
          : `${root} ${part}`,
      )
      .join(",");
    lines.push(`${scoped}{${rule.body.replace(/\s+/g, " ")}}`);
  }
  return `\n${lines.join("\n")}\n`;
}

// --- markup ------------------------------------------------------------------

function attribute(tag, name) {
  const match = new RegExp(`\\s${name}="([^"]*)"`).exec(tag);
  return match ? match[1] : undefined;
}

/** The step an element claims: its id up to the first underscore, so several nodes
 * can share one, and an edge lights with the node it points at. */
function stepOf(id) {
  return id.split("_")[0];
}

function stampSteps(svg) {
  return svg.replace(/<[a-zA-Z]+\b[^>]*>/g, (tag) => {
    const claimed =
      attribute(tag, "data-node-id") ?? attribute(tag, "data-edge-to");
    if (claimed === undefined) return tag;
    return tag.replace(/^<([a-zA-Z]+)/, `<$1 data-step="${stepOf(claimed)}"`);
  });
}

function stripInteractivity(svg) {
  let out = svg.replace(/\srole="button"/g, "");
  for (const name of DROPPED_ATTRS) {
    out = out.replace(new RegExp(`\\s${name}="[^"]*"`, "g"), "");
  }
  return out;
}

function prefixIds(svg, name) {
  const ids = new Set([...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const renamed = (id) => (ids.has(id) ? `${name}-${id}` : id);
  return svg
    .replace(/\sid="([^"]+)"/g, (_, id) => ` id="${renamed(id)}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${renamed(id)})`)
    .replace(/\shref="#([^"]+)"/g, (_, id) => ` href="#${renamed(id)}"`)
    .replace(
      /\s(aria-labelledby|aria-describedby)="([^"]+)"/g,
      (_, key, list) => ` ${key}="${list.split(/\s+/).map(renamed).join(" ")}"`,
    );
}

const CROP_MARGIN = 12;

/** Archify lays the drawing on a canvas no smaller than its viewer wants;
 * the page wants the drawing, so the viewBox closes in on what is drawn:
 * rectangles, circles, text, and the points every edge runs through. A glyph
 * inside a transformed group sits wherever its parent put it, so those groups
 * do not count. */
function cropped(source) {
  const svg = withoutTransformedGroups(source);
  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
  const grow = (x0, y0, x1, y1) => {
    minX = Math.min(minX, x0);
    minY = Math.min(minY, y0);
    maxX = Math.max(maxX, x1);
    maxY = Math.max(maxY, y1);
  };
  const number = (tag, key) => {
    const value = attribute(tag, key);
    return value !== undefined && /^-?[\d.]+$/.test(value)
      ? Number(value)
      : null;
  };
  for (const [tag] of svg.matchAll(/<rect\b[^>]*>/g)) {
    const [x, y, w, h] = ["x", "y", "width", "height"].map((k) =>
      number(tag, k),
    );
    if (w !== null && h !== null)
      grow(x ?? 0, y ?? 0, (x ?? 0) + w, (y ?? 0) + h);
  }
  for (const [tag] of svg.matchAll(/<circle\b[^>]*>/g)) {
    const [cx, cy, r] = ["cx", "cy", "r"].map((k) => number(tag, k));
    if (cx !== null && cy !== null && r !== null)
      grow(cx - r, cy - r, cx + r, cy + r);
  }
  for (const [tag] of svg.matchAll(/<text\b[^>]*>/g)) {
    const [x, y] = ["x", "y"].map((k) => number(tag, k));
    if (x !== null && y !== null) grow(x, y - 12, x, y + 4);
  }
  for (const [, points] of svg.matchAll(/data-composition-points="([^"]*)"/g)) {
    for (const pair of points.split(";")) {
      const [x, y] = pair.split(",").map(Number);
      if (Number.isFinite(x) && Number.isFinite(y)) grow(x, y, x, y);
    }
  }
  if (!Number.isFinite(minX)) return undefined;
  const x = Math.floor(minX - CROP_MARGIN);
  const y = Math.floor(minY - CROP_MARGIN);
  return `${x} ${y} ${Math.ceil(maxX + CROP_MARGIN) - x} ${Math.ceil(maxY + CROP_MARGIN) - y}`;
}

function withoutTransformedGroups(svg) {
  let out = "";
  let skipping = 0;
  let at = 0;
  for (const match of svg.matchAll(/<g\b[^>]*>|<\/g>/g)) {
    const tag = match[0];
    if (skipping === 0) out += svg.slice(at, match.index);
    at = match.index + tag.length;
    if (tag === "</g>") {
      if (skipping > 0) skipping -= 1;
    } else if (skipping > 0 || attribute(tag, "transform") !== undefined) {
      skipping += 1;
    }
  }
  return out + (skipping === 0 ? svg.slice(at) : "");
}

function rebuildRoot(svg, name, viewBox) {
  return svg.replace(/^<svg\b[^>]*>/, (tag) => {
    const attrs = [`xmlns="${NAMESPACE}"`];
    for (const key of ROOT_ATTRS) {
      const value = key === "viewBox" ? viewBox : attribute(tag, key);
      if (value !== undefined) attrs.push(`${key}="${value}"`);
    }
    attrs.push(`data-diagram="${name}"`);
    return `<svg ${attrs.join(" ")}>`;
  });
}

function refuse(svg, name) {
  for (const pattern of [/<script\b/i, /<foreignObject\b/i, /\son[a-z]+=/i]) {
    if (pattern.test(svg)) {
      throw new Error(`${name}: ${pattern} has no place in a manual diagram`);
    }
  }
}
