import { toast } from "@grade10/design-system/components/overlays/toast";

/** Success acknowledgement after payment proof lands. */
export const PROOF_SUBMITTED_TOAST = {
  title: "Proof submitted",
  description: "We’ll verify your payment shortly.",
} as const;

/** Stay-open failure when the upload does not land. */
export const PROOF_NOT_SUBMITTED_TOAST = {
  title: "Proof not submitted",
  description: "Nothing was saved. Try again.",
} as const;

function toastProofSubmitted() {
  toast.success(PROOF_SUBMITTED_TOAST.title, {
    description: PROOF_SUBMITTED_TOAST.description,
  });
}

function toastProofNotSubmitted() {
  toast.error(PROOF_NOT_SUBMITTED_TOAST.title, {
    description: PROOF_NOT_SUBMITTED_TOAST.description,
  });
}

export { toastProofSubmitted, toastProofNotSubmitted };
