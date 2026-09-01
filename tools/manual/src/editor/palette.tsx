import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { Plus } from "@phosphor-icons/react";
import { useState } from "react";
import { blockHint, blockLabel } from "./descriptions";
import { BLOCK_TYPES, isContainer, newDraftBlock } from "./draft";

/** Every block type the grammar knows, one line each. Containers never nest,
 * so a body list offers only the leaves. */

export function AddBlock({
  onAdd,
  label = "Add block",
  leavesOnly = false,
  size = "sm",
}: {
  onAdd: (type: string) => void;
  label?: string;
  leavesOnly?: boolean;
  size?: "sm" | "md";
}) {
  const [open, setOpen] = useState(false);
  const types = BLOCK_TYPES.filter(
    (type) => !leavesOnly || !isContainer(newDraftBlock(type)),
  );

  return (
    <>
      <Button
        leading={<Plus aria-hidden />}
        onClick={() => setOpen(true)}
        size={size}
        type="button"
        variant="outline"
      >
        {label}
      </Button>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="max-w-(--container-lg)">
          <DialogTitle className="font-heading font-bold text-lg">
            Add a block
          </DialogTitle>
          <div className="grid gap-2 overflow-y-auto sm:grid-cols-2">
            {types.map((type) => (
              <button
                className="cursor-pointer rounded-(--radius-xl) border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-border-strong hover:bg-muted"
                key={type}
                onClick={() => {
                  setOpen(false);
                  onAdd(type);
                }}
                type="button"
              >
                <Text as="span" className="block" size="sm" weight="medium">
                  {blockLabel(type)}
                </Text>
                <Text as="span" className="block" size="xs" tone="secondary">
                  {blockHint(type)}
                </Text>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
