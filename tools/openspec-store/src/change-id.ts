/** `archive/` is the fold, not a change; an id that names it would write a
 * proposal into the history of every change ever archived. */
const RESERVED = new Set(["archive"]);
const SLUG = /^[a-z0-9][a-z0-9-]*$/;
const SLUG_LIMIT = 64;

/** The change id a title implies. The proposer can overrule it; both go
 * through `slugProblem` before anything is written. */
export function slugOf(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_LIMIT)
    .replace(/-+$/, "");
}

export function slugProblem(slug: string): string | null {
  if (slug === "") return "a slug is required";
  if (slug.length > SLUG_LIMIT)
    return `a slug is at most ${SLUG_LIMIT} characters`;
  if (!SLUG.test(slug)) {
    return "a slug is lower-case letters, digits and dashes, starting with a letter or digit";
  }
  if (RESERVED.has(slug)) return `\`${slug}\` is not a change, it is the fold`;
  return null;
}
