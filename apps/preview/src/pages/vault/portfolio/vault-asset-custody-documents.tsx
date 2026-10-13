import { Alert } from "@grade10/design-system/components/display/alert";
import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  ArrowSquareOut,
  Eye,
  File,
  FilePdf,
  FileZip,
} from "@phosphor-icons/react";
import type { VaultAsset } from "../../vault-content";

type VaultAssetCustodyDocumentsProps = {
  asset: VaultAsset;
  className?: string;
};

function DocumentActionIcon({
  action,
  external,
}: {
  action: string;
  external: boolean;
}) {
  const Icon = external
    ? ArrowSquareOut
    : action === "View"
      ? Eye
      : action === "ZIP"
        ? FileZip
        : FilePdf;
  return <Icon aria-hidden weight="bold" />;
}

/**
 * Custody log and document tabs for the vault asset detail page. The custody
 * log uses a vertical stepper where the latest entry is marked completed and
 * earlier history is upcoming. Drawn from the Figma Asset Custody & Documents
 * block (`7054:5063`).
 */
function VaultAssetCustodyDocuments({
  asset,
  className,
}: VaultAssetCustodyDocumentsProps) {
  const custodyLog = asset.custodyLog ?? [];
  const documents = asset.documents ?? [];
  const lastIndex = custodyLog.length - 1;

  return (
    <Tabs className={className} defaultValue="custody-log">
      <TabsList
        className="w-full justify-start border-b border-border px-0"
        variant="list"
      >
        <TabsTrigger value="custody-log">Custody Log</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>
      <TabsContent className="py-3" value="custody-log">
        <Stepper orientation="vertical">
          {custodyLog.map((log, index) => (
            <Step
              key={`${log.label}:${log.description}`}
              description={log.description}
              label={log.label}
              orientation="vertical"
              showLeadingConnector={index !== 0}
              showTrailingConnector={index !== lastIndex}
              state={log.state}
            />
          ))}
        </Stepper>
      </TabsContent>
      <TabsContent className="py-3" value="documents">
        <VStack gap="sm" hAlign="stretch">
          {documents.map((doc) => (
            <Alert
              actions={
                doc.action ? (
                  <Button
                    leading={
                      <DocumentActionIcon
                        action={doc.action}
                        external={Boolean(doc.href)}
                      />
                    }
                    render={
                      doc.href ? (
                        <a href={doc.href} rel="noreferrer" target="_blank">
                          {doc.action}
                        </a>
                      ) : undefined
                    }
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {doc.action}
                  </Button>
                ) : undefined
              }
              key={doc.label}
              dismissible={false}
              icon={<File aria-hidden size={16} weight="bold" />}
              layout="inline"
              status="default"
              title={doc.label}
            />
          ))}
        </VStack>
      </TabsContent>
    </Tabs>
  );
}

export type { VaultAssetCustodyDocumentsProps };
export { VaultAssetCustodyDocuments };
