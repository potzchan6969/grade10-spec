import { createBrowserRouter } from "react-router";
import { CapabilityPage } from "./pages/capability-page";
import { DesignPage } from "./pages/design-page";
import { GuidePage } from "./pages/guide-page";
import { HomePage } from "./pages/home-page";
import { ManualPage } from "./pages/manual-page";
import { PlanningPage } from "./pages/planning-page";
import { PlatformPage } from "./pages/platform-page";
import { ProductPage } from "./pages/product-page";
import { QaPage } from "./pages/qa-page";
import { AppShell } from "./shell/app-shell";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "p/:product", element: <ProductPage /> },
      { path: "p/:product/:capability", element: <CapabilityPage /> },
      { path: "platform/:topic", element: <PlatformPage /> },
      { path: "guides/:slug", element: <GuidePage /> },
      { path: "planning", element: <PlanningPage /> },
      { path: "qa", element: <QaPage /> },
      { path: "design", element: <DesignPage /> },
      { path: "*", element: <ManualPage /> },
    ],
  },
]);
