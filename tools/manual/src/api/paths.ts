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

  if (parts[0] === "products" && parts.length === 3) {
    return parts[2] === "index"
      ? `/p/${parts[1]}`
      : `/p/${parts[1]}/${parts[2]}`;
  }
  if (parts[0] === "platform" && parts.length === 2)
    return `/platform/${parts[1]}`;
  if (parts[0] === "guides" && parts.length === 2) return `/guides/${parts[1]}`;
  return null;
}

export function pagePathForRoute(
  manualDir: string,
  pathname: string,
): string | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return pagePath(manualDir, "index.md");
  if (parts[0] === "p" && parts.length === 2) {
    return pagePath(manualDir, "products", parts[1], "index.md");
  }
  if (parts[0] === "p" && parts.length === 3) {
    return pagePath(manualDir, "products", parts[1], `${parts[2]}.md`);
  }
  if (parts[0] === "platform" && parts.length === 2) {
    return pagePath(manualDir, "platform", `${parts[1]}.md`);
  }
  if (parts[0] === "guides" && parts.length === 2) {
    return pagePath(manualDir, "guides", `${parts[1]}.md`);
  }
  return null;
}

/** The product (or platform topic) a spec id belongs to. */
export function ownerOfSpec(specId: string): string {
  return specId.split("/")[0];
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
