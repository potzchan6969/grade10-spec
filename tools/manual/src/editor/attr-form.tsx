import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import { useManualIndex } from "../api/use-manual-index";
import type { SectionRule } from "../blocks/side-blocks";
import { AssetUpload } from "./asset-upload";
import { type Attrs, attrsOf, type BlockProblem } from "./draft";
import { SelectField, TextField } from "./fields";
import { suggestionsFor, suggestionsForAttr } from "./suggestions";

/** Every directive form is generated from the grammar's own descriptors, so a
 * block gains a field the day the grammar gains an attribute. */

type AttrFormProps = {
  type: string;
  attrs: Attrs;
  problems: BlockProblem[];
  onChange: (next: Attrs) => void;
  /** The rules of the heading the block sits under, which a phase block's
   * `rules` names. */
  rules?: SectionRule[];
};

export function AttrForm({
  type,
  attrs,
  problems,
  onChange,
  rules = [],
}: AttrFormProps) {
  const specs = attrsOf(type);
  const suggestions = suggestionsFor(useManualIndex());
  const general = problems.filter((problem) => problem.attr === undefined);

  const set = (name: string, value: string) =>
    onChange({ ...attrs, [name]: value });

  return (
    <div className="flex flex-col gap-3">
      {specs.length === 0 ? (
        <Text as="p" size="sm" tone="secondary">
          This block takes no attributes.
        </Text>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {specs.map((attr) => {
            const problem = problems.find(
              (found) => found.attr === attr.name,
            )?.message;
            const value = attrs[attr.name] ?? "";

            if (attr.oneOf) {
              return (
                <SelectField
                  allowEmpty={!attr.required}
                  key={attr.name}
                  label={attr.name}
                  onChange={(next) => set(attr.name, next)}
                  options={attr.oneOf}
                  problem={problem}
                  required={attr.required}
                  value={value}
                />
              );
            }

            return (
              <div className="flex flex-col gap-2" key={attr.name}>
                <TextField
                  label={attr.name}
                  numeric={attr.kind === "int"}
                  onChange={(next) => set(attr.name, next)}
                  problem={problem}
                  required={attr.required}
                  suggestions={suggestionsForAttr(suggestions, type, attr.name)}
                  value={value}
                />
                {type === "image" && attr.name === "src" ? (
                  <AssetUpload onUploaded={(src) => set("src", src)} />
                ) : null}
                {type === "phase" &&
                attr.name === "rules" &&
                rules.length > 0 ? (
                  <RulePicker
                    onChange={(next) => set("rules", next)}
                    rules={rules}
                    value={value}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {general.map((problem) => (
        <Text
          as="p"
          className="text-destructive"
          key={problem.message}
          size="xs"
        >
          {problem.message}
        </Text>
      ))}
    </div>
  );
}

/** The heading's own rules, each pressed in or out of `rules`, so an anchor
 * is never mistyped. */
function RulePicker({
  rules,
  value,
  onChange,
}: {
  rules: SectionRule[];
  value: string;
  onChange: (next: string) => void;
}) {
  const named = value.split(",").filter(Boolean);
  const toggle = (anchor: string) =>
    onChange(
      (named.includes(anchor)
        ? named.filter((one) => one !== anchor)
        : [...named, anchor]
      ).join(","),
    );
  return (
    <fieldset className="m-0 flex flex-wrap gap-1 border-0 p-0">
      <legend className="sr-only">Rules under this heading</legend>
      {rules.map((rule) => {
        const on = named.includes(rule.anchor);
        return (
          <button
            aria-pressed={on}
            className={cn(
              "cursor-pointer rounded-full border px-2 py-0.5 text-xs outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              on
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-secondary-foreground hover:text-foreground",
            )}
            key={rule.anchor}
            onClick={() => toggle(rule.anchor)}
            title={rule.anchor}
            type="button"
          >
            {rule.name}
          </button>
        );
      })}
    </fieldset>
  );
}
