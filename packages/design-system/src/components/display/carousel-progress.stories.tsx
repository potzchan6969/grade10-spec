import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  CarouselProgress,
  CarouselProgressItem,
} from "./carousel-progress";

const meta = {
  title: "Components/CarouselProgress",
  component: CarouselProgress,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dot pagination for carousels. The active item can run a linear fill timer and call `onComplete` when it finishes.",
      },
    },
  },
} satisfies Meta<typeof CarouselProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

const SLIDES = ["Featured lot 1", "Featured lot 2", "Featured lot 3"] as const;

/** Static active pill — no auto-advance timer. */
export const Default: Story = {
  render: () => (
    <CarouselProgress aria-label="Featured lots">
      {SLIDES.map((label, index) => (
        <CarouselProgressItem
          active={index === 0}
          key={label}
          label={label}
        />
      ))}
    </CarouselProgress>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const active = canvas.getByRole("button", { name: SLIDES[0] });
    await expect(active).toHaveAttribute("aria-current", "true");
    await expect(
      canvas.getByRole("navigation", { name: "Featured lots" }),
    ).toBeInTheDocument();
  },
};

/** Active fill runs for 5s; pause freezes the animation. */
export const Timed: Story = {
  render: function TimedCarouselProgress() {
    const [index, setIndex] = useState(0);
    const [playKey, setPlayKey] = useState(0);
    const [paused, setPaused] = useState(false);

    return (
      <div
        className="flex flex-col items-start gap-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <p className="text-sm text-secondary-foreground">
          Slide {index + 1} of {SLIDES.length}
          {paused ? " (paused)" : ""}
        </p>
        <CarouselProgress aria-label="Featured lots">
          {SLIDES.map((label, itemIndex) => (
            <CarouselProgressItem
              active={itemIndex === index}
              durationMs={5000}
              key={label}
              label={label}
              onClick={() => {
                setIndex(itemIndex);
                setPlayKey((key) => key + 1);
              }}
              onComplete={() => {
                setIndex((current) => (current + 1) % SLIDES.length);
                setPlayKey((key) => key + 1);
              }}
              paused={paused}
              playKey={playKey}
            />
          ))}
        </CarouselProgress>
      </div>
    );
  },
};

/** Reduced motion keeps the active fill full-width with no animation. */
export const ReducedMotion: Story = {
  render: () => (
    <CarouselProgress aria-label="Featured lots">
      {SLIDES.map((label, index) => (
        <CarouselProgressItem
          active={index === 1}
          durationMs={5000}
          key={label}
          label={label}
          reduceMotion
        />
      ))}
    </CarouselProgress>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const active = canvas.getByRole("button", { name: SLIDES[1] });
    const fill = active.querySelector('[aria-hidden="true"]');
    await expect(fill).toBeInstanceOf(HTMLElement);
    await expect((fill as HTMLElement).style.width).toBe("100%");
    await expect((fill as HTMLElement).style.animation).toBe("");
  },
};

/** Selecting a dot restarts the timer via `playKey`. */
export const SelectSlide: Story = {
  render: function SelectSlideCarouselProgress() {
    const [index, setIndex] = useState(0);
    const [playKey, setPlayKey] = useState(0);

    return (
      <CarouselProgress aria-label="Featured lots">
        {SLIDES.map((label, itemIndex) => (
          <CarouselProgressItem
            active={itemIndex === index}
            durationMs={8000}
            key={label}
            label={label}
            onClick={() => {
              setIndex(itemIndex);
              setPlayKey((key) => key + 1);
            }}
            playKey={playKey}
          />
        ))}
      </CarouselProgress>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const second = canvas.getByRole("button", { name: SLIDES[1] });
    await userEvent.click(second);
    await waitFor(() => {
      expect(second).toHaveAttribute("aria-current", "true");
    });
  },
};

/** `onComplete` fires when the fill finishes. */
export const Completes: Story = {
  render: function CompletesCarouselProgress() {
    const [done, setDone] = useState(false);
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-secondary-foreground">
          {done ? "Complete" : "Running"}
        </p>
        <CarouselProgress aria-label="Featured lots">
          <CarouselProgressItem
            active
            durationMs={200}
            label={SLIDES[0]}
            onComplete={() => setDone(true)}
            playKey={0}
          />
          <CarouselProgressItem label={SLIDES[1]} />
        </CarouselProgress>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(
      () => {
        expect(canvas.getByText("Complete")).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  },
};
