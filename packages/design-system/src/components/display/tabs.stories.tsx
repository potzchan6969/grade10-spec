import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartLineIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default `pill` list — muted track with a sliding white indicator. */
export const Default: Story = {
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

/** The `list` variant drops the track for an underline on the active tab. */
export const List: Story = {
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
