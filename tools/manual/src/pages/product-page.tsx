import { Text } from "@grade10/design-system/components/display/text";
import {
  byLastMoved,
  changesForOwner,
  type ManualIndex,
  productTitle,
} from "../api/derive";
import { pagePath } from "../api/paths";
import { useManualIndex } from "../api/use-manual-index";
import { ChangeChip } from "../blocks/change-views";
import { ChildCards } from "../blocks/children-block";
import { PageHeading } from "./page-heading";
import { PageView } from "./page-view";
import { ProductFollowOns } from "./product-follow-ons";
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
      <ProductChanges id={product} index={index} />
      <ProductFollowOns id={product} index={index} />
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
      <ProductChanges id={id} index={index} />
      <ProductFollowOns id={id} index={index} />
    </>
  );
}

function ProductChanges({ index, id }: { index: ManualIndex; id: string }) {
  const changes = [...changesForOwner(index, id)].sort(byLastMoved);
  if (changes.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-1 font-heading font-bold text-lg" id="in-flight">
        In flight
      </h2>
      <Text as="p" className="mb-3" size="sm" tone="secondary">
        Changes whose deltas touch a {id} spec.
      </Text>
      <div className="grid gap-3 sm:grid-cols-2">
        {changes.map((change) => (
          <ChangeChip change={change} key={change.id} />
        ))}
      </div>
    </section>
  );
}
