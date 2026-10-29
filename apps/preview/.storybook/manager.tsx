import * as React from "react";
import { AddonPanel } from "storybook/internal/components";
import { addons, types, useStorybookState } from "storybook/manager-api";
import {
  type PanelMode,
  VerificationPanel,
} from "../src/ui-verification/VerificationPanel";

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
const APPROVE_ID = `${ADDON_ID}/approve`;

// Storybook renders every panel as active and hides the unselected ones, so
// each of these two asks which panel is selected before it draws.
function ArchivePanel({
  active,
  id,
  mode,
}: {
  active: boolean;
  id: string;
  mode: PanelMode;
}) {
  const { selectedPanel } = useStorybookState();
  const shown =
    active && (selectedPanel === id || (!selectedPanel && id === ADDON_ID));
  return (
    <AddonPanel active={active} hasHorizontalScrollbar hasScrollbar>
      <VerificationPanel active={shown} mode={mode} />
    </AddonPanel>
  );
}

// Approve first: a designer approves the Storybook reference, then Site
// Compare holds the site to it.
addons.register(ADDON_ID, () => {
  addons.add(APPROVE_ID, {
    id: APPROVE_ID,
    type: types.PANEL,
    title: "Approve",
    match: ({ viewMode }) => viewMode === "story",
    render: ({ active }) => (
      <ArchivePanel active={Boolean(active)} id={APPROVE_ID} mode="approve" />
    ),
  });
  addons.add(ADDON_ID, {
    id: ADDON_ID,
    type: types.PANEL,
    title: "Site Compare",
    match: ({ viewMode }) => viewMode === "story",
    render: ({ active }) => (
      <ArchivePanel active={Boolean(active)} id={ADDON_ID} mode="site" />
    ),
  });
});
