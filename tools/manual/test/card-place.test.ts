import { describe, expect, it } from "vitest";
import { placeCard } from "../src/blocks/card-place";

const frame = { w: 1000, h: 500 };
const card = { w: 200, h: 100 };

describe("placeCard", () => {
  it("sits below the box, centred on it", () => {
    expect(placeCard({ x: 400, y: 100, w: 100, h: 50 }, card, frame)).toEqual({
      left: 350,
      top: 158,
    });
  });

  it("stays inside the frame's sides", () => {
    expect(placeCard({ x: 0, y: 100, w: 50, h: 50 }, card, frame).left).toBe(
      12,
    );
    expect(placeCard({ x: 950, y: 100, w: 50, h: 50 }, card, frame).left).toBe(
      788,
    );
  });

  it("moves above when the frame ends too soon", () => {
    expect(placeCard({ x: 400, y: 400, w: 100, h: 50 }, card, frame)).toEqual({
      left: 350,
      top: 292,
    });
  });

  it("moves beside the box when neither above nor below fits", () => {
    const tall = { w: 200, h: 400 };
    expect(placeCard({ x: 400, y: 200, w: 100, h: 50 }, tall, frame)).toEqual({
      left: 508,
      top: 88,
    });
    expect(placeCard({ x: 850, y: 200, w: 100, h: 50 }, tall, frame)).toEqual({
      left: 642,
      top: 88,
    });
  });
});
