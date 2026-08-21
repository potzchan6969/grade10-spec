import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ReactNode } from "react";

/** The words the view says, whoever's profile it is. */
type ProfileDetailsCopy = {
  /** Names the way into the form. Omit it, and the handler with it, and the
   * view is read-only. */
  edit?: string;
};

type ProfileDetailsProps = {
  copy?: ProfileDetailsCopy;
  displayName: ReactNode;
  /** Display-ready: the consumer resolves an empty bio to its own
   * placeholder copy before it gets here. */
  bio?: ReactNode;
  /** The dateline — "Member since March 2024", already formatted. */
  meta?: ReactNode;
  onEdit?: () => void;
};

/** The read view of a profile: name, bio, a meta line, and the way into the
 * form. */
function ProfileDetails({
  displayName,
  bio,
  meta,
  copy,
  onEdit,
}: ProfileDetailsProps) {
  return (
    <VStack data-slot="profile-details" gap="sm">
      <VStack gap="xs">
        <Text size="lg" weight="medium">
          {displayName}
        </Text>
        {bio ? <Text tone="secondary">{bio}</Text> : null}
      </VStack>
      {meta ? (
        <Text size="sm" tone="secondary">
          {meta}
        </Text>
      ) : null}
      {onEdit ? (
        <Button onClick={onEdit} variant="outline">
          {copy?.edit}
        </Button>
      ) : null}
    </VStack>
  );
}

export type { ProfileDetailsCopy, ProfileDetailsProps };
export { ProfileDetails };
