/* Public entry: re-exports exactly the compound-component exports the
 * capability specs name. Populated as blocks land under src/blocks/. */

// shared-ui/auction-listing
export {
  ListingBidPanel,
  type ListingBidPanelCopy,
  type ListingBidPanelProps,
} from "./blocks/auction-listing/listing-bid-panel";
export {
  ListingDetails,
  type ListingDetailsCopy,
  type ListingDetailsFact,
  type ListingDetailsProps,
  type ListingDetailsSection,
} from "./blocks/auction-listing/listing-details";
export {
  ListingGallery,
  type ListingGalleryCopy,
  type ListingGalleryImage,
  type ListingGalleryProps,
} from "./blocks/auction-listing/listing-gallery";
// shared-ui/auth-sign-in
export {
  SignInCard,
  type SignInCardAction,
  type SignInCardCopy,
  type SignInCardProps,
} from "./blocks/auth-sign-in/sign-in-card";
export {
  SignInCodeForm,
  type SignInCodeFormCopy,
  type SignInCodeFormProps,
} from "./blocks/auth-sign-in/sign-in-code-form";
export {
  SignInEmailForm,
  type SignInEmailFormCopy,
  type SignInEmailFormProps,
} from "./blocks/auth-sign-in/sign-in-email-form";
export {
  parseTotpUri,
  type TotpEnrollment,
} from "./blocks/auth-two-factor/totp-uri";
// shared-ui/auth-two-factor
export {
  TwoFactorEnrollment,
  type TwoFactorEnrollmentCopy,
  type TwoFactorEnrollmentProps,
} from "./blocks/auth-two-factor/two-factor-enrollment";
export {
  TwoFactorVerifyForm,
  type TwoFactorVerifyFormCopy,
  type TwoFactorVerifyFormProps,
} from "./blocks/auth-two-factor/two-factor-verify-form";
// shared cross-capability types
export type { AsyncAction, AsyncState } from "./blocks/shared/async";
// shared-ui/store-cart
export {
  CartDrawer,
  CartDrawerBody,
  type CartDrawerBodyProps,
  CartDrawerFooter,
  type CartDrawerFooterProps,
  CartDrawerHeader,
  type CartDrawerHeaderProps,
  type CartDrawerProps,
  CartItem,
  type CartItemProps,
  CartItemSlot,
  type CartItemSlotProps,
} from "./blocks/store-cart/cart-drawer";
export type {
  CartDrawerCopy,
  CartDrawerFooterCopy,
  CartDrawerHeaderCopy,
  CartItemCopy,
  CartItemStatus,
  CartItemSummary,
  PromoState,
} from "./blocks/store-cart/types";
// shared-ui/store-home
export {
  StoreCollectionGrid,
  type StoreCollectionGridProps,
} from "./blocks/store-home/store-collection-grid";
export {
  StoreCollectionTile,
  type StoreCollectionTileProps,
} from "./blocks/store-home/store-collection-tile";
export {
  StoreHomeHero,
  type StoreHomeHeroCopy,
  type StoreHomeHeroProps,
} from "./blocks/store-home/store-home-hero";
export {
  StoreSectionHeader,
  type StoreSectionHeaderCopy,
  type StoreSectionHeaderProps,
} from "./blocks/store-home/store-section-header";
export type { StoreCollectionSummary } from "./blocks/store-home/types";
// shared-ui/store-product-listing
export {
  FilterPanel,
  type FilterPanelCopy,
  type FilterPanelProps,
} from "./blocks/store-product-listing/filter-panel";
export {
  ProductBrowse,
  type ProductBrowseCopy,
  type ProductBrowseProps,
} from "./blocks/store-product-listing/product-browse";
export {
  ProductCard,
  type ProductCardCopy,
  type ProductCardProps,
} from "./blocks/store-product-listing/product-card";
export {
  ProductCardImage,
  type ProductCardImageCopy,
  type ProductCardImageProps,
} from "./blocks/store-product-listing/product-card-image";
export {
  ProductFilter,
  type ProductFilterCopy,
  type ProductFilterProps,
} from "./blocks/store-product-listing/product-filter";
export {
  ProductList,
  type ProductListCopy,
  type ProductListProps,
} from "./blocks/store-product-listing/product-list";
export {
  ProductListHeader,
  type ProductListHeaderCopy,
  type ProductListHeaderProps,
} from "./blocks/store-product-listing/product-list-header";
export type {
  AppliedFilter,
  FilterGroup,
  FilterOption,
  FilterSelection,
  ProductSummary,
  SortOption,
  UtilityLink,
} from "./blocks/store-product-listing/types";
// shared-ui/store-profile
export {
  ProfileCard,
  type ProfileCardCopy,
  type ProfileCardProps,
} from "./blocks/store-profile/profile-card";
export {
  ProfileDetails,
  type ProfileDetailsCopy,
  type ProfileDetailsProps,
} from "./blocks/store-profile/profile-details";
export {
  ProfileForm,
  type ProfileFormCopy,
  type ProfileFormProps,
} from "./blocks/store-profile/profile-form";
export type { ProfileFormValues } from "./blocks/store-profile/types";
