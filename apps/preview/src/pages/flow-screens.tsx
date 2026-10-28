import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useArgs } from "storybook/preview-api";
import { expect, userEvent, within } from "storybook/test";
import {
  CANVAS,
  type FlowScreen,
  flowSteps,
  parentId,
  screenOptions,
  treeOrder,
} from "../ui-verification/flow-tree";

/** A flow story's one arg: Canvas, or the id of the screen it focuses. */
type FlowArgs = { screen: string };

/** The desktop capture profile a screen is shown at, as the site is captured. */
const SCREEN_VIEWPORT = { width: 1440, height: 900 };

/**
 * One screen of a flow: its tree id (`4`, or `4a` for another state of step
 * 4), its name, the capture point a recipe walks the site to, and the screen
 * story that draws it. `pnpm storybook:check` holds the story id to a story
 * that exists.
 */
function flowScreen(
  id: string,
  name: string,
  capturePointId: string,
  storyId: string,
): FlowScreen {
  return { id, name, capturePointId, storyId };
}

const ink = "var(--color-foreground, #1d1f21)";
const muted = "var(--color-muted-foreground, #55595d)";
const edge = "var(--color-border, #d3d6d9)";

/** A screen story at desktop size, scaled to the box it sits in. */
function ScreenFrame({ screen, label }: { screen: FlowScreen; label: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / SCREEN_VIEWPORT.width);
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-flow-screen={screen.id}
      ref={frameRef}
      style={{
        aspectRatio: `${SCREEN_VIEWPORT.width} / ${SCREEN_VIEWPORT.height}`,
        background: "#ffffff",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      {scale > 0 ? (
        <iframe
          src={`iframe.html?id=${screen.storyId}&viewMode=story`}
          style={{
            border: 0,
            height: SCREEN_VIEWPORT.height,
            left: 0,
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            transform: `scale(${scale})`,
            transformOrigin: "left top",
            width: SCREEN_VIEWPORT.width,
          }}
          tabIndex={-1}
          title={label}
        />
      ) : null}
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: "#ffffff",
  border: `1px solid ${edge}`,
  borderRadius: 10,
  color: ink,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  font: "inherit",
  gap: 8,
  padding: 8,
  textAlign: "left",
  width: 220,
};

function ScreenCard({
  screen,
  onOpen,
}: {
  screen: FlowScreen;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      aria-label={`Open Screen ${screen.id}, ${screen.name}`}
      onClick={() => onOpen(screen.id)}
      style={cardStyle}
      type="button"
    >
      <ScreenFrame label={`Screen ${screen.id}`} screen={screen} />
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>
          Screen {screen.id}
        </span>
        <span style={{ color: muted, fontSize: 12, lineHeight: 1.35 }}>
          {screen.name}
        </span>
      </span>
    </button>
  );
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      style={{
        alignSelf: "flex-start",
        background: muted,
        flexShrink: 0,
        height: 2,
        marginTop: 70,
        position: "relative",
        width: 40,
      }}
    >
      <span
        style={{
          borderBottom: "5px solid transparent",
          borderLeft: `8px solid ${muted}`,
          borderTop: "5px solid transparent",
          position: "absolute",
          right: -1,
          top: -4,
        }}
      />
    </span>
  );
}

/** Every screen at once: steps left to right, a step's other states below it. */
function FlowCanvas({
  screens,
  onOpen,
}: {
  screens: readonly FlowScreen[];
  onOpen: (id: string) => void;
}) {
  return (
    <ol
      aria-label="Flow steps"
      style={{
        alignItems: "flex-start",
        display: "flex",
        listStyle: "none",
        margin: 0,
        overflowX: "auto",
        padding: 32,
      }}
    >
      {flowSteps(screens).map((step, index) => (
        <li key={step.main.id} style={{ display: "flex" }}>
          {index > 0 ? <Arrow /> : null}
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ScreenCard onOpen={onOpen} screen={step.main} />
            {step.states.map((state) => (
              <div
                key={state.id}
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{ borderLeft: `2px dashed ${edge}`, height: 22 }}
                />
                <ScreenCard onOpen={onOpen} screen={state} />
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** One screen at full desktop size, with the way back to the canvas. */
function FlowFocus({
  screens,
  screen,
  onOpen,
}: {
  screens: readonly FlowScreen[];
  screen: FlowScreen;
  onOpen: (id: string) => void;
}) {
  const parent = parentId(screen.id);
  const parentScreen = parent
    ? screens.find((item) => item.id === parent)
    : null;
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 12, padding: 24 }}
    >
      <nav
        aria-label="Flow"
        style={{ alignItems: "center", display: "flex", gap: 10 }}
      >
        <button
          onClick={() => onOpen(CANVAS)}
          style={{
            background: "none",
            border: 0,
            color: "var(--color-primary, #1f4fa0)",
            cursor: "pointer",
            font: "inherit",
            fontWeight: 600,
            padding: 0,
          }}
          type="button"
        >
          ← Canvas
        </button>
        {parentScreen ? (
          <>
            <span aria-hidden="true" style={{ color: muted }}>
              /
            </span>
            <button
              onClick={() => onOpen(parentScreen.id)}
              style={{
                background: "none",
                border: 0,
                color: muted,
                cursor: "pointer",
                font: "inherit",
                padding: 0,
              }}
              type="button"
            >
              Screen {parentScreen.id}
            </button>
          </>
        ) : null}
        <span aria-hidden="true" style={{ color: muted }}>
          /
        </span>
        <h2 style={{ color: ink, fontSize: 15, fontWeight: 700, margin: 0 }}>
          Screen {screen.id} - {screen.name}
        </h2>
        {parentScreen ? (
          <span
            style={{
              background: "var(--color-muted, #e4e6e8)",
              borderRadius: 999,
              color: muted,
              fontSize: 12,
              fontWeight: 600,
              padding: "2px 8px",
            }}
          >
            Another state of Screen {parentScreen.id}
          </span>
        ) : null}
      </nav>
      <div
        style={{
          border: `1px solid ${edge}`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <ScreenFrame label={`Screen ${screen.id}`} screen={screen} />
      </div>
    </div>
  );
}

/**
 * The canvas or the focused screen. It follows the Screen arg, so the
 * control and the Verification panel move it, and reports a click back
 * through the arg, so they follow it.
 */
function FlowView({
  screens,
  screen,
  onOpen,
}: {
  screens: readonly FlowScreen[];
  screen: string;
  onOpen: (id: string) => void;
}) {
  const [shown, setShown] = useState(screen);
  useEffect(() => setShown(screen), [screen]);
  const open = (id: string) => {
    setShown(id);
    onOpen(id);
  };
  const focused = screens.find((item) => item.id === shown);
  return focused ? (
    <FlowFocus onOpen={open} screen={focused} screens={screens} />
  ) : (
    <FlowCanvas onOpen={open} screens={screens} />
  );
}

/**
 * The parts of a flow story its screens decide: the Screen control, which
 * reads as the tree, and the canvas or focused view it picks. The story keeps
 * its own literal `parameters`, so its case id and journeys stay checkable.
 */
function flowStory(screens: readonly FlowScreen[]) {
  const { options, labels } = screenOptions(screens);
  return {
    args: { screen: CANVAS },
    argTypes: {
      screen: {
        name: "Screen",
        options,
        control: { type: "select" as const, labels },
      },
    },
    render: function Flow({ screen }: FlowArgs) {
      // Storybook's hooks run in the story function itself, not in a component.
      const [, updateArgs] = useArgs<FlowArgs>();
      return (
        <FlowView
          onOpen={(id) => updateArgs({ screen: id })}
          screen={screen}
          screens={screens}
        />
      );
    },
  };
}

/** Each screen card opens its focused view, and the canvas comes back. */
async function walkFlow(
  canvasElement: HTMLElement,
  screens: readonly FlowScreen[],
) {
  const canvas = within(canvasElement);
  for (const screen of treeOrder(screens)) {
    await userEvent.click(
      await canvas.findByRole("button", {
        name: `Open Screen ${screen.id}, ${screen.name}`,
      }),
    );
    expect(
      await canvas.findByRole("heading", {
        name: `Screen ${screen.id} - ${screen.name}`,
      }),
    ).toBeVisible();
    await userEvent.click(
      await canvas.findByRole("button", { name: "← Canvas" }),
    );
  }
  await canvas.findByRole("list", { name: "Flow steps" });
  expect(canvasElement.querySelectorAll("[data-flow-screen]")).toHaveLength(
    screens.length,
  );
}

export { flowParameter } from "../ui-verification/flow-tree";
export type { FlowArgs };
export { flowScreen, flowStory, walkFlow };
