/* Public entry: re-exports exactly the compound-component exports the
 * capability specs name. Populated as blocks land under src/blocks/. */

// shared-ui/auth-sign-in
export {
  SignInCard,
  type SignInCardAction,
  type SignInCardProps,
} from "./blocks/auth-sign-in/sign-in-card";
export {
  SignInCodeForm,
  type SignInCodeFormProps,
} from "./blocks/auth-sign-in/sign-in-code-form";
export {
  SignInEmailForm,
  type SignInEmailFormProps,
} from "./blocks/auth-sign-in/sign-in-email-form";
// shared cross-capability types
export type { AsyncAction, AsyncState } from "./blocks/shared/async";

// shared-ui/store-product-listing
export {
  ProductFilterPanel,
  type ProductFilterPanelProps,
} from "./blocks/store-product-listing/product-filter-panel";
export {
  ProductGrid,
  type ProductGridProps,
} from "./blocks/store-product-listing/product-grid";
export {
  ProductListing,
  type ProductListingProps,
} from "./blocks/store-product-listing/product-listing";
export {
  ProductListingToolbar,
  type ProductListingToolbarProps,
} from "./blocks/store-product-listing/product-listing-toolbar";
export type {
  FilterGroup,
  FilterOption,
  FilterSelection,
  ProductSummary,
  SortOption,
} from "./blocks/store-product-listing/types";

// shared-ui/store-profile
export {
  ProfileCard,
  type ProfileCardProps,
} from "./blocks/store-profile/profile-card";
export {
  ProfileDetails,
  type ProfileDetailsProps,
} from "./blocks/store-profile/profile-details";
export {
  ProfileForm,
  type ProfileFormProps,
} from "./blocks/store-profile/profile-form";
export type { ProfileFormValues } from "./blocks/store-profile/types";
