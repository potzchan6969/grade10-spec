import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Alert } from "@grade10/design-system/components/display/alert";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckCircle, Printer } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  formatHkd,
  MANIFEST_FIXTURE,
  VAULT_PORTFOLIO_HREF,
  VAULT_TRACKER_STORY_ID,
} from "./vault-content";
import { PageHeader, VaultPageShell } from "./vault-shared";
import { navigateToStory } from "./workbench-story-nav";

function VaultSubmissionConfirmationPage() {
  const { submissionId, qrCode, email, phone, items, packingTips } =
    MANIFEST_FIXTURE;

  return (
    <VaultPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={VAULT_PORTFOLIO_HREF}>Vault</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Manifest</BreadcrumbItem>
      </Breadcrumbs>

      <Alert
        dismissible={false}
        status="success"
        title="Submission confirmed"
        description={`Print the Manifest for ${submissionId}, then pack and send.`}
      />

      <PageHeader
        title="Your Manifest"
        description="Packing slip goes inside the box. Shipping label goes outside when you ship."
        actions={
          <Button type="button" leading={<Printer aria-hidden size={18} />}>
            Download Manifest PDF
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <section
          className="flex flex-col gap-5 rounded-(--radius-2xl) border border-border bg-card p-5"
          aria-labelledby="packing-slip"
        >
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-xl font-medium" id="packing-slip">
              Packing slip
            </h2>
            <Text size="sm" tone="secondary">
              {email} · {phone}
            </Text>
          </div>

          <ul className="flex flex-col">
            {items.map((item) => (
              <li
                key={item.cert}
                className="flex flex-col gap-1 border-t border-border py-4 first:border-t-0 first:pt-0"
              >
                <Text weight="medium">{item.name}</Text>
                <Text size="sm" tone="secondary">
                  {item.grade} · Cert {item.cert}
                </Text>
                <Text className="tabular-nums" size="sm" weight="medium">
                  Declared {formatHkd(item.declaredHkd)}
                </Text>
              </li>
            ))}
          </ul>

          <div className="rounded-(--radius-lg) bg-muted p-4">
            <Text size="sm" weight="medium">
              Intake checklist (facility)
            </Text>
            <ul className="mt-2 flex flex-col gap-1.5">
              {[
                "Cert / serial match",
                "Physical condition",
                "Staff sign-off",
              ].map((line) => (
                <li key={line}>
                  <Text size="sm" tone="secondary">
                    ☐ {line}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="flex flex-col items-center gap-3 rounded-(--radius-2xl) border border-border bg-card p-5 text-center lg:sticky lg:top-6 lg:self-start">
          <div
            aria-hidden
            className="flex size-44 items-center justify-center rounded-(--radius-lg) border-2 border-dashed border-border bg-muted font-mono text-xs text-muted-foreground"
          >
            QR CODE
          </div>
          <Text className="break-all font-mono" size="xs" tone="secondary">
            {qrCode}
          </Text>
          <Text size="sm" weight="medium">
            Scan at intake
          </Text>
        </aside>
      </div>

      <section className="flex flex-col gap-4" aria-labelledby="pack-howto">
        <h2 className="font-heading text-xl font-medium" id="pack-howto">
          Packing checklist
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2">
          {packingTips.map((tip, index) => (
            <li
              key={tip}
              className="flex gap-3 rounded-(--radius-lg) border border-border p-3"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium tabular-nums">
                {index + 1}
              </span>
              <Text className="self-center" size="sm">
                {tip}
              </Text>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          leading={<CheckCircle aria-hidden size={18} />}
          onClick={() => navigateToStory(VAULT_TRACKER_STORY_ID)}
        >
          Track this submission
        </Button>
        <Button type="button" variant="secondary">
          Download Manifest PDF
        </Button>
      </div>
    </VaultPageShell>
  );
}

const meta = {
  title: "Pages/Vault/Submission Confirmation",
  component: VaultSubmissionConfirmationPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof VaultSubmissionConfirmationPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Your Manifest" }),
    ).toBeVisible();
    expect(
      canvas.getAllByRole("button", { name: "Download Manifest PDF" }).length,
    ).toBeGreaterThan(0);
  },
};
