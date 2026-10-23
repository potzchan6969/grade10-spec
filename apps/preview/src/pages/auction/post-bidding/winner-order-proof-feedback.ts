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

const SUBMIT_SIMULATE_MS = 400;

/** Preview upload seam — lands after a short beat, or is refused. */
function simulateProofUpload(
  refuse = false,
): Promise<{ title: string; description: string } | null> {
  return new Promise((resolve) => {
    window.setTimeout(
      () => resolve(refuse ? { ...PROOF_NOT_SUBMITTED_TOAST } : null),
      SUBMIT_SIMULATE_MS,
    );
  });
}

function toastProofSubmitted() {
  toast.success(PROOF_SUBMITTED_TOAST.title, {
    description: PROOF_SUBMITTED_TOAST.description,
  });
}

export { simulateProofUpload, toastProofSubmitted };
