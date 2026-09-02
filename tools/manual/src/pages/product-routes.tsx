import { useParams } from "react-router";
import { splitProductRoute } from "../api/derive";
import { useManualIndex } from "../api/use-manual-index";
import { CapabilityPage } from "./capability-page";
import { NotFoundPage } from "./not-found";
import { ProductPage } from "./product-page";

/** Everything under `/p/`: a product id is one or two segments, so the store
 * decides where the product ends and its capability begins. */
export function ProductRoutes() {
  const { "*": splat = "" } = useParams();
  const index = useManualIndex();
  const split = splitProductRoute(index, splat.split("/").filter(Boolean));

  if (!split) return <NotFoundPage index={index} path={`/p/${splat}`} />;
  return split.capability === undefined ? (
    <ProductPage product={split.product} />
  ) : (
    <CapabilityPage capability={split.capability} product={split.product} />
  );
}
