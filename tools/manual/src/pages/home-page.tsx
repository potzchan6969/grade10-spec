import { Text } from "@grade10/design-system/components/display/text";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { X } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router";
import { pagePath } from "../api/paths";
import { useManualIndex } from "../api/use-manual-index";
import { BlockList } from "../blocks/block-list";
import { BlockScopeProvider } from "../blocks/block-scope";
import { browserKeyStore, STORAGE } from "../editor/config";
import { useEditMode } from "../editor/edit-mode";
import { PageEditor } from "../editor/page-editor";
import { PageHeading } from "./page-heading";
import { ProductCard } from "./product-card";
import { useDocumentTitle } from "./use-document-title";

export function HomePage() {
  const index = useManualIndex();
  const homePath = pagePath(index.manualDir, "index.md");
  const home = index.pageByPath.get(homePath);
  useDocumentTitle(home?.ast?.frontmatter.title);
  const { editing } = useEditMode();

  if (editing && home) return <PageEditor path={homePath} />;

  return (
    <>
      <PageHeading
        summary={home?.ast?.frontmatter.summary}
        title={home?.ast?.frontmatter.title ?? "Grade10 Manual"}
      />

      <WelcomeCard />

      {home?.ast ? (
        <BlockScopeProvider value={{ index, pagePath: homePath }}>
          <BlockList blocks={home.ast.blocks} />
        </BlockScopeProvider>
      ) : null}

      {index.groups.map((group) => (
        <section className="mt-10" key={group.title}>
          <h2 className="mb-3 font-bold font-heading text-manual-h2">
            {group.title}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {group.products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {index.topics.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-3 font-bold font-heading text-manual-h2">
            Cross-cutting topics
          </h2>
          <div className="space-y-4">
            {index.topicGroups
              .filter((group) => group.topics.length > 0)
              .map((group) => (
                <div key={group.title}>
                  <Text
                    as="p"
                    className="mb-1.5 uppercase tracking-wide"
                    size="xs"
                    tone="secondary"
                    weight="medium"
                  >
                    {group.title}
                  </Text>
                  <ul className="flex flex-wrap gap-2">
                    {group.topics.map((topic) => (
                      <li key={topic.id}>
                        <Link
                          className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-border-strong hover:bg-muted"
                          to={topic.to}
                        >
                          {topic.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

/** One door to the tutorial, on a first visit only. It is chrome, not page
 * content: dismissing it or following it marks it answered for good. */
function WelcomeCard() {
  const [answered, setAnswered] = useState(
    () => browserKeyStore.get(STORAGE.welcome) !== null,
  );
  if (answered) return null;

  const answer = () => {
    browserKeyStore.set(STORAGE.welcome, new Date().toISOString());
    setAnswered(true);
  };

  return (
    <div className="mb-8 flex items-start gap-3 rounded-(--radius-xl) border border-border bg-card p-4">
      <div className="min-w-0 flex-1">
        <Text as="p" size="sm" weight="bold">
          First time here?
        </Text>
        <Text as="p" className="mt-1" size="sm" tone="secondary">
          Every page here is a view over the spec store.
        </Text>
        <Link
          className="mt-2 inline-flex text-sm underline underline-offset-2 hover:text-foreground"
          onClick={answer}
          to="/guides/how-this-manual-works"
        >
          How this manual works
        </Link>
      </div>
      <IconButton
        aria-label="Dismiss"
        onClick={answer}
        size="sm"
        variant="ghost"
      >
        <X aria-hidden />
      </IconButton>
    </div>
  );
}
