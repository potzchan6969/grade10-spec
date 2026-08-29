import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Compass } from "@phosphor-icons/react";
import { Link } from "react-router";
import type { ManualIndex } from "../api/derive";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

function shared(a: string[], b: string[]): number {
  let count = 0;
  for (const segment of a) if (b.includes(segment)) count += 1;
  return count;
}

/** Nearest pages by shared path segments — a wrong URL still lands somewhere. */
function nearMatches(index: ManualIndex, path: string) {
  const wanted = path.replace(/\.md$/, "").split("/").filter(Boolean);
  return index.pages
    .filter((page) => page.route)
    .map((page) => ({
      page,
      score: shared(wanted, page.path.replace(/\.md$/, "").split("/")),
    }))
    .sort((a, b) => b.score - a.score || a.page.path.localeCompare(b.page.path))
    .slice(0, 5);
}

export function NotFoundPage({
  index,
  path,
}: {
  index: ManualIndex;
  path: string;
}) {
  useDocumentTitle("Not in the manual");
  const matches = nearMatches(index, path);

  return (
    <>
      <PageHeading
        eyebrow="Not found"
        summary="This snapshot has no page at that path. The nearest ones are below."
        title="Nothing is written here yet"
      />
      <Text as="p" className="mb-6 font-mono" size="sm" tone="secondary">
        {path}
      </Text>

      {matches.length === 0 ? (
        <EmptyState
          description="The snapshot carries no pages at all."
          icon={<Compass aria-hidden />}
          title="Empty manual"
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {matches.map(({ page }) => (
            <li key={page.path}>
              <Link
                className="flex h-full flex-col gap-1 rounded-(--radius-xl) border border-border bg-card p-4 transition-colors hover:border-border-strong hover:bg-muted"
                to={page.route ?? "/"}
              >
                <span className="font-medium text-sm">
                  {page.ast?.frontmatter.title ?? page.path}
                </span>
                <Text
                  as="span"
                  className="font-mono"
                  size="xs"
                  tone="secondary"
                >
                  {page.route}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
