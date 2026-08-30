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
import { REPO } from "./config";
import { TextArea, TextField } from "./fields";
import {
  type Citable,
  changeDir,
  citablesOf,
  draftProblem,
  draftProposal,
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
import { describeCause } from "./store";

/**
 * Proposing a change from the page you are reading. What lands is a proposal
 * and nothing else — the title, the proposer's own words, and the ids the row
 * already knew — because the delta is what the discussion after this is for.
 */

const KIND_TONE: Record<Citable["kind"], "info" | "success" | "default"> = {
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
  /** The page's own spec, which is what the picker searches. */
  spec?: SpecEntry;
}) {
  const { store, kind, mode } = useEditorSession();
  const reload = useSnapshotReload();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState(rememberedHandle());
  const [cites, setCites] = useState<string[]>(seeded);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The author line names a person, so the hosted store asks GitHub who the
  // token belongs to rather than letting anyone type someone else's handle.
  useEffect(() => {
    if (!open || kind !== "github" || !store?.identity) return;
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
  }, [open, kind, store]);

  const effective = slug.trim() === "" ? slugOf(title) : slug.trim();
  const draft = {
    slug: effective,
    title,
    why,
    author: author.trim(),
    cites,
    date: today(),
  };
  const problem = draftProblem(draft);
  const started = title.trim() !== "" || why.trim() !== "";

  const citable = useMemo(() => (spec ? citablesOf(spec) : []), [spec]);
  const options = citable
    .filter((item) => !cites.includes(item.id) && matches(item, search))
    .slice(0, 8);

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

        <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto *:shrink-0">
          <TextField label="title" onChange={setTitle} required value={title} />
          <TextArea label="why" onChange={setWhy} rows={5} value={why} />
          {kind === "local" ? (
            <TextField
              hint="Whose proposal this is; the author line carries it"
              label="your GitHub handle"
              onChange={setAuthor}
              required
              value={author}
            />
          ) : null}

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

            {spec ? (
              <>
                <SearchInput
                  aria-label={`Search ${spec.id}`}
                  onChange={(event) => setSearch(event.target.value)}
                  onClear={() => setSearch("")}
                  placeholder={`Cite more from ${spec.id}`}
                  value={search}
                />
                {options.length > 0 ? (
                  <ul className="max-h-40 overflow-y-auto rounded-(--radius-xl) border border-border-subtle">
                    {options.map((item) => (
                      <li key={`${item.kind}:${item.id}`}>
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
                          {item.title === item.id ? null : (
                            <Text
                              as="span"
                              className="min-w-0 max-w-[40%] truncate"
                              size="xs"
                              tone="secondary"
                            >
                              {item.title}
                            </Text>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
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
        {store?.readOnly ? (
          <Text as="p" className="text-destructive" size="xs">
            {store.readOnly}
          </Text>
        ) : null}
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
            disabled={problem !== null || store?.readOnly !== null}
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

function matches(item: Citable, search: string): boolean {
  const wanted = search.trim().toLowerCase();
  if (wanted === "") return true;
  return (
    item.id.toLowerCase().includes(wanted) ||
    item.title.toLowerCase().includes(wanted)
  );
}
