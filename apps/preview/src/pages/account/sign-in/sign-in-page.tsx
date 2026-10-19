import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { Footer } from "@grade10/design-system/components/layout/footer";
import {
  SignInCard,
  SignInEmailForm,
  SignInLinkSent,
  SiteHeader,
} from "@grade10/ui";
import { useEffect, useRef, useState } from "react";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import { AUTH_COPY } from "../auth-content";
import {
  EMAIL_FORM_COPY,
  LINK_SENT_COPY,
  PRODUCT,
  PRODUCT_IMAGE,
  RESEND_WAIT_SECONDS,
  SEND_MS,
  SIGN_IN_FROM_CART_TITLE,
  SIGN_IN_TITLE,
} from "./sign-in-content";

const { or: orWord, googleActionLabel } = AUTH_COPY;
const signIn = AUTH_COPY;

type SignInStep = "email" | "sending" | "sent";

type SignInPageProps = {
  step?: SignInStep;
  email?: string;
  /** Whole seconds left in the resend wait. The clock starts on a send, not before. */
  cooldown?: number;
  /** Opened from Add to Cart rather than the header. */
  fromCart?: boolean;
};

const LEGAL = (
  <>
    By continuing, you agree to our{" "}
    <Link href="/legal/terms" size="xs" target="_blank">
      Terms of Service
    </Link>{" "}
    &{" "}
    <Link href="/legal/privacy" size="xs" target="_blank">
      Privacy Policy
    </Link>
    .
  </>
);

/**
 * Sign-in as the site assembles it: a dialog over the product the collector
 * was reading. The page owns the step, the address and the resend wait; the
 * dialog only shows the step it is given.
 */
function SignInPage({
  step: initialStep = "email",
  email: initialEmail = "",
  cooldown: initialCooldown = 0,
  fromCart = false,
}: SignInPageProps) {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [cooldown, setCooldown] = useState(initialCooldown);
  const [ticking, setTicking] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!ticking || cooldown <= 0) return;
    timer.current = window.setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => window.clearTimeout(timer.current);
  }, [ticking, cooldown]);

  function send() {
    setStep("sending");
    window.setTimeout(() => {
      setStep("sent");
      setCooldown(RESEND_WAIT_SECONDS);
      setTicking(true);
    }, SEND_MS);
  }

  const title =
    step === "sent"
      ? signIn.linkSentTitle
      : fromCart
        ? SIGN_IN_FROM_CART_TITLE
        : SIGN_IN_TITLE;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader
        {...STORE_SITE_HEADER}
        onSignIn={() => setOpen(true)}
        session="signed-out"
      />
      <main className="flex w-full flex-1 justify-center">
        <div className="grid w-full max-w-4xl gap-8 px-8 py-12 md:grid-cols-2">
          <img
            alt={PRODUCT.imageAlt}
            className="w-full rounded-2xl object-cover"
            src={PRODUCT_IMAGE}
          />
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-foreground">
              {PRODUCT.name}
            </h1>
            <p className="text-lg text-foreground">{PRODUCT.price}</p>
            <Button onClick={() => setOpen(true)}>{PRODUCT.addToCart}</Button>
          </div>
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
      <SignInCard
        copy={{
          title,
          providerDivider: orWord,
          legal: LEGAL,
        }}
        onOpenChange={setOpen}
        open={open}
        providerSlot={
          <Button size="md" type="button" variant="outline">
            {googleActionLabel}
          </Button>
        }
      >
        {step === "sent" ? (
          <SignInLinkSent
            copy={{
              ...LINK_SENT_COPY,
              resendCountdown: signIn.resendCountdown.replace(
                "{seconds}",
                String(cooldown),
              ),
            }}
            email={email}
            onResend={() => {
              setCooldown(RESEND_WAIT_SECONDS);
              setTicking(true);
            }}
            resendCooldownRemaining={cooldown}
          />
        ) : (
          <SignInEmailForm
            copy={EMAIL_FORM_COPY}
            email={email}
            onEmailChange={setEmail}
            onSubmit={send}
            submitting={step === "sending"}
          />
        )}
      </SignInCard>
    </div>
  );
}

export type { SignInPageProps, SignInStep };
export { SignInPage };
