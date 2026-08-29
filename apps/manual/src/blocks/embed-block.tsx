import { Text } from "@grade10/design-system/components/display/text";
import { ArrowSquareOut, FigmaLogo, Play } from "@phosphor-icons/react";
import { type ReactNode, useState } from "react";
import type { FigmaBlock, StoryBlock } from "../content/grammar";
import { useBlockScope } from "./block-scope";

const DEFAULT_HEIGHT = 480;

type EmbedCardProps = {
  title: string;
  kind: string;
  icon: ReactNode;
  src: string;
  openUrl: string;
  openLabel: string;
  height: number;
};

/**
 * Third-party frames cost a network round trip and a lot of main thread, so a
 * page full of them loads none of them: the frame arrives on click.
 */
function EmbedCard({
  title,
  kind,
  icon,
  src,
  openUrl,
  openLabel,
  height,
}: EmbedCardProps) {
  const [loaded, setLoaded] = useState(false);

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
        <a
          className="ml-auto inline-flex items-center gap-1 text-secondary-foreground text-xs hover:text-foreground"
          href={openUrl}
          rel="noreferrer noopener"
          target="_blank"
        >
          {openLabel}
          <ArrowSquareOut aria-hidden size={12} />
        </a>
      </figcaption>

      {loaded ? (
        <iframe
          allowFullScreen
          className="w-full border-0 bg-background"
          height={height}
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
  return (
    <EmbedCard
      height={DEFAULT_HEIGHT}
      icon={<FigmaLogo aria-hidden size={16} />}
      kind="Figma frame"
      openLabel="Open in Figma"
      openUrl={block.url}
      src={`https://www.figma.com/embed?embed_host=grade10&url=${encodeURIComponent(block.url)}`}
      title={block.title}
    />
  );
}

export function StoryBlockView({ block }: { block: StoryBlock }) {
  const { index } = useBlockScope();
  const base = index.snapshot.config.storybookBase.replace(/\/$/, "");

  return (
    <EmbedCard
      height={block.height ?? DEFAULT_HEIGHT}
      icon={<Play aria-hidden size={16} />}
      kind="Storybook story"
      openLabel="Open in Storybook"
      openUrl={`${base}/?path=/story/${encodeURIComponent(block.id)}`}
      src={`${base}/iframe.html?id=${encodeURIComponent(block.id)}&viewMode=story`}
      title={block.title ?? block.id}
    />
  );
}
