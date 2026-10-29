import { describe, expect, it } from "vitest";
import {
  CANVAS,
  type FlowScreen,
  flowParameter,
  flowSteps,
  parentId,
  screenOptions,
} from "./flow-tree";

const screen = (id: string, name: string): FlowScreen => ({
  id,
  name,
  capturePointId: `point-${id}`,
  storyId: `story--${id}`,
});

const AUCTION = [
  screen("2", "Auction listing, Upcoming"),
  screen("1b", "Auction list - Not logged in"),
  screen("1", "Auction list"),
  screen("4a", "Auction listing, Active with bid - Outbid"),
  screen("1a", "Auction list - Empty"),
  screen("4", "Auction listing, Active with bid"),
  screen("3", "Auction listing, Active"),
  screen("10", "Auction listing, Sold"),
];

describe("flow tree", () => {
  it("reads steps from the number and other states from the letter", () => {
    expect(
      flowSteps(AUCTION).map((step) => [
        step.main.id,
        step.states.map((state) => state.id),
      ]),
    ).toEqual([
      ["1", ["1a", "1b"]],
      ["2", []],
      ["3", []],
      ["4", ["4a"]],
      ["10", []],
    ]);
    expect(parentId("4a")).toBe("4");
    expect(parentId("4")).toBeNull();
  });

  it("lists Canvas, then every screen in tree order, for the Screen control", () => {
    const { options, labels } = screenOptions(AUCTION);
    expect(options).toEqual([
      CANVAS,
      "1",
      "1a",
      "1b",
      "2",
      "3",
      "4",
      "4a",
      "10",
    ]);
    expect(labels[CANVAS]).toBe("Canvas");
    expect(labels["1a"]).toBe("Screen 1a (Auction list - Empty)");
    expect(
      flowParameter(AUCTION).screens.map((item) => item.capturePointId),
    ).toEqual(options.slice(1).map((id) => `point-${id}`));
  });

  it("refuses a state with no step, a repeated id and an id that is not a place", () => {
    expect(() => flowSteps([screen("2a", "Orphan")])).toThrow(
      "screen 2a has no step 2 to hang under",
    );
    expect(() => flowSteps([screen("1", "A"), screen("1", "B")])).toThrow(
      "screen 1 repeats",
    );
    expect(() => flowSteps([screen("1-a", "Bad")])).toThrow(
      'screen id "1-a" is a step number and an optional letter',
    );
  });
});
