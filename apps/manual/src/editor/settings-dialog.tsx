import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { RadioListItem } from "@grade10/design-system/components/forms/radio-list-item";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { useState } from "react";
import { REPO, TOKEN_SETTINGS_URL, type WriteMode } from "./config";
import { TextField } from "./fields";
import { setGithubMode, setGithubToken, useEditorSession } from "./session";

/**
 * Where the hosted editor saves, and what it saves with. A fine-grained PAT is
 * the interim credential, and it is only tolerable because the renderer never
 * renders raw HTML — that is the XSS line a stored token sits behind.
 */

const MODES: { value: WriteMode; title: string; needs: string; how: string }[] =
  [
    {
      value: "main",
      title: `Straight to ${REPO.defaultBranch}`,
      needs: "Contents: read and write. Add Actions: read to see deploy status",
      how: "The deploy listens on push, so a save is live in about a minute.",
    },
    {
      value: "branch",
      title: "Branch and pull request",
      needs: "Contents plus Pull requests: read and write",
      how: "Edits land on your own branch with its pull request kept open.",
    },
  ];

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const { token, mode } = useEditorSession();
  const [draft, setDraft] = useState(token ?? "");

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-(--container-md)">
        <DialogTitle className="font-heading font-bold text-lg">
          Saving to {REPO.owner}/{REPO.repo}
        </DialogTitle>

        <RadioList
          label="Where saves go"
          onValueChange={(next) => setGithubMode(next as WriteMode)}
          value={mode}
        >
          {MODES.map((choice) => (
            <RadioListItem key={choice.value} value={choice.value}>
              <span className="flex flex-col gap-0.5">
                <Text as="span" size="sm" weight="medium">
                  {choice.title}
                </Text>
                <Text as="span" size="xs" tone="secondary">
                  {choice.how} Needs a fine-grained token for this repository
                  with <strong>{choice.needs}</strong>.
                </Text>
              </span>
            </RadioListItem>
          ))}
        </RadioList>

        <TextField
          label="Token"
          onChange={setDraft}
          placeholder="github_pat_…"
          value={draft}
        />

        <Text as="p" size="xs" tone="secondary">
          The token is kept in this browser only.
        </Text>

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
