import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import { useCallback, useEffect, useRef, useState } from "react";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const SCALE = 1.5;

const messageOf = (caught: unknown) =>
  caught instanceof Error ? caught.message : "Could not render the PDF.";

/**
 * Storybook-only: draws the bytes a pdf-lib renderer returns onto one canvas
 * per page, so a story previews what pdf-lib really drew - including a table
 * that runs onto a second page - rather than a DOM approximation of it. It
 * takes the render itself, so a document the renderer refuses shows its
 * error in the same alert as a PDF that fails to load or draw. Not exported
 * from `../../index` - `pdfjs-dist` is a devDependency, not part of this
 * package's public surface.
 */
export function PdfPreview({ pdf }: { pdf: Promise<ArrayBuffer> }) {
  const [pages, setPages] = useState<PDFPageProxy[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reportError = useCallback(
    (caught: unknown) => setError(messageOf(caught)),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    let document: PDFDocumentProxy | null = null;
    setPages(null);
    setError(null);

    async function load() {
      try {
        const bytes = await pdf;
        document = await getDocument({ data: new Uint8Array(bytes) }).promise;
        const loaded = await Promise.all(
          Array.from({ length: document.numPages }, (_, index) =>
            (document as PDFDocumentProxy).getPage(index + 1),
          ),
        );
        if (!cancelled) setPages(loaded);
      } catch (caught) {
        if (!cancelled) setError(messageOf(caught));
      }
    }

    void load();
    return () => {
      cancelled = true;
      void document?.destroy();
    };
  }, [pdf]);

  if (error) return <p role="alert">{error}</p>;
  if (!pages) return <p>Generating...</p>;
  return (
    <VStack gap="md" hAlign="start">
      {pages.map((page) => (
        <PdfPreviewPage
          key={page.pageNumber}
          page={page}
          onError={reportError}
        />
      ))}
    </VStack>
  );
}

function PdfPreviewPage({
  page,
  onError,
}: {
  page: PDFPageProxy;
  onError: (caught: unknown) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const viewport = page.getViewport({ scale: SCALE });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const task = page.render({ canvas, viewport });
    task.promise.then(
      () => page.cleanup(),
      (caught: unknown) => {
        // Unmounting cancels the render; any other failure reaches the alert.
        if (
          !(caught instanceof Error) ||
          caught.name !== "RenderingCancelledException"
        ) {
          onError(caught);
        }
      },
    );
    return () => task.cancel();
  }, [page, onError]);

  return <canvas ref={canvasRef} data-slot="pdf-preview-canvas" />;
}
