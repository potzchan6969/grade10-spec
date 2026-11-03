import { createBrowserRouter } from "react-router";
import { DesignPage } from "./pages/design-page";
import { GuidePage } from "./pages/guide-page";
import { HomePage } from "./pages/home-page";
import { ManualPage } from "./pages/manual-page";
import { PhasesPage } from "./pages/phases-page";
import { PlatformPage } from "./pages/platform-page";
import { ProductRoutes } from "./pages/product-routes";
import { RecentPage } from "./pages/recent-page";
import { ReferencePage, ReferencesPage } from "./pages/references-page";
import { AppShell } from "./shell/app-shell";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "p/*", element: <ProductRoutes /> },
      { path: "platform/:topic", element: <PlatformPage /> },
      { path: "guides/:slug", element: <GuidePage /> },
      { path: "design", element: <DesignPage /> },
      { path: "recent", element: <RecentPage /> },
      { path: "phases", element: <PhasesPage /> },
      { path: "phases/:phase", element: <PhasesPage /> },
      // The run desk is QA's alone: a reader never downloads it.
      {
        path: "runs",
        lazy: () =>
          import("./pages/runs-page").then((page) => ({
            Component: page.RunsPage,
          })),
      },
      {
        path: "runs/:id",
        lazy: () =>
          import("./pages/run-page").then((page) => ({
            Component: page.RunPage,
          })),
      },
      { path: "references", element: <ReferencesPage /> },
      { path: "references/:slug", element: <ReferencePage /> },
      { path: "*", element: <ManualPage /> },
    ],
  },
]);
