export const LISTING_AGE_VERIFICATION_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type ListingAgeVerificationDob = {
  month?: string;
  day?: string;
  year?: string;
};

export function isListingAgeVerificationComplete(
  dob: ListingAgeVerificationDob,
): boolean {
  return Boolean(dob.month && dob.day && dob.year);
}

export function listingAgeVerificationBirthDate(
  dob: ListingAgeVerificationDob,
): Date | null {
  if (!isListingAgeVerificationComplete(dob)) return null;

  const monthIndex = LISTING_AGE_VERIFICATION_MONTHS.indexOf(
    dob.month as (typeof LISTING_AGE_VERIFICATION_MONTHS)[number],
  );
  if (monthIndex < 0) return null;

  const day = Number.parseInt(dob.day ?? "", 10);
  const year = Number.parseInt(dob.year ?? "", 10);
  if (!Number.isFinite(day) || !Number.isFinite(year)) return null;

  const birthDate = new Date(year, monthIndex, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== monthIndex ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  return birthDate;
}

export function isListingAgeVerificationAdult(
  dob: ListingAgeVerificationDob,
  now = new Date(),
): boolean {
  const birthDate = listingAgeVerificationBirthDate(dob);
  if (!birthDate) return false;

  const eighteenthBirthday = new Date(
    birthDate.getFullYear() + 18,
    birthDate.getMonth(),
    birthDate.getDate(),
  );
  return eighteenthBirthday <= now;
}

export function listingAgeVerificationYearOptions(now = new Date()): string[] {
  const currentYear = now.getFullYear();
  return Array.from({ length: 101 }, (_, index) =>
    String(currentYear - index),
  );
}
