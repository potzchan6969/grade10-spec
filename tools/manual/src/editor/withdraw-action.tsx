import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Trash } from "@phosphor-icons/react";
import { useState } from "react";
import { useSnapshotReload } from "../api/snapshot-provider";
import type { ChangeEntry } from "../api/types";
import { ConfirmDialog } from "./confirm-dialog";
import { useEditorSession } from "./session";
import { describeCause } from "./store";

/** Taking a proposal back — whoever is at the dev server's keyboard may. */
export function WithdrawAction({ change }: { change: ChangeEntry }) {
  const { store } = useEditorSession();
  const reload = useSnapshotReload();
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!store) return null;

  const withdraw = () => {
    setBusy(true);
    setError(null);
    store
      .withdraw(change.id)
      .then(() => {
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
