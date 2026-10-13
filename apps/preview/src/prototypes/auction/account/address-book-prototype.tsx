import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { Link } from "@grade10/design-system/components/forms/link";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { AuctionAddressForm, EmptyPanel, SiteHeader } from "@grade10/ui";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../../pages/store-content";
import { navigateToStory } from "../../../pages/workbench-story-nav";
import {
  ADDRESS_BOOK_CAP,
  ADDRESS_BOOK_COPY,
  ADDRESS_BOOK_STORY_IDS,
  ADDRESS_FORM_COPY,
  type AddressBookState,
  SAVED_ADDRESSES,
} from "./address-book-content";

const SHOWN_ADDRESSES = {
  empty: [],
  saved: SAVED_ADDRESSES.slice(0, 2),
  add: SAVED_ADDRESSES.slice(0, 2),
  edit: SAVED_ADDRESSES.slice(0, 2),
  "full-book": SAVED_ADDRESSES,
} as const;

/** One saved address: its label, its lines, and the controls that change it. */
function SavedAddressRow({
  address,
  onEdit,
}: {
  address: (typeof SAVED_ADDRESSES)[number];
  onEdit: () => void;
}) {
  const lines = [
    address.values.addressLine1,
    address.values.city,
    address.values.country,
  ];
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <Text weight="medium">{address.label}</Text>
          {address.isDefault ? (
            <Badge variant="brand">{ADDRESS_BOOK_COPY.defaultLabel}</Badge>
          ) : null}
        </div>
        <Text size="sm" tone="secondary">
          {lines.join(", ")}
        </Text>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          aria-label={`${ADDRESS_BOOK_COPY.edit} ${address.label} address`}
          onClick={onEdit}
          size="sm"
          variant="outline"
        >
          {ADDRESS_BOOK_COPY.edit}
        </Button>
        <Button
          aria-label={`${ADDRESS_BOOK_COPY.remove} ${address.label} address`}
          size="sm"
          variant="ghost"
        >
          {ADDRESS_BOOK_COPY.remove}
        </Button>
      </div>
    </div>
  );
}

/** The address book: the saved list, the empty book, a new address and an edit. A wireframe. */
function AddressBookPanel({ state }: { state: AddressBookState }) {
  const shown = SHOWN_ADDRESSES[state];
  const full = shown.length >= ADDRESS_BOOK_CAP;

  if (state === "empty")
    return (
      <EmptyPanel
        actions={
          <Button onClick={() => navigateToStory(ADDRESS_BOOK_STORY_IDS.add)}>
            {ADDRESS_BOOK_COPY.add}
          </Button>
        }
        copy={{
          title: ADDRESS_BOOK_COPY.empty.title,
          description: ADDRESS_BOOK_COPY.empty.description,
        }}
        slot="address-book-empty"
      />
    );

  if (state === "add" || state === "edit") {
    const editing = SAVED_ADDRESSES[0];
    const back = () => navigateToStory(ADDRESS_BOOK_STORY_IDS.saved);
    return (
      <div className="flex flex-col gap-5 rounded-2xl border border-border p-5">
        <Text size="lg" weight="medium">
          {state === "add"
            ? ADDRESS_BOOK_COPY.addTitle
            : ADDRESS_BOOK_COPY.editTitle}
        </Text>
        <AuctionAddressForm
          copy={ADDRESS_FORM_COPY}
          initialValues={state === "edit" ? editing.values : undefined}
          onCancel={back}
          onConfirm={back}
        />
        {state === "edit" ? (
          <CheckboxListInput defaultChecked={editing.isDefault} size="sm">
            {ADDRESS_BOOK_COPY.useDefault}
          </CheckboxListInput>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Text weight="medium">{ADDRESS_BOOK_COPY.saved}</Text>
      {shown.map((address) => (
        <SavedAddressRow
          address={address}
          key={address.id}
          onEdit={() => navigateToStory(ADDRESS_BOOK_STORY_IDS.edit)}
        />
      ))}
      <Text size="sm" tone="secondary">
        {full ? ADDRESS_BOOK_COPY.full : ADDRESS_BOOK_COPY.oneTime}
      </Text>
      <div>
        <Button
          disabled={full}
          onClick={() => navigateToStory(ADDRESS_BOOK_STORY_IDS.add)}
          variant="outline"
        >
          {ADDRESS_BOOK_COPY.add}
        </Button>
      </div>
    </div>
  );
}

/** The address book page: the store's header and footer around the book. */
function AddressBookPrototype({ state }: { state: AddressBookState }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <main className="flex w-full flex-1 justify-center px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div className="flex w-full max-w-3xl flex-col gap-8 md:gap-10">
          <aside className="flex flex-col gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-4">
            <Text size="sm" weight="medium">
              Not yet designed
            </Text>
            <Text size="sm" tone="secondary">
              The design must still settle where a collector adds, edits and
              removes a saved address outside an order, and whether a full book
              can be cleared before an address deadline. Manual page:{" "}
              <Link href="https://spec.grade10-stg.com/p/grade10-site/auction/account">
                auction/account
              </Link>
              .
            </Text>
          </aside>
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
              {ADDRESS_BOOK_COPY.title}
            </h1>
            <Text className="text-secondary-foreground">
              {ADDRESS_BOOK_COPY.description}
            </Text>
          </div>
          <AddressBookPanel state={state} />
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

export { AddressBookPrototype };
