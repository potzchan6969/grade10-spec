import { Badge } from "@grade10/design-system/components/display/badge";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { Trash } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, within } from "storybook/test";
import {
  VAULT_CONFIRMATION_STORY_ID,
  VAULT_PORTFOLIO_HREF,
} from "./vault-content";
import { PageHeader, ProposalBanner, VaultPageShell } from "./vault-shared";
import { navigateToStory } from "./workbench-story-nav";

type SlabDraft = {
  key: string;
  name: string;
  grader: string;
  cert: string;
  declared: string;
};

function emptySlab(key: string): SlabDraft {
  return { key, name: "", grader: "PSA", cert: "", declared: "" };
}

function VaultSubmitPage() {
  const [sendMethod, setSendMethod] = useState("ship");
  const [slabs, setSlabs] = useState<SlabDraft[]>([emptySlab("1")]);

  return (
    <VaultPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={VAULT_PORTFOLIO_HREF}>Vault</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Submit to Vault</BreadcrumbItem>
      </Breadcrumbs>

      <PageHeader
        title="Submit to Vault"
        description="Declare graded slabs, choose how you send them, then print a Manifest. We vault at Crown Fine Art."
      />

      <ProposalBanner title="Eligibility">
        Graded slabs only on day one. Raw / ungraded is Coming soon. Multi-item
        manifests are supported; ops may soft-limit to one item at launch.
      </ProposalBanner>

      <section className="flex flex-col gap-4" aria-labelledby="vault-items">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-medium" id="vault-items">
            Collectibles
          </h2>
          <Badge variant="info">Graded slab</Badge>
        </div>

        {slabs.map((slab, index) => (
          <div
            key={slab.key}
            className="flex flex-col gap-4 rounded-(--radius-2xl) border border-border bg-card p-4 sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <Text weight="medium">Slab {index + 1}</Text>
              {slabs.length > 1 ? (
                <IconButton
                  aria-label={`Remove slab ${index + 1}`}
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setSlabs((prev) => prev.filter((s) => s.key !== slab.key))
                  }
                >
                  <Trash aria-hidden size={18} />
                </IconButton>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextInput
                  label="Card / set name *"
                  autoComplete="off"
                  value={slab.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSlabs((prev) =>
                      prev.map((s) =>
                        s.key === slab.key ? { ...s, name: value } : s,
                      ),
                    );
                  }}
                />
              </div>
              <TextInput
                label="Grading company *"
                autoComplete="off"
                value={slab.grader}
                onChange={(e) => {
                  const value = e.target.value;
                  setSlabs((prev) =>
                    prev.map((s) =>
                      s.key === slab.key ? { ...s, grader: value } : s,
                    ),
                  );
                }}
              />
              <TextInput
                label="Cert number *"
                autoComplete="off"
                value={slab.cert}
                onChange={(e) => {
                  const value = e.target.value;
                  setSlabs((prev) =>
                    prev.map((s) =>
                      s.key === slab.key ? { ...s, cert: value } : s,
                    ),
                  );
                }}
              />
              <div className="sm:col-span-2">
                <TextInput
                  label="Declared insurance value (HKD) *"
                  prefix="HK$"
                  inputMode="decimal"
                  autoComplete="off"
                  value={slab.declared}
                  message="Used for intake insurance until an estimate is set"
                  onChange={(e) => {
                    const value = e.target.value;
                    setSlabs((prev) =>
                      prev.map((s) =>
                        s.key === slab.key ? { ...s, declared: value } : s,
                      ),
                    );
                  }}
                />
              </div>
            </div>
            <Text size="sm" tone="secondary">
              Type locked to Graded slab · Raw — Coming soon
            </Text>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setSlabs((prev) => [...prev, emptySlab(String(Date.now()))])
          }
        >
          Add another slab
        </Button>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="send-method">
        <h2 className="font-heading text-xl font-medium" id="send-method">
          How you will send
        </h2>
        <RadioList
          label="Send method"
          value={sendMethod}
          onValueChange={(value) => {
            if (value) setSendMethod(value);
          }}
        >
          <RadioCard
            value="ship"
            title="Ship to us"
            description="Print the Manifest: packing slip inside, prepaid insured label outside."
          />
          <RadioCard
            value="store"
            title="Drop at a Grade10 store"
            description="Bring the packed box with the packing slip. We move it to Crown Fine Art."
          />
        </RadioList>
      </section>

      <div className="sticky bottom-4 z-10 flex flex-wrap gap-3 rounded-(--radius-2xl) border border-border bg-background/95 p-3 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
        <Button
          type="button"
          onClick={() => navigateToStory(VAULT_CONFIRMATION_STORY_ID)}
        >
          Continue to Manifest
        </Button>
        <Text className="self-center" size="sm" tone="secondary">
          {slabs.length} {slabs.length === 1 ? "slab" : "slabs"} ·{" "}
          {sendMethod === "ship" ? "Ship" : "Store drop-off"}
        </Text>
      </div>
    </VaultPageShell>
  );
}

const meta = {
  title: "Pages/Vault/Submit",
  component: VaultSubmitPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof VaultSubmitPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Submit to Vault" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Add another slab" }),
    ).toBeVisible();
    expect(canvas.getByText("Ship to us")).toBeVisible();
  },
};
