import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Link } from "@grade10/design-system/components/forms/link";

type CampaignBannerProps = {
  /** The campaign's name, in the member's language. */
  title: string;
  /** One line under the name; omitted, the banner shows none. */
  tagline?: string | null;
  /** A wide 3:1 picture above the name; decorative, so it carries no alt. */
  imageUrl?: string | null;
  /** The way into the campaign's page. */
  action: { label: string; href: string };
};

/**
 * PROTOTYPE - not yet designed. A running campaign's way in from the
 * membership page: its picture, its name, its tagline and one link. Drawn
 * with the card primitive's own look until the designer draws the banner;
 * what the design must settle is listed on the Campaigns page's prototype.
 */
function CampaignBanner({
  title,
  tagline,
  imageUrl,
  action,
}: CampaignBannerProps) {
  return (
    <Card data-prototype="" data-slot="campaign-banner">
      {imageUrl ? (
        <img
          alt=""
          className="aspect-[3/1] w-full object-cover"
          data-slot="campaign-banner-image"
          src={imageUrl}
        />
      ) : null}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {tagline ? <CardDescription>{tagline}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <Link href={action.href}>{action.label}</Link>
      </CardContent>
    </Card>
  );
}

export type { CampaignBannerProps };
export { CampaignBanner };
