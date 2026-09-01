import { Text } from "@grade10/design-system/components/display/text";
import { useManualIndex } from "../api/use-manual-index";
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
};

export function AttrForm({ type, attrs, problems, onChange }: AttrFormProps) {
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
