/* Public entry: re-exports exactly the compound-component exports the
 * capability specs name. Populated as components land under src/components/. */

// shared-ui/auth-sign-in
export {
  SignInCard,
  type SignInCardAction,
  type SignInCardProps,
} from "./components/auth-sign-in/sign-in-card";
export {
  SignInCodeForm,
  type SignInCodeFormProps,
} from "./components/auth-sign-in/sign-in-code-form";
export {
  SignInEmailForm,
  type SignInEmailFormProps,
} from "./components/auth-sign-in/sign-in-email-form";
// shared cross-capability types
export type { AsyncAction, AsyncState } from "./components/shared/async";

// shared-ui/store-product-listing
export {
  ProductFilterPanel,
  type ProductFilterPanelProps,
} from "./components/store-product-listing/product-filter-panel";
export {
  ProductGrid,
  type ProductGridProps,
} from "./components/store-product-listing/product-grid";
export {
  ProductListing,
  type ProductListingProps,
} from "./components/store-product-listing/product-listing";
export {
  ProductListingToolbar,
  type ProductListingToolbarProps,
} from "./components/store-product-listing/product-listing-toolbar";
export type {
  FilterGroup,
  FilterOption,
  FilterSelection,
  ProductSummary,
  SortOption,
} from "./components/store-product-listing/types";

// shared-ui/store-profile
export {
  ProfileCard,
  type ProfileCardProps,
} from "./components/store-profile/profile-card";
export {
  ProfileDetails,
  type ProfileDetailsProps,
} from "./components/store-profile/profile-details";
export {
  ProfileForm,
  type ProfileFormProps,
} from "./components/store-profile/profile-form";
export type { ProfileFormValues } from "./components/store-profile/types";
