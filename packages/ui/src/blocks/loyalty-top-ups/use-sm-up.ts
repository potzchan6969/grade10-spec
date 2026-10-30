import { useEffect, useState } from "react";

const SM_UP_MQ = "(min-width: 640px)";

/** Reads the 640px line the top-up surfaces swap across: a bottom drawer
 * below, a floating dialog up. */
export function useSmUp() {
  const [smUp, setSmUp] = useState(
    () => typeof window === "undefined" || window.matchMedia(SM_UP_MQ).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(SM_UP_MQ);
    const onChange = () => setSmUp(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return smUp;
}
