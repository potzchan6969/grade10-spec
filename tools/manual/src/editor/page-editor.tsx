import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { type ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSnapshotReload } from "../api/snapshot-provider";
import { useManualIndex } from "../api/use-manual-index";
import { BlockScopeProvider } from "../blocks/block-scope";
import { BlockList } from "./block-list";
import { ConfirmDialog } from "./confirm-dialog";
import { type Conflict, ConflictView } from "./conflict-view";
import {
  buildPage,
  type Draft,
  draftFromSource,
  FRONTMATTER_ID,
  PAGE_ID,
  type Problems,
} from "./draft";
import { useEditMode } from "./edit-mode";
import { EditorChrome } from "./editor-chrome";
import { FrontmatterForm } from "./frontmatter-form";
import { savePage } from "./save";
import { noteWrite, useEditorSession } from "./session";
import { describeCause, type Version } from "./store";
import { checkReferences, REFERENCE_ID } from "./validate";

/**
 * Edit mode for one page. It reads from the store, never from the snapshot,
 * so the version it holds is the version a save writes against, and two
 * editors become a rendered conflict.
 */

const NO_PROBLEMS: Problems = new Map();

type Loaded = { draft: Draft; source: string; version: Version | null };

export function PageEditor({ path }: { path: string }) {
  const index = useManualIndex();
  const { store } = useEditorSession();
  const reload = useSnapshotReload();
  const { exit } = useEditMode();
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<Conflict | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!store) return;
    let live = true;
    // Another page, or another store: hold nothing from the last one.
    setLoaded(null);
    setFailure(null);

    store
      .read(path)
      .then((file) => {
        if (!live) return;
        setLoaded({
          draft: draftFromSource(file.source),
          source: file.source,
          version: file.version,
        });
      })
      .catch((cause: unknown) => {
        console.error(`manual: cannot open ${path} for editing`, cause);
        if (live) setFailure(describeCause(cause));
      });

    return () => {
      live = false;
    };
  }, [store, path]);

  if (failure) {
    return (
      <Notice tone="error" title="This page cannot be opened for editing">
        <Text as="p" size="sm" tone="secondary">
          {failure}
        </Text>
        <Button
          className="mt-3"
          onClick={exit}
          size="sm"
          type="button"
          variant="outline"
        >
          Back to the page
        </Button>
      </Notice>
    );
  }

  if (!loaded || !store) {
    return (
      <Text as="p" size="sm" tone="secondary">
        Opening {path}…
      </Text>
    );
  }

  const build = buildPage(loaded.draft);
  // References are only worth resolving once the page is a page.
  const references = build.ok
    ? checkReferences(index, path, loaded.draft)
    : NO_PROBLEMS;
  const problems = build.ok ? references : build.problems;
  const changed = build.ok ? build.source !== loaded.source : true;
  const canSave = build.ok && references.size === 0 && !saving;

  const setDraft = (draft: Draft) =>
    setLoaded((current) => (current ? { ...current, draft } : current));

  const save = async (against: Version | null) => {
    if (!build.ok || references.size > 0) return;
    setSaving(true);
    setSaveError(null);
    try {
      const outcome = await savePage(
        store,
        index.manualDir,
        path,
        build.source,
        against,
      );
      if (outcome.status === "conflict") {
        setConflict({ mine: build.source, theirs: outcome.current });
        return;
      }
      setConflict(null);
      noteWrite();
      reload();
      exit();
    } catch (cause) {
      console.error(`manual: saving ${path} failed`, cause);
      setSaveError(describeCause(cause));
    } finally {
      setSaving(false);
    }
  };

  const takeTheirs = () => {
    const theirs = conflict?.theirs;
    if (!theirs) return;
    try {
      setLoaded({
        draft: draftFromSource(theirs.source),
        source: theirs.source,
        version: theirs.version,
      });
      setConflict(null);
    } catch (cause) {
      setSaveError(
        `the version on disk does not parse: ${describeCause(cause)}`,
      );
    }
  };

  const remove = async () => {
    if (!loaded.version) return;
    setSaving(true);
    try {
      await store.deletePage(path, loaded.version);
      setDeleting(false);
      noteWrite();
      reload();
      navigate("/");
    } catch (cause) {
      console.error(`manual: deleting ${path} failed`, cause);
      setSaveError(describeCause(cause));
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    if (changed) setLeaving(true);
    else exit();
  };

  return (
    <div data-editor="page" data-editor-path={path}>
      <EditorChrome
        canSave={canSave}
        onCancel={cancel}
        onDelete={loaded.version ? () => setDeleting(true) : undefined}
        onSave={() => save(loaded.version)}
        path={path}
        problemCount={problems.size}
        saving={saving}
        store={store}
      />

      {saveError ? (
        <Notice title="The store refused this save" tone="error">
          <Text as="p" size="sm" tone="secondary">
            {saveError}
          </Text>
        </Notice>
      ) : null}

      {conflict ? (
        <ConflictView
          busy={saving}
          conflict={conflict}
          onCancel={() => setConflict(null)}
          onRetry={() => save(conflict.theirs?.version ?? null)}
          onTakeTheirs={takeTheirs}
        />
      ) : null}

      {problems.get(PAGE_ID)?.map((problem) => (
        <Notice
          key={problem.message}
          title="This page will not serialize"
          tone="error"
        >
          <Text as="p" size="sm" tone="secondary">
            {problem.message}
          </Text>
        </Notice>
      ))}

      {problems.get(REFERENCE_ID)?.map((problem) => (
        <Notice
          key={problem.message}
          title="This save would leave a spec unshown"
          tone="error"
        >
          <Text as="p" size="sm" tone="secondary">
            {problem.message}
          </Text>
        </Notice>
      ))}

      <FrontmatterForm
        frontmatter={loaded.draft.frontmatter}
        onChange={(frontmatter) => setDraft({ ...loaded.draft, frontmatter })}
        problems={problems.get(FRONTMATTER_ID) ?? []}
      />

      <BlockScopeProvider value={{ index, pagePath: path }}>
        <BlockList
          blocks={loaded.draft.blocks}
          onChange={(blocks) => setDraft({ ...loaded.draft, blocks })}
          problems={problems}
        />
      </BlockScopeProvider>

      <ConfirmDialog
        body={`${path} is removed from the working tree. Commit to make it permanent.`}
        busy={saving}
        confirmLabel="Delete the page"
        onConfirm={remove}
        onOpenChange={setDeleting}
        open={deleting}
        title="Delete this page?"
      />
      <ConfirmDialog
        body="The edits on this page have not been saved anywhere."
        confirmLabel="Discard them"
        onConfirm={exit}
        onOpenChange={setLeaving}
        open={leaving}
        title="Leave edit mode?"
      />
    </div>
  );
}

function Notice({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "error" | "warning";
  children: ReactNode;
}) {
  const shell =
    tone === "error"
      ? "border-destructive-border bg-destructive/8"
      : "border-warning-border bg-warning/10";

  return (
    <section
      className={`mb-6 rounded-(--radius-2xl) border px-4 py-3 ${shell}`}
    >
      <Text as="p" size="sm" weight="bold">
        {title}
      </Text>
      {children}
    </section>
  );
}
