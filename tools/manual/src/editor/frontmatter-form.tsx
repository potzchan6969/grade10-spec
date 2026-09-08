import { useManualIndex } from "../api/use-manual-index";
import { PAGE_ICONS } from "../content/icons";
import type { BlockProblem, DraftFrontmatter } from "./draft";
import { TextField } from "./fields";
import { suggestionsFor } from "./suggestions";

/** Every frontmatter field, in the order the grammar prints them. */

export function FrontmatterForm({
  frontmatter,
  problems,
  onChange,
}: {
  frontmatter: DraftFrontmatter;
  problems: BlockProblem[];
  onChange: (next: DraftFrontmatter) => void;
}) {
  const { specIds } = suggestionsFor(useManualIndex());
  const problemOf = (attr: string) =>
    problems.find((problem) => problem.attr === attr)?.message;

  return (
    <section className="mb-6 rounded-(--radius-2xl) border border-border bg-card px-4 py-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label="title"
          onChange={(title) => onChange({ ...frontmatter, title })}
          problem={problemOf("title")}
          required
          value={frontmatter.title}
        />
        <TextField
          hint="The spec this page documents"
          label="spec"
          onChange={(spec) => onChange({ ...frontmatter, spec })}
          problem={problemOf("spec")}
          suggestions={specIds}
          value={frontmatter.spec}
        />
        <div className="sm:col-span-2">
          <TextField
            hint="One sentence, shown under the title and in nav cards"
            label="summary"
            onChange={(summary) => onChange({ ...frontmatter, summary })}
            problem={problemOf("summary")}
            value={frontmatter.summary}
          />
        </div>
        <TextField
          hint="Glyph beside the title in the rail and on cards"
          label="icon"
          onChange={(icon) => onChange({ ...frontmatter, icon })}
          problem={problemOf("icon")}
          suggestions={[...PAGE_ICONS]}
          value={frontmatter.icon}
        />
        <TextField
          hint="`operator` files the page under Admin; empty serves the product's own users"
          label="audience"
          onChange={(audience) => onChange({ ...frontmatter, audience })}
          problem={problemOf("audience")}
          suggestions={["operator"]}
          value={frontmatter.audience}
        />
        <TextField
          hint="Nav sort; leave empty to sort by title"
          label="order"
          numeric
          onChange={(order) => onChange({ ...frontmatter, order })}
          problem={problemOf("order")}
          value={frontmatter.order}
        />
      </div>
    </section>
  );
}
