export const IDENTITY_CHECK_MANUAL_PATH = "vault/identity-check";

/** Draft words for the collector's verification page, one set per state. */
export const VERIFY_COPY = {
  brand: "Grade10 Vault",
  invited: {
    title: "Verify your identity",
    lead: "Before your visit we check who you are. It takes a few minutes on your phone and needs your ID document and a selfie.",
    consent: "I agree to the check and to how my details are kept.",
    action: "Start the check",
  },
  started: {
    title: "Carry on where you left off",
    lead: "You started a check. Carry on from the step you reached.",
    action: "Carry on",
  },
  submitted: {
    title: "We are checking your ID",
    lead: "This usually takes a minute or two. Nothing is needed from you. You can leave this page.",
  },
  approved: {
    title: "You are verified",
    lead: "Nothing else to do. Bring the item and your ID to your visit.",
  },
  declined: {
    title: "We could not verify you online",
    lead: "Bring your ID to your visit and we will check it at the counter.",
  },
  expired: {
    title: "This invitation has expired",
    lead: "Ask the shop to send you a new invitation, or bring your ID to your visit.",
  },
};
