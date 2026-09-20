/**
 * What a room is called. One room per change, and one per Slack thread until a
 * run names the change that thread is about, so there are two names and this
 * is where both are spelled: a router and a room that spelled one of them
 * differently would address two rooms for one change.
 */
import type { Thread } from "./room-state.ts";

/** The change's own room, which a landing wake is addressed by. */
export const changeRoom = (change: string): string => `change/${change}`;

/** A thread's room, which the wake a message starts runs in for as long as it
 * lasts. */
export const threadRoom = (thread: Thread): string =>
  `${thread.channel}/${thread.ts}`;
