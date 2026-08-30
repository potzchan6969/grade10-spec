import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { ArrowSquareOut, FloppyDisk, Trash } from "@phosphor-icons/react";
import type { ContentStore } from "./store";

/** The bar that says where a save goes, and lets it go there. */

export function EditorChrome({
  path,
  store,
  problemCount,
  saving,
  canSave,
  stages,
  onSave,
  onCancel,
  onDelete,
}: {
  path: string;
  store: ContentStore | null;
  problemCount: number;
  saving: boolean;
  canSave: boolean;
  /** Hosted: this save stages a draft in the browser and pushes nothing, so
   * the button says which of the two it is. */
  stages?: boolean;
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
            {stages ? " · staged in this browser until Push all" : null}
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
          type="button"
          variant="default"
        >
          {stages ? "Save draft" : "Save"}
        </Button>
      </div>
    </div>
  );
}
