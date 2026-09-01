import { useEffect } from "react";

const SUFFIX = "Grade10 Manual";

/** Frontmatter drives the tab title; a page with no title falls back to the app. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SUFFIX}` : SUFFIX;
  }, [title]);
}
