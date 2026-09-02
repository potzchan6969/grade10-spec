import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Text } from "@grade10/design-system/components/display/text";
import { BookOpenText } from "@phosphor-icons/react";
import { Link, useParams } from "react-router";
import { REFERENCES_ROUTE } from "../api/derive";
import { useManualIndex } from "../api/use-manual-index";
import { useReference } from "../api/use-reference";
import { FileMeta, withoutLeadingTitle } from "../blocks/change-document";
import { MarkdownView } from "../blocks/markdown";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

const DIR = "docs/references";

/**
 * The store's references, read where the pages that cite them are read. A
 * reference is evidence — an owner's draft, competitor research, a vendor's
 * working notes — so it renders as written, never edited here, and the
 * landing says as much in the store's own words.
 */
export function ReferencesPage() {
  const index = useManualIndex();
  useDocumentTitle("References");
  const readme = index.snapshot.referencesReadme;

  return (
    <>
      <PageHeading eyebrow="Store" title="References" />
      {readme ? (
        <MarkdownView
          baseDir={DIR}
          className="manual-prose"
          index={index}
          text={withoutLeadingTitle(readme)}
        />
      ) : null}
      {index.references.length === 0 ? (
        <EmptyState
          compact
          description={`Nothing is filed under ${DIR}/ in this store.`}
          icon={<BookOpenText aria-hidden />}
          title="No references"
        />
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {index.references.map((item) => (
            <li key={item.id}>
              <Link
                className="block rounded-(--radius-2xl) border border-border px-4 py-3 transition-colors hover:bg-muted"
                to={item.to}
              >
                <Text as="span" className="block font-medium" size="sm">
                  {item.title}
                </Text>
                <Text
                  as="span"
                  className="mt-1 block font-mono"
                  size="xs"
                  tone="secondary"
                >
                  {DIR}/{item.id}.md
                </Text>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function ReferencePage() {
  const { slug = "" } = useParams();
  const index = useManualIndex();
  const listed = index.references.find((item) => item.id === slug);
  const reference = useReference(slug);
  useDocumentTitle(listed?.title ?? slug);

  if (!listed) {
    return (
      <>
        <PageHeading
          eyebrow="References"
          summary="No reference in the store answers to that name."
          title="No such reference"
        />
        <Text as="p" className="mb-6 font-mono" size="sm" tone="secondary">
          {DIR}/{slug}.md
        </Text>
        <Text as="p" size="sm">
          <Link className="underline underline-offset-2" to={REFERENCES_ROUTE}>
            Every reference the store holds
          </Link>
        </Text>
      </>
    );
  }

  return (
    <>
      <PageHeading
        eyebrow={
          <Link className="hover:underline" to={REFERENCES_ROUTE}>
            References
          </Link>
        }
        title={listed.title}
      />
      {reference.status === "loading" ? (
        <div aria-busy="true" className="space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-40 w-full rounded-(--radius-2xl)" />
        </div>
      ) : null}
      {reference.status === "unavailable" ? (
        <EmptyState
          compact
          description={`The document could not be read: ${reference.reason}.`}
          title="Reference unavailable"
        />
      ) : null}
      {reference.status === "ready" ? (
        <>
          <FileMeta
            commit={reference.document.lastCommit}
            path={reference.document.path}
          />
          <MarkdownView
            anchors
            baseDir={DIR}
            className="manual-prose"
            index={index}
            text={withoutLeadingTitle(reference.document.text)}
          />
        </>
      ) : null}
    </>
  );
}
