/**
 * English copy for the sign-in and sign-out surfaces, as the shared catalogue
 * words it. `signOutFailed` and `retry` on sign-out are draft: the catalogue
 * holds no sign-out failure line yet.
 */
const AUTH_COPY = {
  or: "or",
  retry: "Try again",
  signIn: "Sign In",
  signOut: "Sign Out",
  signOutFailed: "Sign-out failed — try again.",
  googleActionLabel: "Continue with Google",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  sendLinkLabel: "Sign In with Email",
  sendWait: "Please wait a minute before requesting another email.",
  linkSentMessage: "We've just sent a sign-in link to",
  linkSentTitle: "Check Your Email",
  resendLabel: "Resend",
  resendCountdown: "Resend ({seconds})",
  linkExpired: "This sign-in link has expired.",
  linkInvalid: "This sign-in link no longer works.",
  differentAccount: "You’re signed in with a different account.",
  differentAccountDescription: "Switch to {email}.",
  switch: "Switch",
  stay: "Stay",
  settledElsewhere: "Signed in on another device.",
} as const;

export { AUTH_COPY };
