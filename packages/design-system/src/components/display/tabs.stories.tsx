import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartLineIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Design System/Display/Tabs",
  component: Tabs,
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default `pill` list — muted track with a sliding white indicator. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_1748e7c6-4054-475e-8f59-18628d00097a" },
  },
  render: (args) => (
    <Tabs defaultValue="overview" className="w-80" {...args}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" />
      <TabsContent value="activity" />
      <TabsContent value="settings" />
    </Tabs>
  ),
};

/** `size="sm"` — 32px pills in a 36px track with `text-xs`. */
export const Small: Story = {
  parameters: {
    verification: { caseId: "vc_879b14e6-6ba4-43be-8d79-deab9f712a1d" },
  },
  render: () => (
    <Tabs defaultValue="overview" className="w-80">
      <TabsList size="sm">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" />
      <TabsContent value="activity" />
      <TabsContent value="settings" />
    </Tabs>
  ),
};

/** The `list` variant drops the track for an underline on the active tab. */
export const List: Story = {
  parameters: {
    verification: { caseId: "vc_e642af12-bbcc-43ef-ac53-f6a8ca984259" },
  },
  render: () => (
    <Tabs defaultValue="overview" className="w-80">
      <TabsList variant="list">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" />
      <TabsContent value="activity" />
      <TabsContent value="settings" />
    </Tabs>
  ),
};

/** Flush the list and share the width evenly across triggers. */
export const FullWidth: Story = {
  parameters: {
    verification: { caseId: "vc_82187ce1-0975-442c-b039-e759088e4826" },
  },
  render: () => (
    <Tabs defaultValue="overview" className="w-80">
      <TabsList fullWidth>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" />
      <TabsContent value="activity" />
      <TabsContent value="settings" />
    </Tabs>
  ),
};

/** Leading icon at `Size/size-4` with `Gap/gap-2` — padding stays `Gap/gap-4`. */
export const WithIcons: Story = {
  parameters: {
    verification: { caseId: "vc_8c0c7c65-6dd2-4a84-b06e-3d5eed3fd650" },
  },
  render: () => (
    <Tabs defaultValue="overview" className="w-80">
      <TabsList>
        <TabsTrigger value="overview">
          <ChartLineIcon />
          Overview
        </TabsTrigger>
        <TabsTrigger value="profile">
          <UserIcon />
          Profile
        </TabsTrigger>
        <TabsTrigger value="settings">
          <SettingsIcon />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" />
      <TabsContent value="profile" />
      <TabsContent value="settings" />
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  parameters: {
    verification: { caseId: "vc_8c2e5fd1-b842-4626-a5e1-6350f91b3674" },
  },
  render: () => (
    <Tabs defaultValue="overview" className="w-80">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity" disabled>
          Activity
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" />
      <TabsContent value="activity" />
    </Tabs>
  ),
};
