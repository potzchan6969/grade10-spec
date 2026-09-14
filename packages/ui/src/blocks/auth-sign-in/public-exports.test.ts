import { describe, expect, it } from "vitest";
import type {
  SignInCardCopy,
  SignInCardProps,
  SignInEmailFormCopy,
  SignInEmailFormProps,
} from "../../index";
import * as publicEntry from "../../index";
import { SignInCard, SignInEmailForm } from "../../index";

type PublicSignInTypes = [
  SignInCardCopy,
  SignInCardProps,
  SignInEmailFormProps,
  SignInEmailFormCopy,
];

const publicSignInTypes: PublicSignInTypes | undefined = undefined;
void publicSignInTypes;

// The email step offers one action, so its copy names one action: a
// `codeAction` key back on the copy type is what this catches.
type CopyNamesNoCode = "codeAction" extends keyof SignInEmailFormCopy
  ? never
  : true;
const copyNamesNoCode: CopyNamesNoCode = true;
void copyNamesNoCode;

describe("sign-in public entry", () => {
  it("exports every named sign-in component", () => {
    expect([SignInCard, SignInEmailForm]).toEqual([
      expect.any(Function),
      expect.any(Function),
    ]);
  });

  it("exports no code step", () => {
    expect(Object.keys(publicEntry)).not.toContain("SignInCodeForm");
  });
});
