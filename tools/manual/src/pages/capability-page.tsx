import { Link, useParams } from "react-router";
import { productTitle } from "../api/derive";
import { pagePath } from "../api/paths";
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
      path={pagePath(index.manualDir, "products", product, `${capability}.md`)}
    />
  );
}
