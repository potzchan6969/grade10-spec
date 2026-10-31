/* What the checkout stories place in the blocks' slots: the bot check's
 * stand-in, the agreement statements with their links, and the phone frame.
 * The site renders the real widget and its own links. */
import { ShieldCheck } from "@phosphor-icons/react";
import type { Decorator } from "@storybook/react-vite";

/** The bot check's 300 × 65 widget, as the boards draw it. */
function BotCheckStandIn({ checked = false }: { checked?: boolean }) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: the board names the widget a group
    <div
      aria-label="Bot check"
      className="flex h-[65px] w-[300px] items-center gap-3 rounded-lg border border-border bg-background-subtle px-4 text-sm leading-5 text-secondary-foreground"
      role="group"
    >
      {checked ? (
        <ShieldCheck aria-hidden size={20} />
      ) : (
        <span
          aria-hidden
          className="size-5 animate-spin rounded-full border-2 border-border-strong border-t-foreground"
        />
      )}
      <span>{checked ? "You’re checked" : "Checking you’re not a bot…"}</span>
    </div>
  );
}

function GuestStatement() {
  return (
    <>
      I agree to the <a href="#terms-of-sale">Terms of Sale</a> and Grade10’s{" "}
      <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.
    </>
  );
}

function AccountStatement() {
  return (
    <>
      I agree to the <a href="#terms-of-sale">Terms of Sale</a>.
    </>
  );
}

/** The boards’ 390 px phone. Listed after a padding decorator, so it wraps
 * it: Storybook applies the first decorator innermost. */
const phone: Decorator = (Story) => (
  <div className="w-[390px] bg-background">
    <Story />
  </div>
);

export { AccountStatement, BotCheckStandIn, GuestStatement, phone };
