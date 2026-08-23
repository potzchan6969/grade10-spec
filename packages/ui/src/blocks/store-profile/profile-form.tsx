import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { type FormEvent, type ReactNode, useState } from "react";
import type { ProfileFormValues } from "./types";

/** The words the form says, whoever is filling it in. */
type ProfileFormCopy = {
  displayName: string;
  bio: string;
  submit: string;
  /** Names the way out. Omit it, and the handler with it, and the form is
   * create-only. */
  cancel?: string;
};

type ProfileFormProps = {
  copy: ProfileFormCopy;
  initialDisplayName?: string;
  initialBio?: string;
  displayNameMaxLength?: number;
  bioMaxLength?: number;
  pending?: boolean;
  error?: ReactNode;
  onSubmit: (values: ProfileFormValues) => void;
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
  copy,
  displayNameMaxLength = 80,
  bioMaxLength = 500,
  pending = false,
  error,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ displayName: displayName.trim(), bio: bio.trim() });
  }

  return (
    <form data-slot="profile-form" onSubmit={handleSubmit}>
      <VStack gap="md">
        <TextInput
          label={copy.displayName}
          maxLength={displayNameMaxLength}
          onChange={(event) => setDisplayName(event.target.value)}
          required
          value={displayName}
        />
        <TextInput
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
          <Button
            disabled={!displayName.trim()}
            loading={pending}
            type="submit"
          >
            {copy.submit}
          </Button>
          {onCancel ? (
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
