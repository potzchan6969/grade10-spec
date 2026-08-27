/* DUMP: local Figma Variables -> the JSON scripts/tokens/figma/pull.mjs expects.
 *
 * Hand-written source, NOT generated — there is nothing in tokens.json to derive
 * a read from. Import via Figma → Plugins → Development → Import plugin from
 * manifest…, run it, hit Download, then:
 *
 *   FIGMA_DUMP=~/Downloads/figma-dump.json pnpm tokens:pull
 *
 * Shape mirrors GET /v1/files/:key/variables/local — pull.mjs reads
 * `.meta`, so the REST route and this one are interchangeable. That endpoint is
 * Enterprise-gated; this is the way in on every other plan.
 */
(async () => {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const variables = await figma.variables.getLocalVariablesAsync();

  const meta = { variables: {}, variableCollections: {} };
  for (const c of collections) {
    meta.variableCollections[c.id] = {
      id: c.id,
      name: c.name,
      modes: c.modes.map((m) => ({ modeId: m.modeId, name: m.name })),
      defaultModeId: c.defaultModeId,
      variableIds: c.variableIds.slice(),
    };
  }
  for (const v of variables) {
    meta.variables[v.id] = {
      id: v.id,
      name: v.name,
      resolvedType: v.resolvedType,
      variableCollectionId: v.variableCollectionId,
      // COLOR -> {r,g,b,a} 0–1, FLOAT -> number, ref -> {type:"VARIABLE_ALIAS",id}
      valuesByMode: v.valuesByMode,
      scopes: v.scopes,
      description: v.description,
    };
  }

  // Components too, for scripts/check-components.mjs. Additive: pull.mjs only
  // reads `.variables` / `.variableCollections`, so the REST-shaped part is
  // untouched. Pages load lazily under documentAccess: dynamic-page, hence the
  // explicit loadAsync per page.
  meta.components = {};
  for (const page of figma.root.children) {
    await page.loadAsync();
    for (const n of page.findAllWithCriteria({
      types: ["COMPONENT_SET", "COMPONENT"],
    })) {
      // variants inside a set are described by the set itself
      if (
        n.type === "COMPONENT" &&
        n.parent &&
        n.parent.type === "COMPONENT_SET"
      )
        continue;
      meta.components[n.id] = {
        id: n.id,
        name: n.name,
        type: n.type,
        page: page.name,
        properties: n.componentPropertyDefinitions || {},
      };
    }
  }

  figma.showUI(__html__, { width: 460, height: 340, themeColors: true });
  figma.ui.postMessage({
    json: JSON.stringify({ meta: meta }, null, 2),
    summary: collections
      .map(
        (c) =>
          c.name +
          " — " +
          c.variableIds.length +
          " vars, modes: " +
          c.modes.map((m) => m.name).join("/"),
      )
      .concat(Object.keys(meta.components).length + " component(s)")
      .join("\n"),
  });
  figma.ui.onmessage = (msg) => {
    if (msg === "close") figma.closePlugin();
  };
})();
