import { describe, expect, it } from "vitest";
import {
  approach,
  beyond,
  dragOffset,
  hoverOffset,
  revealOffset,
} from "../src/blocks/pan";

describe("hoverOffset", () => {
  it("rests at the left edge when nothing overflows", () => {
    expect(hoverOffset(500, 800, 0)).toBe(0);
    expect(hoverOffset(500, 800, -20)).toBe(0);
  });

  it("reaches both edges inside the default margin", () => {
    expect(hoverOffset(0, 800, 400)).toBe(0);
    expect(hoverOffset(96, 800, 400)).toBe(0);
    expect(hoverOffset(800, 800, 400)).toBe(400);
    expect(hoverOffset(704, 800, 400)).toBeCloseTo(400);
  });

  it("spreads the overflow across the middle of the viewport", () => {
    expect(hoverOffset(400, 800, 400)).toBeCloseTo(200);
    expect(hoverOffset(248, 800, 400)).toBeCloseTo(100);
  });

  it("holds still across the zones it is given", () => {
    const still = { start: 250, end: 150 };
    expect(hoverOffset(249, 800, 400, still)).toBe(0);
    expect(hoverOffset(450, 800, 400, still)).toBeCloseTo(200);
    expect(hoverOffset(651, 800, 400, still)).toBe(400);
  });

  it("falls back to the margin when the zones leave no room", () => {
    expect(hoverOffset(400, 800, 400, { start: 400, end: 400 })).toBeCloseTo(
      200,
    );
  });
});

describe("dragOffset", () => {
  it("moves the strip against the finger and stops at the edges", () => {
    expect(dragOffset(100, 30, 400)).toBe(70);
    expect(dragOffset(100, -30, 400)).toBe(130);
    expect(dragOffset(10, 50, 400)).toBe(0);
    expect(dragOffset(390, -50, 400)).toBe(400);
  });
});

describe("revealOffset", () => {
  it("holds still when the span already shows", () => {
    expect(revealOffset(100, 800, 400, { start: 200, end: 500 })).toBe(100);
  });

  it("pans forward just far enough, with padding", () => {
    expect(revealOffset(0, 800, 400, { start: 700, end: 900 })).toBe(116);
  });

  it("pans back to a span behind the viewport", () => {
    expect(revealOffset(300, 800, 400, { start: 50, end: 200 })).toBe(34);
  });

  it("aligns a span wider than the viewport to its start", () => {
    expect(revealOffset(0, 300, 1000, { start: 400, end: 900 })).toBe(384);
  });

  it("never leaves the strip", () => {
    expect(revealOffset(0, 800, 400, { start: 1100, end: 1200 })).toBe(400);
    expect(revealOffset(200, 800, 400, { start: 5, end: 40 })).toBe(0);
  });
});

describe("approach", () => {
  it("covers a share of the distance and snaps at the end", () => {
    expect(approach(0, 100, 0.25)).toBe(25);
    expect(approach(99.7, 100)).toBe(100);
    expect(approach(100, 100)).toBe(100);
  });
});

describe("beyond", () => {
  it("names the side that still has more strip", () => {
    expect(beyond(0, 400)).toEqual({ before: false, after: true });
    expect(beyond(200, 400)).toEqual({ before: true, after: true });
    expect(beyond(400, 400)).toEqual({ before: true, after: false });
    expect(beyond(0, 0)).toEqual({ before: false, after: false });
  });
});
