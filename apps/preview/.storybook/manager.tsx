import * as React from "react";
import { AddonPanel } from "storybook/internal/components";
import { Route } from "storybook/internal/router";
import { addons, types, useStorybookState } from "storybook/manager-api";
import {
  APPROVE_PANEL,
  SITE_COMPARE_PANEL,
} from "../src/ui-verification/dashboard-model";
import { ReferenceCapturesPage } from "../src/ui-verification/ReferenceCapturesPage";
import { VerificationDashboardPage } from "../src/ui-verification/VerificationDashboardPage";
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

const ADDON_ID = SITE_COMPARE_PANEL;
const APPROVE_ID = APPROVE_PANEL;
const DASHBOARD_ID = `${ADDON_ID}/dashboard`;
const CAPTURES_ID = `${ADDON_ID}/captures`;
// A trailing slash is what makes Storybook read this as a page's view mode,
// as its own Settings page does.
const CAPTURES_PATH = "/reference-captures/";
const DASHBOARD_PATH = "/verification-dashboard/";

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
  addons.add(DASHBOARD_ID, {
    type: types.experimental_PAGE,
    url: DASHBOARD_PATH,
    title: "UI Verification Dashboard",
    render: () => (
      <Route path={DASHBOARD_PATH} startsWith>
        <VerificationDashboardPage />
      </Route>
    ),
  });
  addons.add(CAPTURES_ID, {
    type: types.experimental_PAGE,
    url: CAPTURES_PATH,
    title: "Reference captures",
    render: () => (
      <Route path={CAPTURES_PATH} startsWith>
        <ReferenceCapturesPage />
      </Route>
    ),
  });
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
