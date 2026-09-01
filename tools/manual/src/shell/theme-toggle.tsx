import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { useTheme } from "@grade10/design-system/components/providers/theme-provider";
import { Moon, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // The resolved mode is unknown until the client has read storage; render the
  // stable half of the control first so the markup does not disagree with it.
  const [settled, setSettled] = useState(false);
  useEffect(() => setSettled(true), []);

  const dark = settled && resolvedTheme === "dark";

  return (
    <IconButton
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      size="md"
      variant="ghost"
    >
      {dark ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </IconButton>
  );
}
