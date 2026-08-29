/**
 * A diagram is authored content from the store, injected as live DOM so its
 * `data-step` elements can be lit per step. Injection is only safe with the
 * script surface removed, so that happens here and nowhere else.
 */
export function sanitizeSvg(source: string): SVGSVGElement | null {
  const parsed = new DOMParser().parseFromString(source, "image/svg+xml");
  if (parsed.querySelector("parsererror")) return null;

  const svg = parsed.documentElement;
  if (svg.tagName.toLowerCase() !== "svg") return null;

  for (const script of Array.from(svg.querySelectorAll("script"))) {
    script.remove();
  }

  const walk = (element: Element) => {
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      const isLink = name === "href" || name.endsWith(":href");
      if (name.startsWith("on") || (isLink && !isSafeHref(value))) {
        element.removeAttribute(attribute.name);
      }
    }
    for (const child of Array.from(element.children)) walk(child);
  };
  walk(svg);

  svg.setAttribute("width", "100%");
  svg.removeAttribute("height");
  return svg as unknown as SVGSVGElement;
}

function isSafeHref(value: string): boolean {
  return (
    value.startsWith("#") || /^https?:/.test(value) || value.startsWith("/")
  );
}
