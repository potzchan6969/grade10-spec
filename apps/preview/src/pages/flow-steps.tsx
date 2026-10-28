import { useLayoutEffect, useRef, useState } from "react";
import { expect, userEvent, within } from "storybook/test";

/** The desktop capture profile a step is shown at, as the site is captured. */
const STEP_VIEWPORT = { width: 1440, height: 900 };

type FlowStep = {
  /** The screen story this step is drawn by, so no state is drawn twice. */
  storyId: string;
  /** The capture point a recipe photographs the site at for this step. */
  capturePointId: string;
};

/**
 * One step of a flow: its title, the capture point a recipe walks the site to,
 * and the screen story that draws it. `pnpm storybook:check` holds the story
 * id to a story that exists.
 */
function flowStep(
  title: string,
  capturePointId: string,
  storyId: string,
): readonly [string, FlowStep] {
  return [title, { storyId, capturePointId }];
}

/** A screen story at desktop size, scaled to the card it sits in. */
function FlowStepFrame({ step, title }: { step: FlowStep; title: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / STEP_VIEWPORT.width);
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-flow-step={step.capturePointId}
      ref={frameRef}
      style={{
        aspectRatio: `${STEP_VIEWPORT.width} / ${STEP_VIEWPORT.height}`,
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      {scale > 0 ? (
        <iframe
          src={`iframe.html?id=${step.storyId}&viewMode=story`}
          style={{
            border: 0,
            height: STEP_VIEWPORT.height,
            left: 0,
            position: "absolute",
            top: 0,
            transform: `scale(${scale})`,
            transformOrigin: "left top",
            width: STEP_VIEWPORT.width,
          }}
          tabIndex={-1}
          title={title}
        />
      ) : null}
    </div>
  );
}

/** Walks a flow's steps in order, then checks every step in Expanded. */
async function walkSteps(
  canvasElement: HTMLElement,
  steps: readonly (readonly [string, FlowStep])[],
) {
  const canvas = within(canvasElement);
  const next = canvas.getByRole("button", { name: "Next" });
  for (const [index, [title]] of steps.entries()) {
    expect(canvas.getAllByText(title)[0]).toBeVisible();
    if (index < steps.length - 1) await userEvent.click(next);
  }
  await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
  expect(canvasElement.querySelectorAll("[data-flow-step]")).toHaveLength(
    steps.length,
  );
}

export type { FlowStep };
export { FlowStepFrame, flowStep, walkSteps };
