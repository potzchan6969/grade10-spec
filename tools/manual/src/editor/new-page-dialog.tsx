import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { useState } from "react";
import { useNavigate } from "react-router";
import { pagePath, routeForPagePath, slugify } from "../api/paths";
import { useSnapshotReload } from "../api/snapshot-provider";
import { useManualIndex } from "../api/use-manual-index";
import { editHref } from "./edit-mode";
import { SelectField, TextField } from "./fields";
import { savePage } from "./save";
import { newPageSource } from "./scaffold";
import { noteWrite, useEditorSession } from "./session";
import { describeCause } from "./store";

/** New pages are created inside the manual's tree and nowhere else: the
 * picker offers the three places routes exist for, and builds the path. */

const KINDS = [
  "capability page",
  "product landing",
  "platform topic",
  "guide",
] as const;

type Kind = (typeof KINDS)[number];

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function pathFor(
  manualDir: string,
  kind: Kind,
  product: string,
  slug: string,
): string {
  if (kind === "product landing") {
    return pagePath(manualDir, "products", product, "index.md");
  }
  if (kind === "capability page") {
    return pagePath(manualDir, "products", product, `${slug}.md`);
  }
  if (kind === "platform topic") {
    return pagePath(manualDir, "platform", `${slug}.md`);
  }
  return pagePath(manualDir, "guides", `${slug}.md`);
}

export function NewPageDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const index = useManualIndex();
  const { store } = useEditorSession();
  const reload = useSnapshotReload();
  const navigate = useNavigate();

  const products = index.groups.flatMap((group) =>
    group.products.map((product) => product.id),
  );

  const [kind, setKind] = useState<Kind>("capability page");
  const [product, setProduct] = useState(products[0] ?? "");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsSlug = kind !== "product landing";
  const effectiveSlug = slug.trim() === "" ? slugify(title) : slug.trim();
  const path = pathFor(index.manualDir, kind, product, effectiveSlug);
  const taken = index.pageByPath.has(path);

  // A capability page documents the spec its own path names, and gets that
  // spec's shelf — spec, cases — when the store already has one.
  const capability = kind === "capability page";
  const specId = capability ? `${product}/${effectiveSlug}` : undefined;
  const known = specId !== undefined && index.specById.has(specId);

  const problem =
    title.trim() === ""
      ? "a title is required"
      : needsSlug && !SLUG_RE.test(effectiveSlug)
        ? "a slug is lower-case words joined by dashes"
        : taken
          ? "a page already lives there"
          : null;

  const create = () => {
    if (problem || !store) return;
    setBusy(true);
    setError(null);
    const source = newPageSource({
      title: title.trim(),
      capability,
      spec: known ? specId : undefined,
    });

    savePage(store, index.manualDir, path, source, null)
      .then((outcome) => {
        if (outcome.status === "conflict") {
          setError("a page already lives there");
          return;
        }
        if (outcome.status === "ok") {
          noteWrite();
          reload();
        }
        onOpenChange(false);
        const route = routeForPagePath(index.manualDir, path);
        if (route) navigate(editHref(route));
      })
      .catch((cause: unknown) => {
        console.error(`manual: cannot create ${path}`, cause);
        setError(describeCause(cause));
      })
      .finally(() => setBusy(false));
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-(--container-md)">
        <DialogTitle className="font-heading font-bold text-lg">
          New page
        </DialogTitle>

        <div className="flex flex-col gap-3">
          <SelectField
            label="where"
            onChange={(next) => setKind(next as Kind)}
            options={KINDS}
            value={kind}
          />
          {kind.startsWith("product") ? (
            <SelectField
              label="product"
              onChange={setProduct}
              options={products}
              value={product}
            />
          ) : null}
          <TextField label="title" onChange={setTitle} required value={title} />
          {needsSlug ? (
            <TextField
              hint="Leave empty to take it from the title"
              label="slug"
              onChange={setSlug}
              placeholder={slugify(title)}
              value={slug}
            />
          ) : null}

          <Text as="p" className="font-mono" size="xs" tone="secondary">
            {path}
          </Text>
          {capability ? (
            <Text as="p" size="xs" tone="secondary">
              {known
                ? `Starts on the shelf for ${specId}: prose, spec, cases.`
                : `No spec \`${specId}\` in the store yet — the page starts on prose alone.`}
            </Text>
          ) : null}
          {problem && title.trim() !== "" ? (
            <Text as="p" className="text-destructive" size="xs">
              {problem}
            </Text>
          ) : null}
          {error ? (
            <Text as="p" className="text-destructive" size="xs">
              {error}
            </Text>
          ) : null}
        </div>

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
            disabled={problem !== null}
            loading={busy}
            onClick={create}
            size="sm"
            type="button"
          >
            Create the page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
