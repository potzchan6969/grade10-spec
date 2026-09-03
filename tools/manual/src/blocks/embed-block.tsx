import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import {
  ArrowClockwise,
  ArrowSquareOut,
  CheckCircle,
  FigmaLogo,
  Play,
  WarningDiamond,
} from "@phosphor-icons/react";
import { type ReactNode, useState } from "react";
import type { FigmaBlock, StoryBlock } from "../content/grammar";
import { useBlockScope } from "./block-scope";
import {
  type DesignVerdict,
  designSyncOf,
  designSyncOfFrame,
  isDrifting,
} from "./design-drift";

const DEFAULT_HEIGHT = 480;

type EmbedCardProps = {
  title: string;
  kind: string;
  icon: ReactNode;
  src: string;
  openUrl: string;
  openLabel: string;
  height: number;
  verdict?: DesignVerdict;
};

/**
 * Third-party frames cost a network round trip and a lot of main thread, so a
 * page full of them loads none of them: the frame arrives on click. A frame
 * that arrived broken — Storybook still building, Figma timing out — reloads
 * from its own header without a full page load; remounting the iframe is the
 * one way to make a cross-origin frame fetch again.
 */
function EmbedCard({
  title,
  kind,
  icon,
  src,
  openUrl,
  openLabel,
  height,
  verdict,
}: EmbedCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [why, setWhy] = useState(false);

  const reload = () => {
    setLoaded(true);
    setGeneration((current) => current + 1);
  };

  return (
    <figure className="my-6 overflow-hidden rounded-(--radius-2xl) border border-border bg-card">
      <figcaption className="flex items-center gap-2 border-border-subtle border-b bg-background-subtle px-4 py-2.5">
        <span className="text-secondary-foreground">{icon}</span>
        <Text as="span" size="sm" weight="medium">
          {title}
        </Text>
        <Text as="span" size="xs" tone="secondary">
          {kind}
        </Text>
        {verdict ? (
          <DriftBadge
            expanded={why}
            onToggle={() => setWhy((open) => !open)}
            verdict={verdict}
          />
        ) : null}
        <span className="ml-auto flex items-center gap-2">
          <IconButton
            aria-label={`Reload ${kind}`}
            onClick={reload}
            size="xs"
            title={`Reload ${kind}`}
            variant="ghost"
          >
            <ArrowClockwise aria-hidden />
          </IconButton>
          <a
            className="inline-flex items-center gap-1 text-secondary-foreground text-xs hover:text-foreground"
            href={openUrl}
            rel="noreferrer noopener"
            target="_blank"
          >
            {openLabel}
            <ArrowSquareOut aria-hidden size={12} />
          </a>
        </span>
      </figcaption>

      {verdict && why ? <DriftNote verdict={verdict} /> : null}

      {loaded ? (
        <iframe
          allowFullScreen
          className="w-full border-0 bg-background"
          height={height}
          key={generation}
          src={src}
          title={title}
        />
      ) : (
        <button
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 bg-background-subtle text-secondary-foreground transition-colors hover:bg-muted"
          onClick={() => setLoaded(true)}
          style={{ height: `${Math.min(height, 320)}px` }}
          type="button"
        >
          <span className="flex size-12 items-center justify-center rounded-full border border-border bg-background">
            <Play aria-hidden size={20} weight="fill" />
          </span>
          <Text as="span" size="sm" weight="medium">
            Load {kind}
          </Text>
          <Text as="span" size="xs" tone="secondary">
            {title}
          </Text>
        </button>
      )}
    </figure>
  );
}

export function FigmaBlockView({ block }: { block: FigmaBlock }) {
  const { index } = useBlockScope();
  const verdict = designSyncOfFrame(index.snapshot.designSync, block);

  return (
    <EmbedCard
      height={DEFAULT_HEIGHT}
      icon={<FigmaLogo aria-hidden size={16} />}
      kind="Figma frame"
      openLabel="Open in Figma"
      openUrl={block.url}
      src={`https://www.figma.com/embed?embed_host=grade10&url=${encodeURIComponent(block.url)}`}
      title={block.title}
      verdict={verdict}
    />
  );
}

export function StoryBlockView({ block }: { block: StoryBlock }) {
  const { index } = useBlockScope();
  const base = index.snapshot.config.storybookBase.replace(/\/$/, "");
  const verdict = designSyncOf(index.snapshot.designSync, block.id);

  return (
    <EmbedCard
      height={block.height ?? DEFAULT_HEIGHT}
      icon={<Play aria-hidden size={16} />}
      kind="Storybook story"
      openLabel="Open in Storybook"
      openUrl={`${base}/?path=/story/${encodeURIComponent(block.id)}`}
      src={`${base}/iframe.html?id=${encodeURIComponent(block.id)}&viewMode=story`}
      title={block.title ?? block.id}
      verdict={verdict}
    />
  );
}

const DRIFT_LABEL: Record<DesignVerdict["class"], string> = {
  ok: "checked",
  skipped: "not compared",
  warn: "design drift",
  fail: "design drift",
};

const DRIFT_TITLE: Record<DesignVerdict["class"], string> = {
  ok: "The nightly design-sync check compared this component set against the code and found them agreeing.",
  skipped:
    "The nightly design-sync check reached this component set and found nothing it could compare.",
  warn: "The nightly design-sync check found this component set and its code disagreeing. It may be deliberate — someone has to settle it.",
  fail: "The nightly design-sync check found an error on this component set: Dev Mode would emit wrong code, or the code renders a value Figma does not draw.",
};

/** `ok` and `skipped` wear the quietest rungs the badge has: they are there so
 * that nothing is legible as "not checked", not to be read. */
const DRIFT_VARIANT = {
  ok: "outline",
  skipped: "default",
  warn: "warning",
  fail: "error",
} as const;

/**
 * Every verdict says something, including the quiet ones. `ok` renders too:
 * without it a page with no badges reads as "verified" when it usually means
 * "outside the sweep", and coverage gaps are the thing a designer most needs
 * to see. No link out — the run is long gone by the time anyone reads this —
 * but the badge opens what the run actually said.
 */
function DriftBadge({
  verdict,
  expanded,
  onToggle,
}: {
  verdict: DesignVerdict;
  expanded: boolean;
  onToggle: () => void;
}) {
  const loud = isDrifting(verdict.class);
  return (
    <Badge
      aria-expanded={expanded}
      className="cursor-pointer gap-1"
      render={<button onClick={onToggle} type="button" />}
      size="sm"
      title={DRIFT_TITLE[verdict.class]}
      variant={DRIFT_VARIANT[verdict.class]}
    >
      {loud ? (
        <WarningDiamond aria-hidden size={12} weight="fill" />
      ) : (
        <CheckCircle aria-hidden size={12} weight="fill" />
      )}
      {DRIFT_LABEL[verdict.class]}
    </Badge>
  );
}

/** The same verdict where there is no frame to open — an index of cards rather
 * than the card itself. */
export function VerdictChip({ verdict }: { verdict: DesignVerdict }) {
  return (
    <Badge
      className="gap-1"
      size="sm"
      title={DRIFT_TITLE[verdict.class]}
      variant={DRIFT_VARIANT[verdict.class]}
    >
      {isDrifting(verdict.class) ? (
        <WarningDiamond aria-hidden size={12} weight="fill" />
      ) : (
        <CheckCircle aria-hidden size={12} weight="fill" />
      )}
      {DRIFT_LABEL[verdict.class]}
    </Badge>
  );
}

const day = (iso: string) => iso.slice(0, 10);

/** What the run said, in its own words. The check computes a precise diff and
 * used to write it only to a job summary nobody keeps; this is where it lands
 * for the person looking at the card. */
function DriftNote({ verdict }: { verdict: DesignVerdict }) {
  return (
    <div className="space-y-1.5 border-border-subtle border-b bg-background-subtle px-4 py-3">
      {verdict.messages.map((line) => (
        <Text as="p" key={line} size="xs">
          {line}
        </Text>
      ))}
      <Text as="p" size="xs" tone="secondary">
        {verdict.set ? `${verdict.set} · ` : ""}checked{" "}
        {day(verdict.generatedAt)}
      </Text>
    </div>
  );
}
