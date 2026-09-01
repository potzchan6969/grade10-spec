import { IconProvider } from "@grade10/design-system/components/providers/icon-provider";
import { ThemeProvider } from "@grade10/design-system/components/providers/theme-provider";
import { RouterProvider } from "react-router";
import { SnapshotProvider } from "./api/snapshot-provider";
import { router } from "./routes";

export function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
      storageKey="manual-mode"
    >
      <IconProvider>
        <SnapshotProvider>
          <RouterProvider router={router} />
        </SnapshotProvider>
      </IconProvider>
    </ThemeProvider>
  );
}
