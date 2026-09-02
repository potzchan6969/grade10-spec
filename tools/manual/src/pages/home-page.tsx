import { Text } from "@grade10/design-system/components/display/text";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { X } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router";
import { byLastMoved, isProposal, taskTotals } from "../api/derive";
import { pagePath } from "../api/paths";
import { relativeTime } from "../api/time";
import { useManualIndex } from "../api/use-manual-index";
import { BlockScopeProvider } from "../blocks/block-scope";
import { BlockView } from "../blocks/block-view";
import { TaskProgress } from "../blocks/change-views";
import { InlineMarkdown } from "../blocks/inline-markdown";
import { browserKeyStore, STORAGE } from "../editor/config";
import { PageActions } from "../editor/edit-actions";
import { useEditMode } from "../editor/edit-mode";
import { PageEditor } from "../editor/page-editor";
import { useEditorSession } from "../editor/session";
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
      <PageActions path={homePath} />
      <PageHeading
        summary={home?.ast?.frontmatter.summary}
        title={home?.ast?.frontmatter.title ?? "Grade10 Manual"}
      />

      <WelcomeCard />

      {home?.ast ? (
        <BlockScopeProvider value={{ index, pagePath: homePath }}>
          {home.ast.blocks.map((block, position) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
            <BlockView block={block} key={`${block.type}-${position}`} />
          ))}
        </BlockScopeProvider>
      ) : null}

      {index.groups.map((group) => (
        <section className="mt-10" key={group.title}>
          <h2 className="mb-3 font-heading font-bold text-lg">{group.title}</h2>
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
          <h2 className="mb-3 font-heading font-bold text-lg">
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

      <WhatsMoving />
    </>
  );
}

/** One door to the tutorial, on a first visit only. It is chrome, not page
 * content: dismissing it or following it marks it answered for good. The
 * hosted build tells the truth about itself — its propose buttons are gone,
 * so promising them to a first-time visitor would be the site's first lie. */
function WelcomeCard() {
  const { status, store } = useEditorSession();
  const [answered, setAnswered] = useState(
    () => browserKeyStore.get(STORAGE.welcome) !== null,
  );
  if (answered) return null;

  const answer = () => {
    browserKeyStore.set(STORAGE.welcome, new Date().toISOString());
    setAnswered(true);
  };

  const readOnly = status === "ready" && store === null;

  return (
    <div className="mb-8 flex items-start gap-3 rounded-(--radius-xl) border border-border bg-card p-4">
      <div className="min-w-0 flex-1">
        <Text as="p" size="sm" weight="bold">
          First time here?
        </Text>
        <Text as="p" className="mt-1" size="sm" tone="secondary">
          {readOnly
            ? "Every page here is a view over the spec store. This hosted build is read-only; proposing a change from the page you are reading needs the locally-run manual."
            : "Every page here is a view over the spec store, and anyone can propose a change from the page they are reading."}
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

/** What is moving is what someone is delivering; a proposal has moved nowhere
 * yet, and it lives on the planning board's own lane. */
function WhatsMoving() {
  const index = useManualIndex();
  const moving = index.snapshot.changes
    .filter((change) => !isProposal(change))
    .sort(byLastMoved)
    .slice(0, 4);

  if (moving.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="font-heading font-bold text-lg">What's moving</h2>
        <Link
          className="text-secondary-foreground text-sm hover:underline"
          to="/planning"
        >
          All planning
        </Link>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {moving.map((change) => {
          const { done, total } = taskTotals(change);
          return (
            <li key={change.id}>
              <Link
                className="flex h-full flex-col gap-2 rounded-(--radius-xl) border border-border bg-card p-3.5 transition-colors hover:border-border-strong hover:bg-muted"
                to={`/planning/${change.id}`}
              >
                <div className="flex items-baseline gap-2">
                  <Text
                    as="span"
                    className="min-w-0 flex-1"
                    size="sm"
                    weight="medium"
                  >
                    <InlineMarkdown text={change.title} />
                  </Text>
                  <Text as="span" size="xs" tone="secondary">
                    {change.lastMoved
                      ? relativeTime(change.lastMoved)
                      : "unmoved"}
                  </Text>
                </div>
                <TaskProgress done={done} total={total} />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
