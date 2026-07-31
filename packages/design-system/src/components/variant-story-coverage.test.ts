import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { describe, expect, it } from "vitest";

// Every cva option is a variant a consumer can select, so every cva option
// needs a story. Nothing enforced that before this file: the suite passed with
// a variant no story ever rendered, and it would have passed with a variant no
// story *could* render.
//
// The option list is read from the cva rather than restated here. cva 0.7.1
// returns a bare closure and keeps its config in scope, so the options are
// unreachable at runtime and this reads them off the AST instead.

const componentsDir = path.dirname(fileURLToPath(import.meta.url));

type Axis = { options: string[]; defaultOption?: string };
type Cva = { name: string; axes: Map<string, Axis> };

function propertyName(node: ts.ObjectLiteralElementLike): string | undefined {
  const name = node.name;
  if (name && (ts.isIdentifier(name) || ts.isStringLiteral(name))) {
    return name.text;
  }
  return undefined;
}

function objectProperty(
  object: ts.ObjectLiteralExpression,
  key: string,
): ts.ObjectLiteralExpression | undefined {
  for (const property of object.properties) {
    if (
      ts.isPropertyAssignment(property) &&
      propertyName(property) === key &&
      ts.isObjectLiteralExpression(property.initializer)
    ) {
      return property.initializer;
    }
  }
  return undefined;
}

/** Reads `cva(base, { variants, defaultVariants })` calls out of a component. */
function readCvas(file: string): Cva[] {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const found: Cva[] = [];

  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "cva" &&
      node.arguments.length > 1 &&
      ts.isObjectLiteralExpression(node.arguments[1])
    ) {
      const config = node.arguments[1];
      const variants = objectProperty(config, "variants");
      const defaults = objectProperty(config, "defaultVariants");

      if (variants) {
        const axes = new Map<string, Axis>();

        for (const axis of variants.properties) {
          const axisName = propertyName(axis);
          if (
            !axisName ||
            !ts.isPropertyAssignment(axis) ||
            !ts.isObjectLiteralExpression(axis.initializer)
          ) {
            continue;
          }
          const options = axis.initializer.properties
            .map(propertyName)
            .filter((option): option is string => option !== undefined);
          axes.set(axisName, { options });
        }

        for (const property of defaults?.properties ?? []) {
          const axisName = propertyName(property);
          const axis = axisName && axes.get(axisName);
          if (
            axis &&
            ts.isPropertyAssignment(property) &&
            ts.isStringLiteral(property.initializer)
          ) {
            axis.defaultOption = property.initializer.text;
          }
        }

        // `const buttonVariants = cva(...)` — used only to name the failure.
        const declaration = ts.findAncestor(node, ts.isVariableDeclaration);
        const name =
          declaration && ts.isIdentifier(declaration.name)
            ? declaration.name.text
            : "cva";

        if (axes.size > 0) {
          found.push({ name, axes });
        }
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return found;
}

function componentFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return componentFiles(entryPath);
    if (!entry.name.endsWith(".tsx")) return [];
    if (entry.name.endsWith(".stories.tsx")) return [];
    return [entryPath];
  });
}

/**
 * Matches both authoring styles in this package: `variant: "line"` in a story's
 * `args`, and `variant="line"` in a `render` function. Anchoring on the axis
 * name keeps a bare option string — an `argTypes` `options` array, a class name
 * — from counting as coverage.
 */
function exercises(
  storiesSource: string,
  axis: string,
  option: string,
): boolean {
  const escaped = option.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${axis}\\s*[:=]\\s*["']${escaped}["']`).test(
    storiesSource,
  );
}

const componentsWithVariants = componentFiles(componentsDir).flatMap((file) => {
  const cvas = readCvas(file);
  return cvas.length > 0
    ? [{ label: path.relative(componentsDir, file), file, cvas }]
    : [];
});

describe("variant story coverage", () => {
  it("finds the components that declare variants", () => {
    // A parser that silently stops matching would make every assertion below
    // vacuous, so assert the discovery itself.
    expect(componentsWithVariants.length).toBeGreaterThan(0);
  });

  describe.each(componentsWithVariants)(
    "$label",
    ({ label, file, cvas }: { label: string; file: string; cvas: Cva[] }) => {
      const storiesFile = file.replace(/\.tsx$/, ".stories.tsx");

      it("has a stories file", () => {
        expect(
          readdirSync(path.dirname(storiesFile)).includes(
            path.basename(storiesFile),
          ),
          `${label} declares variants but has no stories file`,
        ).toBe(true);
      });

      for (const cva of cvas) {
        for (const [axisName, axis] of cva.axes) {
          for (const option of axis.options) {
            it(`covers ${cva.name} ${axisName}="${option}"`, () => {
              // The default option renders whenever a story omits the prop, so
              // it needs no story of its own.
              if (option === axis.defaultOption) return;

              const storiesSource = readFileSync(storiesFile, "utf8");
              expect(
                exercises(storiesSource, axisName, option),
                `No story in ${path.basename(storiesFile)} renders ${cva.name} with ${axisName}="${option}"`,
              ).toBe(true);
            });
          }
        }
      }
    },
  );
});
