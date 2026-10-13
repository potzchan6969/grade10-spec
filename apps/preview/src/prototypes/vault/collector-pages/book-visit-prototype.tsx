import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { EmptyPanel, FactCard } from "@grade10/ui";
import { SHOP_ADDRESS, SHOP_NAME } from "../../../pages/vault-content";
import {
  PageHeader,
  PrototypeNote,
  VaultPageShell,
} from "../../../pages/vault-shared";
import { navigateToStory } from "../../../pages/workbench-story-nav";
import {
  BOOK_A_VISIT_BOOKED_STORY_ID,
  BOOK_A_VISIT_COPY,
  BOOK_A_VISIT_TIMES_STORY_ID,
  COLLECTOR_PAGES_MANUAL_PATH,
} from "./collector-pages-content";

type BookVisitState = "shop" | "times" | "nothing-free" | "booked";

type BookVisitPrototypeProps = { state: BookVisitState };

const { shop, times, nothingFree, booked } = BOOK_A_VISIT_COPY;

/** One step of booking a visit. Flows draw it alone. */
function BookVisitBody({ state }: BookVisitPrototypeProps) {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      {state === "shop" ? (
        <FactCard
          copy={{ title: shop.title }}
          lead={shop.lead}
          rows={[{ label: "Address", value: SHOP_ADDRESS }]}
          actions={
            <Button
              onClick={() => navigateToStory(BOOK_A_VISIT_TIMES_STORY_ID)}
            >
              {shop.choose}
            </Button>
          }
        >
          <Text weight="medium">{SHOP_NAME}</Text>
        </FactCard>
      ) : null}
      {state === "times" ? (
        <FactCard copy={{ title: times.title, description: times.day }}>
          <div className="flex flex-wrap gap-2">
            {times.slots.map((slot) => (
              <Button
                aria-label={`${slot}, ${times.day}`}
                key={slot}
                onClick={() => navigateToStory(BOOK_A_VISIT_BOOKED_STORY_ID)}
                variant="outline"
              >
                {slot}
              </Button>
            ))}
          </div>
          <Text size="sm" tone="secondary">
            {times.zone}
          </Text>
          <Text size="sm" tone="secondary">
            {times.moveCancel}
          </Text>
        </FactCard>
      ) : null}
      {state === "nothing-free" ? (
        <EmptyPanel
          copy={{
            title: nothingFree.title,
            description: nothingFree.description,
          }}
          actions={
            <Button
              onClick={() => navigateToStory(BOOK_A_VISIT_TIMES_STORY_ID)}
              variant="outline"
            >
              {nothingFree.chooseDay}
            </Button>
          }
          slot="book-visit-nothing-free"
        />
      ) : null}
      {state === "booked" ? (
        <FactCard
          copy={{ title: booked.title }}
          lead={booked.lead}
          rows={booked.rows}
          actions={
            <>
              <Button variant="outline">{booked.calendar}</Button>
              <Button variant="outline">{booked.move}</Button>
              <Button variant="outline">{booked.cancel}</Button>
            </>
          }
        />
      ) : null}
    </div>
  );
}

/** Book a visit: the shop, a time, nothing free, and the visit booked. A wireframe. */
function BookVisitPrototype({ state }: BookVisitPrototypeProps) {
  return (
    <VaultPageShell>
      <PrototypeNote
        manualPath={COLLECTOR_PAGES_MANUAL_PATH}
        settles="where the shop and slot pickers sit on the case page and how the booked visit reads."
      />
      <PageHeader title="Book a visit" />
      <BookVisitBody state={state} />
    </VaultPageShell>
  );
}

export type { BookVisitPrototypeProps, BookVisitState };
export { BookVisitBody, BookVisitPrototype };
