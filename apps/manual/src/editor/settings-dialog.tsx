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
import {
  REPO,
  TOKEN_LIST_URL,
  TOKEN_SETTINGS_URL,
  type WriteMode,
} from "./config";
import { TextField } from "./fields";
import {
  forgetGithubToken,
  saveGithubToken,
  setGithubMode,
  useEditorSession,
} from "./session";
import { describeCause } from "./store";
import { expiryNote } from "./verify";

/**
 * Where the hosted editor saves, and what it saves with. A fine-grained PAT is
 * the interim credential, and it is only tolerable because the renderer never
 * renders raw HTML — that is the XSS line a stored token sits behind.
 *
 * Saving one is a verification, not a paste: GitHub is asked who the token
 * belongs to and whether it reaches this repository, and the answer — the
 * handle, the expiry, or the exact refusal — is what this dialog shows.
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

type Check =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "refused"; reason: string };

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const { token, mode, verdict } = useEditorSession();
  const [draft, setDraft] = useState(token ?? "");
  const [check, setCheck] = useState<Check>({ state: "idle" });

  const expiry = expiryNote(verdict?.expires ?? null);

  const save = () => {
    setCheck({ state: "checking" });
    saveGithubToken(draft.trim())
      .then((result) => {
        setCheck(
          result.ok
            ? { state: "idle" }
            : { state: "refused", reason: result.reason },
        );
      })
      .catch((cause: unknown) => {
        setCheck({
          state: "refused",
          reason: `GitHub could not be reached: ${describeCause(cause)}`,
        });
      });
  };

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
          onChange={(next) => {
            setDraft(next);
            setCheck({ state: "idle" });
          }}
          placeholder="github_pat_…"
          value={draft}
        />

        {verdict ? (
          <Text as="p" size="xs">
            Signed in as <strong>@{verdict.login}</strong> · write access to{" "}
            {REPO.owner}/{REPO.repo}
            {expiry ? (
              <span className={expiry.urgent ? "text-destructive" : undefined}>
                {" · "}
                {expiry.text}
              </span>
            ) : null}
          </Text>
        ) : null}

        {check.state === "refused" ? (
          <Text as="p" className="text-destructive" size="xs">
            {check.reason}
          </Text>
        ) : null}

        <TokenGuide />

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
                  forgetGithubToken();
                  setDraft("");
                  setCheck({ state: "idle" });
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
              loading={check.state === "checking"}
              onClick={save}
              size="sm"
              type="button"
            >
              Verify and save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** What to ask GitHub for, and the two things that go wrong afterwards. Short
 * on purpose: a manual nobody reads is worse than four sentences. */
function TokenGuide() {
  return (
    <Text as="p" size="xs" tone="secondary">
      Make a <strong>fine-grained</strong> token: Only select repositories →{" "}
      <strong>
        {REPO.owner}/{REPO.repo}
      </strong>
      , Repository permissions → <strong>Contents: read and write</strong> (add{" "}
      <strong>Pull requests: read and write</strong> for branch mode).{" "}
      {REPO.owner} is an organization, so an owner may have to approve the token
      — until they do it reads as no access at all, and it sits pending on{" "}
      <a
        className="underline hover:text-foreground"
        href={TOKEN_LIST_URL}
        rel="noreferrer noopener"
        target="_blank"
      >
        your token list
      </a>
      . Fine-grained tokens expire — 30 days unless you pick otherwise — and
      when this one does, saving stops until you paste the next one here. The
      token is kept in this browser only.
    </Text>
  );
}
