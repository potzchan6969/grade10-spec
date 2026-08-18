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
  CollectionMenu,
  type CollectionMenuProps,
} from "./blocks/store-product-listing/collection-menu";
export {
  CollectionMenuItem,
  type CollectionMenuItemProps,
} from "./blocks/store-product-listing/collection-menu-item";
export {
  FilterPanel,
  type FilterPanelProps,
} from "./blocks/store-product-listing/filter-panel";
export {
  ProductBrowse,
  type ProductBrowseProps,
} from "./blocks/store-product-listing/product-browse";
export {
  ProductCard,
  type ProductCardProps,
} from "./blocks/store-product-listing/product-card";
export {
  ProductList,
  type ProductListProps,
} from "./blocks/store-product-listing/product-list";
export {
  ProductListHeader,
  type ProductListHeaderProps,
} from "./blocks/store-product-listing/product-list-header";
export type {
  CollectionOption,
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
