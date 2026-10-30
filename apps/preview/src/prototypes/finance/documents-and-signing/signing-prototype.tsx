import { Button } from "@grade10/design-system/components/forms/button";
import { Label } from "@grade10/design-system/components/forms/label";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { FactCard } from "@grade10/ui";
import {
  PageHeader,
  PrototypeNote,
  VaultPageShell,
} from "../../../pages/vault-shared";
import {
  DOCUMENTS_AND_SIGNING_MANUAL_PATH,
  SIGNED_DOCUMENTS,
  SIGNING_COPY,
} from "./documents-and-signing-content";

type SigningState = "sign" | "refuse" | "signed" | "download-all";

type SigningPrototypeProps = { state: SigningState };

const packetRows = SIGNED_DOCUMENTS.map((document) => ({
  label: document.name,
  value: `${document.case} · ${document.fingerprint}`,
}));

/** The signing step's body for one state. Flows draw it alone. */
function SigningBody({ state }: SigningPrototypeProps) {
  if (state === "sign") {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <FactCard
          copy={{
            title: SIGNING_COPY.packetTitle,
            rowsLabel: SIGNING_COPY.packetRowsLabel,
          }}
          lead={SIGNING_COPY.packetLead}
          rows={packetRows.slice(0, 2)}
        />
        <div className="flex w-full flex-col gap-2">
          <Label htmlFor="signer-name">{SIGNING_COPY.name}</Label>
          <TextInput id="signer-name" name="signer-name" />
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input name="signing-consent" type="checkbox" />
          {SIGNING_COPY.consent}
        </label>
        <div className="flex flex-wrap gap-3">
          <Button>{SIGNING_COPY.sign}</Button>
          <Button variant="outline">{SIGNING_COPY.decline}</Button>
        </div>
      </div>
    );
  }
  if (state === "refuse") {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <FactCard
          copy={{ title: SIGNING_COPY.refuseTitle }}
          lead={SIGNING_COPY.refuseLead}
        />
      </div>
    );
  }
  if (state === "signed") {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <FactCard
          copy={{
            title: SIGNING_COPY.signedTitle,
            rowsLabel: SIGNING_COPY.packetRowsLabel,
          }}
          lead={SIGNING_COPY.signedLead}
          rows={packetRows.slice(0, 2)}
        />
      </div>
    );
  }
  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <FactCard
        copy={{
          title: SIGNING_COPY.downloadTitle,
          description: SIGNING_COPY.downloadNote,
          rowsLabel: SIGNING_COPY.packetRowsLabel,
        }}
        lead={SIGNING_COPY.downloadLead}
        rows={packetRows}
        actions={<Button>{SIGNING_COPY.downloadAll}</Button>}
      />
    </div>
  );
}

/** The signing ceremony on the shop's iPad, one state per story. A wireframe. */
function SigningPrototype({ state }: SigningPrototypeProps) {
  return (
    <VaultPageShell>
      <PrototypeNote
        manualPath={DOCUMENTS_AND_SIGNING_MANUAL_PATH}
        settles="the packet’s layout on the iPad, how the fingerprints read, what the staff member sees after a refusal and the download’s wording."
      />
      <PageHeader title={SIGNING_COPY.title} />
      <SigningBody state={state} />
    </VaultPageShell>
  );
}

export type { SigningPrototypeProps, SigningState };
export { SigningBody, SigningPrototype };
