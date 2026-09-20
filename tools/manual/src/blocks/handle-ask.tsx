import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { useEffect, useId, useState } from "react";

/**
 * The one place a reader is asked who they are: the board's Mine filter and
 * My turn both need a handle and neither can ask the store for one, so both
 * compose this rather than each drawing its own field.
 *
 * `current` is the handle the browser already remembers, where one is set —
 * My turn keeps this in its page heading rather than only before a handle is
 * chosen, so a remembered one can still be changed. The field stays in step
 * with it: `remember`'s own write comes back around as a new `current`, and a
 * browser that already knows a handle shows it filled in rather than blank.
 *
 * The prompt is the label a reader sees, and the field's own is read out
 * rather than drawn: two labels over one box put "Your handle" above the
 * field and the sentence beside it, aligned with neither. The `sr-only`
 * label is this block's own and not the shell's, because the shell draws its
 * label in the flow — hidden text in it still holds the line it would have
 * taken, and the box sits a line below the prompt again.
 */
export function HandleAsk({
  current,
  remember,
}: {
  current?: string;
  remember: (handle: string) => void;
}) {
  const [written, setWritten] = useState(current ?? "");
  useEffect(() => setWritten(current ?? ""), [current]);
  const field = useId();

  return (
    <form
      className="mb-6 flex flex-wrap items-baseline gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        remember(written);
      }}
    >
      <Text as="span" size="sm">
        {current === undefined
          ? "Choose a handle to see the changes you are a hand of"
          : "Reading as"}
      </Text>
      <label className="sr-only" htmlFor={field}>
        Your handle
      </label>
      <div className="w-40">
        <TextInput
          autoComplete="off"
          id={field}
          onChange={(event) => setWritten(event.target.value)}
          placeholder="handle"
          spellCheck={false}
          value={written}
        />
      </div>
      <Button size="sm" type="submit" variant="outline">
        {current === undefined ? "Remember me" : "Change"}
      </Button>
    </form>
  );
}
