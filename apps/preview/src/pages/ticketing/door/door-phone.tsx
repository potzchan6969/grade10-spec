import {
  DoorAnswer,
  DoorFind,
  type DoorFindResult,
  DoorPasscodeChanged,
  DoorPhoneFrame,
  DoorScanner,
  type DoorScannerStatus,
  DoorSignIn,
  type DoorSignInStatus,
  DoorUndoBar,
} from "@grade10/ui";
import { useEffect, useState } from "react";
import { T, t } from "../ticketing-words";
import {
  ANSWER_COPY,
  ANSWERS,
  DEVICE,
  type DoorAnswerName,
  FIND_COPY,
  FIND_TICKETS,
  FRAME_COPY,
  OPEN_WINDOW,
  PASSCODE,
  PASSCODE_CHANGED_COPY,
  SCANNER_COPY,
  SIGN_IN_COPY,
  SIGN_IN_EVENT,
} from "./door-content";

const D = T.door;
const UNDO_SECONDS = 10;

/** Where the phone stands. */
export type DoorView =
  | { at: "signIn"; status: DoorSignInStatus }
  | { at: "scanner"; status: DoorScannerStatus }
  | {
      at: "answer";
      answer: DoorAnswerName;
      fastPassUsed?: boolean;
      undoFrom?: number;
    }
  | { at: "find"; result: DoorFindResult; query: string }
  | { at: "passcodeChanged" };

export type DoorPhoneProps = {
  /** Where the story opens. */
  start: DoorView;
  offline?: boolean;
};

/**
 * The passcode door on a phone, `/door`, the DoorPhone board: getting in,
 * scanning, the answer with Undo and Use Fast Pass, finding by reference
 * and the passcode changed. Pressed through, it walks the whole shift; the
 * camera is a stand-in whose button reads the next code.
 */
export function DoorPhone({ start, offline = false }: DoorPhoneProps) {
  const [view, setView] = useState<DoorView>(start);
  const [passcode, setPasscode] = useState(
    start.at === "signIn" ? "" : PASSCODE,
  );
  const [device, setDevice] = useState(start.at === "signIn" ? "" : DEVICE);
  const [submitting, setSubmitting] = useState(false);
  const [admitted, setAdmitted] = useState(412);
  const [left, setLeft] = useState(
    view.at === "answer" ? (view.undoFrom ?? 0) : 0,
  );

  const answering = view.at === "answer" && view.answer === "admitted";
  useEffect(() => {
    if (!answering || left <= 0) return;
    const timer = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [answering, left]);

  const scan = () => setView({ at: "scanner", status: "ready" });
  const admit = () => {
    setAdmitted((n) => n + 1);
    setLeft(UNDO_SECONDS);
    setView({ at: "answer", answer: "admitted" });
  };
  const readCode = () => {
    setView({ at: "scanner", status: "checking" });
    window.setTimeout(admit, 600);
  };
  const find = () =>
    setView({ at: "find", result: { status: "idle" }, query: "" });

  const signedIn = view.at !== "signIn" && view.at !== "passcodeChanged";

  let screen: React.ReactNode;
  switch (view.at) {
    case "signIn":
      screen = (
        <DoorSignIn
          copy={SIGN_IN_COPY}
          deviceName={device}
          event={SIGN_IN_EVENT}
          onCheckAgain={() =>
            setView({ at: "signIn", status: { kind: "ready" } })
          }
          onDeviceNameChange={setDevice}
          onPasscodeChange={setPasscode}
          onSubmit={() => {
            if (passcode !== PASSCODE) {
              setView({
                at: "signIn",
                status: {
                  kind: "wrong",
                  message: t(D.signIn.wrong, { left: 3 }),
                },
              });
              return;
            }
            setSubmitting(true);
            window.setTimeout(() => {
              setSubmitting(false);
              setView({ at: "scanner", status: "ready" });
            }, 600);
          }}
          openWindow={OPEN_WINDOW}
          passcode={passcode}
          status={view.status}
          submitting={submitting}
        />
      );
      break;
    case "scanner":
      screen = (
        <DoorScanner
          admittedToday={String(admitted)}
          camera={
            view.status === "ready" ? (
              <div className="grid size-full place-items-end bg-gradient-to-br from-secondary-foreground to-background-inverse p-4">
                <button
                  className="rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground"
                  onClick={readCode}
                  type="button"
                >
                  Stand-in camera: read TK7Q2M-1
                </button>
              </div>
            ) : undefined
          }
          copy={SCANNER_COPY}
          onFindByReference={find}
          onTryAgain={scan}
          status={view.status}
        />
      );
      break;
    case "answer": {
      const words = ANSWERS[view.answer];
      const isAdmitted = view.answer === "admitted";
      screen = (
        <DoorAnswer
          copy={ANSWER_COPY}
          details={"details" in words ? words.details : undefined}
          fastPass={
            isAdmitted
              ? view.fastPassUsed
                ? {
                    state: "used",
                    label: t(D.answer.fastPass.usedLeft, { count: 1 }),
                  }
                : {
                    state: "available",
                    label: t(D.answer.fastPass.left, { count: 2 }),
                  }
              : undefined
          }
          kind={words.kind}
          layout="phone"
          line={words.line}
          note={"note" in words ? words.note : undefined}
          onFindByReference={view.answer === "notATicket" ? find : undefined}
          onScanNext={scan}
          onTryAgain={view.answer === "notChecked" ? readCode : undefined}
          onUndoFastPass={() => setView({ ...view, fastPassUsed: false })}
          onUseFastPass={() => setView({ ...view, fastPassUsed: true })}
          title={words.title}
          undo={
            isAdmitted && left > 0 ? (
              <DoorUndoBar
                copy={{ undo: D.answer.undo }}
                onUndo={() => {
                  setAdmitted((n) => n - 1);
                  setView({ at: "answer", answer: "undone" });
                }}
                remaining={t(D.answer.undoSeconds, { seconds: left })}
                secondsLeft={left}
                size="lg"
                totalSeconds={UNDO_SECONDS}
              />
            ) : undefined
          }
        />
      );
      break;
    }
    case "find":
      screen = (
        <DoorFind
          copy={FIND_COPY}
          layout="phone"
          note={
            view.result.status === "found" ? D.find.firstNamesOnly : undefined
          }
          onAdmit={admit}
          onBack={scan}
          onQueryChange={(query) => setView({ ...view, query })}
          onSubmit={() =>
            setView({
              ...view,
              result:
                view.query.trim().toUpperCase() === "TK7Q2M"
                  ? {
                      status: "found",
                      heading: t(D.find.results, {
                        count: 3,
                        reference: "TK7Q2M",
                      }),
                      tickets: FIND_TICKETS,
                    }
                  : { status: "notFound", message: D.find.notFound },
            })
          }
          query={view.query}
          result={view.result}
        />
      );
      break;
    case "passcodeChanged":
      screen = (
        <DoorPasscodeChanged
          copy={PASSCODE_CHANGED_COPY}
          onEnterNewPasscode={() => {
            setPasscode("");
            setView({ at: "signIn", status: { kind: "ready" } });
          }}
        />
      );
      break;
  }

  return (
    <DoorPhoneFrame
      className="min-h-svh w-full"
      copy={FRAME_COPY}
      mode={signedIn ? "signedIn" : "signedOut"}
      offlineNotice={offline ? D.scanner.offline : undefined}
      onFindByReference={find}
      onOpenMenu={() => {
        setPasscode("");
        setView({ at: "signIn", status: { kind: "ready" } });
      }}
      title={signedIn ? device || DEVICE : D.wordmark}
    >
      {screen}
    </DoorPhoneFrame>
  );
}
