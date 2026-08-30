import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useSnapshotReload } from "../api/snapshot-provider";
import type { ChangeEntry } from "../api/types";
import { ConfirmDialog } from "./confirm-dialog";
import { noteWrite, useEditorSession } from "./session";
import { describeCause } from "./store";

/**
 * Taking a proposal back. The dev store lets whoever is at the keyboard; the
 * hosted one lets the author named in the proposal, and the store refuses the
 * rest — this only decides whether to offer the control, and the refusal that
 * matters happens at the transport, where the files are.
 */
export function WithdrawAction({ change }: { change: ChangeEntry }) {
  const { store, kind } = useEditorSession();
  const reload = useSnapshotReload();
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Whether this is the reader's own proposal turns on who the token belongs
  // to, and main mode has had no other reason to ask. One question a session,
  // and the answer is remembered.
  useEffect(() => {
    if (kind !== "github" || !store || store.readOnly || store.author) return;
    store.identity?.().catch((cause: unknown) => {
      console.warn("manual: cannot tell who this token belongs to", cause);
    });
  }, [kind, store]);

  const mine =
    kind === "local" || (!!store?.author && store.author === change.author);
  if (!store || store.readOnly || !mine) return null;

  const withdraw = () => {
    setBusy(true);
    setError(null);
    store
      .withdraw(change.id)
      .then(() => {
        noteWrite();
        reload();
        setAsking(false);
      })
      .catch((cause: unknown) => {
        console.error(`manual: cannot withdraw ${change.id}`, cause);
        setError(describeCause(cause));
      })
      .finally(() => setBusy(false));
  };

  return (
    <>
      <Button
        leading={<Trash aria-hidden />}
        onClick={() => setAsking(true)}
        size="sm"
        type="button"
        variant="ghost"
      >
        Withdraw
      </Button>
      {error ? (
        <Text as="span" className="text-destructive" size="xs">
          {error}
        </Text>
      ) : null}
      <ConfirmDialog
        body={`“${change.title}” and its two files leave the store in one commit. Nothing else is touched.`}
        busy={busy}
        confirmLabel="Withdraw it"
        onConfirm={withdraw}
        onOpenChange={setAsking}
        open={asking}
        title={`Withdraw ${change.id}?`}
      />
    </>
  );
}
