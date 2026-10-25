import { type ManualIndex, productTitle } from "../api/derive";
import { pagePath } from "../api/paths";
import { useManualIndex } from "../api/use-manual-index";
import { ChildCards } from "../blocks/children-block";
import { PageHeading } from "./page-heading";
import { PageView } from "./page-view";
import { useDocumentTitle } from "./use-document-title";

export function ProductPage({ product }: { product: string }) {
  const index = useManualIndex();
  const dir = pagePath(index.manualDir, "products", product);
  const page = index.pageByPath.get(`${dir}/index.md`);

  if (!page) return <ProductWithoutLanding id={product} index={index} />;

  const authored = page.ast?.blocks.some((block) => block.type === "children");

  return (
    <PageView eyebrow="Product" index={index} path={`${dir}/index.md`}>
      {authored ? null : <ChildCards dir={dir} index={index} />}
    </PageView>
  );
}

/** A product manual.yaml lists before anyone has written its landing page. */
function ProductWithoutLanding({
  index,
  id,
}: {
  index: ManualIndex;
  id: string;
}) {
  const title = productTitle(index, id);
  useDocumentTitle(title);

  return (
    <>
      <PageHeading
        eyebrow="Product"
        summary="No landing page has been written for this product yet — what exists is below."
        title={title}
      />
      <ChildCards
        dir={pagePath(index.manualDir, "products", id)}
        index={index}
      />
    </>
  );
}
