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
export type {
  UserDirectoryRow,
  UserRoleOption,
  UserSessionRow,
} from "./blocks/auth-user-directory/types";
// shared-ui/auth-user-directory
export {
  UserModerationDialog,
  type UserModerationDialogCopy,
  type UserModerationDialogProps,
  type UserModerationTone,
} from "./blocks/auth-user-directory/user-moderation-dialog";
export {
  UserRolesDialog,
  type UserRolesDialogCopy,
  type UserRolesDialogProps,
} from "./blocks/auth-user-directory/user-roles-dialog";
export {
  UserSessionsDialog,
  type UserSessionsDialogCopy,
  type UserSessionsDialogProps,
} from "./blocks/auth-user-directory/user-sessions-dialog";
export {
  UserTable,
  type UserTableCopy,
  type UserTableProps,
} from "./blocks/auth-user-directory/user-table";
// shared-ui/loyalty-membership
export {
  ActivityList,
  type ActivityListCopy,
  type ActivityListProps,
} from "./blocks/loyalty-membership/activity-list";
export {
  CouponList,
  type CouponListCopy,
  type CouponListProps,
} from "./blocks/loyalty-membership/coupon-list";
export {
  MemberCard,
  type MemberCardCopy,
  type MemberCardProps,
  type MemberCardState,
  type MemberCardUse,
} from "./blocks/loyalty-membership/member-card";
export {
  MembershipSummary,
  type MembershipSummaryCopy,
  type MembershipSummaryProps,
} from "./blocks/loyalty-membership/membership-summary";
export {
  PendingCollectionList,
  type PendingCollectionListCopy,
  type PendingCollectionListProps,
} from "./blocks/loyalty-membership/pending-collection-list";
export {
  RewardMenu,
  type RewardMenuCopy,
  type RewardMenuProps,
} from "./blocks/loyalty-membership/reward-menu";
export type {
  ActivityEntry,
  CouponItem,
  CouponStatus,
  PendingCollectionItem,
  RewardMenuItem,
} from "./blocks/loyalty-membership/types";
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
// shared-ui/store-order-history
export {
  OrderHistory,
  type OrderHistoryCopy,
  type OrderHistoryProps,
} from "./blocks/store-order-history/order-history";
export {
  OrderHistoryCard,
  type OrderHistoryCardProps,
} from "./blocks/store-order-history/order-history-card";
export {
  OrderHistoryCardHeader,
  type OrderHistoryCardHeaderCopy,
  type OrderHistoryCardHeaderProps,
} from "./blocks/store-order-history/order-history-card-header";
export {
  OrderHistoryLineItem,
  type OrderHistoryLineItemProps,
} from "./blocks/store-order-history/order-history-line-item";
export {
  OrderHistoryStatus,
  type OrderHistoryStatusProps,
} from "./blocks/store-order-history/order-history-status";
export type {
  OrderHistoryFulfillmentStatus,
  OrderHistoryLineSummary,
  OrderHistoryOrderSummary,
} from "./blocks/store-order-history/types";
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
