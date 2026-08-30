import {
  Avatar,
  AvatarFallback,
} from "@grade10/design-system/components/display/avatar";

type BidderInitialAvatarProps = {
  initials: string;
  size?: "sm" | "md";
};

function BidderInitialAvatar({
  initials,
  size = "sm",
}: BidderInitialAvatarProps) {
  return (
    <Avatar size={size === "sm" ? "sm" : "md"}>
      <AvatarFallback aria-hidden>{initials}</AvatarFallback>
    </Avatar>
  );
}

export { BidderInitialAvatar };
