import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import {
  ArrowSquareOut,
  FigmaLogo,
  Play,
  WarningDiamond,
} from "@phosphor-icons/react";
import { Link } from "react-router";
import {
  type DesignCard,
  type DesignShelf,
  designShelves,
} from "../api/derive";
import { slugify } from "../api/paths";
import type { DesignSyncReport } from "../api/types";
import { useManualIndex } from "../api/use-manual-index";
import { designSyncOf, designSyncOfFrame } from "../blocks/design-drift";
import { VerdictChip } from "../blocks/embed-block";
import { ReadOnlyNotice } from "../editor/read-only-notice";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

/**
 * Every visual in the manual, by the page that shows it. A designer's question
 * is "which pages show my designs" and the nav — group, product, capability —
 * cannot answer it; nothing here is new data, only the one arrangement the
 * taxonomy never offered.
 */
export function DesignPage() {
  const index = useManualIndex();
  useDocumentTitle("Design");
  const shelves = designShelves(index);
  const report = index.snapshot.designSync;
  const cards = shelves.reduce((sum, shelf) => sum + shelf.cards.length, 0);

  return (
    <>
      <ReadOnlyNotice className="mb-3 text-right" />
      <PageHeading
        summary="Every Figma frame and Storybook story the manual shows, and what the nightly check said about it."
        title="Design"
      />

      {shelves.length === 0 ? (
        <EmptyState
          description="No page in this snapshot embeds a Figma frame or a story."
          icon={<FigmaLogo aria-hidden />}
          title="Nothing embedded"
        />
      ) : (
        <>
          <Text as="p" size="sm" tone="secondary">
            {cards} cards across {shelves.length}{" "}
            {shelves.length === 1 ? "page" : "pages"}
            {report ? ` · last checked ${report.generatedAt.slice(0, 10)}` : ""}
          </Text>
          {report ? null : <NoReportNotice />}
          <div className="mt-5 space-y-6">
            {shelves.map((shelf) => (
              <Shelf key={shelf.route} report={report} shelf={shelf} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

/**
 * The page's own rule, applied to itself: a run that checked nothing must not
 * look like a clean run. Without a report every card below renders no verdict,
 * and that silence used to be indistinguishable from "checked and fine" — the
 * exact failure the design-sync rail exists to prevent.
 */
function NoReportNotice() {
  return (
    <div className="mt-3 flex items-baseline gap-2 rounded-(--radius-xl) border border-warning/40 bg-warning/8 px-4 py-2.5">
      <span className="inline-flex translate-y-0.5 text-warning">
        <WarningDiamond aria-hidden size={14} weight="fill" />
      </span>
      <Text as="p" size="sm">
        No nightly report found — nothing below has been checked, so a missing
        badge means unchecked, not fine. The nightly design-sync run commits{" "}
        <code className="font-mono text-xs">.design-sync/report.json</code>;{" "}
        <code className="font-mono text-xs">
          pnpm run design-sync:check --report .design-sync/report.json
        </code>{" "}
        writes one by hand.
      </Text>
    </div>
  );
}

function Shelf({
  shelf,
  report,
}: {
  shelf: DesignShelf;
  report?: DesignSyncReport;
}) {
  return (
    <section>
      <div className="mb-2 flex flex-wrap items-baseline gap-2">
        <h2
          className="font-heading font-bold text-base"
          id={slugify(shelf.route)}
        >
          <Link className="hover:underline" to={shelf.route}>
            {shelf.title}
          </Link>
        </h2>
        <Text as="span" size="xs" tone="secondary">
          {shelf.cards.length} {shelf.cards.length === 1 ? "card" : "cards"}
        </Text>
      </div>
      <ul className="divide-y divide-border-subtle rounded-(--radius-2xl) border border-border bg-card">
        {shelf.cards.map((card) => (
          <li key={cardKey(card)}>
            <CardRow card={card} report={report} route={shelf.route} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const cardKey = (card: DesignCard) =>
  card.type === "figma" ? `figma:${card.url}` : `story:${card.id}`;

function CardRow({
  card,
  route,
  report,
}: {
  card: DesignCard;
  route: string;
  report?: DesignSyncReport;
}) {
  const verdict =
    card.type === "figma"
      ? designSyncOfFrame(report, card)
      : designSyncOf(report, card.id);

  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 px-3.5 py-2.5">
      <span className="inline-flex shrink-0 text-secondary-foreground">
        {card.type === "figma" ? (
          <FigmaLogo aria-hidden size={14} />
        ) : (
          <Play aria-hidden size={14} />
        )}
      </span>
      <Link className="min-w-0 text-sm hover:underline" to={route}>
        {card.type === "figma" ? card.title : (card.title ?? card.id)}
      </Link>
      {card.type === "story" ? (
        <Badge className="font-mono" size="sm" variant="outline">
          {card.id}
        </Badge>
      ) : null}
      {card.type === "figma" && card.set ? (
        <Text as="span" className="font-mono" size="xs" tone="secondary">
          {card.set}
        </Text>
      ) : null}
      <span className="ml-auto flex items-center gap-2">
        {verdict ? <VerdictChip verdict={verdict} /> : null}
        {card.type === "figma" ? (
          <a
            aria-label={`Open ${card.title} in Figma`}
            className="inline-flex items-center gap-1 text-secondary-foreground text-xs hover:text-foreground"
            href={card.url}
            rel="noreferrer noopener"
            target="_blank"
          >
            Figma
            <ArrowSquareOut aria-hidden size={12} />
          </a>
        ) : null}
      </span>
    </div>
  );
}
