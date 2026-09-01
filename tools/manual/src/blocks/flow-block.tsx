import { Text } from "@grade10/design-system/components/display/text";
import { FlowArrow } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FlowBlock } from "../content/grammar";
import { AnchorLink } from "./anchor";
import { BlockView } from "./block-view";
import {
  type FlowPhase,
  type FlowStep,
  flowSteps,
  splitFlow,
  stepTokens,
} from "./flow-steps";
import { sanitizeSvg } from "./sanitize-svg";

/** Set while a step is pointed at, so a diagram can answer it. */
type Point = (step: FlowStep | null) => void;

export function FlowBlockView({ block }: { block: FlowBlock }) {
  const phases = useMemo(() => splitFlow(block), [block]);
  const steps = useMemo(() => flowSteps(phases), [phases]);
  const [pointed, setPointed] = useState<FlowStep | null>(null);

  return (
    <section
      aria-label={block.title}
      className="my-6 overflow-hidden rounded-(--radius-2xl) border border-border bg-card"
    >
      <header className="flex items-center gap-2 border-border-subtle border-b bg-background-subtle px-4 py-2.5">
        <span className="inline-flex text-secondary-foreground">
          <FlowArrow aria-hidden size={16} />
        </span>
        <Text as="span" size="sm" weight="bold">
          {block.title}
        </Text>
        <Text as="span" className="ml-auto" size="xs" tone="secondary">
          {steps.length} {steps.length === 1 ? "step" : "steps"}
        </Text>
      </header>

      {block.diagram ? (
        <FlowDiagram pointed={pointed} src={block.diagram} />
      ) : null}

      <div className="divide-y divide-border-subtle">
        {phases.map((phase) => (
          <PhaseSection
            key={phase.id}
            onPoint={block.diagram ? setPointed : null}
            phase={phase}
          />
        ))}
      </div>
    </section>
  );
}

function PhaseSection({
  phase,
  onPoint,
}: {
  phase: FlowPhase;
  onPoint: Point | null;
}) {
  const first = phase.steps[0];
  const last = phase.steps[phase.steps.length - 1];

  return (
    <section className="px-4 py-4" id={phase.id}>
      {phase.title === null ? null : (
        <header className="mb-3 flex items-baseline gap-3">
          <Text
            as="h3"
            className="uppercase tracking-wide"
            size="xs"
            weight="bold"
          >
            {phase.title}
          </Text>
          {first ? (
            <Text as="span" className="ml-auto" size="xs" tone="secondary">
              {first === last
                ? `Step ${first.number}`
                : `Steps ${first.number}–${last.number}`}
            </Text>
          ) : null}
        </header>
      )}

      {phase.lede.length === 0 ? null : (
        <div className="manual-flow-body mb-4 text-secondary-foreground">
          <Items items={phase.lede} />
        </div>
      )}

      {first ? (
        <ol start={first.number}>
          {phase.steps.map((step, position) => (
            <StepRow
              key={step.id}
              last={position === phase.steps.length - 1}
              onPoint={onPoint}
              step={step}
            />
          ))}
        </ol>
      ) : null}
    </section>
  );
}

function StepRow({
  step,
  last,
  onPoint,
}: {
  step: FlowStep;
  last: boolean;
  onPoint: Point | null;
}) {
  const claim = onPoint
    ? {
        onBlur: () => onPoint(null),
        onFocus: () => onPoint(step),
        onMouseEnter: () => onPoint(step),
        onMouseLeave: () => onPoint(null),
      }
    : {};

  return (
    <li
      className="group/anchor relative flex gap-3 pb-5 last:pb-0"
      id={step.id}
      {...claim}
    >
      {last ? null : (
        <span
          aria-hidden
          className="-translate-x-1/2 absolute top-7 bottom-0 left-3 w-px bg-border"
        />
      )}
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-[0.6875rem] text-secondary-foreground">
        {step.number}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex min-h-6 items-center gap-1">
          <Text as="span" size="sm" weight="bold">
            {step.title}
          </Text>
          <AnchorLink
            className="shrink-0"
            id={step.id}
            label="Copy link to this step"
          />
        </div>
        {step.items.length === 0 ? null : (
          <div className="manual-flow-body mt-1">
            <Items items={step.items} />
          </div>
        )}
      </div>
    </li>
  );
}

function Items({ items }: { items: FlowStep["items"] }) {
  return (
    <>
      {items.map((item, position) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
        <BlockView block={item} key={`${item.type}-${position}`} />
      ))}
    </>
  );
}

type DiagramState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "unavailable"; reason: string };

function FlowDiagram({
  src,
  pointed,
}: {
  src: string;
  pointed: FlowStep | null;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<DiagramState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    const url = `/${src.replace(/^\/+/, "")}`;

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`${url} answered ${response.status}`);
        return response.text();
      })
      .then((text) => {
        const svg = sanitizeSvg(text);
        if (!svg) throw new Error(`${url} is not an SVG`);
        const mount = host.current;
        if (!mount) return;
        mount.replaceChildren(svg);
        setState({ status: "ready" });
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "unavailable",
          reason: cause instanceof Error ? cause.message : String(cause),
        });
      });

    return () => controller.abort();
  }, [src]);

  useEffect(() => {
    if (state.status !== "ready") return;
    const tokens = pointed ? stepTokens(pointed) : null;
    for (const element of Array.from(
      host.current?.querySelectorAll("[data-step]") ?? [],
    )) {
      const claimed = (element.getAttribute("data-step") ?? "")
        .split(/[\s,]+/)
        .filter(Boolean);
      element.classList.toggle(
        "data-step-active",
        tokens !== null && claimed.some((token) => tokens.has(token)),
      );
    }
  }, [pointed, state.status]);

  return (
    <div className="border-border-subtle border-b bg-background-subtle px-4 py-4">
      <div
        className="manual-flow-diagram mx-auto max-w-2xl"
        data-seeking={pointed ? "" : undefined}
        ref={host}
      />
      {state.status === "unavailable" ? (
        <Text as="p" size="xs" title={state.reason} tone="secondary">
          {src} is not being served, so this flow runs as text. The steps read
          on their own.
        </Text>
      ) : null}
    </div>
  );
}
