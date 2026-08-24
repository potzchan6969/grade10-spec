/*
 * The value half of the Figma checks, shared verbatim between
 * check-components.mjs (variants of a component set) and audit-node.mjs
 * (arbitrary nodes): how a file key is read out of a URL, how a token name
 * resolves through tokens.json to the 8-digit hex a fill compares against,
 * how a radius rung resolves to the pixels a browser actually paints, and
 * which Tailwind utilities turn into checkable expectations.
 *
 * One authority on purpose. The radius resolver in particular carries
 * semantics that were silently wrong twice before they were modelled
 * (see radiusResolver); a second copy would re-diverge the same way.
 */

export function fileKeyFrom(spec) {
  // /design/:key/branch/:branchKey/:name resolves to the BRANCH key — a branch
  // is a distinct file to the API, and tokens.config.json points at one today.
  const branch = /\/branch\/([0-9a-zA-Z]{22,128})/.exec(spec)?.[1];
  if (branch) return branch;
  const inUrl = /\/(?:design|file)\/([0-9a-zA-Z]{22,128})/.exec(spec)?.[1];
  if (inUrl) return inUrl;
  return /^[0-9a-zA-Z]{22,128}$/.test(spec.trim()) ? spec.trim() : null;
}

// tokens.json is the source of truth for values; `{ref}` chases through the
// primitives. Returns 8-digit hex so an opacity-bearing token compares directly
// against a Figma fill's colour plus its opacity.
export function tokenResolver(tokens) {
  const flat = { ...tokens.primitives };
  for (const theme of Object.values(tokens.themes ?? {}))
    Object.assign(flat, theme.tokens ?? {});
  const resolve_ = (name, seen = new Set()) => {
    if (seen.has(name)) return null;
    seen.add(name);
    const raw = flat[name]?.$value;
    if (typeof raw !== "string") return null;
    const ref = /^\{([^}]+)\}$/.exec(raw.trim());
    return ref ? resolve_(ref[1], seen) : raw;
  };
  return resolve_;
}

/*
 * `rounded-*` -> the pixel value a browser actually paints.
 *
 * This cannot go through tokenResolver by name. Two things get in the way, and
 * both of them silently produced *no* radius check at all until they were
 * modelled here — the lookup just missed and the expectation was dropped.
 *
 * 1. The token names moved. Figma renamed the Foundation collection
 *    `Rounded/rounded-*` to `Radius/radius-*`, so the old `rounded-${rung}`
 *    lookup stopped resolving for every rung at once.
 *
 * 2. The utility does not read the primitive anyway. theme.preamble.css
 *    derives the scale proportionally in an `@theme inline` block
 *    (`--radius-sm: calc(var(--radius) * 0.6)`), and `inline` means Tailwind
 *    substitutes that expression into the utility rather than emitting a
 *    var() reference. So `rounded-sm` paints calc(--radius * 0.6) = 4.8px
 *    while the `radius-sm` primitive says 4px. Resolving the primitive would
 *    assert a value nothing renders — papering over exactly the mismatch this
 *    check exists to surface.
 *
 * So the scale is read out of the preamble rather than restated here, the same
 * way axes are read through the Code Connect template rather than aliased: a
 * rung the preamble overrides is evaluated from its own expression, and a rung
 * it leaves alone falls through to the `radius-*` primitive, which is what
 * Tailwind's non-inline default theme references.
 */
export function radiusResolver(preambleCss, cfg, resolveToken) {
  const inline = /@theme\s+inline\s*\{/.exec(preambleCss);
  const block = inline
    ? preambleCss.slice(inline.index, preambleCss.indexOf("}", inline.index))
    : "";
  const derived = Object.fromEntries(
    [...block.matchAll(/--radius-([a-z0-9]+)\s*:\s*([^;]+);/g)].map((m) => [
      m[1],
      m[2].trim(),
    ]),
  );

  // `--radius` is not a rung; it is the slot the whole scale is derived from,
  // and tokens.config.json says which Figma token fills it.
  const baseToken = cfg.slotMap?.["--radius"];
  const base = baseToken
    ? px(resolveToken(baseToken.replace(/^.*\//, "")))
    : null;

  return (rung) => {
    // `rounded-(--radius-sm)` — an arbitrary property, so it references the
    // custom property directly and the primitive is what resolves.
    const arbitrary = /^\((--)?([a-z0-9-]+)\)$/.exec(rung);
    if (arbitrary) return px(resolveToken(arbitrary[2]));

    const expr = derived[rung];
    if (expr) {
      if (base == null) return null;
      if (/^var\(--radius\)$/.test(expr)) return base;
      const scaled = /^calc\(\s*var\(--radius\)\s*\*\s*([\d.]+)\s*\)$/.exec(
        expr,
      );
      if (scaled) return base * Number(scaled[1]);
      // A literal such as `--radius-pill: 999px`.
      return Number.isNaN(px(expr)) ? null : px(expr);
    }

    // Not overridden in the preamble, so Tailwind's own theme entry applies and
    // it is a plain var() reference onto the :root primitive.
    return px(resolveToken(`radius-${rung}`));
  };
}

export const px = (v) => (typeof v === "string" ? Number.parseFloat(v) : v);
export const toHex8 = (color, opacity) => {
  const a = Math.round((color.a ?? 1) * (opacity ?? 1) * 255);
  const part = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${part(color.r)}${part(color.g)}${part(color.b)}${a.toString(16).padStart(2, "0")}`.toUpperCase();
};
export const normHex = (hex) => {
  const h = hex.replace("#", "").toUpperCase();
  return `#${h.length === 6 ? `${h}FF` : h}`;
};

// A Tailwind utility a variant's class string states, turned into the value
// Figma should show. Prefixed utilities (hover:, disabled:, [&_svg]:) describe
// states this check cannot see in a static variant, so they are skipped.
export function expectations(classString, resolveToken, resolveRadius) {
  const out = [];
  for (const cls of classString.split(/\s+/).filter(Boolean)) {
    if (cls.includes(":")) continue;
    let m;
    if ((m = /^bg-(.+)$/.exec(cls))) {
      const value = resolveToken(m[1]);
      if (value?.startsWith("#"))
        out.push({ prop: "fill", cls, expected: normHex(value) });
    } else if ((m = /^h-(\d+(?:\.\d+)?)$/.exec(cls))) {
      out.push({ prop: "height", cls, expected: Number(m[1]) * 4 });
    } else if ((m = /^px-(\d+(?:\.\d+)?)$/.exec(cls))) {
      out.push({ prop: "padX", cls, expected: Number(m[1]) * 4 });
    } else if ((m = /^gap-(\d+(?:\.\d+)?)$/.exec(cls))) {
      out.push({ prop: "gap", cls, expected: Number(m[1]) * 4 });
    } else if ((m = /^rounded-(.+)$/.exec(cls))) {
      const value = resolveRadius(m[1]);
      if (value != null && !Number.isNaN(value))
        out.push({ prop: "radius", cls, expected: value });
    }
  }
  return out;
}
