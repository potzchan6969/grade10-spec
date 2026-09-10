import { Text } from "@grade10/design-system/components/display/text";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "react-router";
import {
  capabilityStatus,
  childPages,
  isProductDir,
  type ManualIndex,
} from "../api/derive";
import { dirOf, humanize } from "../api/paths";
import { useBlockScope } from "./block-scope";
import { CapabilityWord } from "./capability-status";

/** The authored block: a page that asks for its children and has none is
 * told so, where a landing rendered without asking shows nothing. */
export function ChildrenBlockView() {
  const { index, pagePath } = useBlockScope();
  const dir = dirOf(pagePath);
  if (childPages(index, dir).length === 0) {
    return (
      <Text as="p" className="my-4" size="sm" tone="secondary">
        No pages under {dir} yet.
      </Text>
    );
  }
  return <ChildCards dir={dir} index={index} />;
}

/** Cards for the pages under a directory, ordered by their own frontmatter;
 * nothing for a domain of one page. */
export function ChildCards({
  index,
  dir,
}: {
  index: ManualIndex;
  dir: string;
}) {
  const children = childPages(index, dir);
  const capabilities = isProductDir(index.manualDir, dir);
  if (children.length === 0) return null;

  return (
    <ul className="my-6 grid gap-3 sm:grid-cols-2">
      {children.map((page) => {
        const title =
          page.ast?.frontmatter.title ??
          humanize(
            page.path.split("/").pop()?.replace(/\.md$/, "") ?? page.path,
          );
        return (
          <li key={page.path}>
            <Link
              className="group flex h-full flex-col gap-1 rounded-(--radius-xl) border border-border bg-card p-4 transition-colors hover:border-border-strong hover:bg-muted"
              to={page.route ?? "/"}
            >
              <span className="flex items-center gap-1.5 font-medium text-sm">
                {title}
                <span className="inline-flex opacity-0 transition-opacity group-hover:opacity-60">
                  <ArrowRight aria-hidden size={14} />
                </span>
                {capabilities ? (
                  <CapabilityWord
                    className="ml-auto"
                    status={capabilityStatus(index, page.ast?.frontmatter.spec)}
                  />
                ) : null}
              </span>
              {page.ast?.frontmatter.summary ? (
                <Text as="span" size="sm" tone="secondary">
                  {page.ast.frontmatter.summary}
                </Text>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
