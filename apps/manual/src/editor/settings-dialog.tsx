import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { useState } from "react";
import { REPO, TOKEN_SETTINGS_URL } from "./config";
import { TextField } from "./fields";
import { setGithubToken, useEditorSession } from "./session";

/**
 * Where the hosted editor gets its credential. A fine-grained PAT is the
 * interim answer, and it is only tolerable because the renderer never renders
 * raw HTML — that is the XSS line a stored token sits behind.
 */

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const { token } = useEditorSession();
  const [draft, setDraft] = useState(token ?? "");

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-(--container-md)">
        <DialogTitle className="font-heading font-bold text-lg">
          GitHub token
        </DialogTitle>

        <Text as="p" size="sm" tone="secondary">
          Edits are committed to a branch of {REPO.owner}/{REPO.repo} and opened
          as a pull request. That needs a fine-grained token for this repository
          with <strong>Contents: read and write</strong> and{" "}
          <strong>Pull requests: read and write</strong>. It is kept in this
          browser only.
        </Text>

        <TextField
          label="Token"
          onChange={setDraft}
          placeholder="github_pat_…"
          value={draft}
        />

        <div className="flex flex-wrap items-center gap-2">
          <a
            className="text-secondary-foreground text-xs underline hover:text-foreground"
            href={TOKEN_SETTINGS_URL}
            rel="noreferrer noopener"
            target="_blank"
          >
            Make one on GitHub
          </a>
          <div className="ml-auto flex gap-2">
            {token ? (
              <Button
                onClick={() => {
                  setGithubToken(null);
                  setDraft("");
                  onOpenChange(false);
                }}
                size="sm"
                type="button"
                variant="ghost"
              >
                Forget it
              </Button>
            ) : null}
            <Button
              disabled={draft.trim() === ""}
              onClick={() => {
                setGithubToken(draft.trim());
                onOpenChange(false);
              }}
              size="sm"
              type="button"
            >
              Save token
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
