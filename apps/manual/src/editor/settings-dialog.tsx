import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { useEffect, useState } from "react";
import { authAvailability, readRenewal, signInPath } from "./auth";
import { REPO } from "./config";
import { browserKeyStore } from "./github-store";
import { signOut, useEditorSession } from "./session";
import { expiryNote } from "./verify";

/**
 * Who is signed in, and the door for whoever is not. There is nothing to
 * paste and nothing to configure per person: the GitHub App is installed on
 * the repository once, sign-in is one redirect, and the token it lands stays
 * in this browser only — renewed by the session itself while GitHub allows.
 *
 * Saves land straight on the base branch; the deploy listens on push, so an
 * edit is live in about a minute.
 */

type Availability = "asking" | "enabled" | "disabled";

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const { token, verdict, problem } = useEditorSession();
  const [auth, setAuth] = useState<Availability>("asking");

  useEffect(() => {
    if (!open) return;
    let live = true;
    void authAvailability().then((answer) => {
      if (live) setAuth(answer.enabled ? "enabled" : "disabled");
    });
    return () => {
      live = false;
    };
  }, [open]);

  // A sign-in that renews itself has no expiry worth announcing; one that
  // cannot renew wears the token's own end date.
  const renewal = readRenewal(browserKeyStore);
  const expiry = renewal?.refreshToken
    ? null
    : expiryNote(verdict?.expires ?? null);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-(--container-md)">
        <DialogTitle className="font-heading font-bold text-lg">
          Editing {REPO.owner}/{REPO.repo}
        </DialogTitle>

        <Text as="p" size="xs" tone="secondary">
          Saves land straight on <strong>{REPO.defaultBranch}</strong> — the
          deploy listens on push, so an edit is live in about a minute. Signing
          in with GitHub is what turns editing on; the token it leaves stays in
          this browser only.
        </Text>

        {verdict ? (
          <Text as="p" size="xs">
            Signed in as <strong>@{verdict.login}</strong> · write access to{" "}
            {REPO.owner}/{REPO.repo}
            {renewal?.refreshToken ? (
              <span> · signs itself back in as the token expires</span>
            ) : null}
            {expiry ? (
              <span className={expiry.urgent ? "text-destructive" : undefined}>
                {" · "}
                {expiry.text}
              </span>
            ) : null}
          </Text>
        ) : null}

        {problem ? (
          <Text as="p" className="text-destructive" size="xs">
            {problem}
          </Text>
        ) : null}

        {!verdict && token && !problem ? (
          <Text as="p" size="xs" tone="secondary">
            Checking this sign-in with GitHub…
          </Text>
        ) : null}

        {!token && auth === "disabled" ? <SetupNote /> : null}

        <div className="flex flex-wrap items-center justify-end gap-2">
          {token ? (
            <Button
              onClick={() => {
                signOut();
                onOpenChange(false);
              }}
              size="sm"
              type="button"
              variant="ghost"
            >
              Sign out
            </Button>
          ) : null}
          {auth === "enabled" && (!token || problem) ? (
            <Button
              onClick={() => {
                window.location.assign(signInPath(backPath()));
              }}
              size="sm"
              type="button"
            >
              Sign in with GitHub
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** The one state a reader cannot fix: the deployment has no GitHub App yet.
 * Say what an admin does, and where the exact steps live. */
function SetupNote() {
  return (
    <Text as="p" size="xs" tone="secondary">
      Sign-in is not configured on this deployment, so the site is read-only for
      everyone. An admin registers a GitHub App for {REPO.owner}/{REPO.repo} —
      Contents: read and write, Actions: read, callback URL{" "}
      <code>/auth/callback</code> on this host — installs it on the repository,
      and gives the worker its client id and secret. The exact steps live in{" "}
      <code>apps/manual/worker/auth.ts</code>.
    </Text>
  );
}

function backPath(): string {
  return `${window.location.pathname}${window.location.search}`;
}
