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

// `text-sm` is a size and `border-t` is an edge; only a value that resolves
// through the tokens to a hex is a class claiming a colour.
const isColorClass = (cls, prefix, resolveToken) => {
  const m = new RegExp(`^${prefix}-(.+)$`).exec(cls);
  if (!m) return false;
  // `bg-sidebar/95` is a token carrying an opacity modifier, and it claims the
  // property as surely as the bare token does — reading the modifier as part
  // of the name resolved nothing, so a glass surface audited as if it painted
  // no background at all.
  //
  // The modifier is multiplied into whatever alpha the token ALREADY carries,
  // so a token that is itself translucent is deliberately left unresolved and
  // goes on being reported. `bg-overlay/30` over an `--overlay` that is itself
  // 30% paints 9%: that is how the cart and dialog scrims shipped a third as
  // dark as Figma draws them, and this rail is what surfaced it.
  const slash = m[1].lastIndexOf("/");
  const modified = slash > 0 && /^[\d.]+$/.test(m[1].slice(slash + 1));
  const hex = resolveToken(modified ? m[1].slice(0, slash) : m[1]);
  if (!hex?.startsWith("#")) return false;
  return !modified || hex.length <= 7 || /ff$/i.test(hex);
};

/**
 * The other half of `expectations`, and the half that has to be asked of the
 * NODE rather than of the class string.
 *
 * Every expectation above is raised BY a class, so a property the code never
 * styled raises none and is compared against nothing — which is how a header
 * that drew no background at all audited clean while Figma filled its frame.
 * Fill and stroke are read off the node instead, and the classes are searched
 * for something that claims them.
 *
 * Silence on either side is an answer here, unlike the layout-intent rails:
 * every frame, component, and variant states `fills` and `strokes`, so an
 * empty one is the node saying it draws nothing rather than declining to say.
 *
 * Deliberately not general. A rail demanding a class for every property a
 * node happens to state would fail every element for the ones Figma always
 * emits; these two are singled out because they are the ones a node cannot
 * decline to answer, and the ones a viewer sees immediately.
 *
 * `values` is `{ type, fill, stroke }` — 8-digit hex or null, and the node
 * type, because on a TEXT node the fill IS the text colour and `text-*`
 * rather than `bg-*` is what claims it. Both callers build it their own way:
 * audit-node.mjs from a node, check-components.mjs from one variant.
 */
export function omissions(classString, values, resolveToken) {
  // A prefixed utility describes a state this cannot see, so it is not what
  // claims the resting fill either. But a colon inside an arbitrary value —
  // `border-[color:var(--border-subtle)]` — is not a variant prefix, and
  // dropping those drops the very classes that carry a colour. A prefix is a
  // colon that comes before any bracket.
  const isPrefixed = (c) => {
    const colon = c.indexOf(":");
    if (colon === -1) return false;
    const bracket = c.indexOf("[");
    return bracket === -1 || colon < bracket;
  };
  const plain = classString.split(/\s+/).filter((c) => c && !isPrefixed(c));
  const out = [];
  const isText = values.type === "TEXT";
  const prefix = isText ? "text" : "bg";

  // Three answers, not two. A class can name a colour, say there is
  // deliberately none, or — the case that made this subtle — be a `bg-*` or
  // `border-*` utility that is not about colour at all. `bg-clip-padding`,
  // `bg-cover`, a bare `border` and `border-t` are geometry and painting
  // hints; reading them as colour claims marks a component covered when
  // nothing has compared its fill.
  //
  // Order matters, and last wins, because that is what the cascade does. The
  // classes arrive base-first: a base `border border-transparent` followed by
  // a variant's `border-border` renders the variant's colour, so reading the
  // first answer would report every such variant as declaring no border.
  const claim = (kind) => {
    let answer = "unclaimed";
    for (const c of plain) {
      if (c === `${kind}-transparent`) answer = "none";
      // An arbitrary value — bg-[#fff], border-[color:var(--x)] — or a
      // gradient paints without resolving through the tokens, so it claims
      // the property even though expectations() cannot compare what it paints.
      else if (new RegExp(`^${kind}-\\[`).test(c)) answer = "opaque";
      else if (kind === "bg" && /^bg-(gradient|linear|radial|conic)/.test(c))
        answer = "opaque";
      else if (isColorClass(c, kind, resolveToken)) answer = "token";
    }
    return answer;
  };

  const fill = claim(prefix);
  if (fill === "none" && values.fill != null)
    out.push(`${prefix}-transparent in code, ${values.fill} in Figma`);
  else if (fill === "unclaimed" && values.fill != null)
    out.push(`draws ${values.fill}, no ${prefix}-* class claims it`);
  else if (fill === "opaque" && values.fill == null)
    // A token-resolved class is already compared by expectations(); only the
    // arbitrary value it cannot resolve needs reporting here.
    out.push(
      `${plain.find((c) => new RegExp(`^${prefix}-`).test(c))} in code, no fill in Figma`,
    );

  const stroke = claim("border");
  if (stroke === "none" && values.stroke != null)
    out.push(`border-transparent in code, ${values.stroke} in Figma`);
  else if (stroke === "unclaimed" && values.stroke != null)
    out.push(`strokes ${values.stroke}, no border-* class claims it`);
  else if (stroke === "opaque" && values.stroke == null)
    out.push(
      `${plain.find((c) => /^border-\[/.test(c))} in code, no stroke in Figma`,
    );

  return out;
}
