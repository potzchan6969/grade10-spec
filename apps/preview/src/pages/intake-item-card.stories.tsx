import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  GRADING_IN_PROGRESS_ITEMS,
  type IntakeItemRow,
  VAULT_COMPLETED_ITEMS,
  VAULT_IN_PROGRESS_ITEMS,
} from "./intake-content";
import { IntakeItemCard } from "./intake-item-card";
import { INTAKE_TRACKER_HREF } from "./vault-content";
import { PageHeader, VaultPageShell } from "./vault-shared";

function IntakeItemCardPage({ item }: { item: IntakeItemRow }) {
  return (
    <VaultPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={INTAKE_TRACKER_HREF}>
          Submissions
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>{item.name}</BreadcrumbItem>
      </Breadcrumbs>

      <PageHeader title={item.name} description={item.itemId} />

      <IntakeItemCard item={item} />
    </VaultPageShell>
  );
}

const meta = {
  title: "Pages/Submissions/Item Card",
  component: IntakeItemCardPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    item: VAULT_IN_PROGRESS_ITEMS[0],
  },
} satisfies Meta<typeof IntakeItemCardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InScanning: Story = {
  args: {
    item: VAULT_IN_PROGRESS_ITEMS[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: "Submissions" })).toBeVisible();
    expect(canvas.getAllByText("ITM-99482-01")).toHaveLength(2);
    expect(canvas.getByText("In Scanning")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Vault receipt" }),
    ).toBeDisabled();
  },
};

export const Vaulted: Story = {
  args: {
    item: VAULT_COMPLETED_ITEMS[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Vaulted")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Vault receipt" })).toBeEnabled();
    expect(
      canvas.getByRole("button", { name: "View in vault portfolio" }),
    ).toBeVisible();
  },
};

export const GradingInTransit: Story = {
  args: {
    item: GRADING_IN_PROGRESS_ITEMS[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("ITM-99110-01")).toHaveLength(2);
    expect(canvas.getByText("In Transit")).toBeVisible();
    expect(canvas.queryByRole("button", { name: "Vault receipt" })).toBeNull();
  },
};
