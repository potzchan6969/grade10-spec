import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Chip } from "@grade10/design-system/components/forms/chip";
import { SearchInput } from "@grade10/design-system/components/forms/search-input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useSnapshotReload } from "../api/snapshot-provider";
import type { SpecEntry } from "../api/types";
import { useManualIndex } from "../api/use-manual-index";
import { REPO } from "./config";
import { TextArea, TextField } from "./fields";
import {
  type Citable,
  changeDir,
  citablesAcross,
  draftProblem,
  draftProposal,
  issuedCeiling,
  slugOf,
  slugProblem,
  today,
} from "./propose";
import {
  noteWrite,
  rememberedHandle,
  rememberHandle,
  useEditorSession,
} from "./session";
import { openSettings } from "./settings-open";
import { describeCause } from "./store";

/**
 * Proposing a change from the page you are reading. What lands is a proposal
 * and nothing else — the title, the proposer's own words, the ids it touches
 * and the frame it is arguing with — because the delta is what the discussion
 * after this is for.
 *
 * A read-only session sees all of it, and the one line that says what access
 * it would take. The picker reaches every spec in the store: an idea crosses
 * capabilities far more often than a page does.
 */

const KIND_TONE: Record<
  Citable["kind"],
  "info" | "success" | "default" | "outline"
> = {
  spec: "outline",
  requirement: "default",
  scenario: "info",
  journey: "success",
  case: "default",
};

export function ProposeDialog({
  open,
  onOpenChange,
  cites: seeded,
  spec,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  /** What the control that opened this already knows it is about. */
  cites: string[];
  /** The page's own spec: what the picker offers first, and whose id ceiling
   * the proposer is warned about. */
  spec?: SpecEntry;
}) {
  const { store, kind, mode } = useEditorSession();
  const index = useManualIndex();
  const reload = useSnapshotReload();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [slug, setSlug] = useState("");
  const [figma, setFigma] = useState("");
  const [author, setAuthor] = useState(rememberedHandle());
  const [cites, setCites] = useState<string[]>(seeded);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locked = store?.readOnly ?? null;

  // The author line names a person, so the hosted store asks GitHub who the
  // token belongs to rather than letting anyone type someone else's handle.
  useEffect(() => {
    if (!open || kind !== "github" || locked || !store?.identity) return;
    let live = true;
    store
      .identity()
      .then((login) => {
        if (live) setAuthor(login);
      })
      .catch((cause: unknown) => {
        if (live) setError(describeCause(cause));
      });
    return () => {
      live = false;
    };
  }, [open, kind, locked, store]);

  const effective = slug.trim() === "" ? slugOf(title) : slug.trim();
  const draft = {
    slug: effective,
    title,
    why,
    author: author.trim(),
    cites,
    figma,
    date: today(),
  };
  const problem = draftProblem(draft);
  const started = title.trim() !== "" || why.trim() !== "";

  const citable = useMemo(
    () => citablesAcross(index.snapshot.specs, spec),
    [index, spec],
  );
  const options = citable
    .filter((item) => !cites.includes(item.id) && matches(item, search))
    .slice(0, 8);
  const ceiling = issuedCeiling(spec);

  const propose = () => {
    if (problem || !store) return;
    setBusy(true);
    setError(null);
    store
      .propose(draftProposal(draft))
      .then(({ id }) => {
        if (kind === "local") rememberHandle(draft.author);
        noteWrite();
        reload();
        onOpenChange(false);
        navigate(`/planning#${id}`);
      })
      .catch((cause: unknown) => {
        console.error(`manual: cannot propose ${effective}`, cause);
        setError(describeCause(cause));
      })
      .finally(() => setBusy(false));
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-(--container-md)">
        <DialogTitle className="font-heading font-bold text-lg">
          Propose a change
        </DialogTitle>
        <Text as="p" size="xs" tone="secondary">
          A proposal is the reason for a change and the ids it touches. No
          delta, no task list — that is what the discussion is for.
        </Text>
        {locked ? (
          <LockedNote onSettings={() => onOpenChange(false)} reason={locked} />
        ) : null}

        <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto *:shrink-0">
          <TextField label="title" onChange={setTitle} required value={title} />
          <TextArea label="why" onChange={setWhy} rows={5} value={why} />
          {kind === "local" || locked ? (
            <TextField
              hint="Whose proposal this is; the author line carries it"
              label="your GitHub handle"
              onChange={setAuthor}
              required
              value={author}
            />
          ) : null}
          <TextField
            hint="Optional: the frame this is arguing with"
            label="Figma link"
            onChange={setFigma}
            placeholder="https://www.figma.com/design/…"
            value={figma}
          />

          <div className="flex flex-col gap-2">
            <Text as="span" size="sm" tone="secondary" weight="medium">
              References
            </Text>
            {cites.length === 0 ? (
              <Text as="p" size="xs" tone="secondary">
                Nothing cited yet — add the ids this is about.
              </Text>
            ) : (
              <ul className="flex flex-wrap gap-1.5">
                {cites.map((id) => (
                  <li key={id}>
                    <Chip
                      aria-label={`Remove ${id}`}
                      onClick={() =>
                        setCites((held) => held.filter((one) => one !== id))
                      }
                    >
                      <span className="max-w-[28ch] truncate font-mono text-xs">
                        {id}
                      </span>
                    </Chip>
                  </li>
                ))}
              </ul>
            )}

            <SearchInput
              aria-label="Search every spec"
              onChange={(event) => setSearch(event.target.value)}
              onClear={() => setSearch("")}
              placeholder="Cite ids from any capability"
              value={search}
            />
            {options.length > 0 ? (
              <ul className="max-h-40 overflow-y-auto rounded-(--radius-xl) border border-border-subtle">
                {options.map((item) => (
                  <li key={`${item.spec}:${item.kind}:${item.id}`}>
                    <button
                      className="flex w-full cursor-pointer items-center gap-2 px-2.5 py-1.5 text-left outline-none hover:bg-muted focus-visible:bg-muted"
                      onClick={() => {
                        setCites((held) => [...held, item.id]);
                        setSearch("");
                      }}
                      type="button"
                    >
                      <Badge size="sm" variant={KIND_TONE[item.kind]}>
                        {item.kind}
                      </Badge>
                      <span className="min-w-0 flex-1 truncate font-mono text-xs">
                        {item.id}
                      </span>
                      <Text
                        as="span"
                        className="min-w-0 max-w-[40%] truncate"
                        size="xs"
                        tone="secondary"
                      >
                        {item.kind === "spec" || item.title === item.id
                          ? item.spec
                          : `${item.spec} · ${item.title}`}
                      </Text>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {ceiling ? (
              <Text as="p" size="xs" tone="secondary">
                {ceiling} — counting every in-flight change, not just this
                page's. The next one starts above that.
              </Text>
            ) : null}
          </div>

          <TextField
            hint="Leave empty to take it from the title"
            label="slug"
            onChange={setSlug}
            placeholder={slugOf(title)}
            value={slug}
          />
          <Text as="p" className="font-mono" size="xs" tone="secondary">
            {slugProblem(effective) ? "—" : `${changeDir(effective)}/`}
          </Text>
        </div>

        <Text as="p" size="xs" tone="secondary">
          {kind === "local"
            ? "Lands in the working tree; commit it with the rest of your edits."
            : mode === "main"
              ? `Lands on ${REPO.defaultBranch}, and shows on Planning as soon as the deploy runs.`
              : "Lands on your branch, on the pull request it keeps open."}
        </Text>
        {problem && started ? (
          <Text as="p" className="text-destructive" size="xs">
            {problem}
          </Text>
        ) : null}
        {error ? (
          <Text as="p" className="text-destructive" size="xs">
            {error}
          </Text>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            onClick={() => onOpenChange(false)}
            size="sm"
            type="button"
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            disabled={problem !== null || locked !== null}
            loading={busy}
            onClick={propose}
            size="sm"
            type="button"
          >
            Propose it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** The door is visible, and this is what is behind the lock. One line: what
 * proposing does, what it takes, and where to put it. */
function LockedNote({
  reason,
  onSettings,
}: {
  reason: string;
  onSettings: () => void;
}) {
  return (
    <div className="rounded-(--radius-xl) border border-border-subtle bg-muted px-3 py-2">
      <Text as="p" size="xs">
        Proposing writes a new change to {REPO.owner}/{REPO.repo} — the reason
        and the ids it touches, nothing more. It needs a GitHub token with write
        access, which you add in{" "}
        <button
          className="cursor-pointer underline hover:text-foreground"
          onClick={() => {
            onSettings();
            openSettings();
          }}
          type="button"
        >
          Settings
        </button>
        .
      </Text>
      <Text as="p" className="mt-1" size="xs" tone="secondary">
        {reason}
      </Text>
    </div>
  );
}

function matches(item: Citable, search: string): boolean {
  const wanted = search.trim().toLowerCase();
  if (wanted === "") return true;
  return (
    item.id.toLowerCase().includes(wanted) ||
    item.title.toLowerCase().includes(wanted) ||
    item.spec.toLowerCase().includes(wanted)
  );
}
