/** Store paths, canonical routes, and the slugs that link the two. */

/** A page's content-relative path: the manual's directory, then the rest —
 * `pagePath("docs/prds", "products", "vault", "index.md")`. The directory
 * is the store's to choose, so it rides the snapshot and is never named here. */
export function pagePath(manualDir: string, ...rest: string[]): string {
  return [manualDir, ...rest].join("/");
}

/** The store's own repository — the one place it is named. */
export const STORE_REPO = {
  owner: "9gag",
  repo: "grade10-spec",
  defaultBranch: "main",
} as const;

export const GITHUB_BLOB = `https://github.com/${STORE_REPO.owner}/${STORE_REPO.repo}/blob/${STORE_REPO.defaultBranch}`;

export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug === "" ? "item" : slug;
}

const HEADING_LINK = /\[([^\]]+)\]\([^)]*\)/g;
const HEADING_INLINE = /[*_`]/g;

/** The id a `## ` heading renders with: its text, a link unwrapped to the
 * words it shows and the emphasis marks dropped. A proposal's `## References`
 * link names a section by this, so it is the one slug both sides compare on. */
export function sectionSlug(heading: string): string {
  return slugify(
    heading.replace(HEADING_LINK, "$1").replace(HEADING_INLINE, ""),
  );
}

export function humanize(id: string): string {
  return id
    .split(/[-_/]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function dirOf(path: string): string {
  const cut = path.lastIndexOf("/");
  return cut === -1 ? "" : path.slice(0, cut);
}

/** Store-relative target of a relative href, or null when it climbs past the root. */
export function resolveRelative(baseDir: string, href: string): string | null {
  const segments = baseDir === "" ? [] : baseDir.split("/");
  for (const part of href.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      if (segments.length === 0) return null;
      segments.pop();
      continue;
    }
    segments.push(part);
  }
  return segments.length === 0 ? null : segments.join("/");
}

/** The one canonical route for a page path; null for a path the routes do not claim. */
export function routeForPagePath(
  manualDir: string,
  path: string,
): string | null {
  if (path === `${manualDir}/index.md`) return "/";
  const rest = path.startsWith(`${manualDir}/`)
    ? path.slice(manualDir.length + 1)
    : null;
  if (rest === null || !rest.endsWith(".md")) return null;
  const parts = rest.slice(0, -3).split("/");

  // A product id is `<product>/<domain>` in a store that groups its specs by
  // the application shipping them, and a single segment in one that does not.
  // Both are read, so a page moving deeper keeps its route shape.
  if (parts[0] === "products" && (parts.length === 3 || parts.length === 4)) {
    const owner = parts.slice(1, -1).join("/");
    const leaf = parts[parts.length - 1];
    return leaf === "index" ? `/p/${owner}` : `/p/${owner}/${leaf}`;
  }
  if (parts[0] === "platform" && (parts.length === 2 || parts.length === 3))
    return `/platform/${parts.slice(1).join("/")}`;
  if (parts[0] === "guides" && parts.length === 2) return `/guides/${parts[1]}`;
  return null;
}

/**
 * The store paths a route could name, best first. `/p/a/b` is the landing page
 * of the product `a/b` where products carry a domain, and the capability `b`
 * of the product `a` where they do not; only the store knows which, so both
 * are offered and the caller keeps the one it holds.
 */
export function pagePathsForRoute(
  manualDir: string,
  pathname: string,
): string[] {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [pagePath(manualDir, "index.md")];
  if (parts[0] === "p" && parts.length === 2) {
    return [pagePath(manualDir, "products", parts[1], "index.md")];
  }
  if (parts[0] === "p" && parts.length === 3) {
    return [
      pagePath(manualDir, "products", parts[1], parts[2], "index.md"),
      pagePath(manualDir, "products", parts[1], `${parts[2]}.md`),
    ];
  }
  if (parts[0] === "p" && parts.length === 4) {
    return [
      pagePath(manualDir, "products", parts[1], parts[2], `${parts[3]}.md`),
    ];
  }
  if (parts[0] === "platform" && (parts.length === 2 || parts.length === 3)) {
    return [pagePath(manualDir, "platform", `${parts.slice(1).join("/")}.md`)];
  }
  if (parts[0] === "guides" && parts.length === 2) {
    return [pagePath(manualDir, "guides", `${parts[1]}.md`)];
  }
  return [];
}

export function pagePathForRoute(
  manualDir: string,
  pathname: string,
): string | null {
  return pagePathsForRoute(manualDir, pathname)[0] ?? null;
}

/**
 * The product (or platform topic) a spec id belongs to. The taxonomy decides:
 * the longest product that prefixes the id owns it, and a topic owns itself.
 * A spec the taxonomy does not name yet — one only a change has written — is
 * read off its own shape, giving its parent where it has one to give.
 */
export function ownerOfSpec(
  specId: string,
  taxonomy?: { products: string[]; topics: string[] },
): string {
  let owned = "";
  for (const product of taxonomy?.products ?? []) {
    if (specId.startsWith(`${product}/`) && product.length > owned.length) {
      owned = product;
    }
  }
  if (owned !== "") return owned;
  if (taxonomy?.topics.includes(specId)) return specId;
  const parts = specId.split("/");
  return parts.length === 1 ? specId : parts.slice(0, -1).join("/");
}

/**
 * The name a spec wears on screen. The store titles most specs `<id>
 * Specification` — the id said twice, noise beside the id badge that sits next
 * to it — and the reader hands that title over verbatim on purpose, leaving the
 * choice here. A title that says something of its own is kept as written.
 */
export function specTitle(spec: { id: string; title: string }): string {
  const bare = spec.title.replace(/\s+Specification$/i, "").trim();
  const echoesId =
    bare !== spec.title || bare === "" || bare.startsWith(spec.id);
  return echoesId ? humanize(spec.id.split("/").at(-1) ?? spec.id) : spec.title;
}

/** Where a spec lives in the store — the base its own relative links resolve from. */
export function specDir(specId: string): string {
  return `openspec/specs/${specId}`;
}

export function specSourceUrl(specId: string): string {
  return `${GITHUB_BLOB}/${specDir(specId)}/spec.md`;
}

export function changeSourceUrl(changeId: string): string {
  return `${GITHUB_BLOB}/openspec/changes/${changeId}`;
}
