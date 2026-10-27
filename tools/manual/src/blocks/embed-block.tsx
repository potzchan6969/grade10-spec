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
import { createContext, type ReactNode, use, useState } from "react";
import type { FigmaBlock, StoryBlock } from "../content/grammar";
import { useBlockScope } from "./block-scope";
import {
  type DesignVerdict,
  designSyncOf,
  designSyncOfFrame,
  isDrifting,
} from "./design-drift";

const DEFAULT_HEIGHT = 480;

/** Inside the side column an embed is the frame alone: the section beside
 * it already says what it is, so its header would only repeat it. */
export const BareEmbedContext = createContext(false);

type EmbedCardProps = {
  title: string;
  kind: string;
  icon: ReactNode;
  src: string;
  openUrl: string;
  openLabel: string;
  height: number;
  /** Draws the frame at this width, centred, rather than across the card. */
  width?: number;
  verdict?: DesignVerdict;
  /** A third-party frame costs a network round trip and a lot of main
   * thread, so a page full of them loads none of them: the frame arrives on
   * click. Our own Storybook workbench is worth seeing without that click,
   * so it loads eagerly instead. A frame that arrived broken — Storybook
   * still building, Figma timing out — reloads from its own header without
   * a full page load; remounting the iframe is the one way to make a
   * cross-origin frame fetch again. */
  lazy?: boolean;
};

function EmbedCard({
  title,
  kind,
  icon,
  src,
  openUrl,
  openLabel,
  height,
  width,
  verdict,
  lazy = true,
}: EmbedCardProps) {
  const [loaded, setLoaded] = useState(!lazy);
  const [generation, setGeneration] = useState(0);
  const [why, setWhy] = useState(false);

  const bare = use(BareEmbedContext);

  const reload = () => {
    setLoaded(true);
    setGeneration((current) => current + 1);
  };

  if (bare) {
    return (
      <figure className="group/embed relative m-0">
        {loaded ? (
          <iframe
            allowFullScreen
            className="mx-auto block max-w-full rounded-(--radius-2xl) border border-border bg-background"
            height={height}
            key={generation}
            src={src}
            style={{ width: width ? `${width}px` : "100%" }}
            title={title}
          />
        ) : (
          <button
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-(--radius-2xl) border border-border bg-background-subtle text-secondary-foreground hover:bg-muted"
            onClick={() => setLoaded(true)}
            style={{ height: `${Math.min(height, 320)}px` }}
            type="button"
          >
            <Play aria-hidden size={16} weight="fill" />
            <Text as="span" size="sm" weight="medium">
              Load {title}
            </Text>
          </button>
        )}
        {/* Drift is the one thing worth saying unasked; the rest shows on
            hover or focus. */}
        <figcaption className="absolute top-2 right-2 flex items-center gap-1">
          {verdict && isDrifting(verdict.class) ? (
            <DriftBadge
              expanded={why}
              onToggle={() => setWhy((open) => !open)}
              verdict={verdict}
            />
          ) : null}
          <span className="flex items-center gap-1 rounded-(--radius-md) border border-border bg-background/95 p-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover/embed:opacity-100">
            <IconButton
              aria-label={`Reload ${title}`}
              onClick={reload}
              size="xs"
              title={`Reload ${title}`}
              variant="ghost"
            >
              <ArrowClockwise aria-hidden />
            </IconButton>
            <a
              aria-label={`${openLabel}: ${title}`}
              className="inline-flex size-6 items-center justify-center rounded-(--radius-sm) text-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
              href={openUrl}
              rel="noreferrer noopener"
              target="_blank"
              title={openLabel}
            >
              <ArrowSquareOut aria-hidden size={12} />
            </a>
          </span>
        </figcaption>
        {verdict && why ? <DriftNote verdict={verdict} /> : null}
      </figure>
    );
  }

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

      {loaded && width ? (
        <div className="flex justify-center bg-background-subtle px-4 py-6">
          <iframe
            allowFullScreen
            className="max-w-full rounded-(--radius-2xl) border border-border bg-background"
            height={height}
            key={generation}
            src={src}
            style={{ width: `${width}px` }}
            title={title}
          />
        </div>
      ) : loaded ? (
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
      width={block.width}
      kind="Storybook story"
      lazy={false}
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
