import { Text } from "@grade10/design-system/components/display/text";
import { relativeTime, shortSha } from "../api/time";
import type { Snapshot } from "../api/types";

/** Where the page came from — one line, always visible, never guessed. */
export function SnapshotFooter({ snapshot }: { snapshot: Snapshot }) {
  return (
    <footer className="border-border border-t px-5 py-4 lg:px-12">
      <Text as="p" className="font-mono" size="xs" tone="secondary">
        snapshot from {shortSha(snapshot.storeHead)} ·{" "}
        {relativeTime(snapshot.generatedAt)}
      </Text>
    </footer>
  );
}
