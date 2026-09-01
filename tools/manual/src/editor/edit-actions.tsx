import { Button } from "@grade10/design-system/components/forms/button";
import { FilePlus, PencilSimple } from "@phosphor-icons/react";
import { useState } from "react";
import { useSnapshot } from "../api/snapshot-provider";
import { useManualIndex } from "../api/use-manual-index";
import { useEditMode } from "./edit-mode";
import { NewPageDialog } from "./new-page-dialog";
import { ProposePageAction } from "./propose-actions";
import { ReadOnlyNotice } from "./read-only-notice";
import { useEditorSession } from "./session";

/** The two ways into the editor: edit this page, or propose a change to the
 * spec this page documents. On the hosted build both are gone, and the notice
 * stands where they would be — a promise the prose keeps making should not
 * outlive its buttons silently. */

export function PageActions({ path }: { path: string }) {
  const { store } = useEditorSession();
  const index = useManualIndex();
  const { enter } = useEditMode();

  if (!store) {
    return <ReadOnlyNotice className="mb-3 text-right" />;
  }

  // The header proposes about the page's own capability, so it cites the one
  // id the page names. A page without a spec proposes about nothing in
  // particular, and says so by citing nothing.
  const specId = index.pageByPath.get(path)?.ast?.frontmatter.spec;

  return (
    <div className="mb-3 flex flex-wrap items-center justify-end gap-1">
      <ProposePageAction
        cites={specId ? [specId] : []}
        spec={specId ? index.specById.get(specId) : undefined}
      />
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
