import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { CampaignGiftArt } from "./campaign-gift-art";

type CampaignGiftProps = {
  /** "What you can win". */
  eyebrow: string;
  /** The gift's name. */
  title: string;
  /** A line about it: how many a member can win, where it is collected. */
  text?: string | null;
  imageUrl?: string | null;
};

/** The prize, shown big: the reason anyone opens the page. */
function CampaignGift({ eyebrow, title, text, imageUrl }: CampaignGiftProps) {
  return (
    <HStack
      className="rounded-2xl bg-primary-muted p-6"
      data-slot="campaign-gift"
      gap="lg"
      vAlign="center"
      wrap
    >
      <CampaignGiftArt imageUrl={imageUrl} size="lg" />
      <VStack className="min-w-0 flex-1" gap="xs">
        <span className="text-xs font-bold tracking-widest text-primary uppercase">
          {eyebrow}
        </span>
        <h2 className="text-2xl leading-tight font-bold text-balance">
          {title}
        </h2>
        {text ? <Text tone="secondary">{text}</Text> : null}
      </VStack>
    </HStack>
  );
}

export type { CampaignGiftProps };
export { CampaignGift };
