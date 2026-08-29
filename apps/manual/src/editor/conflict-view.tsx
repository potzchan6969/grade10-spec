import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Warning } from "@phosphor-icons/react";
import type { StoredFile } from "./store";

/** Two writers, both sources shown. Nothing here overwrites on its own. */

export type Conflict = {
  mine: string;
  theirs: StoredFile | null;
};

export function ConflictView({
  conflict,
  onTakeTheirs,
  onRetry,
  onCancel,
  busy,
}: {
  conflict: Conflict;
  onTakeTheirs: () => void;
  onRetry: () => void;
  onCancel: () => void;
  busy: boolean;
}) {
  const theirs = conflict.theirs;

  return (
    <section className="mb-6 rounded-(--radius-2xl) border border-warning-border bg-warning/10 px-4 py-4">
      <div className="flex items-center gap-2 text-warning-foreground">
        <Warning aria-hidden size={18} weight="fill" />
        <Text as="span" size="sm" weight="bold">
          This page changed while you were editing it
        </Text>
      </div>
      <Text as="p" className="mt-1" size="sm" tone="secondary">
        {theirs
          ? "Nothing has been written. Read both, then choose."
          : "The page is gone from the store — it was deleted or renamed while you were editing."}
      </Text>

      {theirs ? (
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <SourcePane label="Yours" source={conflict.mine} />
          <SourcePane label="On disk now" source={theirs.source} />
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {theirs ? (
          <>
            <Button
              disabled={busy}
              onClick={onTakeTheirs}
              size="sm"
              type="button"
              variant="outline"
            >
              Take theirs and re-edit
            </Button>
            <Button
              loading={busy}
              onClick={onRetry}
              size="sm"
              type="button"
              variant="default"
            >
              Retry over theirs
            </Button>
          </>
        ) : null}
        <Button
          disabled={busy}
          onClick={onCancel}
          size="sm"
          type="button"
          variant="ghost"
        >
          Keep editing
        </Button>
      </div>
    </section>
  );
}

function SourcePane({ label, source }: { label: string; source: string }) {
  return (
    <div className="min-w-0">
      <Text as="p" className="mb-1 font-medium" size="xs" tone="secondary">
        {label}
      </Text>
      <pre className="max-h-72 overflow-auto rounded-(--radius-xl) border border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed">
        {source}
      </pre>
    </div>
  );
}
