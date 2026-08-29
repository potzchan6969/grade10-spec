/// <reference path="./demo-flow.css.d.ts" />
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { SquaresFour, Tree } from "@phosphor-icons/react";
import {
  type ReactNode,
  type Ref,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./demo-flow.css";

type FlowContainerMode = "transition" | "expanded";
type FlowContainerLayout = "single" | "row";

type FlowContainerProps<T> = {
  /** Insertion-ordered title → state pairs (`Map` or `[title, value][]`). */
  cases: Iterable<readonly [string, T]>;
  children: (value: T, title: string) => ReactNode;
};

type MotionTimes = {
  duration: number;
  stagger: number;
  easing: string;
};

function readTime(value: string): number {
  const trimmed = value.trim();
  if (trimmed.endsWith("ms")) return Number.parseFloat(trimmed);
  if (trimmed.endsWith("s")) return Number.parseFloat(trimmed) * 1000;
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : 0;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function motionTimes(node: HTMLElement): MotionTimes {
  const styles = getComputedStyle(node);
  return {
    duration: readTime(styles.getPropertyValue("--duration-very-slow")) || 500,
    stagger: readTime(styles.getPropertyValue("--duration-stagger")) || 80,
    easing:
      styles.getPropertyValue("--ease-smooth-out").trim() ||
      "cubic-bezier(0.22, 1, 0.36, 1)",
  };
}

function clearMotion(card: HTMLElement) {
  card.style.transform = "";
  card.style.opacity = "";
}

async function runCardMotion(
  card: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
  animations: Animation[],
  persist: boolean,
) {
  const animation = card.animate(keyframes, options);
  animations.push(animation);
  try {
    await animation.finished;
    if (persist) {
      animation.commitStyles();
    }
  } catch {
    // Cancelled because the other mode was chosen mid-flight.
  } finally {
    animation.cancel();
    if (!persist) {
      clearMotion(card);
    }
  }
}

function playSpread(
  cards: HTMLElement[],
  origin: DOMRect,
  times: MotionTimes,
  animations: Animation[],
) {
  return Promise.all(
    cards.map((card, index) => {
      const last = card.getBoundingClientRect();
      const fromLeft = index === 0 ? origin.left : origin.right;
      return runCardMotion(
        card,
        [
          {
            transform: `translate(${fromLeft - last.left}px, ${origin.top - last.top}px)`,
            opacity: index === 0 ? 1 : 0,
          },
          { transform: "translate(0px, 0px)", opacity: 1 },
        ],
        {
          duration: times.duration,
          delay: index * times.stagger,
          easing: times.easing,
          fill: "both",
        },
        animations,
        false,
      );
    }),
  );
}

function playConverge(
  cards: HTMLElement[],
  times: MotionTimes,
  animations: Animation[],
) {
  const origin = cards[0]?.getBoundingClientRect();
  if (!origin) return Promise.resolve();
  const lastIndex = cards.length - 1;
  return Promise.all(
    cards.map((card, index) => {
      const now = card.getBoundingClientRect();
      const toLeft = index === 0 ? origin.left : origin.right;
      return runCardMotion(
        card,
        [
          { transform: "translate(0px, 0px)", opacity: 1 },
          {
            transform: `translate(${toLeft - now.left}px, ${origin.top - now.top}px)`,
            opacity: index === 0 ? 1 : 0,
          },
        ],
        {
          duration: times.duration,
          delay: (lastIndex - index) * times.stagger,
          easing: times.easing,
          fill: "forwards",
        },
        animations,
        true,
      );
    }),
  );
}

function FlowContainerCase({
  title,
  children,
  layer,
  ref,
}: {
  title: string;
  children: ReactNode;
  layer?: number;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      className="demo-flow-case w-[420px] shrink-0"
      ref={ref}
      style={layer == null ? undefined : { zIndex: layer }}
    >
      <VStack gap="sm">
        <Text
          className="text-left text-[var(--demo-flow-cream)]"
          size="sm"
          weight="medium"
        >
          {title}
        </Text>
        <div className="rounded-lg border border-border bg-background p-6 text-foreground">
          {children}
        </div>
      </VStack>
    </div>
  );
}

/**
 * Storybook demo chrome: step one instance, or lay every case out in a row.
 * Forest ground is demo-only — not a product surface.
 */
function FlowContainer<T>({ cases, children }: FlowContainerProps<T>) {
  const items = useMemo(() => [...cases], [cases]);
  const [mode, setMode] = useState<FlowContainerMode>("transition");
  const [layout, setLayout] = useState<FlowContainerLayout>("single");
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const last = Math.max(items.length - 1, 0);
  const current = items[Math.min(step, last)];
  const canStep = mode === "transition" && layout === "single";
  const stageRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  const originRectRef = useRef<DOMRect | null>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const animationsRef = useRef<Animation[]>([]);
  const motionGenRef = useRef(0);
  const pendingSpreadRef = useRef(false);

  useEffect(() => {
    return () => {
      for (const animation of animationsRef.current) {
        animation.cancel();
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (layout !== "row" || !pendingSpreadRef.current) return;
    pendingSpreadRef.current = false;
    const origin = originRectRef.current;
    originRectRef.current = null;
    const stage = stageRef.current;
    const cards = cardsRef.current.filter(
      (card): card is HTMLDivElement => card != null,
    );
    if (!origin || !stage || cards.length === 0 || prefersReducedMotion()) {
      return;
    }
    const gen = motionGenRef.current;
    setBusy(true);
    void playSpread(
      cards,
      origin,
      motionTimes(stage),
      animationsRef.current,
    ).then(() => {
      if (gen !== motionGenRef.current) return;
      animationsRef.current = [];
      setBusy(false);
    });
  }, [layout]);

  function cancelMotion() {
    motionGenRef.current += 1;
    pendingSpreadRef.current = false;
    setBusy(false);
    for (const animation of animationsRef.current) {
      animation.cancel();
    }
    animationsRef.current = [];
    for (const card of cardsRef.current) {
      if (card) clearMotion(card);
    }
  }

  function setView(next: FlowContainerMode) {
    if (next === mode) {
      return;
    }
    cancelMotion();
    if (next === "expanded") {
      originRectRef.current =
        originRef.current?.getBoundingClientRect() ?? null;
      pendingSpreadRef.current = !prefersReducedMotion();
      setMode("expanded");
      setLayout("row");
      return;
    }
    setMode("transition");
    setStep(0);
    if (layout !== "row" || prefersReducedMotion()) {
      setLayout("single");
      return;
    }
    const stage = stageRef.current;
    const cards = cardsRef.current.filter(
      (card): card is HTMLDivElement => card != null,
    );
    if (!stage || cards.length === 0) {
      setLayout("single");
      return;
    }
    const gen = motionGenRef.current;
    setBusy(true);
    void playConverge(cards, motionTimes(stage), animationsRef.current).then(
      () => {
        if (gen !== motionGenRef.current) return;
        animationsRef.current = [];
        setBusy(false);
        setLayout("single");
      },
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="demo-flow">
      <VStack className="demo-flow-body" gap="lg">
        <HStack className="demo-flow-toolbar" gap="sm" vAlign="center" wrap>
          <Tabs
            onValueChange={(value) => {
              if (value === "transition" || value === "expanded") {
                setView(value);
              }
            }}
            value={mode}
          >
            <TabsList aria-label="Demo view" className="rounded-full">
              <TabsTrigger value="transition">
                <Tree
                  aria-hidden="true"
                  data-icon="inline-start"
                  weight="fill"
                />
                Transition
              </TabsTrigger>
              <TabsTrigger value="expanded">
                <SquaresFour
                  aria-hidden="true"
                  data-icon="inline-start"
                  weight="fill"
                />
                Expanded
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="demo-flow-rule" />
          <Button
            disabled={!canStep || step >= last}
            onClick={() => setStep((value) => Math.min(value + 1, last))}
            size="sm"
          >
            Next
          </Button>
          <Button
            disabled={!canStep || step === 0}
            onClick={() => setStep(0)}
            size="sm"
            variant="outline"
          >
            Reset
          </Button>
        </HStack>
        <div
          className="demo-flow-stage"
          data-busy={busy ? "true" : undefined}
          ref={stageRef}
        >
          {layout === "single" && current ? (
            <FlowContainerCase ref={originRef} title={current[0]}>
              {children(current[1], current[0])}
            </FlowContainerCase>
          ) : (
            <HStack
              className={busy ? "w-full pb-2" : "w-full overflow-x-auto pb-2"}
              gap="lg"
              vAlign="start"
            >
              {items.map(([title, value], index) => (
                <FlowContainerCase
                  key={title}
                  layer={items.length - index}
                  ref={(node) => {
                    cardsRef.current[index] = node;
                  }}
                  title={title}
                >
                  {children(value, title)}
                </FlowContainerCase>
              ))}
            </HStack>
          )}
        </div>
      </VStack>
    </div>
  );
}

export type { FlowContainerMode, FlowContainerProps };
export { FlowContainer };
