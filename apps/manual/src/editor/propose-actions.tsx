import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Lightbulb, Lock } from "@phosphor-icons/react";
import { useState } from "react";
import type { SpecEntry } from "../api/types";
import { ProposeDialog } from "./propose-dialog";
import { useEditorSession } from "./session";

/**
 * The two ways to start a proposal: quietly, from the row being read, and
 * plainly, from the page's own header. Both open the same dialog with what the
 * surface already knows about itself already cited.
 *
 * A session that cannot write still sees them, wearing a lock. Hiding the
 * control hid the whole loop: a reader with no token had no way to learn that
 * proposing exists, let alone what it would take. The dialog behind the lock
 * says what proposing does and where the access comes from.
 */

type ProposeProps = {
  cites: string[];
  spec?: SpecEntry;
};

const LOCKED = "Propose a change — needs a GitHub token with write access";

export function ProposeRowAction({
  cites,
  spec,
  label,
}: ProposeProps & { label: string }) {
  const { store } = useEditorSession();
  const [open, setOpen] = useState(false);

  if (!store) return null;
  const locked = store.readOnly !== null;
  const title = locked ? LOCKED : label;

  return (
    <>
      <IconButton
        aria-label={title}
        className="opacity-0 transition-opacity focus-visible:opacity-100 group-hover/anchor:opacity-100"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        size="xs"
        title={title}
        variant="ghost"
      >
        {locked ? <Lock aria-hidden /> : <Lightbulb aria-hidden />}
      </IconButton>
      {open ? (
        <ProposeDialog cites={cites} onOpenChange={setOpen} open spec={spec} />
      ) : null}
    </>
  );
}

export function ProposePageAction({ cites, spec }: ProposeProps) {
  const { store } = useEditorSession();
  const [open, setOpen] = useState(false);

  if (!store) return null;
  const locked = store.readOnly !== null;

  return (
    <>
      <Button
        leading={locked ? <Lock aria-hidden /> : <Lightbulb aria-hidden />}
        onClick={() => setOpen(true)}
        size="sm"
        title={locked ? LOCKED : "Propose a change to this page's spec"}
        type="button"
        variant="ghost"
      >
        Propose
      </Button>
      {open ? (
        <ProposeDialog cites={cites} onOpenChange={setOpen} open spec={spec} />
      ) : null}
    </>
  );
}
