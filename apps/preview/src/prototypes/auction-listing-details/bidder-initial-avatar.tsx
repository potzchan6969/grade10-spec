import {
  Avatar,
  AvatarFallback,
  avatarInitial,
} from "@grade10/design-system/components/display/avatar";

type BidderInitialAvatarProps = {
  /** Email or display label — one uppercase initial is shown. */
  initials: string;
  size?: "sm" | "md";
};

function BidderInitialAvatar({
  initials,
  size = "sm",
}: BidderInitialAvatarProps) {
  return (
    <Avatar size={size === "sm" ? "sm" : "md"}>
      <AvatarFallback aria-hidden>{avatarInitial(initials)}</AvatarFallback>
    </Avatar>
  );
}

export { BidderInitialAvatar };
