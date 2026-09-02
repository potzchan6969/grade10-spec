import { Navigate, useLocation } from "react-router";
import { pagePathForRoute } from "../api/paths";
import { useManualIndex } from "../api/use-manual-index";
import { NotFoundPage } from "./not-found";
import { PageView } from "./page-view";

/**
 * Catch-all. A raw store path redirects to the one canonical route for that
 * page rather than rendering a second copy of it beside it.
 */
export function ManualPage() {
  const { pathname, search, hash } = useLocation();
  const index = useManualIndex();

  const raw = pathname.replace(/^\/+/, "");
  const stored = index.pageByPath.get(raw) ?? index.pageByPath.get(`${raw}.md`);
  if (stored?.route) {
    return <Navigate replace to={`${stored.route}${search}${hash}`} />;
  }

  const path = pagePathForRoute(index.manualDir, pathname);
  return path ? (
    <PageView index={index} path={path} />
  ) : (
    <NotFoundPage index={index} path={pathname} />
  );
}
