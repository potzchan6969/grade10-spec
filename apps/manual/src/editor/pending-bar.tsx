import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { CloudArrowUp, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { routeForPagePath } from "../api/paths";
import { relativeTime } from "../api/time";
import { useManualIndex } from "../api/use-manual-index";
import { noteLiveHead, onLiveHead } from "../shell/health";
import { ConfirmDialog } from "./confirm-dialog";
import { ConflictView } from "./conflict-view";
import {
  checkDraftsMoved,
  discardAllDrafts,
  discardDraft,
  discardDrafts,
  type Staged,
  stageDraft,
  useDrafts,
} from "./drafts";
import { ensureFreshSession, noteWrite, useEditorSession } from "./session";
import { describeCause, type PushConflict } from "./store";

/**
 * Hosted only. A save has gone no further than this browser, so this bar is
 * the app's answer to "what have I changed, and is any of it live?" — the
 * whole staged set, what moved underneath it, and the one control that turns
 * all of it into a single commit.
 */

export function PendingBar() {
  const { store } = useEditorSession();
  const index = useManualIndex();
  const drafts = useDrafts();

  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<PushConflict[]>([]);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  // Somebody else pushed: ask what every staged page is now, and mark the ones
  // that changed underneath before a push discovers it the hard way.
  useEffect(() => {
    const movedSince = store?.movedSince;
    if (!store || !movedSince) return;
    return onLiveHead(() => {
      checkDraftsMoved((files) => movedSince.call(store, files)).catch(
        (cause: unknown) => {
          console.warn(
            "manual: cannot check the drafts against the head",
            cause,
          );
        },
      );
    });
  }, [store]);

  const push = store?.push;
  const staged = drafts.staged;
  if (!push || !store) return null;
  if (staged.length === 0 && !drafts.failure) return null;

  const fallback = `Update ${staged.length} ${staged.length === 1 ? "page" : "pages"}`;
  const moved = staged.filter((draft) => draft.moved).length;
  const titleOf = (path: string) =>
    index.pageByPath.get(path)?.ast?.frontmatter.title ?? path;

  const send = () => {
    setBusy(true);
    setError(null);
    setConflicts([]);
    const pushing = staged.map(({ path, source, baseVersion }) => ({
      path,
      source,
      baseVersion,
    }));
    // A renewal may swap the store out from under this closure, so the push
    // asks for the session as it stands once the sign-in is fresh.
    ensureFreshSession()
      .then((session) => {
        const live = session.store;
        if (!live?.push) throw new Error("no store can push right now");
        return live.push(
          pushing,
          message.trim() === "" ? fallback : message.trim(),
        );
      })
      .then((outcome) => {
        if (outcome.status === "conflicts") {
          setConflicts(outcome.conflicts);
          setReviewing(outcome.conflicts[0]?.path ?? null);
          return;
        }
        // What landed, and only that: another tab may have staged a page
        // while this push was in the air.
        discardDrafts(pushing.map((file) => file.path));
        setMessage("");
        noteLiveHead(outcome.head);
        noteWrite();
      })
      .catch((cause: unknown) => {
        console.error("manual: the push failed", cause);
        setError(describeCause(cause));
      })
      .finally(() => setBusy(false));
  };

  const conflict = conflicts.find((held) => held.path === reviewing) ?? null;
  const mine = conflict ? drafts.byPath.get(conflict.path) : null;

  return (
    <div
      className="sticky bottom-0 z-40 border-border border-t bg-background/95 px-4 py-2 backdrop-blur lg:px-12"
      data-slot="manual-pending-bar"
    >
      <div className="mx-auto flex w-full max-w-[100rem] flex-wrap items-center gap-3">
        <details className="min-w-0">
          <summary className="cursor-pointer text-secondary-foreground text-xs">
            {staged.length} {staged.length === 1 ? "page" : "pages"} staged
            {moved > 0 ? ` · ${moved} changed underneath` : ""}
          </summary>
          <ul className="mt-1 max-h-40 space-y-1 overflow-y-auto">
            {staged.map((draft) => (
              <StagedRow
                draft={draft}
                key={draft.path}
                title={titleOf(draft.path)}
              />
            ))}
          </ul>
        </details>

        <div className="ml-auto flex min-w-0 flex-1 items-center gap-2 sm:max-w-lg">
          <TextInput
            aria-label="Commit message"
            className="min-w-0 flex-1"
            onChange={(event) => setMessage(event.target.value)}
            placeholder={fallback}
            value={message}
          />
          <Button
            disabled={staged.length === 0 || store.readOnly !== null}
            leading={<CloudArrowUp aria-hidden />}
            loading={busy}
            onClick={send}
            size="sm"
            type="button"
          >
            Push all
          </Button>
          <Button
            disabled={busy}
            onClick={() => setClearing(true)}
            size="sm"
            type="button"
            variant="ghost"
          >
            Discard all
          </Button>
        </div>

        {drafts.failure ? (
          <Text as="p" className="w-full text-destructive" size="xs">
            {drafts.failure}
          </Text>
        ) : null}

        {store.readOnly ? (
          <Text as="p" className="w-full text-destructive" size="xs">
            {store.readOnly}
          </Text>
        ) : null}

        {error ? (
          <Text as="p" className="w-full text-destructive" size="xs">
            {error}
          </Text>
        ) : null}

        {conflicts.length > 0 ? (
          <div className="flex w-full flex-wrap items-center gap-2">
            <Text as="span" className="text-destructive" size="xs">
              {conflicts.length} {conflicts.length === 1 ? "page" : "pages"}{" "}
              changed on the branch — nothing was pushed.
            </Text>
            {conflicts.map((held) => (
              <Button
                key={held.path}
                onClick={() => setReviewing(held.path)}
                size="sm"
                type="button"
                variant="outline"
              >
                Review {titleOf(held.path)}
              </Button>
            ))}
          </div>
        ) : null}
      </div>

      <Dialog
        onOpenChange={(next) => {
          if (!next) setReviewing(null);
        }}
        open={conflict !== null && mine !== null && mine !== undefined}
      >
        <DialogContent className="max-w-(--container-4xl)">
          <DialogTitle className="font-heading font-bold text-lg">
            {conflict ? titleOf(conflict.path) : ""}
          </DialogTitle>
          {conflict && mine ? (
            <ConflictView
              busy={busy}
              conflict={{ mine: mine.source, theirs: conflict.current }}
              onCancel={() => setReviewing(null)}
              onRetry={() => {
                stageDraft(
                  conflict.path,
                  mine.source,
                  conflict.current?.version ?? null,
                );
                setConflicts((held) =>
                  held.filter((one) => one.path !== conflict.path),
                );
                setReviewing(null);
              }}
              onTakeTheirs={() => {
                discardDraft(conflict.path);
                setConflicts((held) =>
                  held.filter((one) => one.path !== conflict.path),
                );
                setReviewing(null);
              }}
              retryLabel="Keep mine, push over theirs"
              takeLabel="Drop my draft"
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        body={`${staged.length} staged ${staged.length === 1 ? "page goes" : "pages go"} back to what the store has. Nothing was pushed, so nothing is recoverable.`}
        confirmLabel="Discard them all"
        onConfirm={() => {
          discardAllDrafts();
          setClearing(false);
          setConflicts([]);
        }}
        onOpenChange={setClearing}
        open={clearing}
        title="Discard every staged draft?"
      />
    </div>
  );
}

function StagedRow({ draft, title }: { draft: Staged; title: string }) {
  const route = routeForPagePath(draft.path);

  return (
    <li className="flex items-center gap-2 text-xs">
      {route ? (
        <Link className="truncate underline hover:text-foreground" to={route}>
          {title}
        </Link>
      ) : (
        <span className="truncate">{title}</span>
      )}
      <Text as="span" className="truncate font-mono" size="xs" tone="secondary">
        {draft.path}
      </Text>
      <Text as="span" className="whitespace-nowrap" size="xs" tone="secondary">
        staged {relativeTime(draft.stagedAt)}
      </Text>
      {draft.moved ? (
        <Badge size="sm" variant="warning">
          changed under your draft — pushing will show the conflict
        </Badge>
      ) : null}
      <IconButton
        aria-label={`Discard the draft of ${draft.path}`}
        className="ml-auto"
        onClick={() => discardDraft(draft.path)}
        size="sm"
        variant="ghost"
      >
        <Trash aria-hidden />
      </IconButton>
    </li>
  );
}
