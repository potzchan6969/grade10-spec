import { VStack } from "@grade10/design-system/components/layout/vstack";
import { ArrowsClockwise, FilePdf, X } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  type AttachmentState,
  AttachmentTitle,
  AttachmentTrigger,
} from "./attachment";

function Row({
  name,
  description,
  state = "done",
}: {
  name: string;
  description: string;
  state?: AttachmentState;
}) {
  return (
    <Attachment className="w-full" state={state}>
      <AttachmentMedia aria-hidden>
        <FilePdf size={16} weight="regular" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{name}</AttachmentTitle>
        <AttachmentDescription>{description}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        {state === "error" ? (
          <AttachmentAction
            aria-label={`Retry ${name}`}
            onClick={fn()}
            type="button"
          >
            <ArrowsClockwise aria-hidden weight="regular" />
          </AttachmentAction>
        ) : null}
        <AttachmentAction
          aria-label={`Remove ${name}`}
          onClick={fn()}
          type="button"
        >
          <X aria-hidden weight="regular" />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}

const meta = {
  title: "Design System/Display/Attachment",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Every upload state — idle, uploading, processing, error, done. */
export const States: Story = {
  name: "States",
  render: () => (
    <VStack className="w-full max-w-md" gap="sm" hAlign="stretch">
      <Row description="Dragged, not yet added" name="draft.pdf" state="idle" />
      <Row
        description="Uploading · 64%"
        name="sales-dashboard.pdf"
        state="uploading"
      />
      <Row
        description="Converting HEIC…"
        name="photo.heic"
        state="processing"
      />
      <Row
        description="Each file must be 5 MB or less."
        name="too-big.pdf"
        state="error"
      />
      <Row description="PDF · 2.4 MB" name="receipt.pdf" />
    </VStack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rows = canvasElement.querySelectorAll('[data-slot="attachment"]');
    expect(rows).toHaveLength(5);
    expect(canvas.getByText("Converting HEIC…")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Remove receipt.pdf" }),
    ).toBeVisible();
  },
};

/** Compact horizontal strip with snapping scroll. */
export const Group: Story = {
  name: "Group",
  render: () => (
    <AttachmentGroup aria-label="Attachments" className="max-w-sm">
      {["a.pdf", "b.pdf", "c.pdf", "d.pdf", "e.pdf", "f.pdf"].map((name) => (
        <Attachment key={name} size="sm">
          <AttachmentMedia aria-hidden>
            <FilePdf size={16} weight="regular" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{name}</AttachmentTitle>
          </AttachmentContent>
        </Attachment>
      ))}
    </AttachmentGroup>
  ),
};

/** Full-card trigger — the row opens while actions stay clickable. */
export const Trigger: Story = {
  name: "Trigger",
  render: () => (
    <Attachment className="w-full max-w-md">
      <AttachmentMedia aria-hidden>
        <FilePdf size={16} weight="regular" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>invoice.pdf</AttachmentTitle>
        <AttachmentDescription>PDF · 1.2 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentTrigger aria-label="Open invoice.pdf" onClick={fn()} />
      <AttachmentActions>
        <AttachmentAction
          aria-label="Remove invoice.pdf"
          onClick={fn()}
          type="button"
        >
          <X aria-hidden weight="regular" />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
};
