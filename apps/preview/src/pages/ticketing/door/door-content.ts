import type {
  DoorAnswerCopy,
  DoorAnswerKind,
  DoorDetail,
  DoorFindCopy,
  DoorFindTicket,
  DoorPasscodeChangedCopy,
  DoorPhoneFrameCopy,
  DoorScannerCopy,
  DoorSignInCopy,
} from "@grade10/ui";
import { SHOW, T, t } from "../ticketing-words";

/* What the door phone passes its blocks, every word from the `ticketing`
 * catalog's `door` keys. The tickets are the DoorPhone board's. */

const D = T.door;

export const DEVICE = "Gate A phone 1";
export const PASSCODE = "482913";

export const FRAME_COPY: DoorPhoneFrameCopy = {
  findByReference: D.bar.findLabel,
  menu: D.bar.menuLabel,
};

export const SIGN_IN_COPY: DoorSignInCopy = {
  title: D.signIn.title,
  description: D.signIn.body,
  passcodeLabel: D.signIn.passcode,
  passcodePlaceholder: D.signIn.passcodePlaceholder,
  deviceNameLabel: D.signIn.deviceName,
  deviceNameHint: D.signIn.deviceHint,
  submit: D.signIn.submit,
  notOpenTitle: D.signIn.notOpen,
  untilOpen: D.signIn.notOpenUntil,
  checkAgain: D.signIn.checkAgain,
};

export const SIGN_IN_EVENT = {
  name: SHOW.name,
  when: `${SHOW.shortDays}, [Venue]`,
};

export const OPEN_WINDOW = t(D.signIn.opens, {
  time: "09:00",
  date: "Sat 12 Dec",
});

export const SCANNER_COPY: DoorScannerCopy = {
  pointAtCode: D.scanner.point,
  checking: D.scanner.checking,
  cameraAsk: D.scanner.cameraWhy,
  blockedTitle: D.scanner.blocked.title,
  blockedBody: D.scanner.blocked.body,
  noCameraTitle: D.scanner.noCamera.title,
  noCameraBody: D.scanner.noCamera.body,
  tryAgain: D.answer.tryAgain,
  findByReferenceAction: D.scanner.blocked.action,
  findByReference: D.scanner.findByReference,
  admittedTodayLabel: D.scanner.countToday,
};

export const ANSWER_COPY: DoorAnswerCopy = {
  scanNext: D.answer.scanNext,
  useFastPass: D.answer.fastPass.use,
  undoFastPass: D.answer.fastPass.undo,
  tryAgain: D.answer.tryAgain,
  findByReference: D.find.title,
};

export const FIND_COPY: DoorFindCopy = {
  title: D.find.title,
  description: D.find.hint,
  fieldLabel: D.find.label,
  back: D.answer.scan,
  admit: D.find.admit,
};

export const PASSCODE_CHANGED_COPY: DoorPasscodeChangedCopy = {
  title: D.passcodeChanged.title,
  body: D.passcodeChanged.body,
  action: D.passcodeChanged.action,
};

const F = D.answer.facts;
const ADULT = "General Pass (Two-Day), Adult";
const CHILD = "General Pass (Two-Day), Child";

export const ALEX: readonly DoorDetail[] = [
  { label: F.name, value: "Alex" },
  { label: F.pass, value: ADULT },
  { label: F.ticket, value: "TK7Q2M-1", code: true },
  { label: F.today, value: t(F.dayOf, { day: 1, count: 2 }) },
];

/** One answer as the door words it: its title, its line, its facts and
 * the note for staff. */
export type DoorAnswerWords = {
  kind: DoorAnswerKind;
  title: string;
  line: string;
  details?: readonly DoorDetail[];
  note?: string;
};

export const ANSWERS = {
  admitted: {
    kind: "admitted",
    title: D.answer.admitted.title,
    line: D.answer.admitted.line,
    details: ALEX,
  },
  undone: {
    kind: "undone",
    title: D.answer.undone.title,
    line: D.answer.undone.lineFastPass,
    details: [
      ...ALEX.slice(0, 3),
      { label: F.today, value: D.answer.undone.entryNotUsed },
      { label: F.fastPass, value: D.answer.undone.useGivenBack },
    ],
  },
  alreadyIn: {
    kind: "alreadyAdmitted",
    title: D.answer.alreadyIn.title,
    line: D.answer.alreadyIn.line,
    details: [
      ...ALEX.slice(0, 3),
      { label: F.letIn, value: t(F.timeToday, { time: "11:42" }) },
      { label: F.by, value: "Gate B phone 2" },
      { label: F.fastPass, value: t(F.usedThen, { left: 1 }) },
      { label: F.daysLeft, value: "Sun 13 Dec" },
    ],
    note: D.answer.alreadyIn.note,
  },
  noEntriesLeft: {
    kind: "noEntriesLeft",
    title: D.answer.noEntriesLeft.title,
    line: D.answer.noEntriesLeft.line,
    details: [
      { label: F.name, value: "Sam" },
      { label: F.pass, value: "General Pass (One-Day), Adult" },
      { label: F.ticket, value: "TK3H8P-1", code: true },
      { label: F.letIn, value: "Sat 12 Dec, 10:14" },
      { label: F.by, value: DEVICE },
    ],
  },
  void: {
    kind: "void",
    title: D.answer.void.title,
    line: D.answer.void.line,
    details: [
      { label: F.name, value: "Jo" },
      { label: F.pass, value: CHILD },
      { label: F.ticket, value: "TK9F4D-2", code: true },
      { label: F.order, value: "TK9F4D", code: true },
    ],
    note: D.answer.void.note,
  },
  notATicket: {
    kind: "notATicket",
    title: D.answer.notATicket.title,
    line: D.answer.notATicket.line,
    note: D.answer.notATicket.note,
  },
  wrongEvent: {
    kind: "wrongEvent",
    title: D.answer.wrongEvent.title,
    line: D.answer.wrongEvent.line,
    details: [
      { label: F.event, value: "[Another Show Name]" },
      { label: F.days, value: "Sat 9 Jan 2027" },
      { label: F.ticket, value: "TK5R2W-1", code: true },
    ],
  },
  notValidToday: {
    kind: "notValidToday",
    title: D.answer.notValidToday.title,
    line: D.answer.notValidToday.line,
    details: [
      { label: F.name, value: "Sam" },
      { label: F.pass, value: "General Pass (One-Day), Adult" },
      { label: F.ticket, value: "TK3H8P-1", code: true },
    ],
  },
  notChecked: {
    kind: "notChecked",
    title: D.answer.notChecked.title,
    line: D.answer.notChecked.line,
    details: [
      { label: F.code, value: "TK7Q2M-1", code: true },
      { label: F.tried, value: "14:05:22" },
    ],
    note: t(D.answer.notChecked.note, { seconds: 4 }),
  },
} satisfies Record<string, DoorAnswerWords>;

export type DoorAnswerName = keyof typeof ANSWERS;

export const FIND_TICKETS: readonly DoorFindTicket[] = [
  {
    id: "t1",
    name: "Alex",
    pass: t(D.find.passFastPass, { pass: ADULT, count: 2 }),
    code: "TK7Q2M-1",
    entry: t(D.find.dayOfLeftToday, { day: 1, count: 2 }),
    action: { kind: "admit" },
  },
  {
    id: "t2",
    name: "Ben",
    pass: ADULT,
    code: "TK7Q2M-2",
    entry: t(D.find.letInBy, { time: "10:31", device: DEVICE }),
    action: { kind: "blocked", label: D.find.inToday },
  },
  {
    id: "t3",
    name: "Chloe",
    pass: CHILD,
    code: "TK7Q2M-3",
    entry: t(D.find.dayOfLeftToday, { day: 1, count: 2 }),
    action: { kind: "admit" },
  },
];
