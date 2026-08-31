import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { FilePlus, GearSix, PencilSimple } from "@phosphor-icons/react";
import { useState } from "react";
import { useSnapshot } from "../api/snapshot-provider";
import { relativeTime } from "../api/time";
import { useManualIndex } from "../api/use-manual-index";
import { ConfirmDialog } from "./confirm-dialog";
import { discardDraft, type Staged, useDrafts } from "./drafts";
import { useEditMode } from "./edit-mode";
import { NewPageDialog } from "./new-page-dialog";
import { ProposePageAction } from "./propose-actions";
import { useEditorSession } from "./session";
import { SettingsDialog } from "./settings-dialog";
import {
  openSettings,
  setSettingsOpen,
  useSettingsOpen,
} from "./settings-open";

/** The three ways into the editor: edit this page, start a new one, or propose
 * a change to the spec this page documents. */

export function PageActions({ path }: { path: string }) {
  const { store, kind } = useEditorSession();
  const index = useManualIndex();
  const { enter } = useEditMode();
  const staged = useDrafts().byPath.get(path);
  // The dialog is mounted here and opened from anywhere — a locked Propose
  // control says "Settings" and has to mean this one.
  const settingsOpen = useSettingsOpen();

  if (!store) return null;

  // The header proposes about the page's own capability, so it cites the one
  // id the page names. A page without a spec proposes about nothing in
  // particular, and says so by citing nothing.
  const specId = index.pageByPath.get(path)?.ast?.frontmatter.spec;

  return (
    <div className="mb-3 flex flex-wrap items-center justify-end gap-1">
      {staged ? <DraftMark staged={staged} /> : null}
      <ProposePageAction
        cites={specId ? [specId] : []}
        spec={specId ? index.specById.get(specId) : undefined}
      />
      {kind === "github" ? (
        <IconButton
          aria-label="GitHub sign-in"
          onClick={openSettings}
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

/** This page is not the page the store has — it is your staged draft, and it
 * is nowhere but this browser until the pending bar pushes it. */
function DraftMark({ staged }: { staged: Staged }) {
  const [discarding, setDiscarding] = useState(false);

  return (
    <div className="mr-auto flex min-w-0 items-center gap-2">
      <Badge size="sm" variant="warning">
        Draft
      </Badge>
      <Text as="span" className="truncate" size="xs" tone="secondary">
        staged {relativeTime(staged.stagedAt)}, not pushed
        {staged.moved ? " · changed under your draft" : ""}
      </Text>
      <Button
        onClick={() => setDiscarding(true)}
        size="sm"
        type="button"
        variant="ghost"
      >
        Discard
      </Button>
      <ConfirmDialog
        body={`${staged.path} goes back to what the store has. Nothing was pushed, so the draft is not recoverable.`}
        confirmLabel="Discard the draft"
        onConfirm={() => {
          discardDraft(staged.path);
          setDiscarding(false);
        }}
        onOpenChange={setDiscarding}
        open={discarding}
        title="Discard this draft?"
      />
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
