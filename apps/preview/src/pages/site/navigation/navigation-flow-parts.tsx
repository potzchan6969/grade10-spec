import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import {
  SignInEmailForm,
  type SignInEmailFormCopy,
  SiteHeader,
} from "@grade10/ui";
import type { ReactNode } from "react";
import { STORE_SITE_HEADER } from "../../store-content";

/** The sign-in words the ask uses, as the shared catalogue words them. */
const SIGN_IN_COPY = {
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  sendLinkLabel: "Sign In with Email",
};

/** Draft words for the ask's title, which the catalogue does not hold yet. */
const SIGN_IN_TITLE = "Sign In to Grade10";

const EMAIL_FORM_COPY: SignInEmailFormCopy = {
  email: SIGN_IN_COPY.emailLabel,
  emailPlaceholder: SIGN_IN_COPY.emailPlaceholder,
  submit: SIGN_IN_COPY.sendLinkLabel,
};

/** Draft words for the surfaces these flows move between. */
const GATED = {
  title: "My Auctions",
  empty: "Your auctions appear here once you have bid.",
};
const READING = {
  title: "Auction",
  line: "Lots closing this week.",
};
const FRONT_DOOR = { title: "Grade10" };

/**
 * One surface inside a flow card: the header and the surface's heading. Each
 * card is its own region, so repeated headers are not read as page banners.
 */
function Surface({
  label,
  title,
  line,
  signedIn,
  ask = false,
}: {
  label: string;
  title: string;
  line?: string;
  signedIn: boolean;
  ask?: boolean;
}) {
  return (
    <section aria-label={label} className="relative flex w-full flex-col gap-6">
      <SiteHeader
        {...STORE_SITE_HEADER}
        session={signedIn ? "signed-in" : "signed-out"}
      />
      <div className="flex w-full flex-col gap-4 px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {line ? (
          <p className="text-sm text-secondary-foreground">{line}</p>
        ) : null}
      </div>
      {ask ? <SignInAsk /> : null}
    </section>
  );
}

/** A stand-in for the sign-in dialog: a dialog cannot sit inside a flow card. */
function SignInAsk(): ReactNode {
  return (
    <div className="absolute inset-x-0 top-24 mx-auto w-full max-w-md px-4">
      <Card>
        <CardHeader>
          <CardTitle>{SIGN_IN_TITLE}</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInEmailForm
            copy={EMAIL_FORM_COPY}
            email=""
            onEmailChange={() => undefined}
            onSubmit={() => undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export { FRONT_DOOR, GATED, READING, SIGN_IN_COPY, SIGN_IN_TITLE, Surface };
