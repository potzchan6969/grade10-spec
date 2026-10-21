export type ProfileId = "desktop" | "tablet" | "mobile";
export type LocaleTag = string;

export function captureLocale(
  value: { locale?: string | null } | null | undefined,
): string;
export function validateLocale(value: unknown, path?: string): LocaleTag;

export interface ViewportSize {
  readonly width: number;
  readonly height: number;
}

export const PROFILES: Readonly<Record<ProfileId, ViewportSize>>;

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface CaseReference {
  storyId: string;
  selector?: string;
}

export interface CaseDeclaration {
  schemaVersion: 1;
  caseId: string;
  targetId: string;
  capturePointId: string;
  storyId: string;
  label: string;
  scoreProfile: ProfileId;
  recipe: string | { [key: string]: JsonValue };
  reference: CaseReference;
}

export type CatalogueStatus = "active" | "retired";

export type CatalogueEntry = CaseDeclaration & { status: CatalogueStatus };

export interface ImageArtifact {
  key: string;
  sha256: string;
  width: number;
  height: number;
}

export interface ImageRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ReuseProvenance {
  runId: string;
  appCommit: string;
  referenceCommit: string;
  capturedAt: string;
}

export interface CaptureProvenance {
  verified: boolean;
  appCommit: string;
  referenceCommit: string;
  capturedAt: string;
  reusedFrom?: ReuseProvenance;
}

export interface CaptureFailure {
  code?: string;
  message: string;
}

interface CaptureBase {
  caseId: string;
  targetId: string;
  capturePointId: string;
  profileId: ProfileId;
  inputFingerprint: string;
  locale?: LocaleTag;
}

export type CaptureOutcome =
  | (CaptureBase & {
      status: "captured";
      provenance: CaptureProvenance;
      site: ImageArtifact;
      reference?: ImageArtifact;
      siteRegion?: ImageRegion;
      referenceRegion?: ImageRegion;
      failure?: never;
    })
  | (CaptureBase & {
      status: "failed";
      provenance: CaptureProvenance & { verified: false };
      failure: CaptureFailure;
      site?: never;
      reference?: never;
      siteRegion?: never;
      referenceRegion?: never;
    })
  | (CaptureBase & {
      status: "not-selected";
      provenance: CaptureProvenance & { verified: false };
      site?: never;
      reference?: never;
      siteRegion?: never;
      referenceRegion?: never;
      failure?: never;
    });

export interface CheckpointRevision {
  ref: string;
  commit: string;
}

export interface Checkpoint {
  app: CheckpointRevision;
  reference: CheckpointRevision;
}

export interface VerificationManifest {
  schemaVersion: 1;
  runId: string;
  createdAt: string;
  checkpoint: Checkpoint;
  catalogue: CatalogueEntry[];
  captures: CaptureOutcome[];
  locales?: LocaleTag[];
}

export function validateDeclaration(value: unknown): CaseDeclaration;
export function validateDeclarations(values: unknown[]): CaseDeclaration[];
export function validateObjectKey(value: unknown): string;
export function validateManifest(value: unknown): VerificationManifest;
export function canonicalJson(value: unknown): string;
export function fingerprint(value: unknown): Promise<string>;
