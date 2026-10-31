import { Button } from "@grade10/design-system/components/forms/button";
import { SignOut } from "@phosphor-icons/react";

type DoorPasscodeChangedCopy = {
  /** "The passcode was changed" */
  title: string;
  /** "Every phone at the door was signed out. Ask the door lead for the new passcode." */
  body: string;
  /** "Enter the New Passcode" */
  action: string;
};

type DoorPasscodeChangedProps = {
  copy: DoorPasscodeChangedCopy;
  onEnterNewPasscode: () => void;
};

/**
 * What a phone shows once the passcode is changed in the console: every
 * phone was signed out, and the way back in is the new passcode.
 */
function DoorPasscodeChanged({
  copy,
  onEnterNewPasscode,
}: DoorPasscodeChangedProps) {
  return (
    <div
      className="flex flex-1 flex-col px-4 pt-10 pb-4"
      data-slot="door-passcode-changed"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span
          aria-hidden
          className="grid size-14 place-items-center rounded-full bg-muted text-foreground"
        >
          <SignOut size={24} />
        </span>
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          {copy.title}
        </h1>
        <p className="text-sm text-secondary-foreground">{copy.body}</p>
      </div>
      <div className="mt-auto pt-6">
        <Button className="w-full" onClick={onEnterNewPasscode}>
          {copy.action}
        </Button>
      </div>
    </div>
  );
}

export {
  DoorPasscodeChanged,
  type DoorPasscodeChangedCopy,
  type DoorPasscodeChangedProps,
};
