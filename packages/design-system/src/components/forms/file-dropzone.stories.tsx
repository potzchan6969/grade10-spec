import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  FileDropzone,
  FileDropzoneFileList,
  FileDropzoneTarget,
  FILE_DROPZONE_MIB,
  type FileDropzoneItem,
} from "./file-dropzone";

const COPY = {
  idleTitle: "Drop files here or choose files",
  idleDescription: "PDF, PNG, JPG, or HEIC. Up to 3 files, 5 MB each, 15 MB total.",
  chooseFiles: "Choose Files",
  converting: "Converting HEIC…",
  removeFile: "Remove file",
} as const;

const LIMITS = {
  minFiles: 1,
  maxFiles: 3,
  maxBytesPerFile: 5 * FILE_DROPZONE_MIB,
  maxBytesTotal: 15 * FILE_DROPZONE_MIB,
} as const;

const ACCEPT =
  ".pdf,.png,.jpg,.jpeg,.heic,.heif,application/pdf,image/png,image/jpeg,image/heic,image/heif";
const unsupportedReject = fn();

function sampleItem(
  name: string,
  type: string,
  size = 120_000,
): FileDropzoneItem {
  const file = new File([new Uint8Array(size)], name, { type });
  return { id: name, file, name };
}

function targetInput(canvasElement: HTMLElement): HTMLInputElement {
  const input = within(canvasElement)
    .getByRole("button", { name: "Choose Files" })
    .closest('[data-slot="file-dropzone-target"]')
    ?.querySelector('input[type="file"]');
  expect(input).toBeTruthy();
  return input as HTMLInputElement;
}

function ComposedDemo() {
  const [files, setFiles] = useState<FileDropzoneItem[]>([]);
  return (
    <VStack className="w-full max-w-md" gap="sm" hAlign="stretch">
      <Text size="sm" tone="secondary">
        Target and file list composed separately.
      </Text>
      <FileDropzoneTarget
        accept={ACCEPT}
        copy={COPY}
        files={files}
        limits={LIMITS}
        onChange={setFiles}
        onReject={fn()}
      />
      <FileDropzoneFileList
        copy={COPY}
        files={files}
        onRemove={(id) => setFiles((held) => held.filter((f) => f.id !== id))}
      />
    </VStack>
  );
}

function CombinedDemo() {
  const [files, setFiles] = useState<FileDropzoneItem[]>([]);
  return (
    <FileDropzone
      accept={ACCEPT}
      copy={COPY}
      files={files}
      limits={LIMITS}
      onChange={setFiles}
      onReject={fn()}
    />
  );
}

const meta = {
  title: "Components/FileDropzone",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Drop target only — no file rows. */
export const TargetOnly: Story = {
  name: "Target",
  render: () => (
    <FileDropzoneTarget
      accept={ACCEPT}
      copy={COPY}
      files={[]}
      limits={LIMITS}
      onChange={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Drop files here/i)).toBeVisible();
    expect(canvas.getByRole("button", { name: "Choose Files" })).toBeVisible();
  },
};

/** File list with image and PDF rows. */
export const FileList: Story = {
  name: "File list",
  render: () => (
    <FileDropzoneFileList
      copy={COPY}
      files={[
        sampleItem("receipt.jpg", "image/jpeg"),
        sampleItem("transfer.pdf", "application/pdf"),
      ]}
      onRemove={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("receipt.jpg")).toBeVisible();
    expect(canvas.getByText("transfer.pdf")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Remove file: receipt.jpg" }),
    ).toBeVisible();
  },
};

/** Target + list composed by the consumer. */
export const Composed: Story = {
  name: "Composed",
  render: () => <ComposedDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const file = new File(["proof"], "slip.pdf", { type: "application/pdf" });
    await userEvent.upload(targetInput(canvasElement), file);
    expect(canvas.getByText("slip.pdf")).toBeVisible();
  },
};

/** Convenience wrapper that owns both parts. */
export const Combined: Story = {
  name: "Combined",
  render: () => <CombinedDemo />,
};

/** Unsupported files are rejected without changing the controlled list. */
export const RejectsUnsupportedFile: Story = {
  name: "Rejects unsupported file",
  render: () => {
    const [files, setFiles] = useState<FileDropzoneItem[]>([]);
    return (
      <FileDropzoneTarget
        accept={ACCEPT}
        copy={COPY}
        files={files}
        limits={LIMITS}
        onChange={setFiles}
        onReject={unsupportedReject}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.upload(
      targetInput(canvasElement),
      new File(["not a proof"], "notes.txt", { type: "text/plain" }),
      { applyAccept: false },
    );
    expect(canvas.queryByText("notes.txt")).not.toBeInTheDocument();
    expect(unsupportedReject).toHaveBeenCalledWith("type", "notes.txt");
  },
};
