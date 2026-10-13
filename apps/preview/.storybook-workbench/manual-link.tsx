import {
  DocsContainer,
  type DocsContainerProps,
} from "@storybook/addon-docs/blocks";

const MANUAL = "https://spec.grade10-stg.com/p";

const slug = (words: string) =>
  words
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The manual page a `<Domain>/<Feature>/…` title names; none for Start Here
 * and the design system, which the manual does not page by feature. */
export function manualPage(title: string | undefined) {
  const [domain, feature] = title?.split("/") ?? [];
  if (!domain || !feature || domain === "Design System") return null;
  const app = domain === "Auth" ? "shared" : "grade10-site";
  return {
    label: `${domain} › ${feature}`,
    href: `${MANUAL}/${app}/${slug(domain)}/${slug(feature)}`,
  };
}

function titleOf(context: DocsContainerProps["context"]) {
  try {
    return context.resolveOf("meta", ["meta"]).preparedMeta.title;
  } catch {
    return undefined;
  }
}

/** Every docs page opens on the manual page its feature is written on. */
export function ManualDocsContainer({
  children,
  ...props
}: React.PropsWithChildren<DocsContainerProps>) {
  const page = manualPage(titleOf(props.context));
  return (
    <DocsContainer {...props}>
      {page ? (
        <p style={{ fontSize: 13, margin: "0 0 16px" }}>
          Manual:{" "}
          <a href={page.href} rel="noreferrer" target="_blank">
            {page.label}
          </a>
        </p>
      ) : null}
      {children}
    </DocsContainer>
  );
}
