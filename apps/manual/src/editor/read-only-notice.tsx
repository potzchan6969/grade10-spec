import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "react-router";
import { useEditorSession } from "./session";

/**
 * The hosted build's one honest sentence. Every editor surface hides itself
 * where no dev server answers, which is right — but the manual's own prose
 * keeps promising a propose action, so the silent absence read as a bug and
 * the promise as a lie. Where the buttons would be, this says why they are
 * not, once, quietly.
 */
export function ReadOnlyNotice({ className }: { className?: string }) {
  const { status, store } = useEditorSession();
  if (status !== "ready" || store !== null) return null;

  return (
    <Text as="p" className={className} size="xs" tone="secondary">
      This hosted build is read-only — proposing and editing need the
      locally-run manual.{" "}
      <Link
        className="underline underline-offset-2 hover:text-foreground"
        to="/guides/how-this-manual-works"
      >
        How this manual works
      </Link>{" "}
      covers the loop.
    </Text>
  );
}
