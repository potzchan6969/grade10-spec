import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { useEffect } from "react";
import {
  onTimers,
  readDeployedHead,
  useCheckout,
  useMainHead,
  type Wait,
} from "../api/head";
import { useSnapshotData, useSnapshotReload } from "../api/snapshot-provider";
import { relativeTime } from "../api/time";
import type { CheckoutStanding } from "../api/types";
import { InlineMarkdown } from "../blocks/inline-markdown";
import { useEditorSession } from "../editor/session";

/**
 * What a page says while it is behind `main`.
 *
 * One banner with two readings, because a reader has one question — is what I
 * am reading current — and the answer comes from wherever it can be had. The
 * hosted page hears `main` move from the relay and waits for its own rebuild.
 * The locally run manual can see its own checkout, so it says how far behind
 * it is and offers the pull.
 *
 * Nothing here reloads the window. The snapshot is re-read, which keeps the
 * reader on the page and at the scroll position they were already at — and it
 * is not re-read at all under a reader who is typing, because an edit in the
 * block editor is unsaved text.
 */

/** How often the site's own head is read while the page is behind. The deploy
 * takes a few minutes, and a page that is behind is a page a reader is
 * already waiting on. */
export const DEPLOYED_POLL_MS = 30_000;

const REBUILDS =
  "This site rebuilds in a few minutes and refreshes on its own.";

export type DeployedWatch = {
  /** The head the page is showing, from the snapshot it booted from. */
  head: string;
  /** Re-read the store. Never a window reload. */
  reload: () => void;
  http?: typeof fetch;
  /** Whether a reader is typing right now. */
  typing?: () => boolean;
  wait?: Wait;
};

/**
 * Polls the site's own head while the page is behind `main`, and re-reads the
 * store once the site has caught up.
 *
 * Returns the stop. A page that is no longer behind stops polling, which is
 * the same thing as the banner going away.
 */
export function watchDeployedHead(watch: DeployedWatch): () => void {
  const http = watch.http ?? fetch;
  const typing = watch.typing ?? focusIsTyping;
  const wait = watch.wait ?? onTimers;

  let stopped = false;
  let cancel: (() => void) | null = null;

  const poll = async () => {
    const found = await readDeployedHead(http);
    if (stopped) return;
    // A reader mid-sentence is left alone: the page is still behind, the
    // banner still says so, and the next poll is half a minute away.
    if (found !== null && found !== watch.head && !typing()) watch.reload();
    cancel = wait(DEPLOYED_POLL_MS, () => void poll());
  };
  cancel = wait(DEPLOYED_POLL_MS, () => void poll());

  return () => {
    stopped = true;
    cancel?.();
  };
}

/** Just enough of an element to answer with: what it is, and whether its
 * author made it editable. */
type Focused = Pick<Element, "tagName" | "getAttribute">;

/** Everything a caret can sit in. An input that takes no text — a checkbox, a
 * button — is not one of them. */
const NOT_TEXT = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "hidden",
  "image",
  "radio",
  "range",
  "reset",
  "submit",
]);

export function isTyping(active: Focused | null): boolean {
  if (active === null) return false;
  const tag = active.tagName.toLowerCase();
  if (tag === "textarea") return true;
  if (tag === "input") {
    return !NOT_TEXT.has((active.getAttribute("type") ?? "text").toLowerCase());
  }
  const editable = active.getAttribute("contenteditable");
  return editable !== null && editable !== "false";
}

function focusIsTyping(): boolean {
  return typeof document === "undefined"
    ? false
    : isTyping(document.activeElement);
}

export function MainMoved() {
  const snapshot = useSnapshotData();
  const reload = useSnapshotReload();
  const head = useMainHead();
  const { store } = useEditorSession();
  const local = store !== null;
  const checkout = useCheckout(local);
  const { reread } = checkout;

  const moved = head !== null && head.main !== snapshot.storeHead ? head : null;
  const behind = moved !== null;
  const movedTo = moved?.main;

  // `main` moved: read `origin` now rather than at the end of the minute, so
  // the local line agrees with the sentence above it.
  useEffect(() => {
    if (local && movedTo !== undefined) reread();
  }, [local, movedTo, reread]);

  useEffect(() => {
    if (!behind) return;
    return watchDeployedHead({ head: snapshot.storeHead, reload });
  }, [behind, reload, snapshot.storeHead]);

  const standing = local ? checkout.standing : null;
  const line = standing === null ? null : checkoutLine(standing);
  if (moved === null && line === null) return null;

  return (
    <div
      className="mb-8 rounded-lg border border-warning-border bg-background-subtle px-4 py-3"
      data-slot="manual-main-moved"
      role="status"
    >
      {moved === null ? null : (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Text as="p" className="min-w-0 flex-1" size="sm" tone="secondary">
            <InlineMarkdown text="`main`" /> moved {relativeTime(moved.at)} —{" "}
            {moved.subject}. {REBUILDS}
          </Text>
          <Button onClick={reload} size="sm" type="button" variant="outline">
            Refresh now
          </Button>
        </div>
      )}

      {line === null ? null : (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 first:mt-0">
          <Text as="p" className="min-w-0 flex-1" size="sm" tone="secondary">
            <InlineMarkdown text={line.text} />
          </Text>
          {line.pull ? (
            <Button
              loading={checkout.pulling}
              onClick={checkout.pull}
              size="sm"
              type="button"
              variant="outline"
            >
              Pull
            </Button>
          ) : null}
        </div>
      )}

      {checkout.refused === null ? null : (
        <Text as="p" className="mt-2 text-destructive" size="sm">
          {checkout.refused}
        </Text>
      )}
    </div>
  );
}

/** What the checkout's standing reads as, and whether the pull is offered.
 * Level says nothing at all; a checkout with commits of its own is not
 * fast-forwarded, so it is told and offered nothing. */
function checkoutLine(
  standing: CheckoutStanding,
): { text: string; pull: boolean } | null {
  const { ahead, behind } = standing;
  if (behind > 0 && ahead === 0) {
    return {
      pull: true,
      text: `Your checkout is ${commits(behind)} behind \`main\`.`,
    };
  }
  if (ahead > 0 && behind > 0) {
    return {
      pull: false,
      text: `Your checkout is ${commits(behind)} behind \`main\` and ${ahead} ahead.`,
    };
  }
  if (ahead > 0) {
    return {
      pull: false,
      text: `Your checkout is ${commits(ahead)} ahead of \`main\`.`,
    };
  }
  return null;
}

function commits(count: number): string {
  return `${count} commit${count === 1 ? "" : "s"}`;
}
