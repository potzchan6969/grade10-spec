import { Button } from "@grade10/design-system/components/forms/button";
import { FilePlus, PencilSimple } from "@phosphor-icons/react";
import { useState } from "react";
import { useSnapshot } from "../api/snapshot-provider";
import { useEditMode } from "./edit-mode";
import { NewPageDialog } from "./new-page-dialog";
import { ReadOnlyNotice } from "./read-only-notice";
import { useEditorSession } from "./session";

/** The way into the editor on a page: edit it. On the hosted build the button
 * is gone, and the notice stands where it would be. */

export function PageActions({ path }: { path: string }) {
  const { store } = useEditorSession();
  const { enter } = useEditMode();

  if (!store) {
    return <ReadOnlyNotice className="mb-3 text-right" />;
  }

  return (
    <div className="mb-3 flex flex-wrap items-center justify-end gap-1">
      <Button
        leading={<PencilSimple aria-hidden />}
        onClick={enter}
        size="sm"
        title={`Edit ${path}`}
        type="button"
        variant="outline"
      >
        Edit
      </Button>
    </div>
  );
}

export function NewPageAction() {
  const { store } = useEditorSession();
  const snapshot = useSnapshot();
  const [open, setOpen] = useState(false);

  // The picker is built from the snapshot's own taxonomy, so it has nothing to
  // offer until the snapshot lands.
  if (!store || snapshot.status !== "ready") return null;

  return (
    <>
      <Button
        className="w-full justify-start"
        leading={<FilePlus aria-hidden />}
        onClick={() => setOpen(true)}
        size="sm"
        type="button"
        variant="ghost"
      >
        New page
      </Button>
      {open ? <NewPageDialog onOpenChange={setOpen} open /> : null}
    </>
  );
}
