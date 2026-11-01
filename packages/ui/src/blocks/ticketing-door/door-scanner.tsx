import { Button } from "@grade10/design-system/components/forms/button";
import {
  ArrowsClockwise,
  CameraSlash,
  CircleNotch,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";

type DoorScannerCopy = {
  /** "Point at a code" */
  pointAtCode: string;
  /** "Checking" */
  checking: string;
  /** "Allow the camera so this phone can read tickets. Nothing is recorded." */
  cameraAsk: string;
  /** "The camera is blocked" */
  blockedTitle: string;
  /** How to allow it again, ending "…then tap Try Again." */
  blockedBody: string;
  /** "No camera found" */
  noCameraTitle: string;
  /** "This device has no camera we can use…" */
  noCameraBody: string;
  /** "Try Again" */
  tryAgain: string;
  /** "Find by Reference" — the full-width action under a camera problem. */
  findByReferenceAction: string;
  /** "Find by reference" — the small button beside today’s count. */
  findByReference: string;
  /** "Let in today on this phone:" */
  admittedTodayLabel: string;
};

/**
 * What the camera is doing.
 * - `asking` — the browser is asking for the camera
 * - `ready` — pointing at a code
 * - `checking` — a code was read and the answer is on its way
 * - `blocked` — the browser was told not to use the camera
 * - `noCamera` — there is no camera, or another app holds it
 */
type DoorScannerStatus =
  | "asking"
  | "ready"
  | "checking"
  | "blocked"
  | "noCamera";

type DoorScannerProps = {
  copy: DoorScannerCopy;
  status: DoorScannerStatus;
  /**
   * The camera's picture: the consumer's own `<video>` (or any element) with
   * its stream attached. The block owns no camera; it only places it.
   */
  camera?: ReactNode;
  /** Today’s count for this phone, formatted: "412". */
  admittedToday: string;
  onFindByReference: () => void;
  onTryAgain: () => void;
};

function CameraProblem({
  title,
  body,
  copy,
  onTryAgain,
  onFindByReference,
}: {
  title: string;
  body: string;
  copy: DoorScannerCopy;
  onTryAgain: () => void;
  onFindByReference: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col px-4 pt-10 pb-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <span
          aria-hidden
          className="grid size-14 place-items-center rounded-full bg-destructive-muted text-destructive"
        >
          <CameraSlash size={24} />
        </span>
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-secondary-foreground">{body}</p>
      </div>
      <div className="mt-auto flex flex-col gap-2 pt-6">
        <Button
          className="w-full"
          leading={<ArrowsClockwise />}
          onClick={onTryAgain}
        >
          {copy.tryAgain}
        </Button>
        <Button
          className="w-full"
          leading={<MagnifyingGlass />}
          onClick={onFindByReference}
          variant="outline"
        >
          {copy.findByReferenceAction}
        </Button>
      </div>
    </div>
  );
}

/**
 * The scanning screen: the camera's picture behind a square to aim with,
 * today's count for this phone, and Find by reference. A blocked or missing
 * camera is told apart, each with Try Again and a way to find by reference.
 */
function DoorScanner({
  copy,
  status,
  camera,
  admittedToday,
  onFindByReference,
  onTryAgain,
}: DoorScannerProps) {
  if (status === "blocked" || status === "noCamera") {
    return (
      <div className="flex flex-1 flex-col" data-slot="door-scanner">
        <CameraProblem
          body={status === "blocked" ? copy.blockedBody : copy.noCameraBody}
          copy={copy}
          onFindByReference={onFindByReference}
          onTryAgain={onTryAgain}
          title={status === "blocked" ? copy.blockedTitle : copy.noCameraTitle}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col" data-slot="door-scanner">
      <div className="relative m-4 mb-0 flex min-h-80 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-background-inverse text-background">
        {camera ? (
          <div className="absolute inset-0 [&>video]:size-full [&>video]:object-cover">
            {camera}
          </div>
        ) : null}
        <div
          aria-hidden
          className="relative grid aspect-square w-3/5 max-w-60 place-items-center rounded-2xl border-2 border-background/70"
        />
        <div aria-live="polite" className="absolute inset-0" role="status">
          {status === "checking" ? (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 font-semibold">
              <span aria-hidden className="inline-flex animate-spin">
                <CircleNotch size={22} />
              </span>
              {copy.checking}
            </span>
          ) : null}
          {status === "ready" ? (
            <span className="absolute inset-x-0 bottom-5 text-center text-sm font-medium">
              {copy.pointAtCode}
            </span>
          ) : null}
          {status === "asking" ? (
            <span className="absolute inset-x-3 bottom-3 rounded-xl bg-background p-3 text-sm text-foreground">
              {copy.cameraAsk}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="text-xs text-secondary-foreground">
          {copy.admittedTodayLabel}{" "}
          <strong className="font-semibold text-foreground tabular-nums">
            {admittedToday}
          </strong>
        </span>
        <Button
          leading={<MagnifyingGlass />}
          onClick={onFindByReference}
          size="md"
          variant="outline"
        >
          {copy.findByReference}
        </Button>
      </div>
    </div>
  );
}

export {
  DoorScanner,
  type DoorScannerCopy,
  type DoorScannerProps,
  type DoorScannerStatus,
};
