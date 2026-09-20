import { describe, expect, it } from "vitest";
import {
  BUDGET_MS,
  bind,
  type Command,
  consumeWord,
  DEBOUNCE_MS,
  done,
  enqueue,
  fired,
  fireFailed,
  freshRoom,
  isRunningWake,
  onAlarm,
  PENDING_MAX,
  type RoomState,
  remember,
  SEEN_MAX,
  seenBefore,
  type Wake,
} from "../src/room-state.ts";

/** Every transition of one room: the debounce that gathers a burst into one
 * wake, the budget that frees a room whose run went quiet, and the one rule
 * under both — one running wake per room. */

const NOW = 1_700_000_000_000;
const THREAD = { channel: "C0PLAN", ts: "1700000000.000100" };

function saidAt(ts: string, text: string, slack = "U0PM") {
  return { slack, text, ts };
}

function fireOf(commands: Command[]): Wake {
  const fire = commands.find((command) => command.kind === "fire");
  if (fire?.kind !== "fire") throw new Error("no fire in the commands");
  return fire.wake;
}

function postsOf(commands: Command[]): string[] {
  return commands
    .filter((command) => command.kind === "post")
    .map((command) => (command.kind === "post" ? command.text : ""));
}

function running(state: Partial<RoomState> = {}): RoomState {
  return {
    ...freshRoom(),
    wake: 1,
    reason: "message",
    thread: THREAD,
    change: "nav-cart-count-badge",
    run: { url: "https://runs.example/s1" },
    alarm: { kind: "budget", at: NOW + BUDGET_MS.message },
    ...state,
  };
}

describe("the debounce", () => {
  it("waits 60 s for a message", () => {
    const step = enqueue(
      freshRoom(),
      { reason: "message", thread: THREAD, message: saidAt("1.1", "land") },
      NOW,
    );
    expect(step.commands).toEqual([{ kind: "setAlarm", at: NOW + 60_000 }]);
    expect(step.state.alarm).toEqual({ kind: "debounce", at: NOW + 60_000 });
    expect(step.state.pending).toHaveLength(1);
    expect(DEBOUNCE_MS.message).toBe(60_000);
  });

  it("waits for nothing on a first sentence", () => {
    const step = enqueue(
      freshRoom(),
      {
        reason: "plan",
        thread: THREAD,
        message: saidAt("1.1", "plan the cart badge"),
      },
      NOW,
    );
    expect(step.commands).toEqual([{ kind: "setAlarm", at: NOW }]);
    expect(DEBOUNCE_MS.plan).toBe(0);
  });

  it("shared-planning-agent-rounds-SC-66 - A landing wakes the relay once per change, with no debounce before it", () => {
    const step = enqueue(
      freshRoom(),
      { reason: "landing", change: "nav-cart-count-badge" },
      NOW,
    );
    expect(step.commands).toEqual([{ kind: "setAlarm", at: NOW }]);
    expect(step.state.queued).toBe("landing");
    expect(step.state.change).toBe("nav-cart-count-badge");
    expect(DEBOUNCE_MS.landing).toBe(0);
  });

  it("does not push the wake out when a second message arrives", () => {
    const first = enqueue(
      freshRoom(),
      { reason: "message", thread: THREAD, message: saidAt("1.1", "one") },
      NOW,
    );
    const second = enqueue(
      first.state,
      { reason: "message", message: saidAt("1.2", "two") },
      NOW + 30_000,
    );
    expect(second.commands).toEqual([]);
    expect(second.state.alarm).toEqual({ kind: "debounce", at: NOW + 60_000 });
    expect(second.state.pending.map((message) => message.text)).toEqual([
      "one",
      "two",
    ]);
  });

  it("pulls the alarm in when a landing arrives inside a message's debounce", () => {
    const first = enqueue(
      freshRoom(),
      { reason: "message", thread: THREAD, message: saidAt("1.1", "one") },
      NOW,
    );
    const second = enqueue(first.state, { reason: "landing" }, NOW + 10_000);
    expect(second.commands).toEqual([{ kind: "setAlarm", at: NOW + 10_000 }]);
    // A plan and a landing both need the longer budget of the two reasons
    // waiting, and a landing needs no debounce.
    expect(second.state.queued).toBe("landing");
  });

  it("answers a debounce with nothing behind it by clearing the alarm", () => {
    const step = onAlarm(
      { ...freshRoom(), alarm: { kind: "debounce", at: NOW } },
      NOW,
    );
    expect(step.commands).toEqual([{ kind: "clearAlarm" }]);
    expect(step.state.reason).toBe(null);
  });
});

describe("what a room remembers", () => {
  it("knows an arrival it has answered before", () => {
    const state = remember(freshRoom(), "slack:C0PLAN/1.1");
    expect(seenBefore(state, "slack:C0PLAN/1.1")).toBe(true);
    expect(seenBefore(state, "slack:C0PLAN/1.2")).toBe(false);
  });

  it("holds the newest 200 arrivals and drops the oldest", () => {
    let state = freshRoom();
    for (let i = 0; i < SEEN_MAX + 5; i += 1) state = remember(state, `k${i}`);
    expect(state.seen).toHaveLength(SEEN_MAX);
    expect(seenBefore(state, "k0")).toBe(false);
    expect(seenBefore(state, `k${SEEN_MAX + 4}`)).toBe(true);
  });

  it("holds the newest 200 lines of a burst and counts what it dropped", () => {
    let state = freshRoom();
    for (let i = 0; i < PENDING_MAX + 2; i += 1)
      state = enqueue(
        state,
        {
          reason: "message",
          thread: THREAD,
          message: saidAt(`1.${i}`, `#${i}`),
        },
        NOW,
      ).state;
    expect(state.pending).toHaveLength(PENDING_MAX);
    expect(state.pending[0].text).toBe("#2");
    expect(state.dropped).toBe(2);
  });

  it("says in the thread which lines a wake did not carry", () => {
    const step = onAlarm(
      {
        ...freshRoom(),
        dropped: 2,
        queued: "message",
        pending: [saidAt("1.1", "and this")],
        thread: THREAD,
        alarm: { kind: "debounce", at: NOW },
      },
      NOW,
    );
    expect(postsOf(step.commands)).toEqual([
      "2 earlier lines are not in this wake: the room keeps the latest 200.",
    ]);
    expect(step.state.dropped).toBe(0);
  });

  it("says one line in the singular", () => {
    const step = onAlarm(
      {
        ...freshRoom(),
        dropped: 1,
        queued: "message",
        thread: THREAD,
        alarm: { kind: "debounce", at: NOW },
      },
      NOW,
    );
    expect(postsOf(step.commands)).toEqual([
      "1 earlier line is not in this wake: the room keeps the latest 200.",
    ]);
  });
});

describe("the fire", () => {
  it("carries the wake, its messages, its sender and its expiry", () => {
    const queued = enqueue(
      { ...freshRoom(), change: "nav-cart-count-badge" },
      { reason: "message", thread: THREAD, message: saidAt("1.1", "land") },
      NOW,
    );
    const step = onAlarm(queued.state, NOW + 60_000);
    expect(fireOf(step.commands)).toEqual({
      wake: 1,
      reason: "message",
      change: "nav-cart-count-badge",
      thread: THREAD,
      messages: [saidAt("1.1", "land")],
      sender: "U0PM",
      expiresAt: NOW + 60_000 + 30 * 60_000,
    });
    expect(step.state.reason).toBe("message");
    expect(step.state.pending).toEqual([]);
  });

  it("sets the budget before it fires", () => {
    const queued = enqueue(
      freshRoom(),
      { reason: "plan", thread: THREAD, message: saidAt("1.1", "plan it") },
      NOW,
    );
    const step = onAlarm(queued.state, NOW);
    // A fire that never answers still leaves the room with an alarm to free
    // it, which it would not if the alarm were set after.
    expect(step.commands.map((command) => command.kind)).toEqual([
      "setAlarm",
      "fire",
    ]);
    expect(step.commands[0]).toEqual({
      kind: "setAlarm",
      at: NOW + 120 * 60_000,
    });
  });

  it("keeps the landing word and who said it for the landing check", () => {
    const queued = enqueue(
      freshRoom(),
      { reason: "message", thread: THREAD, message: saidAt("1.1", "land") },
      NOW,
    );
    const step = onAlarm(queued.state, NOW + 60_000);
    expect(step.state.word).toBe("land");
    expect(step.state.senderSlack).toBe("U0PM");
  });

  it("takes the latest landing word of a burst, not the latest line", () => {
    const first = enqueue(
      freshRoom(),
      { reason: "message", thread: THREAD, message: saidAt("1.1", "land") },
      NOW,
    );
    const second = enqueue(
      first.state,
      { reason: "message", message: saidAt("1.2", "thanks!", "U0DEV") },
      NOW + 10_000,
    );
    const step = onAlarm(second.state, NOW + 60_000);
    // `land` then `thanks!` lands: the word is the word, whatever was said
    // after it.
    expect(step.state.word).toBe("land");
    expect(step.state.senderSlack).toBe("U0PM");
    expect(fireOf(step.commands).messages.map((one) => one.text)).toEqual([
      "land",
      "thanks!",
    ]);
    // The wake's sender is who woke it, which is the latest line's member.
    expect(fireOf(step.commands).sender).toBe("U0DEV");
  });

  it("strips a mention off the word and folds its case", () => {
    const queued = enqueue(
      freshRoom(),
      {
        reason: "message",
        thread: THREAD,
        message: saidAt("1.1", "<@U0APP> Land With Recommendations"),
      },
      NOW,
    );
    expect(onAlarm(queued.state, NOW + 60_000).state.word).toBe(
      "land with recommendations",
    );
  });

  it("keeps the word a wake did not consume for the wake after it", () => {
    const first = onAlarm(
      enqueue(
        freshRoom(),
        { reason: "message", thread: THREAD, message: saidAt("1.1", "land") },
        NOW,
      ).state,
      NOW + 60_000,
    );
    const arrived = enqueue(
      first.state,
      { reason: "message", message: saidAt("1.9", "any news?") },
      NOW + 120_000,
    );
    // The budget cut the chain halfway; the next wake finishes it on the same
    // word.
    const next = done(arrived.state, NOW + 180_000);
    expect(next.state.word).toBe("land");
    expect(next.state.senderSlack).toBe("U0PM");
  });

  it("starts the next wake with no word once a landing has spent it", () => {
    const spent = consumeWord(running({ word: "land", senderSlack: "U0PM" }));
    expect(spent.word).toBe(null);
    expect(spent.senderSlack).toBe(null);
    const next = done(
      { ...spent, queued: "message", pending: [saidAt("2.1", "and now?")] },
      NOW + 60_000,
    );
    expect(next.state.word).toBe(null);
  });

  it("takes 30 minutes for a message, 30 for a landing and 120 for a plan", () => {
    expect(BUDGET_MS.message).toBe(30 * 60_000);
    expect(BUDGET_MS.landing).toBe(30 * 60_000);
    expect(BUDGET_MS.plan).toBe(120 * 60_000);
    const plan = onAlarm(
      enqueue(freshRoom(), { reason: "plan", thread: THREAD }, NOW).state,
      NOW,
    );
    expect(fireOf(plan.commands).expiresAt).toBe(NOW + 120 * 60_000);
  });

  it("the ack carries the wake's subject and the run url", () => {
    const step = fired(running({ run: null }), {
      url: "https://runs.example/s2",
    });
    expect(step.commands).toEqual([
      {
        kind: "post",
        text: "Reading nav-cart-count-badge… https://runs.example/s2",
      },
    ]);
    expect(step.state.run).toEqual({ url: "https://runs.example/s2" });
  });

  it("the ack names the thread's first words where no change is bound", () => {
    const opened = enqueue(
      freshRoom(),
      {
        reason: "plan",
        thread: THREAD,
        message: saidAt("1.1", "<@U0APP> plan the cart badge"),
      },
      NOW,
    ).state;
    const step = fired(onAlarm(opened, NOW).state, {
      url: "https://runs.example/s2",
    });
    expect(step.commands).toEqual([
      {
        kind: "post",
        text: "Reading plan the cart badge… https://runs.example/s2",
      },
    ]);
  });

  it("the ack says the run did not start where the runner named no session", () => {
    const step = fired(running({ run: null }), null);
    expect(step.commands).toEqual([
      {
        kind: "post",
        text: "The reply of nav-cart-count-badge did not start.",
      },
    ]);
    expect(step.state.run).toBe(null);
  });

  it("says in the thread what the runner answered, and frees the room", () => {
    const step = fireFailed(
      running({ run: null, reason: "plan" }),
      "the runner answered 429",
    );
    expect(step.commands).toEqual([
      {
        kind: "post",
        text: "The plan of nav-cart-count-badge did not start: the runner answered 429",
      },
      { kind: "clearAlarm" },
    ]);
    expect(step.state).toMatchObject({
      reason: null,
      queued: null,
      alarm: null,
    });
  });
});

describe("one running wake per room", () => {
  it("shared-planning-agent-rounds-SC-76 - One wake runs per thread, and a message during a run fires again after it", () => {
    const arrived = enqueue(
      running(),
      { reason: "message", message: saidAt("1.9", "one more thing") },
      NOW + 60_000,
    );
    expect(arrived.commands).toEqual([]);
    expect(arrived.state.reason).toBe("message");
    expect(arrived.state.queued).toBe("message");
    expect(arrived.state.wake).toBe(1);

    const after = done(arrived.state, NOW + 120_000);
    const wake = fireOf(after.commands);
    expect(wake.wake).toBe(2);
    expect(wake.messages.map((message) => message.text)).toEqual([
      "one more thing",
    ]);
    expect(after.commands[0]).toEqual({ kind: "clearAlarm" });
    expect(after.state.queued).toBe(null);
  });

  it("shared-planning-agent-rounds-SC-66 - A landing wakes the relay once per change, behind the wake already running", () => {
    const arrived = enqueue(running(), { reason: "landing" }, NOW + 60_000);
    expect(arrived.commands).toEqual([]);
    expect(arrived.state.queued).toBe("landing");
    const after = done(arrived.state, NOW + 120_000);
    const wake = fireOf(after.commands);
    expect(wake.reason).toBe("landing");
    expect(wake.expiresAt).toBe(NOW + 120_000 + 30 * 60_000);
  });

  it("frees the room when a run finishes with nothing behind it", () => {
    const after = done(running(), NOW + 120_000);
    expect(after.commands).toEqual([{ kind: "clearAlarm" }]);
    expect(after.state).toMatchObject({
      reason: null,
      queued: null,
      run: null,
      alarm: null,
    });
  });

  it("refuses a token minted for the wake before", () => {
    const state = running({ wake: 3 });
    expect(isRunningWake(state, 3)).toBe(true);
    expect(isRunningWake(state, 2)).toBe(false);
    expect(isRunningWake({ ...state, reason: null }, 3)).toBe(false);
  });
});

describe("the budget", () => {
  it("shared-planning-agent-rounds-SC-75 - A wake that does not finish says so", () => {
    const step = onAlarm(running(), NOW + BUDGET_MS.message);
    expect(step.commands[0]).toEqual({
      kind: "post",
      text: "The reply of nav-cart-count-badge did not finish: https://runs.example/s1",
    });
    expect(step.state.reason).toBe(null);
    expect(step.commands).toContainEqual({ kind: "clearAlarm" });
  });

  it("names the wake's own reason", () => {
    expect(
      onAlarm(running({ reason: "plan" }), NOW + BUDGET_MS.plan).commands[0],
    ).toEqual({
      kind: "post",
      text: "The plan of nav-cart-count-badge did not finish: https://runs.example/s1",
    });
    expect(
      onAlarm(running({ reason: "landing" }), NOW + BUDGET_MS.landing)
        .commands[0],
    ).toEqual({
      kind: "post",
      text: "The read again of nav-cart-count-badge did not finish: https://runs.example/s1",
    });
  });

  it("posts the line and fires again when something is behind", () => {
    const arrived = enqueue(
      running(),
      { reason: "message", message: saidAt("1.9", "and this") },
      NOW + 60_000,
    );
    const step = onAlarm(arrived.state, NOW + BUDGET_MS.message);
    expect(step.commands[0].kind).toBe("post");
    expect(fireOf(step.commands).wake).toBe(2);
  });

  it("says so when the run never started", () => {
    const step = onAlarm(running({ run: null }), NOW + BUDGET_MS.message);
    expect(step.commands[0]).toEqual({
      kind: "post",
      text: "The reply of nav-cart-count-badge did not start.",
    });
  });

  it("answers nothing before the budget it was set for", () => {
    const state = running();
    expect(onAlarm(state, NOW + BUDGET_MS.message - 1)).toEqual({
      state,
      commands: [],
    });
    expect(onAlarm(state, NOW + BUDGET_MS.message).commands[0].kind).toBe(
      "post",
    );
  });

  it("answers nothing at all on a room that is not running", () => {
    const idle = {
      ...freshRoom(),
      alarm: { kind: "budget" as const, at: NOW },
    };
    expect(onAlarm(idle, NOW + 60_000)).toEqual({
      state: idle,
      commands: [],
    });
  });

  it("names the thread where the room has no change", () => {
    expect(
      onAlarm(running({ change: null }), NOW + BUDGET_MS.message).commands[0],
    ).toEqual({
      kind: "post",
      text: "The reply of this thread did not finish: https://runs.example/s1",
    });
  });
});

describe("what the run tells the room", () => {
  it("binds the change", () => {
    expect(bind(freshRoom(), "nav-cart-count-badge").change).toBe(
      "nav-cart-count-badge",
    );
  });
});
