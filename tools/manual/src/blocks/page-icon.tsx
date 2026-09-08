import {
  ArrowsClockwise,
  Bank,
  Browsers,
  CalendarCheck,
  Gavel,
  type Icon,
  IdentificationCard,
  Key,
  ListMagnifyingGlass,
  Medal,
  Moon,
  Package,
  Palette,
  ShoppingBag,
  Signature,
  Sliders,
  SquaresFour,
  Storefront,
  UserCircle,
  Vault,
} from "@phosphor-icons/react";
import type { PageIcon as PageIconName } from "../content/icons";

/** The one place a name in the vocabulary becomes a glyph. The record is
 * total, so a name added to the vocabulary without a glyph fails typecheck. */
const GLYPHS: Record<PageIconName, Icon> = {
  "arrows-clockwise": ArrowsClockwise,
  bank: Bank,
  browsers: Browsers,
  "calendar-check": CalendarCheck,
  gavel: Gavel,
  "identification-card": IdentificationCard,
  key: Key,
  "list-magnifying-glass": ListMagnifyingGlass,
  medal: Medal,
  moon: Moon,
  package: Package,
  palette: Palette,
  "shopping-bag": ShoppingBag,
  signature: Signature,
  sliders: Sliders,
  "squares-four": SquaresFour,
  storefront: Storefront,
  "user-circle": UserCircle,
  vault: Vault,
};

/** The glyph alone — a caller that needs it placed or coloured wraps it, the
 * way every row in the rail already does. */
export function PageIcon({
  name,
  size = 16,
}: {
  name: PageIconName | undefined;
  size?: number;
}) {
  if (!name) return null;
  const Glyph = GLYPHS[name];
  return <Glyph aria-hidden size={size} />;
}
