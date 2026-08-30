import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  ArrowSquareOut,
  FloppyDisk,
  Trash,
  WarningCircle,
} from "@phosphor-icons/react";
import { shortSha } from "../api/time";
import { REPO } from "./config";
import type { ContentStore, Staleness } from "./store";

/** The bar that says where a save goes, and lets it go there. */

export function EditorChrome({
  path,
  store,
  problemCount,
  saving,
  canSave,
  stale,
  onSave,
  onCancel,
  onDelete,
}: {
  path: string;
  store: ContentStore | null;
  problemCount: number;
  saving: boolean;
  canSave: boolean;
  /** Set once the pre-save check found the branch ahead of the snapshot; the
   * save button then asks for the second, deliberate click. */
  stale?: Staleness | null;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="sticky top-16 z-20 -mx-2 mb-6 rounded-(--radius-2xl) border border-border bg-background/90 px-3 py-2.5 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1">
          <Text as="p" className="font-mono" size="sm" weight="medium">
            {path}
          </Text>
          <Text as="p" className="truncate" size="xs" tone="secondary">
            {store?.label ?? "Looking for a store…"}
            {store?.reviewUrl ? (
              <>
                {" · "}
                <a
                  className="inline-flex items-center gap-1 underline hover:text-foreground"
                  href={store.reviewUrl}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  pull request
                  <ArrowSquareOut aria-hidden size={12} />
                </a>
              </>
            ) : null}
          </Text>
        </div>

        {problemCount > 0 ? (
          <Text as="span" className="text-destructive" size="xs">
            {problemCount} {problemCount === 1 ? "problem" : "problems"} to fix
          </Text>
        ) : null}

        {onDelete ? (
          <Button
            leading={<Trash aria-hidden />}
            onClick={onDelete}
            size="sm"
            type="button"
            variant="ghost"
          >
            Delete page
          </Button>
        ) : null}

        <Button onClick={onCancel} size="sm" type="button" variant="ghost">
          Cancel
        </Button>
        <Button
          disabled={!canSave}
          leading={<FloppyDisk aria-hidden />}
          loading={saving}
          onClick={onSave}
          size="sm"
          variant={stale ? "outline" : "default"}
          type="button"
        >
          {stale ? "Save anyway" : "Save"}
        </Button>
      </div>

      {stale ? (
        <div
          className="mt-2 flex items-start gap-2 rounded-(--radius-xl) border border-warning-border bg-warning/10 px-3 py-2"
          role="status"
        >
          <span className="mt-0.5 inline-flex text-warning-foreground">
            <WarningCircle aria-hidden size={14} />
          </span>
          <Text as="p" size="xs" tone="secondary">
            {REPO.defaultBranch} has moved past the snapshot this page was
            loaded from — it is now at{" "}
            <span className="font-mono">{shortSha(stale.head)}</span>. Saving
            writes this page over whatever landed since. Click save again to go
            ahead.
          </Text>
        </div>
      ) : null}
    </div>
  );
}
