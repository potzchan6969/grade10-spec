import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { useEffect, useState } from "react";
import { useSnapshotReload } from "../api/snapshot-provider";
import { noteWrite, onStoreWrite, useEditorSession } from "./session";
import { type DirtyState, describeCause } from "./store";

/**
 * Dev only. The working tree is the only place a local edit lives until it is
 * committed, so the bar appears the moment `manual/` is dirty and stays until
 * it is not.
 */

const CLEAN: DirtyState = { dirty: false, files: [] };

export function CommitBar() {
  const { store } = useEditorSession();
  const reload = useSnapshotReload();
  const [state, setState] = useState<DirtyState>(CLEAN);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const read = store?.dirty;
    if (!read || !store) {
      setState(CLEAN);
      return;
    }
    let live = true;
    const look = () => {
      read
        .call(store)
        .then((next) => {
          if (live) setState(next);
        })
        .catch((cause: unknown) => {
          console.error("manual: cannot read the working tree", cause);
        });
    };
    look();
    window.addEventListener("focus", look);
    const stopWatching = onStoreWrite(look);
    return () => {
      live = false;
      stopWatching();
      window.removeEventListener("focus", look);
    };
  }, [store]);

  const commit = store?.commit;
  if (!commit || !store || !state.dirty) return null;

  const send = () => {
    setBusy(true);
    setError(null);
    commit
      .call(store, message.trim())
      .then(() => {
        setMessage("");
        noteWrite();
        reload();
      })
      .catch((cause: unknown) => {
        console.error("manual: commit failed", cause);
        setError(describeCause(cause));
      })
      .finally(() => setBusy(false));
  };

  return (
    <div
      className="sticky bottom-0 z-40 border-border border-t bg-background/95 px-4 py-2 backdrop-blur lg:px-12"
      data-slot="manual-commit-bar"
    >
      <div className="mx-auto flex w-full max-w-[100rem] flex-wrap items-center gap-3">
        <details className="min-w-0">
          <summary className="cursor-pointer text-secondary-foreground text-xs">
            {state.files.length} {state.files.length === 1 ? "file" : "files"}{" "}
            changed under manual/
          </summary>
          <ul className="mt-1 max-h-32 overflow-y-auto">
            {state.files.map((file) => (
              <li
                className="font-mono text-secondary-foreground text-xs"
                key={file}
              >
                {file}
              </li>
            ))}
          </ul>
        </details>

        <div className="ml-auto flex min-w-0 flex-1 items-center gap-2 sm:max-w-lg">
          <TextInput
            aria-label="Commit message"
            className="min-w-0 flex-1"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="docs(manual): what changed"
            value={message}
          />
          <Button
            disabled={message.trim() === ""}
            loading={busy}
            onClick={send}
            size="sm"
            type="button"
          >
            Commit
          </Button>
        </div>

        {error ? (
          <Text as="p" className="w-full text-destructive" size="xs">
            {error}
          </Text>
        ) : null}
      </div>
    </div>
  );
}
