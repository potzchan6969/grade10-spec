import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { useState } from "react";
import { TextField } from "../editor/fields";

/**
 * The one place a reader is asked who they are: the board's Mine filter and
 * My turn both need a handle and neither can ask the store for one, so both
 * compose this rather than each drawing its own field.
 */
export function HandleAsk({
  remember,
}: {
  remember: (handle: string) => void;
}) {
  const [written, setWritten] = useState("");

  return (
    <form
      className="mb-6 flex flex-wrap items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        remember(written);
      }}
    >
      <Text as="span" className="mb-2.5" size="sm">
        Choose a handle to see the changes you are a hand of
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
        Remember me
      </Button>
    </form>
  );
}
