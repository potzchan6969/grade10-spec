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

export const Default: Story = {
  render: (args) => (
    <Tabs defaultValue="overview" className="w-80" {...args}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Your open positions across every market.
      </TabsContent>
      <TabsContent value="activity">Recently settled rounds.</TabsContent>
      <TabsContent value="settings">Notifications and display.</TabsContent>
    </Tabs>
  ),
};

/** The `line` list variant swaps the pill for an underline on the active tab. */
export const Line: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-80">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Your open positions across every market.
      </TabsContent>
      <TabsContent value="activity">Recently settled rounds.</TabsContent>
      <TabsContent value="settings">Notifications and display.</TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="overview" orientation="vertical" className="w-96">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Your open positions across every market.
      </TabsContent>
      <TabsContent value="activity">Recently settled rounds.</TabsContent>
      <TabsContent value="settings">Notifications and display.</TabsContent>
    </Tabs>
  ),
};

/** `data-icon` tightens the padding on the side the icon sits. */
export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-80">
      <TabsList>
        <TabsTrigger value="overview">
          <ChartLineIcon data-icon="inline-start" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="profile">
          <UserIcon data-icon="inline-start" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="settings">
          <SettingsIcon data-icon="inline-start" />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Your open positions across every market.
      </TabsContent>
      <TabsContent value="profile">Display name and avatar.</TabsContent>
      <TabsContent value="settings">Notifications and display.</TabsContent>
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
      <TabsContent value="overview">
        Your open positions across every market.
      </TabsContent>
      <TabsContent value="activity">Recently settled rounds.</TabsContent>
    </Tabs>
  ),
};
