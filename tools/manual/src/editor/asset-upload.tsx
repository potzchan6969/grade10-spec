import { Button } from "@grade10/design-system/components/forms/button";
import { UploadSimple } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { slugify } from "../api/paths";
import { useManualIndex } from "../api/use-manual-index";
import { useEditorSession } from "./session";
import { type ContentStore, describeCause } from "./store";

/** Uploads into the manual's `assets/` and hands back the `src` a block wants. */

function assetName(fileName: string, attempt: number): string {
  const dot = fileName.lastIndexOf(".");
  const stem = dot === -1 ? fileName : fileName.slice(0, dot);
  const ext = dot === -1 ? "" : fileName.slice(dot).toLowerCase();
  const slug = slugify(stem);
  return attempt === 0 ? `${slug}${ext}` : `${slug}-${attempt + 1}${ext}`;
}

async function upload(
  store: ContentStore,
  manualDir: string,
  file: File,
): Promise<string> {
  const assetDir = `${manualDir}/assets`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  // A name already taken is not an error — take the next one rather than
  // overwriting a file this editor never read.
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const name = assetName(file.name, attempt);
    const outcome = await store.writeBinary(`${assetDir}/${name}`, bytes, null);
    if (outcome.status === "ok") return `assets/${name}`;
  }
  throw new Error(`no free name for ${file.name} under ${assetDir}/`);
}

export function AssetUpload({
  onUploaded,
}: {
  onUploaded: (src: string) => void;
}) {
  const { store } = useEditorSession();
  const { manualDir } = useManualIndex();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = !store;

  return (
    <div className="flex flex-col gap-1">
      <input
        accept="image/*,.svg"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file || !store) return;
          setBusy(true);
          setError(null);
          upload(store, manualDir, file)
            .then(onUploaded)
            .catch((cause: unknown) => {
              console.error("manual: upload failed", cause);
              setError(describeCause(cause));
            })
            .finally(() => setBusy(false));
        }}
        ref={input}
        type="file"
      />
      <Button
        disabled={disabled}
        leading={<UploadSimple aria-hidden />}
        loading={busy}
        onClick={() => input.current?.click()}
        size="sm"
        type="button"
        variant="outline"
      >
        Upload an image
      </Button>
      {error ? <span className="text-destructive text-xs">{error}</span> : null}
    </div>
  );
}
