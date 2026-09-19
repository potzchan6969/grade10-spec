import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { useEffect, useState } from "react";
import { TextField } from "../editor/fields";

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

  return (
    <form
      className="mb-6 flex flex-wrap items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        remember(written);
      }}
    >
      <Text as="span" className="mb-2.5" size="sm">
        {current === undefined
          ? "Choose a handle to see the changes you are a hand of"
          : "Reading as"}
      </Text>
      <div className="w-40">
        <TextField
          label="Your handle"
          onChange={setWritten}
          placeholder="handle"
          value={written}
        />
      </div>
      <Button size="sm" type="submit" variant="outline">
        {current === undefined ? "Remember me" : "Change"}
      </Button>
    </form>
  );
}
