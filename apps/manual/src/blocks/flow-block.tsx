import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CaretLeft, CaretRight, FlowArrow } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import type { FlowBlock } from "../content/grammar";
import { BlockView } from "./block-view";
import {
  type FlowStep,
  railScrollLeft,
  splitSteps,
  stepTokens,
} from "./flow-steps";
import { sanitizeSvg } from "./sanitize-svg";

export function FlowBlockView({ block }: { block: FlowBlock }) {
  const steps = useMemo(() => splitSteps(block), [block]);
  const [active, setActive] = useState(0);
  const { hash } = useLocation();

  useEffect(() => {
    const target = decodeURIComponent(hash.replace(/^#/, ""));
    const found = steps.findIndex((step) => step.id === target);
    if (found >= 0) setActive(found);
  }, [hash, steps]);

  const move = (delta: number) => {
    setActive((current) =>
      Math.min(steps.length - 1, Math.max(0, current + delta)),
    );
  };

  return (
    <section
      aria-label={`${block.title} — step player`}
      className="my-6 overflow-hidden rounded-(--radius-2xl) border border-border bg-card"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
      }}
    >
      <header className="flex items-center gap-2 border-border-subtle border-b bg-background-subtle px-4 py-2.5">
        <span className="inline-flex text-secondary-foreground">
          <FlowArrow aria-hidden size={16} />
        </span>
        <Text as="span" size="sm" weight="bold">
          {block.title}
        </Text>
        <Text
          as="span"
          className="ml-auto font-mono"
          size="xs"
          tone="secondary"
        >
          {active + 1}/{steps.length}
        </Text>
      </header>

      {block.diagram ? (
        <FlowDiagram active={active} src={block.diagram} steps={steps} />
      ) : null}

      <StepRail active={active} onSelect={setActive} steps={steps} />

      <div
        aria-live="polite"
        className="px-4 py-4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
        id={steps[active].id}
      >
        <Text as="p" className="mb-2" size="xs" tone="secondary">
          Step {active + 1} · {steps[active].title}
        </Text>
        {steps[active].items.length === 0 ? (
          <Text as="p" size="sm" tone="secondary">
            This step carries no body.
          </Text>
        ) : (
          steps[active].items.map((item, position) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
            <BlockView block={item} key={`${item.type}-${position}`} />
          ))
        )}
      </div>

      <footer className="flex items-center justify-between gap-2 border-border-subtle border-t px-4 py-3">
        <Button
          disabled={active === 0}
          leading={<CaretLeft aria-hidden />}
          onClick={() => move(-1)}
          size="sm"
          variant="secondary"
        >
          Previous
        </Button>
        <Button
          disabled={active === steps.length - 1}
          onClick={() => move(1)}
          size="sm"
          trailing={<CaretRight aria-hidden />}
          variant="secondary"
        >
          Next
        </Button>
      </footer>
    </section>
  );
}

function StepRail({
  steps,
  active,
  onSelect,
}: {
  steps: FlowStep[];
  active: number;
  onSelect: (index: number) => void;
}) {
  const track = useRef<HTMLOListElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  const readEdges = () => {
    const element = track.current;
    if (!element) return;
    const room = element.scrollWidth - element.clientWidth;
    setEdges({
      start: element.scrollLeft > 4,
      end: room > 4 && element.scrollLeft < room - 4,
    });
  };

  // The rail is the only thing that says how many steps there are, so the chip
  // for the step being read comes to the reader rather than the other way round.
  // biome-ignore lint/correctness/useExhaustiveDependencies: steps.length is the trigger — a new flow re-measures its own edges.
  useEffect(() => {
    const element = track.current;
    const chip = element?.children[active];
    if (!element || !(chip instanceof HTMLElement)) return;
    const left = railScrollLeft(element, chip);
    if (left !== element.scrollLeft) {
      element.scrollTo({ left, behavior: "smooth" });
    }
    readEdges();
  }, [active, steps.length]);

  return (
    <div className="relative border-border-subtle border-b">
      <ol
        className="flex gap-2 overflow-x-auto px-4 py-3"
        onScroll={readEdges}
        ref={track}
      >
        {steps.map((step, position) => {
          const current = position === active;
          return (
            <li key={step.id}>
              <button
                aria-current={current ? "step" : undefined}
                className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  current
                    ? "border-primary-border bg-primary-muted text-primary-muted-foreground"
                    : "border-border bg-background-subtle text-secondary-foreground hover:border-border-strong hover:text-foreground"
                }`}
                onClick={() => onSelect(position)}
                type="button"
              >
                <span
                  className={`flex size-4 items-center justify-center rounded-full font-mono text-[0.625rem] ${current ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  {position + 1}
                </span>
                {step.title}
              </button>
            </li>
          );
        })}
      </ol>

      {/* There are more steps than fit. Say so at the edge they run off. */}
      {edges.start ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-card to-transparent"
        />
      ) : null}
      {edges.end ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card to-transparent"
        />
      ) : null}
    </div>
  );
}

type DiagramState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "unavailable"; reason: string };

function FlowDiagram({
  src,
  steps,
  active,
}: {
  src: string;
  steps: FlowStep[];
  active: number;
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
    const tokens = stepTokens(steps[active], active);
    for (const element of Array.from(
      host.current?.querySelectorAll("[data-step]") ?? [],
    )) {
      const claimed = (element.getAttribute("data-step") ?? "")
        .split(/[\s,]+/)
        .filter(Boolean);
      element.classList.toggle(
        "data-step-active",
        claimed.some((token) => tokens.has(token)),
      );
    }
  }, [active, state.status, steps]);

  return (
    <div className="border-border-subtle border-b bg-background-subtle px-4 py-4">
      <div className="manual-flow-diagram mx-auto max-w-2xl" ref={host} />
      {state.status === "unavailable" ? (
        <Text as="p" size="xs" title={state.reason} tone="secondary">
          {src} is not being served, so this flow runs as text. The steps read
          on their own.
        </Text>
      ) : null}
    </div>
  );
}
