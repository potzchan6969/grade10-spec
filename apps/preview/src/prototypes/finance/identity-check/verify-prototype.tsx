import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  PageHeader,
  PrototypeNote,
  VaultPageShell,
} from "../../../pages/vault-shared";
import {
  IDENTITY_CHECK_MANUAL_PATH,
  VERIFY_COPY,
} from "./identity-check-content";

type VerifyState =
  | "invited"
  | "started"
  | "submitted"
  | "approved"
  | "declined"
  | "expired";

type VerifyPrototypeProps = { state: VerifyState };

/** The verification page's one column for a state: its words and the one thing to do. */
function VerifyBody({ state }: VerifyPrototypeProps) {
  const copy = VERIFY_COPY[state];
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">
        {copy.title}
      </h2>
      <Text>{copy.lead}</Text>
      {state === "invited" ? (
        <>
          <label className="flex items-start gap-2 text-sm">
            <input name="verify-consent" type="checkbox" />
            {VERIFY_COPY.invited.consent}
          </label>
          <div>
            <Button>{VERIFY_COPY.invited.action}</Button>
          </div>
        </>
      ) : null}
      {state === "started" ? (
        <div>
          <Button>{VERIFY_COPY.started.action}</Button>
        </div>
      ) : null}
    </div>
  );
}

/** The collector's verification page, one state per story. A wireframe until the design lands. */
function VerifyPrototype({ state }: VerifyPrototypeProps) {
  return (
    <VaultPageShell>
      <PrototypeNote
        manualPath={IDENTITY_CHECK_MANUAL_PATH}
        settles="the page’s layout, whether Verify opens the provider in this tab or another, the consent text before a check starts and how the check-running and declined states look."
      />
      <PageHeader title={VERIFY_COPY.brand} />
      <VerifyBody state={state} />
    </VaultPageShell>
  );
}

export type { VerifyPrototypeProps, VerifyState };
export { VerifyBody, VerifyPrototype };
