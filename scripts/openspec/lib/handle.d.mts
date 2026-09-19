/**
 * Types for `handle.mjs`, read only by the browser project
 * (`tools/manual/tsconfig.app.json`), which does not allow a plain `.mjs`
 * import: `handle.mjs` itself stays untyped JavaScript, held to this by
 * nothing but its own tests, the way every other file under
 * `scripts/openspec/lib/` is.
 */
export declare const handleOf: (handle: unknown) => string;
export declare const isHandle: (value: string) => boolean;
