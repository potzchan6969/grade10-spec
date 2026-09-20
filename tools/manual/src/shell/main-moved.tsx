import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { useEffect, useState } from "react";
import {
  every,
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
import { ShellNotice } from "./shell-notice";

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
 * is held while a reader is typing, because an edit in the block editor is
 * unsaved text, until the caret leaves the field.
 */

/** How often the site's own head is read while the page is behind. The deploy
 * takes a few minutes, and a page that is behind is a page a reader is
 * already waiting on. */
export const DEPLOYED_POLL_MS = 30_000;

/** How long the page waits before it stops promising the rebuild. Ten minutes
 * is well past a deploy that worked, so what the banner says after it is what
 * the reader can see for themselves. */
export const LATE_MS = 600_000;

/** How often the site's own head is read after that. Nothing the next reading
 * says changes the page, and a page left open all afternoon would otherwise be
 * a page polling all afternoon. */
export const LATE_POLL_MS = 300_000;

const REBUILDS =
  "This site rebuilds in a few minutes and refreshes on its own.";

const NOT_CAUGHT_UP = "This site has not caught up yet.";

/** Just enough of a document to hear the caret leave a field. */
export type Focus = {
  addEventListener: (type: "focusout", run: () => void) => void;
  removeEventListener: (type: "focusout", run: () => void) => void;
};

export type DeployedWatch = {
  /** The head the page is showing, from the snapshot it booted from. */
  head: string;
  /** When the push arrived, as the relay stamped it: what the ten minutes are
   * counted from. */
  since: string;
  /** Re-read the store. Never a window reload. */
  reload: () => void;
  http?: typeof fetch;
  /** Whether a reader is typing right now. */
  typing?: () => boolean;
  /** Where the caret leaving a field is heard from. `null` where there is no
   * DOM, which is every test that is not driving one. */
  focus?: Focus | null;
  /** Said once, the poll after the page has been behind ten minutes. */
  onLate?: () => void;
  now?: () => number;
  wait?: Wait;
};

/**
 * Polls the site's own head while the page is behind `main`, and re-reads the
 * store once the site has caught up.
 *
 * A reader mid-sentence is not interrupted: the re-read is held, and taken the
 * moment the caret leaves the field. Ten minutes behind, the page stops
 * promising the rebuild and the poll slows to five minutes — the site plainly
 * is not catching up, and nothing the next reading says would change that.
 *
 * Returns the stop. A page that is no longer behind stops polling, which is
 * the same thing as the banner going away.
 */
export function watchDeployedHead(watch: DeployedWatch): () => void {
  const http = watch.http ?? fetch;
  const typing = watch.typing ?? focusIsTyping;
  const wait = watch.wait ?? onTimers;
  const now = watch.now ?? Date.now;
  const focus = watch.focus === undefined ? theCaret() : watch.focus;

  let stopped = false;
  let late = false;
  /** The site caught up under a reader who is typing: the re-read waits on the
   * caret rather than being dropped and read again half a minute later. */
  let held = false;
  let unlisten: (() => void) | null = null;

  const reload = () => {
    held = false;
    unlisten?.();
    unlisten = null;
    watch.reload();
  };

  /** Keep what the poll read, and listen for the caret. The caret moving from
   * one field to the next is still a reader typing, so the listener stays. */
  const hold = () => {
    held = true;
    if (unlisten !== null || focus === null) return;
    const left = () => {
      if (stopped || typing()) return;
      reload();
    };
    focus.addEventListener("focusout", left);
    unlisten = () => focus.removeEventListener("focusout", left);
  };

  const poll = async () => {
    const found = await readDeployedHead(http);
    if (stopped) return;
    const caughtUp = held || (found !== null && found !== watch.head);
    if (caughtUp) {
      if (typing()) hold();
      else reload();
    }
    if (!late && behindLong(watch.since, now())) {
      late = true;
      watch.onLate?.();
    }
  };

  const stop = every(
    wait,
    () => (late ? LATE_POLL_MS : DEPLOYED_POLL_MS),
    poll,
    "later",
  );

  return () => {
    stopped = true;
    unlisten?.();
    stop();
  };
}

/** Whether the page has been behind long enough to stop promising the
 * rebuild. A stamp nobody can read is never late: the page says what it
 * knows. */
export function behindLong(since: string, now: number): boolean {
  const at = Date.parse(since);
  return !Number.isNaN(at) && now - at >= LATE_MS;
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

function theCaret(): Focus | null {
  return typeof document === "undefined" ? null : document;
}

export function MainMoved() {
  const snapshot = useSnapshotData();
  const reload = useSnapshotReload();
  const head = useMainHead();
  const { store } = useEditorSession();
  const local = store !== null;
  const checkout = useCheckout(local);
  const { reread } = checkout;
  const [told, setTold] = useState(false);

  const moved = head !== null && head.main !== snapshot.storeHead ? head : null;
  const movedTo = moved?.main;
  const since = moved?.at;

  // `main` moved: read `origin` now rather than at the end of the minute, so
  // the local line agrees with the sentence above it.
  useEffect(() => {
    if (local && movedTo !== undefined) reread();
  }, [local, movedTo, reread]);

  useEffect(() => {
    if (since === undefined) return;
    setTold(false);
    return watchDeployedHead({
      head: snapshot.storeHead,
      onLate: () => setTold(true),
      reload,
      since,
    });
  }, [reload, since, snapshot.storeHead]);

  // The sentence changes ten minutes in. The watch is what wakes a page
  // nobody has touched since; the reading is what a page that opened already
  // behind says at once.
  const late = moved !== null && (told || behindLong(moved.at, Date.now()));

  const standing = local ? checkout.standing : null;
  const line = standing === null ? null : checkoutLine(standing);
  if (moved === null && line === null) return null;

  return (
    <ShellNotice slot="manual-main-moved">
      {moved === null ? null : (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Text as="p" className="min-w-0 flex-1" size="sm" tone="secondary">
            <InlineMarkdown text="`main`" /> moved {relativeTime(moved.at)} —{" "}
            {moved.subject}. {late ? NOT_CAUGHT_UP : REBUILDS}
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
          {/* One slot: the pull, or what the last press came back with. A
              refusal under a button that stays pressable reads as a press
              worth repeating, which is not what happened. */}
          {line.pull && checkout.refused === null ? (
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
          {checkout.refused === null ? null : (
            <Text as="p" className="text-destructive" size="sm">
              {checkout.refused}
            </Text>
          )}
        </div>
      )}
    </ShellNotice>
  );
}

/** What the checkout's standing reads as, and whether the pull is offered.
 * Level says nothing at all. Uncommitted work is what stands in the way of a
 * fast-forward, so it is read before the counts; a checkout with commits of
 * its own is not fast-forwarded either, and both are told and offered
 * nothing. */
function checkoutLine(
  standing: CheckoutStanding,
): { text: string; pull: boolean } | null {
  const { ahead, behind, dirty } = standing;
  if (behind === 0 && ahead === 0) return null;
  if (dirty) {
    return { pull: false, text: "Your checkout has uncommitted work." };
  }
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
  return {
    pull: false,
    text: `Your checkout is ${commits(ahead)} ahead of \`main\`.`,
  };
}

function commits(count: number): string {
  return `${count} commit${count === 1 ? "" : "s"}`;
}
