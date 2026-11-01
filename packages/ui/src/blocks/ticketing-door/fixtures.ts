import type { DoorAnswerCopy } from "./door-answer";
import type { DoorFindCopy, DoorFindTicket } from "./door-find";
import type { DoorPasscodeChangedCopy } from "./door-passcode-changed";
import type { DoorPhoneFrameCopy } from "./door-phone-frame";
import type {
  DoorRecentAdmission,
  DoorRecentAdmissionsCopy,
} from "./door-recent-admissions";
import type { DoorScannerCopy } from "./door-scanner";
import type { DoorSignInCopy, DoorSignInEvent } from "./door-sign-in";
import type { DoorUndoBarCopy } from "./door-undo-bar";
import type { DoorDetail } from "./types";

/** Draft English from the 2026-10-30 DoorPhone and DoorConsole boards. */
export const frameCopy: DoorPhoneFrameCopy = {
  findByReference: "Find by reference",
  menu: "Door menu: sign out",
};

export const signInCopy: DoorSignInCopy = {
  title: "Open the door",
  description: "Enter the passcode the door lead gave you. No account needed.",
  passcodeLabel: "Passcode",
  passcodePlaceholder: "Letters and numbers",
  deviceNameLabel: "This phone’s name",
  deviceNameHint: "Every ticket you let in is recorded with it.",
  submit: "Open the Door",
  notOpenTitle: "Not open yet",
  untilOpen: "until the door opens",
  checkAgain: "Check Again",
};

export const signInEvent: DoorSignInEvent = {
  name: "Grade10 Collectors Fair",
  when: "Sat 12 and Sun 13 Dec 2026, AsiaWorld-Expo Hall 5",
};

export const openWindow =
  "Works from 09:00 Sat 12 Dec to the end of the event.";

export const scannerCopy: DoorScannerCopy = {
  pointAtCode: "Point at a code",
  checking: "Checking",
  cameraAsk:
    "Allow the camera so this phone can read tickets. Nothing is recorded.",
  blockedTitle: "The camera is blocked",
  blockedBody:
    "This browser was told not to use the camera. Open Settings, then Safari, then Camera, and choose Allow. Then come back and tap Try Again.",
  noCameraTitle: "No camera found",
  noCameraBody:
    "This device has no camera we can use, or another app is using it. Close other camera apps and try again, or plug in a handheld scanner.",
  tryAgain: "Try Again",
  findByReferenceAction: "Find by Reference",
  findByReference: "Find by reference",
  admittedTodayLabel: "Let in today on this phone:",
};

export const answerCopy: DoorAnswerCopy = {
  scanNext: "Scan next",
  useFastPass: "Use Fast Pass",
  undoFastPass: "Undo Fast Pass",
  tryAgain: "Try Again",
  findByReference: "Find by reference",
};

export const undoCopy: DoorUndoBarCopy = { undo: "Undo" };

export const alexDetails: readonly DoorDetail[] = [
  { label: "Name", value: "Alex" },
  { label: "Pass", value: "General Pass (Two-Day), Adult" },
  { label: "Ticket", value: "TK7Q2M-1", code: true },
  { label: "Today", value: "Day 1 of 2 it admits" },
];

export const findPhoneCopy: DoorFindCopy = {
  title: "Find by reference",
  description: "The six characters on the ticket or in the email.",
  fieldLabel: "Reference",
  back: "Scan",
  admit: "Admit",
};

export const findConsoleCopy: DoorFindCopy = {
  title: "Find a ticket",
  description:
    "A reference, or the buyer’s exact email. Email search is console only.",
  fieldLabel: "Reference or email",
  back: "Scan",
  admit: "Admit",
};

export const findTickets: readonly DoorFindTicket[] = [
  {
    id: "t1",
    name: "Alex",
    pass: "General Pass (Two-Day), Adult, Fast Pass: 2 left",
    code: "TK7Q2M-1",
    entry: "Day 1 of 2 left today",
    action: { kind: "admit" },
  },
  {
    id: "t2",
    name: "Ben",
    pass: "General Pass (Two-Day), Adult",
    code: "TK7Q2M-2",
    entry: "Let in 10:31 by Gate A phone 1",
    action: { kind: "blocked", label: "In today" },
  },
  {
    id: "t3",
    name: "Chloe",
    pass: "General Pass (Two-Day), Child",
    code: "TK7Q2M-3",
    entry: "Day 1 of 2 left today",
    action: { kind: "admit" },
  },
];

export const passcodeChangedCopy: DoorPasscodeChangedCopy = {
  title: "The passcode was changed",
  body: "Every phone at the door was signed out. Ask the door lead for the new passcode.",
  action: "Enter the New Passcode",
};

export const recentCopy: DoorRecentAdmissionsCopy = {
  title: "Recent admissions",
  caption: "Every door, HKT",
  undo: "Undo",
  reverse: "Reverse…",
  reverseHint:
    "Takes the admission back. Asks for a reason; the audit keeps it.",
  fastPassUsed: "Fast Pass used",
  reversed: "Reversed",
  empty: "No admissions yet.",
};

export const recentAdmissions: readonly DoorRecentAdmission[] = [
  {
    id: "a1",
    time: "14:05",
    name: "Alex Chan",
    pass: "General Pass (Two-Day), Adult",
    device: "This screen",
    fastPassUsed: false,
    reversed: false,
    action: "undo",
  },
  {
    id: "a2",
    time: "14:05",
    name: "Mei Lin",
    pass: "VIP Pass",
    device: "Gate A phone 1",
    fastPassUsed: true,
    reversed: false,
    action: "reverse",
  },
  {
    id: "a3",
    time: "14:04",
    name: "Daniel Ng",
    pass: "General Pass (One-Day), Adult",
    device: "Gate A phone 1",
    fastPassUsed: false,
    reversed: false,
    action: "reverse",
  },
  {
    id: "a4",
    time: "14:04",
    name: "Iris Ho",
    pass: "General Pass (One-Day), Child",
    device: "Gate B phone 2",
    fastPassUsed: false,
    reversed: true,
    action: "none",
  },
  {
    id: "a5",
    time: "14:03",
    name: "Tom Lee",
    pass: "General Pass (Two-Day), Adult",
    device: "Gate A phone 1",
    fastPassUsed: true,
    reversed: false,
    action: "reverse",
  },
];
