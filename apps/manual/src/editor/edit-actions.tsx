import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { FilePlus, GearSix, PencilSimple } from "@phosphor-icons/react";
import { useState } from "react";
import { useSnapshot } from "../api/snapshot-provider";
import { useEditMode } from "./edit-mode";
import { NewPageDialog } from "./new-page-dialog";
import { useEditorSession } from "./session";
import { SettingsDialog } from "./settings-dialog";

/** The two ways into the editor: edit this page, or start a new one. */

export function PageActions({ path }: { path: string }) {
  const { store, kind } = useEditorSession();
  const { enter } = useEditMode();
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!store) return null;

  return (
    <div className="mb-3 flex items-center justify-end gap-1">
      {kind === "github" ? (
        <IconButton
          aria-label="GitHub token"
          onClick={() => setSettingsOpen(true)}
          size="sm"
          variant="ghost"
        >
          <GearSix aria-hidden />
        </IconButton>
      ) : null}
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
      <SettingsDialog onOpenChange={setSettingsOpen} open={settingsOpen} />
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
