export interface CatalogCell {
  layer: string;
  locale: string;
  namespace: string;
  key: string;
}

export const CATALOG_ROOT: string;
export function catalogPath(cell: Omit<CatalogCell, "key">): string;
export function flatten(tree: object, prefix?: string): Record<string, unknown>;
export function setPath(
  tree: object,
  key: string,
  value: string,
  order?: object,
): object;
export function serialize(tree: object): string;
export function valueHash(value: string | null | undefined): Promise<string>;
