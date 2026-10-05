import { Alert } from "@grade10/design-system/components/display/alert";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  INTAKE_FIXTURE,
  VAULT_PORTFOLIO_HREF,
  VAULT_PORTFOLIO_STORY_ID,
} from "./vault-content";
import { PageHeader, VaultPageShell } from "./vault-shared";
import { navigateToStory } from "./workbench-story-nav";

type TrackerPhase =
  | "registered"
  | "pre-check"
  | "signed"
  | "imaging"
  | "vaulted";

const PHASE_ORDER: TrackerPhase[] = [
  "registered",
  "pre-check",
  "signed",
  "imaging",
  "vaulted",
];

const PHASE_LABELS: Record<TrackerPhase, string> = {
  registered: "Registered",
  "pre-check": "Pre-check",
  signed: "Signed",
  imaging: "Imaging",
  vaulted: "Vaulted",
};

const PHASE_COPY: Record<TrackerPhase, string> = {
  registered: "Staff registered your items at the counter.",
  "pre-check": "Staff checking condition.",
  signed: "Custody signed on the counter iPad.",
  imaging: "Professional front and back HD scans in progress.",
  vaulted:
    "Digital twins are live in your portfolio. Vault Storage IDs assigned.",
};

function stepState(
  phase: TrackerPhase,
  current: TrackerPhase,
): "completed" | "progress" | "upcoming" {
  const pi = PHASE_ORDER.indexOf(phase);
  const ci = PHASE_ORDER.indexOf(current);
  if (pi < ci) return "completed";
  if (pi === ci) return "progress";
  return "upcoming";
}

function itemLine(item: (typeof INTAKE_FIXTURE.items)[number]): string {
  if (item.condition === "Graded" && item.cert) {
    return `${item.grade} · Cert ${item.cert}`;
  }
  return "Raw";
}

function VaultIntakeTrackerPage({ phase }: { phase: TrackerPhase }) {
  const isDone = phase === "vaulted";

  return (
    <VaultPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={VAULT_PORTFOLIO_HREF}>Vault</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Intake tracker</BreadcrumbItem>
      </Breadcrumbs>

      <PageHeader
        title="Intake tracker"
        description={`Case ${INTAKE_FIXTURE.caseId} · ${INTAKE_FIXTURE.items.length} items · ${INTAKE_FIXTURE.shop}`}
      />

      {isDone ? (
        <Alert
          dismissible={false}
          status="success"
          title="Securely vaulted"
          description="Your items are in the portfolio with HD scans and Vault IDs."
        />
      ) : (
        <Alert
          dismissible={false}
          status="default"
          title={`Now: ${PHASE_LABELS[phase]}`}
          description={PHASE_COPY[phase]}
        />
      )}

      <div className="overflow-x-auto rounded-(--radius-2xl) border border-border bg-card p-4 sm:p-5">
        <Stepper>
          {PHASE_ORDER.map((p, index) => (
            <Step
              key={p}
              label={PHASE_LABELS[p]}
              state={stepState(p, phase)}
              showLeadingConnector={index > 0}
              showTrailingConnector={index < PHASE_ORDER.length - 1}
            />
          ))}
        </Stepper>
      </div>

      <section
        className="flex flex-col gap-3 rounded-(--radius-2xl) border border-border p-5"
        aria-labelledby="case-items"
      >
        <h2 className="font-heading text-lg font-medium" id="case-items">
          Registered items
        </h2>
        <ul className="flex flex-col divide-y divide-border">
          {INTAKE_FIXTURE.items.map((item) => (
            <li
              key={item.name}
              className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0"
            >
              <Text weight="medium">{item.name}</Text>
              <Text size="sm" tone="secondary">
                {itemLine(item)}
              </Text>
            </li>
          ))}
        </ul>
      </section>

      {isDone ? (
        <Button
          type="button"
          onClick={() => navigateToStory(VAULT_PORTFOLIO_STORY_ID)}
        >
          Open portfolio
        </Button>
      ) : null}
    </VaultPageShell>
  );
}

const meta = {
  title: "Pages/Vault/Intake Tracker",
  component: VaultIntakeTrackerPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { phase: "registered" as TrackerPhase },
} satisfies Meta<typeof VaultIntakeTrackerPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Registered: Story = {
  args: { phase: "registered" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Intake tracker" }),
    ).toBeVisible();
    expect(canvas.getByText(/Now: Registered/)).toBeVisible();
  },
};

export const PreCheck: Story = { args: { phase: "pre-check" } };
export const Signed: Story = { args: { phase: "signed" } };
export const Imaging: Story = { args: { phase: "imaging" } };
export const Vaulted: Story = {
  args: { phase: "vaulted" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Open portfolio" }),
    ).toBeVisible();
  },
};
