import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  FILE_DROPZONE_MIB,
  FileDropzone,
  FileDropzoneFileList,
  type FileDropzoneItem,
  FileDropzoneTarget,
} from "./file-dropzone";

const COPY = {
  idleTitle: "Drop files here or choose files",
  idleDescription:
    "PDF, PNG, JPG, or HEIC. Up to 3 files, 5 MB each, 15 MB total.",
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
const rejectionSpy = fn();

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
  title: "Design System/Forms/FileDropzone",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Drop target only — no file rows. */
export const TargetOnly: Story = {
  parameters: {
    verification: { caseId: "vc_099a566b-8969-45ae-a663-62319053cd93" },
  },
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
  parameters: {
    verification: { caseId: "vc_d2faba77-e98c-4b17-b3ba-18c79d7a316e" },
  },
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

/** Row lifecycle — processing pulse, error tint, ready. */
export const FileStates: Story = {
  parameters: {
    verification: { caseId: "vc_a767e185-cfaa-4a0a-884f-9f4bc2d54491" },
  },
  name: "File states",
  render: () => (
    <FileDropzoneFileList
      copy={COPY}
      files={[
        {
          ...sampleItem("photo-from-iphone.heic", "image/heic"),
          status: "processing",
          statusMessage: "Converting HEIC…",
        },
        {
          ...sampleItem("too-big.pdf", "application/pdf"),
          status: "error",
          statusMessage: "Each file must be 5 MB or less.",
        },
        sampleItem("receipt.jpg", "image/jpeg"),
      ]}
      onRemove={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rows = canvasElement.querySelectorAll(
      '[data-slot="file-dropzone-file"]',
    );
    expect(rows[0]?.getAttribute("data-state")).toBe("processing");
    expect(rows[1]?.getAttribute("data-state")).toBe("error");
    expect(rows[2]?.getAttribute("data-state")).toBe("done");
    expect(canvas.getByText("Converting HEIC…")).toBeVisible();
    expect(canvas.getByText("Each file must be 5 MB or less.")).toBeVisible();
  },
};

/** Target + list composed by the consumer. */
export const Composed: Story = {
  parameters: {
    verification: { caseId: "vc_aeb4dccd-8ea2-4007-bd33-bddc72252b78" },
  },
  name: "Composed",
  render: () => <ComposedDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const file = new File(["proof"], "slip.pdf", { type: "application/pdf" });
    await userEvent.upload(targetInput(canvasElement), file);
    await waitFor(() => {
      expect(canvas.getByText("slip.pdf")).toBeVisible();
    });
  },
};

/** Convenience wrapper that owns both parts. */
export const Combined: Story = {
  parameters: {
    verification: { caseId: "vc_001a686b-91fc-4492-aaca-838a77027eab" },
  },
  name: "Combined",
  render: () => <CombinedDemo />,
};

/** Oversized files are rejected without changing the controlled list. */
export const RejectsOversizedFile: Story = {
  parameters: {
    verification: { caseId: "vc_9149c8dd-2f7e-4336-b071-1ad61b9b176e" },
  },
  name: "Rejects oversized file",
  render: () => {
    const [files, setFiles] = useState<FileDropzoneItem[]>([]);
    return (
      <FileDropzoneTarget
        accept={ACCEPT}
        copy={COPY}
        files={files}
        limits={LIMITS}
        onChange={setFiles}
        onReject={rejectionSpy}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.upload(
      targetInput(canvasElement),
      new File([new Uint8Array(LIMITS.maxBytesPerFile + 1)], "oversized.pdf", {
        type: "application/pdf",
      }),
    );
    expect(canvas.queryByText("oversized.pdf")).not.toBeInTheDocument();
    expect(rejectionSpy).toHaveBeenCalledWith(
      "too_large_file",
      "Each file must be 5 MB or less.",
    );
  },
};
