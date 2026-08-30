import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { FilePlus, GearSix, PencilSimple } from "@phosphor-icons/react";
import { useState } from "react";
import { useSnapshot } from "../api/snapshot-provider";
import { useManualIndex } from "../api/use-manual-index";
import { useEditMode } from "./edit-mode";
import { NewPageDialog } from "./new-page-dialog";
import { ProposePageAction } from "./propose-actions";
import { useEditorSession } from "./session";
import { SettingsDialog } from "./settings-dialog";

/** The three ways into the editor: edit this page, start a new one, or propose
 * a change to the spec this page documents. */

export function PageActions({ path }: { path: string }) {
  const { store, kind } = useEditorSession();
  const index = useManualIndex();
  const { enter } = useEditMode();
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!store) return null;

  // The header proposes about the page's own capability, so it cites the one
  // id the page names. A page without a spec proposes about nothing in
  // particular, and says so by citing nothing.
  const specId = index.pageByPath.get(path)?.ast?.frontmatter.spec;

  return (
    <div className="mb-3 flex items-center justify-end gap-1">
      <ProposePageAction
        cites={specId ? [specId] : []}
        spec={specId ? index.specById.get(specId) : undefined}
      />
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
