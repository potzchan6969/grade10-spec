import { Section, Text } from "react-email";

export type PickupBlockProps = {
  /** Shown at the counter; the letter leads with it. */
  code: string;
  items: string;
  where: string;
  open: string;
  toSettle: string;
  /** What to bring. Left out on the reminder letters, which ask for nothing. */
  bring?: string;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <Text className="mb-0.5 mt-0 text-sm text-secondary-fg">{label}</Text>
      <Text className="mb-3 mt-0 text-base leading-base text-fg">{value}</Text>
    </>
  );
}

/** The pickup card as a letter prints it: code, where, open, due, bring. */
export function PickupBlock({
  code,
  items,
  where,
  open,
  toSettle,
  bring,
}: PickupBlockProps) {
  return (
    <Section className="my-6 rounded-lg border border-solid border-stroke p-6">
      <Text className="mb-0.5 mt-0 text-sm text-secondary-fg">Pickup code</Text>
      <Text className="mb-3 mt-0 text-xl font-bold leading-tight text-fg">
        {code}
      </Text>
      <Row label="Items" value={items} />
      <Row label="Where" value={where} />
      <Row label="Open" value={open} />
      <Row label="To settle" value={toSettle} />
      {bring ? <Row label="Bring" value={bring} /> : null}
    </Section>
  );
}
