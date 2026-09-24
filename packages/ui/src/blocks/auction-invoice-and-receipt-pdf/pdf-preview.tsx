import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import { useEffect, useRef, useState } from "react";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

/**
 * Storybook-only: renders the actual bytes a pdf-lib generator produced onto
 * a canvas, so a story previews what pdf-lib really drew rather than a DOM
 * approximation of it. Not exported from `../../index` - `pdfjs-dist` is a
 * devDependency, not part of this package's public surface.
 */
export function PdfPreview({ bytes }: { bytes: ArrayBuffer }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const document = await getDocument({ data: new Uint8Array(bytes) })
          .promise;
        if (cancelled) return;
        const page = await document.getPage(1);
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, viewport }).promise;
        page.cleanup();
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Could not render the PDF.",
          );
        }
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [bytes]);

  if (error) return <p role="alert">{error}</p>;
  return <canvas ref={canvasRef} data-slot="pdf-preview-canvas" />;
}
