/* Public entry: re-exports exactly the compound-component exports the
 * capability specs name. Populated as blocks land under src/blocks/. */

// shared/ui/appointment-booking
export {
  BookingConfirmation,
  type BookingConfirmationCopy,
  type BookingConfirmationProps,
} from "./blocks/appointment-booking/booking-confirmation";
export {
  BookingDetailsForm,
  type BookingDetailsFormCopy,
  type BookingDetailsFormProps,
} from "./blocks/appointment-booking/booking-details-form";
export {
  BookingList,
  type BookingListCopy,
  type BookingListProps,
} from "./blocks/appointment-booking/booking-list";
export {
  BookingLocationPicker,
  type BookingLocationPickerCopy,
  type BookingLocationPickerProps,
} from "./blocks/appointment-booking/booking-location-picker";
export {
  BookingManageCard,
  type BookingManageCardCopy,
  type BookingManageCardProps,
} from "./blocks/appointment-booking/booking-manage-card";
export {
  BookingServicePicker,
  type BookingServicePickerCopy,
  type BookingServicePickerProps,
} from "./blocks/appointment-booking/booking-service-picker";
export {
  BookingSlotPicker,
  type BookingSlotPickerCopy,
  type BookingSlotPickerProps,
} from "./blocks/appointment-booking/booking-slot-picker";
export {
  BookingSteps,
  type BookingStepsCopy,
  type BookingStepsProps,
} from "./blocks/appointment-booking/booking-steps";
export {
  BookingSummary,
  type BookingSummaryCopy,
  type BookingSummaryProps,
} from "./blocks/appointment-booking/booking-summary";
export type {
  BookingAnswers,
  BookingDay,
  BookingDetailsValues,
  BookingLocation,
  BookingQuestion,
  BookingRecord,
  BookingRecordState,
  BookingService,
  BookingSlot,
  BookingStep,
} from "./blocks/appointment-booking/types";
export {
  ListingAgeVerificationDialog,
  type ListingAgeVerificationDialogCopy,
  type ListingAgeVerificationDialogProps,
  ListingAgeVerificationFields,
  type ListingAgeVerificationFieldsCopy,
  type ListingAgeVerificationFieldsProps,
} from "./blocks/auction-listing/listing-age-verification-dialog";
export {
  ListingAuctionBidCard,
  type ListingAuctionBidCardCopy,
  type ListingAuctionBidCardProps,
} from "./blocks/auction-listing/listing-auction-bid-card";
export type { ListingAuctionBidFieldsCopy } from "./blocks/auction-listing/listing-auction-bid-fields";
export {
  ListingAuctionCardSidebar,
  type ListingAuctionCardSidebarCopy,
  type ListingAuctionCardSidebarProps,
} from "./blocks/auction-listing/listing-auction-card-sidebar";
export {
  EnrollmentSetupSheet,
  type EnrollmentSetupSheetCopy,
  type EnrollmentSetupSheetProps,
  InlineOverlayPreview,
  type OverlayPresentation,
  PaymentMethodEmptyState,
  type PaymentMethodEmptyStateCopy,
  type PaymentMethodEmptyStateProps,
  PaymentMethodRow,
  type PaymentMethodRowCopy,
  type PaymentMethodRowProps,
} from "./blocks/auction-listing/listing-bid-enrollment";
export { ListingBidHistoryList } from "./blocks/auction-listing/listing-bid-history-list";
export {
  CUSTOM_MAXIMUM_MAJOR_CEILING,
  formatMinimumMaximumCaption,
  isMaximumBelowFloor,
  minNextBidMinor,
  moneyDraftFromMinor,
  parseExactMoneyDraftToMinor,
  resolveMaximumFloor,
  sanitizeCustomMaximumDraft,
  sanitizeMoneyDraft,
  validateCommittedMaximumMinor,
  wholeMajorDraftFromMinor,
} from "./blocks/auction-listing/listing-bid-money";
// shared/ui/auction-listing
export {
  ListingDetails,
  type ListingDetailsCopy,
  type ListingDetailsFact,
  type ListingDetailsProps,
  type ListingDetailsSection,
} from "./blocks/auction-listing/listing-details";
export {
  DEFAULT_LISTING_EXTENSION_POLICY,
  extendRecordedCloseAt,
  formatAutoExtendedTooltip,
  formatExtendedBiddingRules,
  formatExtensionDurationValue,
  type ListingExtensionPolicy,
  SHORT_WINDOW_EXTENSION_POLICY,
  shouldExtendCloseAt,
} from "./blocks/auction-listing/listing-extension-policy";
export {
  ListingGallery,
  type ListingGalleryCopy,
  type ListingGalleryImage,
  type ListingGalleryProps,
} from "./blocks/auction-listing/listing-gallery";
export { ListingLotGallery } from "./blocks/auction-listing/listing-lot-gallery";
export {
  ListingLotHeader,
  type ListingLotHeaderCopy,
  type ListingLotHeaderProps,
} from "./blocks/auction-listing/listing-lot-header";
export {
  LISTING_LOT_GALLERY_CLASS,
  LISTING_LOT_GRID_CLASS,
  LISTING_LOT_SIDEBAR_CLASS,
} from "./blocks/auction-listing/listing-lot-layout";
export {
  type ListingLotMarketComps,
  ListingLotMeta,
  type ListingLotMetaCopy,
  type ListingLotMetaFact,
  type ListingLotMetaProps,
} from "./blocks/auction-listing/listing-lot-meta";
export {
  ListingUserBidHistory,
  type ListingUserBidHistoryCopy,
  type ListingUserBidHistoryProps,
} from "./blocks/auction-listing/listing-user-bid-history";
export type {
  BidEnrollment,
  ListingAuctionBidView,
  ListingAuctionStanding,
  ListingBidHistoryRow,
  ListingLotGalleryImage,
  ListingLotMetaBadge,
  ListingUserBidHistoryRow,
  ListingUserMaximumHistoryRow,
} from "./blocks/auction-listing/types";
// shared/ui/auction-record
export { AuctionRecord } from "./blocks/auction-record/auction-record";
export { AuctionRecordEmpty } from "./blocks/auction-record/auction-record-empty";
export { AuctionRecordRow } from "./blocks/auction-record/auction-record-row";
export { AuctionRecordTabs } from "./blocks/auction-record/auction-record-tabs";
export type {
  AuctionRecordCopy,
  AuctionRecordEmptyProps,
  AuctionRecordProps,
  AuctionRecordRowCopy,
  AuctionRecordRowProps,
  AuctionRecordRowState,
  AuctionRecordTabsProps,
  EmailAlertsCopy,
  EmailAlertsToastCopy,
  WatchButtonCopy,
  WatchButtonProps,
  WatchToastCopy,
} from "./blocks/auction-record/types";
export { WatchButton } from "./blocks/auction-record/watch-button";
// shared/ui/auth-sign-in
export {
  SignInCard,
  type SignInCardCopy,
  type SignInCardProps,
} from "./blocks/auth-sign-in/sign-in-card";
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
  RewardMenu,
  type RewardMenuCopy,
  type RewardMenuProps,
} from "./blocks/loyalty-membership/reward-menu";
export {
  ScanPlate,
  type ScanPlateProps,
} from "./blocks/loyalty-membership/scan-plate";
export type {
  ActivityEntry,
  CouponItem,
  CouponStatus,
  RewardMenuItem,
} from "./blocks/loyalty-membership/types";
export {
  WalletPassLinks,
  type WalletPassLinksCopy,
  type WalletPassLinksProps,
  type WalletPassOffer,
  type WalletPassState,
  type WalletPassWallet,
} from "./blocks/loyalty-membership/wallet-pass-links";
// shared cross-capability types
export type { AsyncAction, AsyncState } from "./blocks/shared/async";
// shared/ui/site-chrome
export {
  SiteHeader,
  type SiteHeaderCopy,
  type SiteHeaderProps,
  type SiteHeaderSession,
} from "./blocks/site-chrome/site-header";
// shared/ui/store-cart
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
  CartPromoSheet,
  type CartPromoSheetProps,
} from "./blocks/store-cart/cart-drawer";
export {
  PromoTicket,
  type PromoTicketProps,
} from "./blocks/store-cart/promo-ticket";
export type {
  CartDrawerCopy,
  CartDrawerFooterCopy,
  CartDrawerHeaderCopy,
  CartItemCopy,
  CartItemStatus,
  CartItemSummary,
  HeldPromoCode,
  PointsState,
  PromoNotice,
  PromoState,
} from "./blocks/store-cart/types";
// shared/ui/store-home
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
export { loyaltyPointsHeading } from "./blocks/store-order-detail/loyalty-points-heading";
// shared-ui/store-order-detail
export {
  OrderDetails,
  type OrderDetailsCopy,
  type OrderDetailsProps,
} from "./blocks/store-order-detail/order-details";
export {
  OrderDetailsDeliveryStatus,
  type OrderDetailsDeliveryStatusProps,
} from "./blocks/store-order-detail/order-details-delivery-status";
export {
  OrderDetailsHeader,
  type OrderDetailsHeaderProps,
} from "./blocks/store-order-detail/order-details-header";
export {
  OrderDetailsOrderItem,
  type OrderDetailsOrderItemProps,
} from "./blocks/store-order-detail/order-details-order-item";
export {
  OrderDetailsOrderTable,
  type OrderDetailsOrderTableProps,
} from "./blocks/store-order-detail/order-details-order-table";
export {
  OrderDetailsPaymentLogo,
  type OrderDetailsPaymentLogoProps,
} from "./blocks/store-order-detail/order-details-payment-logo";
export {
  OrderDetailsSidebar,
  type OrderDetailsSidebarProps,
} from "./blocks/store-order-detail/order-details-sidebar";
export { resolveDeliverySteps } from "./blocks/store-order-detail/resolve-delivery-steps";
export type {
  OrderDetailsAddress,
  OrderDetailsDelivery,
  OrderDetailsDeliveryStep,
  OrderDetailsFulfillmentStatus,
  OrderDetailsLineItem,
  OrderDetailsPayment,
  OrderDetailsPaymentBrand,
  OrderDetailsSummary,
} from "./blocks/store-order-detail/types";
// shared/ui/store-order-history
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
// shared/ui/store-product
export {
  StoreProductDescription,
  type StoreProductDescriptionProps,
} from "./blocks/store-product/store-product-description";
export {
  StoreProductGallery,
  type StoreProductGalleryProps,
} from "./blocks/store-product/store-product-gallery";
export {
  StoreProductHeader,
  type StoreProductHeaderProps,
} from "./blocks/store-product/store-product-header";
export {
  StoreProductMetadata,
  type StoreProductMetadataProps,
} from "./blocks/store-product/store-product-metadata";
export {
  StoreProductPurchasePanel,
  type StoreProductPurchasePanelProps,
} from "./blocks/store-product/store-product-purchase-panel";
export type {
  StoreProductImage,
  StoreProductSaleItem,
} from "./blocks/store-product/types";
// shared/ui/store-product-listing
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
  SearchSuggestion,
  SearchSuggestionGroup,
  SortOption,
  UtilityLink,
} from "./blocks/store-product-listing/types";
// shared/ui/store-profile
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
export {
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_NOW_MS,
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
} from "./lib/datetime-fixtures";
export {
  ACTIVITY_RELATIVE_MAX_MS,
  type ActivityTimeCopy,
  formatActivityAt,
  formatAuctionClosed,
  formatAuctionDeadline,
  formatAuctionMoment,
  formatAuctionOpens,
  formatClosedAt,
  formatCollectorDeadline,
  formatDay,
  formatDeadline,
  formatEvent,
  formatListingClosed,
  formatListingEnds,
  formatListingOpens,
  formatLocalDay,
  formatLocalMoment,
  formatLocalTime,
  formatMoment,
  formatRelativeAt,
  isPastActivityCap,
  JUST_NOW_MAX_MS,
  resolveActivityNow,
  resolveShippedLocale,
  type ShippedLocale,
} from "./lib/format-datetime";
export {
  currencyExponent,
  DEFAULT_LISTING_CURRENCY,
  formatMoney,
  formatMoneyNumeric,
  formatMoneyPrefix,
  fromMinorUnits,
  parseMoneyInputToMinor,
  toMinorUnits,
} from "./lib/format-money";
