import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Lightbulb } from "@phosphor-icons/react";
import { useState } from "react";
import type { SpecEntry } from "../api/types";
import { ProposeDialog } from "./propose-dialog";
import { useEditorSession } from "./session";

/**
 * The two ways to start a proposal: quietly, from the row being read, and
 * plainly, from the page's own header. Both open the same dialog with what the
 * surface already knows about itself already cited.
 *
 * Neither shows for a session that cannot write — a control whose only outcome
 * is a refusal is noise on every requirement in the manual.
 */

type ProposeProps = {
  cites: string[];
  spec?: SpecEntry;
};

export function ProposeRowAction({
  cites,
  spec,
  label,
}: ProposeProps & { label: string }) {
  const { store } = useEditorSession();
  const [open, setOpen] = useState(false);

  if (!store || store.readOnly) return null;

  return (
    <>
      <IconButton
        aria-label={label}
        className="opacity-0 transition-opacity focus-visible:opacity-100 group-hover/anchor:opacity-100"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        size="xs"
        title={label}
        variant="ghost"
      >
        <Lightbulb aria-hidden />
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

  if (!store || store.readOnly) return null;

  return (
    <>
      <Button
        leading={<Lightbulb aria-hidden />}
        onClick={() => setOpen(true)}
        size="sm"
        title="Propose a change to this page's spec"
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
