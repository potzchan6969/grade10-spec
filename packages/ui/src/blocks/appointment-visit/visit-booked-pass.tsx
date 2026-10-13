import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  BookingConfirmation,
  type BookingConfirmationCopy,
  type BookingConfirmationProps,
} from "../appointment-booking/booking-confirmation";
import { FactCard, type FactRow } from "../page-blocks/fact-card";
import { NoteList } from "../page-blocks/note-list";
import { VisitPass, type VisitPassCopy } from "./visit-pass";

type VisitBookedPassCopy = {
  confirmation: BookingConfirmationCopy;
  /** The pass's words, drawn when the visit has a name. */
  pass: VisitPassCopy;
  directions: string;
  /** Until when it can be changed or cancelled. */
  until: string;
  before: string;
  getThere: string;
  another: string;
};

type VisitBookedPassProps = {
  copy: VisitBookedPassCopy;
  confirmation: Omit<BookingConfirmationProps, "copy" | "className">;
  /** Who the visit is booked for; without a name no pass is drawn. */
  name?: string | null;
  /** The shop on a map, opened outside the site. */
  directionsHref: string;
  /** What to bring and know, one line each. */
  before: readonly string[];
  /** The shop's name, address, directions and phone. */
  getThere: readonly FactRow[];
  onAgain: () => void;
  className?: string;
};

/** Booked: what was booked and the pass, with Directions, the calendar file
 * and the link that manages it. */
function VisitBookedPass({
  copy,
  confirmation,
  name,
  directionsHref,
  before,
  getThere,
  onAgain,
  className,
}: VisitBookedPassProps) {
  return (
    <VStack
      className={className}
      data-slot="booking-booked"
      gap="lg"
      hAlign="stretch"
    >
      <BookingConfirmation {...confirmation} copy={copy.confirmation} />
      {name ? <VisitPass copy={copy.pass} name={name} /> : null}
      <HStack gap="md" wrap>
        <Link href={directionsHref} rel="noopener" target="_blank">
          {copy.directions}
        </Link>
      </HStack>
      <Text as="p" size="sm" tone="secondary">
        {copy.until}
      </Text>
      <FactCard copy={{ title: copy.before }} slot="booking-before">
        <NoteList
          notes={before.map((line, index) => ({
            id: String(index),
            content: line,
          }))}
        />
      </FactCard>
      <FactCard
        copy={{ title: copy.getThere }}
        rows={getThere}
        slot="booking-get-there"
      />
      <HStack gap="sm">
        <Button onClick={onAgain} size="md" type="button" variant="outline">
          {copy.another}
        </Button>
      </HStack>
    </VStack>
  );
}

export type { VisitBookedPassCopy, VisitBookedPassProps };
export { VisitBookedPass };
