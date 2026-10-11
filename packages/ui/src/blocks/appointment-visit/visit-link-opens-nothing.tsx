import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { NoteList } from "../page-blocks/note-list";

type VisitLinkOpensNothingCopy = {
  title: string;
  lede: string;
  /** Each reason the link may not open a visit. */
  missing: string;
  older: string;
  moved: string;
  mine: string;
  book: string;
  /** The way in with a visit code instead. */
  code: string;
};

type VisitLinkOpensNothingProps = {
  copy: VisitLinkOpensNothingCopy;
  mineHref: string;
  bookHref: string;
};

/** A link that opens no visit says why it may not, and never guesses one. */
function VisitLinkOpensNothing({
  copy,
  mineHref,
  bookHref,
}: VisitLinkOpensNothingProps) {
  return (
    <VStack data-slot="visit-not-found" gap="md" hAlign="stretch">
      <Text as="h2" size="xl" weight="bold">
        {copy.title}
      </Text>
      <Text as="p" tone="secondary">
        {copy.lede}
      </Text>
      <NoteList
        notes={[
          { id: "missing", content: copy.missing },
          { id: "older", content: copy.older },
          { id: "moved", content: copy.moved },
        ]}
      />
      <HStack gap="md" wrap>
        <Link href={mineHref}>{copy.mine}</Link>
        <Link href={bookHref}>{copy.book}</Link>
      </HStack>
      <Text as="p" size="sm" tone="secondary">
        {copy.code}
      </Text>
    </VStack>
  );
}

export type { VisitLinkOpensNothingCopy, VisitLinkOpensNothingProps };
export { VisitLinkOpensNothing };
