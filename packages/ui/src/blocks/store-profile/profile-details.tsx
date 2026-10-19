import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@grade10/design-system/components/display/avatar";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ReactNode } from "react";

/** The words the view says, whoever's profile it is. */
type ProfileDetailsCopy = {
  /** Names the way into the form. Omit it, or the handler, and the view is
   * read-only. */
  edit?: string;
};

type ProfileDetailsProps = {
  copy?: ProfileDetailsCopy;
  /** The avatar image. Omitted, or failing to load, `avatarFallback` shows. */
  avatarSrc?: string;
  /** The image's accessible name, supplied by the application. */
  avatarAlt: string;
  /** What stands in for the image — the application derives it. */
  avatarFallback: ReactNode;
  displayName: ReactNode;
  /** The signed-in address, shown as given. */
  email?: ReactNode;
  /** Display-ready: the consumer resolves an empty bio to its own
   * placeholder copy before it gets here. Line breaks show as typed. */
  bio?: ReactNode;
  /** The dateline — "Member since March 2024", already formatted. */
  meta?: ReactNode;
  onEdit?: () => void;
};

/** The read view of a profile: avatar, name, email, bio, a meta line, and the
 * way into the form. */
function ProfileDetails({
  avatarSrc,
  avatarAlt,
  avatarFallback,
  displayName,
  email,
  bio,
  meta,
  copy,
  onEdit,
}: ProfileDetailsProps) {
  return (
    <VStack data-slot="profile-details" gap="sm">
      <HStack gap="md" vAlign="center">
        <Avatar size="xl">
          {avatarSrc ? <AvatarImage alt={avatarAlt} src={avatarSrc} /> : null}
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <VStack gap="xs">
          <Text size="lg" weight="medium">
            {displayName}
          </Text>
          {email ? (
            <Text size="sm" tone="secondary">
              {email}
            </Text>
          ) : null}
        </VStack>
      </HStack>
      {bio ? (
        <Text className="whitespace-pre-line" tone="secondary">
          {bio}
        </Text>
      ) : null}
      {meta ? (
        <Text size="sm" tone="secondary">
          {meta}
        </Text>
      ) : null}
      {copy?.edit && onEdit ? (
        <Button onClick={onEdit} variant="outline">
          {copy.edit}
        </Button>
      ) : null}
    </VStack>
  );
}

export type { ProfileDetailsCopy, ProfileDetailsProps };
export { ProfileDetails };
