import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@grade10/design-system/components/display/avatar";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { Textarea } from "@grade10/design-system/components/forms/textarea";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ProfileFormValues } from "./types";

/** The words the form says, whoever is filling it in. */
type ProfileFormCopy = {
  displayName: string;
  bio: string;
  submit: string;
  /** Opens the file picker for a replacement avatar. */
  chooseAvatar: string;
  /** Takes the current or chosen avatar away. */
  removeAvatar: string;
  /** Names the way out. Omit it, or the handler, and no cancel shows. */
  cancel?: string;
};

type ProfileFormProps = {
  copy: ProfileFormCopy;
  initialDisplayName?: string;
  initialBio?: string;
  /** The current avatar image, if the collector has one. */
  avatarSrc?: string;
  /** The image's accessible name, supplied by the application. */
  avatarAlt: string;
  /** What stands in for the image — the application derives it. */
  avatarFallback: ReactNode;
  /** The signed-in address, shown read-only and never reported. */
  email?: ReactNode;
  /** The application's limits; the form holds none of its own. */
  displayNameMaxLength: number;
  bioMaxLength: number;
  pending?: boolean;
  error?: ReactNode;
  onSubmit: (values: ProfileFormValues) => void;
  onCancel?: () => void;
};

type AvatarDraft = ProfileFormValues["avatar"];

/** The object URL of a chosen file, revoked when the choice changes. */
function usePreview(draft: AvatarDraft): string | undefined {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (draft.outcome !== "chosen") {
      setUrl(undefined);
      return;
    }
    const next = URL.createObjectURL(draft.file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [draft]);
  return url;
}

/**
 * Edits the avatar and the two text fields and reports them, the text
 * trimmed. Drafts are internal UI state; the saved profile stays with the
 * consumer, seeded through the `initial*` and `avatar*` props. The form
 * judges nothing: the application refuses through `error`.
 */
function ProfileForm({
  initialDisplayName = "",
  initialBio = "",
  avatarSrc,
  avatarAlt,
  avatarFallback,
  email,
  copy,
  displayNameMaxLength,
  bioMaxLength,
  pending = false,
  error,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [avatar, setAvatar] = useState<AvatarDraft>({ outcome: "unchanged" });
  const fileInput = useRef<HTMLInputElement>(null);
  const preview = usePreview(avatar);

  const shownSrc =
    avatar.outcome === "chosen"
      ? preview
      : avatar.outcome === "removed"
        ? undefined
        : avatarSrc;

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) setAvatar({ outcome: "chosen", file });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    onSubmit({ displayName: displayName.trim(), bio: bio.trim(), avatar });
  }

  return (
    <form data-slot="profile-form" onSubmit={handleSubmit}>
      <VStack gap="md">
        <HStack gap="md" vAlign="center">
          <Avatar size="xl">
            {shownSrc ? <AvatarImage alt={avatarAlt} src={shownSrc} /> : null}
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <VStack gap="xs">
            <HStack gap="sm">
              <Button
                onClick={() => fileInput.current?.click()}
                size="sm"
                type="button"
                variant="outline"
              >
                {copy.chooseAvatar}
              </Button>
              {shownSrc ? (
                <Button
                  onClick={() => setAvatar({ outcome: "removed" })}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  {copy.removeAvatar}
                </Button>
              ) : null}
            </HStack>
            {email ? (
              <Text size="sm" tone="secondary">
                {email}
              </Text>
            ) : null}
          </VStack>
          <input
            aria-label={copy.chooseAvatar}
            className="hidden"
            data-slot="profile-avatar-input"
            onChange={handleFile}
            ref={fileInput}
            tabIndex={-1}
            type="file"
          />
        </HStack>
        <TextInput
          label={copy.displayName}
          maxLength={displayNameMaxLength}
          onChange={(event) => setDisplayName(event.target.value)}
          value={displayName}
        />
        <Textarea
          label={copy.bio}
          maxLength={bioMaxLength}
          onChange={(event) => setBio(event.target.value)}
          value={bio}
        />
        {error ? (
          <Text size="sm" tone="error">
            {error}
          </Text>
        ) : null}
        <HStack gap="sm">
          <Button loading={pending} type="submit">
            {copy.submit}
          </Button>
          {copy.cancel && onCancel ? (
            <Button onClick={onCancel} type="button" variant="ghost">
              {copy.cancel}
            </Button>
          ) : null}
        </HStack>
      </VStack>
    </form>
  );
}

export type { ProfileFormCopy, ProfileFormProps };
export { ProfileForm };
