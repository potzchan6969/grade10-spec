import { createBrowserRouter } from "react-router";
import { ChangePage } from "./pages/change-page";
import { DesignPage } from "./pages/design-page";
import { GuidePage } from "./pages/guide-page";
import { HomePage } from "./pages/home-page";
import { InFlightPage } from "./pages/in-flight-page";
import { ManualPage } from "./pages/manual-page";
import { MyTurnPage } from "./pages/my-turn-page";
import { PendingPage } from "./pages/pending-page";
import { PlatformPage } from "./pages/platform-page";
import { ProductRoutes } from "./pages/product-routes";
import { QaPage } from "./pages/qa-page";
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
      { path: "in-flight", element: <InFlightPage /> },
      { path: "in-flight/:change", element: <ChangePage /> },
      { path: "pending", element: <PendingPage /> },
      { path: "my-turn", element: <MyTurnPage /> },
      { path: "qa", element: <QaPage /> },
      { path: "design", element: <DesignPage /> },
      { path: "recent", element: <RecentPage /> },
      { path: "references", element: <ReferencesPage /> },
      { path: "references/:slug", element: <ReferencePage /> },
      { path: "*", element: <ManualPage /> },
    ],
  },
]);
