import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { type FormEvent, type ReactNode, useState } from "react";
import type { ProfileFormValues } from "./types";

type ProfileFormProps = {
  initialDisplayName?: string;
  initialBio?: string;
  displayNameLabel: ReactNode;
  bioLabel: ReactNode;
  displayNameMaxLength?: number;
  bioMaxLength?: number;
  pending?: boolean;
  error?: ReactNode;
  submitLabel: ReactNode;
  onSubmit: (values: ProfileFormValues) => void;
  /** Omit both and the form is create-only, with no way to dismiss it. */
  cancelLabel?: ReactNode;
  onCancel?: () => void;
};

/**
 * Edits the two profile fields and reports them trimmed. Drafts are internal
 * UI state; the saved profile stays with the consumer, seeded through the
 * `initial*` props.
 *
 * Bio is a single-line field because the design system publishes no textarea;
 * a local one would be the hand-rolled control the house rules forbid.
 */
function ProfileForm({
  initialDisplayName = "",
  initialBio = "",
  displayNameLabel,
  bioLabel,
  displayNameMaxLength = 80,
  bioMaxLength = 500,
  pending = false,
  error,
  submitLabel,
  onSubmit,
  cancelLabel,
  onCancel,
}: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ displayName: displayName.trim(), bio: bio.trim() });
  }

  return (
    <form
      className="flex flex-col gap-4"
      data-slot="profile-form"
      onSubmit={handleSubmit}
    >
      <TextInput
        label={displayNameLabel}
        maxLength={displayNameMaxLength}
        onChange={(event) => setDisplayName(event.target.value)}
        required
        value={displayName}
      />
      <TextInput
        label={bioLabel}
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
        <Button disabled={!displayName.trim()} loading={pending} type="submit">
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button onClick={onCancel} type="button" variant="ghost">
            {cancelLabel}
          </Button>
        ) : null}
      </HStack>
    </form>
  );
}

export type { ProfileFormProps };
export { ProfileForm };
