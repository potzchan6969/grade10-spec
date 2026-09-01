import { Link, useParams } from "react-router";
import { productTitle } from "../api/derive";
import { MANUAL_ROOT } from "../api/paths";
import { useManualIndex } from "../api/use-manual-index";
import { PageView } from "./page-view";

export function CapabilityPage() {
  const { product = "", capability = "" } = useParams();
  const index = useManualIndex();

  return (
    <PageView
      eyebrow={
        <Link className="hover:underline" to={`/p/${product}`}>
          {productTitle(index, product)}
        </Link>
      }
      index={index}
      path={`${MANUAL_ROOT}/products/${product}/${capability}.md`}
    />
  );
}
