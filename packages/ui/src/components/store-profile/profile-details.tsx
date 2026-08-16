import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ReactNode } from "react";

type ProfileDetailsProps = {
  displayName: ReactNode;
  /** Display-ready: the consumer resolves an empty bio to its own
   * placeholder copy before it gets here. */
  bio?: ReactNode;
  /** The dateline — "Member since March 2024", already formatted. */
  meta?: ReactNode;
  /** Omit both and the view is read-only. */
  editLabel?: ReactNode;
  onEdit?: () => void;
};

/** The read view of a profile: name, bio, a meta line, and the way into the
 * form. */
function ProfileDetails({
  displayName,
  bio,
  meta,
  editLabel,
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
          {editLabel}
        </Button>
      ) : null}
    </VStack>
  );
}

export type { ProfileDetailsProps };
export { ProfileDetails };
