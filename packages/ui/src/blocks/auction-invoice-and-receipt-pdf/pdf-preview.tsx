import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { PDFPageProxy } from "pdfjs-dist";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import { useEffect, useRef, useState } from "react";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const SCALE = 1.5;

/**
 * Storybook-only: renders the actual bytes a pdf-lib generator produced onto
 * one canvas per page, so a story previews what pdf-lib really drew -
 * including a table that runs onto a second page - rather than a DOM
 * approximation of it. Not exported from `../../index` - `pdfjs-dist` is a
 * devDependency, not part of this package's public surface.
 */
export function PdfPreview({ bytes }: { bytes: ArrayBuffer }) {
  const [pages, setPages] = useState<PDFPageProxy[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const document = await getDocument({ data: new Uint8Array(bytes) })
          .promise;
        const loaded = await Promise.all(
          Array.from({ length: document.numPages }, (_, index) =>
            document.getPage(index + 1),
          ),
        );
        if (!cancelled) setPages(loaded);
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

    setPages([]);
    void load();
    return () => {
      cancelled = true;
    };
  }, [bytes]);

  if (error) return <p role="alert">{error}</p>;
  return (
    <VStack gap="md" hAlign="start">
      {pages.map((page) => (
        <PdfPreviewPage key={page.pageNumber} page={page} />
      ))}
    </VStack>
  );
}

function PdfPreviewPage({ page }: { page: PDFPageProxy }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const viewport = page.getViewport({ scale: SCALE });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const task = page.render({ canvas, viewport });
    task.promise
      .then(() => page.cleanup())
      .catch((caught: unknown) => {
        // Unmounting cancels the render; any other failure still surfaces.
        if (
          !(caught instanceof Error) ||
          caught.name !== "RenderingCancelledException"
        ) {
          throw caught;
        }
      });
    return () => task.cancel();
  }, [page]);

  return <canvas ref={canvasRef} data-slot="pdf-preview-canvas" />;
}
