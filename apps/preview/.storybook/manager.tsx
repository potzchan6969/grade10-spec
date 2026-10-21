import * as React from "react";
import { AddonPanel } from "storybook/internal/components";
import { addons, types } from "storybook/manager-api";
import { VerificationPanel } from "../src/ui-verification/VerificationPanel";

// The Storybook manager builder compiles this TSX with React.createElement.
void React;

declare module "storybook/internal/csf" {
  interface Parameters {
    verification?: {
      caseId: string;
      targetId?: string;
      capturePointId?: string;
    };
  }
}

const ADDON_ID = "grade10/ui-verification";

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    id: ADDON_ID,
    type: types.PANEL,
    title: "Verification",
    match: ({ viewMode }) => viewMode === "story",
    render: ({ active }) => (
      <AddonPanel active={Boolean(active)} hasHorizontalScrollbar hasScrollbar>
        <VerificationPanel active={Boolean(active)} />
      </AddonPanel>
    ),
  });
});
