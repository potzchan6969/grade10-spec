import { avatarInitial } from "@grade10/design-system/components/display/avatar";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import {
  type AsyncState,
  ProfileCard,
  ProfileDetails,
  ProfileForm,
  type ProfileFormValues,
  SiteHeader,
} from "@grade10/ui";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import {
  FIRST_SAVE_DATE,
  PROFILE_CARD_COPY,
  PROFILE_COPY,
  PROFILE_DETAILS_COPY,
  PROFILE_FORM_COPY,
  PROFILE_LIMITS,
  type ProfileView,
  SAVED_PROFILE,
} from "./profile-content";

/** How long the stand-in save runs before it answers. */
const SAVE_MS = 600;

type ProfileSave = "idle" | "saving" | "refused" | "failed" | "emptyName";

type ProfilePageProps = {
  read?: "ready" | "loading" | "error";
  profile?: ProfileView;
  mode?: "view" | "edit";
  /** Drops the edit control: the read view with nothing to change. */
  readOnly?: boolean;
  /** The save as it stands when the page opens. */
  save?: ProfileSave;
  /** What the next save answers. The page stands in for the server. */
  outcome?: "saved" | "refused" | "failed";
};

/**
 * The account profile as the store assembles it: `SiteHeader`, the profile
 * card, and `Footer`. The page owns the view-versus-edit state and the save;
 * the card and the form only receive what it decides.
 */
function ProfilePage({
  read: initialRead = "ready",
  profile: initialProfile = SAVED_PROFILE,
  mode: initialMode = "view",
  readOnly = false,
  save: initialSave = "idle",
  outcome = "saved",
}: ProfilePageProps) {
  const [read, setRead] = useState(initialRead);
  const [saved, setSaved] = useState(initialProfile);
  const [mode, setMode] = useState(initialMode);
  const [save, setSave] = useState(initialSave);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function submit(values: ProfileFormValues) {
    setSave("saving");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (outcome !== "saved") {
        setSave(outcome);
        return;
      }
      setSaved({
        ...saved,
        displayName: values.displayName,
        bio: values.bio,
        avatarSrc:
          values.avatar.outcome === "unchanged"
            ? saved.avatarSrc
            : values.avatar.outcome === "removed"
              ? undefined
              : URL.createObjectURL(values.avatar.file),
        memberSince: saved.memberSince ?? FIRST_SAVE_DATE,
      });
      setMode("view");
      setSave("idle");
    }, SAVE_MS);
  }

  function cancel() {
    setMode("view");
    setSave("idle");
  }

  const error =
    save === "refused"
      ? PROFILE_COPY.refused
      : save === "failed"
        ? PROFILE_COPY.failed
        : save === "emptyName"
          ? PROFILE_COPY.emptyName
          : undefined;

  const card: AsyncState<ReactNode> =
    read === "loading"
      ? { status: "loading" }
      : read === "error"
        ? {
            status: "error",
            message: PROFILE_COPY.loadFailed,
            action: {
              label: PROFILE_COPY.retry,
              onAction: () => setRead("ready"),
            },
          }
        : {
            status: "ready",
            data:
              mode === "view" ? (
                <ProfileDetails
                  avatarAlt={PROFILE_COPY.avatarAlt}
                  avatarFallback={avatarInitial(saved.displayName)}
                  avatarSrc={saved.avatarSrc}
                  email={saved.email}
                  bio={saved.bio || PROFILE_COPY.emptyBio}
                  copy={readOnly ? undefined : PROFILE_DETAILS_COPY}
                  displayName={saved.displayName}
                  meta={
                    saved.memberSince
                      ? PROFILE_COPY.memberSince(saved.memberSince)
                      : undefined
                  }
                  onEdit={readOnly ? undefined : () => setMode("edit")}
                />
              ) : (
                <ProfileForm
                  {...PROFILE_LIMITS}
                  avatarAlt={PROFILE_COPY.avatarAlt}
                  avatarFallback={avatarInitial(saved.displayName)}
                  avatarSrc={saved.avatarSrc}
                  copy={PROFILE_FORM_COPY}
                  email={saved.email}
                  error={error}
                  initialBio={saved.bio}
                  initialDisplayName={saved.displayName}
                  onCancel={cancel}
                  onSubmit={submit}
                  pending={save === "saving"}
                />
              ),
          };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <div className="flex w-full flex-1 justify-center">
        <div className="flex w-full max-w-4xl flex-col gap-8 px-8 py-12">
          <Breadcrumbs>
            <BreadcrumbItem href="#account">Account</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem current>{PROFILE_COPY.title}</BreadcrumbItem>
          </Breadcrumbs>
          <h1 className="text-3xl font-semibold text-foreground">
            {PROFILE_COPY.title}
          </h1>
          <ProfileCard copy={PROFILE_CARD_COPY} state={card} />
        </div>
      </div>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

export type { ProfilePageProps, ProfileSave };
export { ProfilePage };
