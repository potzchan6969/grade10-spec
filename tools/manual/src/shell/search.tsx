import { Text } from "@grade10/design-system/components/display/text";
import { SearchInput } from "@grade10/design-system/components/forms/search-input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  groupResults,
  runSearch,
  type SearchHit,
  searchIndexFor,
} from "../api/search";
import { useSnapshot } from "../api/snapshot-provider";
import { useManualIndex } from "../api/use-manual-index";

export function ManualSearch() {
  const snapshot = useSnapshot();
  if (snapshot.status !== "ready") return null;
  return <SearchControl />;
}

function SearchControl() {
  const snapshot = useSnapshot();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((on) => !on);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (snapshot.status !== "ready") return null;

  return (
    <>
      <button
        aria-keyshortcuts="Meta+K Control+K"
        className="flex h-9 w-full max-w-64 cursor-pointer items-center gap-2 rounded-(--radius-full) border border-border bg-control px-3 text-secondary-foreground text-sm transition-colors hover:border-border-strong hover:text-foreground max-sm:w-9 max-sm:max-w-9 max-sm:justify-center max-sm:px-0"
        onClick={() => setOpen(true)}
        type="button"
      >
        <MagnifyingGlass aria-hidden size={16} weight="bold" />
        <span className="max-sm:sr-only">Search the manual</span>
        <kbd className="ml-auto rounded border border-border px-1 font-mono text-[0.625rem] max-sm:hidden">
          ⌘K
        </kbd>
      </button>

      <SearchDialog onOpenChange={setOpen} open={open} />
    </>
  );
}

function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const index = useManualIndex();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  // Opening is a fresh search. The dialog stays mounted across closes, so the
  // last query would otherwise be sitting there for the next one to type into.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setCursor(0);
  }, [open]);

  // The index is built the first time the palette opens, never at boot, and
  // over the pages as they stand — a staged draft included.
  const engine = useMemo(
    () => (open ? searchIndexFor(index) : null),
    [open, index],
  );

  const found = useMemo(
    () =>
      query.trim() === "" || !engine
        ? { hits: [], partial: false }
        : runSearch(engine, query),
    [engine, query],
  );
  const groups = useMemo(() => groupResults(found.hits), [found]);

  const flat = useMemo(() => groups.flatMap((group) => group.hits), [groups]);

  const go = (hit: SearchHit) => {
    onOpenChange(false);
    navigate(hit.to);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="top-24 max-h-[60vh] max-w-(--container-xl) translate-y-0 gap-3 p-4"
        initialFocus={() => inputRef.current ?? true}
      >
        <DialogTitle className="sr-only">Search the manual</DialogTitle>

        <SearchInput
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
            setCursor(0);
          }}
          onClear={() => setQuery("")}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setCursor((at) => Math.min(flat.length - 1, at + 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setCursor((at) => Math.max(0, at - 1));
            }
            if (event.key === "Enter" && flat[cursor]) {
              event.preventDefault();
              go(flat[cursor]);
            }
          }}
          placeholder="Pages, requirements, scenarios, changes"
          ref={inputRef}
          value={query}
        />

        <div className="min-h-0 flex-1 overflow-y-auto">
          {query.trim() === "" ? (
            <Text
              as="p"
              className="px-1 py-6 text-center"
              size="sm"
              tone="secondary"
            >
              Type to search pages, spec rows and changes in flight.
            </Text>
          ) : flat.length === 0 ? (
            <Text
              as="p"
              className="px-1 py-6 text-center"
              size="sm"
              tone="secondary"
            >
              Nothing matches “{query}”.
            </Text>
          ) : (
            <>
              {found.partial ? (
                <Text as="p" className="px-2 pb-1" size="xs" tone="secondary">
                  Nothing matches every word. These match some of it.
                </Text>
              ) : null}
              {groups.map((group) => (
                <section className="mb-3" key={group.kind}>
                  <Text
                    as="p"
                    className="px-2 py-1 uppercase tracking-wide"
                    size="xs"
                    tone="secondary"
                    weight="medium"
                  >
                    {group.label}
                  </Text>
                  <ul>
                    {group.hits.map((hit) => {
                      const position = flat.indexOf(hit);
                      return (
                        <li key={hit.id}>
                          <button
                            className={`flex w-full cursor-pointer flex-col items-start gap-0.5 rounded-(--radius-lg) px-2 py-1.5 text-left transition-colors hover:bg-muted ${position === cursor ? "bg-muted" : ""}`}
                            onClick={() => go(hit)}
                            onMouseEnter={() => setCursor(position)}
                            type="button"
                          >
                            <span className="text-sm">{hit.title}</span>
                            <span className="text-secondary-foreground text-xs">
                              {hit.subtitle}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </>
          )}
        </div>

        <div className="flex items-center gap-3 border-border-subtle border-t pt-2 text-secondary-foreground text-xs">
          <span>↑↓ move</span>
          <span>⏎ open</span>
          <span>esc close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
