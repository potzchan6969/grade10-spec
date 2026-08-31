import {
  Avatar,
  AvatarFallback,
  avatarInitial,
} from "@grade10/design-system/components/display/avatar";

type ListingBidderAvatarProps = {
  /** Email or display label — one uppercase initial is shown. */
  initials: string;
  size?: "sm" | "md";
};

function ListingBidderAvatar({
  initials,
  size = "sm",
}: ListingBidderAvatarProps) {
  return (
    <Avatar size={size === "sm" ? "sm" : "md"}>
      <AvatarFallback aria-hidden>{avatarInitial(initials)}</AvatarFallback>
    </Avatar>
  );
}

export type { ListingBidderAvatarProps };
export { ListingBidderAvatar };
