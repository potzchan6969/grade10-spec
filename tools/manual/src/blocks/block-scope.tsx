import { createContext, type ReactNode, use } from "react";
import type { ManualIndex } from "../api/derive";
import { dirOf } from "../api/paths";

/** What every block needs to resolve a reference: the store, and where it sits. */
export type BlockScope = {
  index: ManualIndex;
  /** Store path of the page being rendered. */
  pagePath: string;
};

const ScopeContext = createContext<BlockScope | null>(null);

export function BlockScopeProvider({
  value,
  children,
}: {
  value: BlockScope;
  children: ReactNode;
}) {
  return <ScopeContext value={value}>{children}</ScopeContext>;
}

export function useBlockScope(): BlockScope {
  const scope = use(ScopeContext);
  if (!scope) throw new Error("blocks render inside a BlockScopeProvider");
  return scope;
}

/** The directory a page's own relative links resolve against. */
export function usePageDir(): string {
  return dirOf(useBlockScope().pagePath);
}

/** The spec a page's own bare `[[ids]]` resolve inside, from its frontmatter. */
export function usePageSpec(): string | undefined {
  const { index, pagePath } = useBlockScope();
  return index.pageByPath.get(pagePath)?.ast?.frontmatter.spec;
}
