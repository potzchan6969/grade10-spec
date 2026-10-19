import type { SignInEmailFormCopy, SignInLinkSentCopy } from "@grade10/ui";
import { AUTH_COPY } from "../auth-content";

const signIn = AUTH_COPY;

/** Draft words: the dialog title the catalogue does not hold yet. */
const SIGN_IN_TITLE = "Sign In to Grade10";
const SIGN_IN_FROM_CART_TITLE = "Sign In to Add to Cart";

const EMAIL_FORM_COPY: SignInEmailFormCopy = {
  email: signIn.emailLabel,
  emailPlaceholder: signIn.emailPlaceholder,
  submit: signIn.sendLinkLabel,
};

const LINK_SENT_COPY: SignInLinkSentCopy = {
  message: signIn.linkSentMessage,
  resend: signIn.resendLabel,
  resendCountdown: signIn.resendCountdown.replace("{seconds}", "45"),
};

/** The sign-in wait after a send, in seconds. */
const RESEND_WAIT_SECONDS = 60;

/** The wait between a send and its answer in the stand-in. */
const SEND_MS = 600;

/** The stand-in product the sign-in dialog opens over. */
const PRODUCT = {
  name: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  price: "HK$1,770",
  imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  addToCart: "Add to Cart",
} as const;

const PRODUCT_IMAGE = new URL("../../product.fixture.png", import.meta.url)
  .href;

/** Draft words for the brand home a link lands on. */
const HOME = {
  title: "Grade10",
};

const SIGN_IN_EMAIL = "kit@example.com";

export {
  EMAIL_FORM_COPY,
  HOME,
  LINK_SENT_COPY,
  PRODUCT,
  PRODUCT_IMAGE,
  RESEND_WAIT_SECONDS,
  SEND_MS,
  SIGN_IN_EMAIL,
  SIGN_IN_FROM_CART_TITLE,
  SIGN_IN_TITLE,
  signIn,
};
