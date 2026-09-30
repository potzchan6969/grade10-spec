import { VaultLetter } from "@/emails/vault/_components/vault-letter";
import {
  footerLines,
  previewCase,
  previewCaseLine,
} from "@/emails/vault/fixtures";

export type VisitCancelledProps = Record<string, never>;

export default function VisitCancelledEmail() {
  const { itemTitle } = previewCase;

  return (
    <VaultLetter
      attachments={["a calendar update"]}
      caseLine={previewCaseLine}
      cta={{ href: previewCase.url, label: "Book again" }}
      footer={{
        lines: footerLines("custodian"),
        whyYouGotThis: "Your vault visit was cancelled.",
      }}
      heading="Your visit is off"
      lead={[
        `The visit for ${itemTitle} has been cancelled. You can book another time whenever you are ready.`,
        "The attached file clears the earlier visit from your phone's calendar.",
      ]}
      preheader="Your visit was cancelled. Book another time whenever you are ready."
    />
  );
}

VisitCancelledEmail.PreviewProps = {} satisfies VisitCancelledProps;
