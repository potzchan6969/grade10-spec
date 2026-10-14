import { useEffect, useRef } from "react";

/**
 * Calls `onSettledChange` once per change of `value` the person made, after
 * it settles: a change while `pending` waits for pending to end, so a refused
 * write that moves back to the settled value reports nothing, and a value the
 * application loads on its own is never reported. Call the returned function
 * from the press that asks for the change.
 */
function useSettledChange<T>(
  value: T,
  pending: boolean,
  onSettledChange: (value: T) => void,
): () => void {
  const settled = useRef(value);
  const pressed = useRef(false);
  const report = useRef(onSettledChange);
  report.current = onSettledChange;

  useEffect(() => {
    if (pending) return;
    const changed = !Object.is(settled.current, value);
    const byPerson = pressed.current;
    settled.current = value;
    pressed.current = false;
    if (changed && byPerson) report.current(value);
  }, [pending, value]);

  return () => {
    pressed.current = true;
  };
}

export { useSettledChange };
