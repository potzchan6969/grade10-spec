import { describe, expect, it } from "vitest";
import type {
  ProfileCardCopy,
  ProfileCardProps,
  ProfileDetailsCopy,
  ProfileDetailsProps,
  ProfileFormCopy,
  ProfileFormProps,
  ProfileFormValues,
} from "../../index";
import * as publicEntry from "../../index";

type PublicProfileTypes = [
  ProfileCardCopy,
  ProfileCardProps,
  ProfileDetailsCopy,
  ProfileDetailsProps,
  ProfileFormCopy,
  ProfileFormProps,
  ProfileFormValues,
];

const publicProfileTypes: PublicProfileTypes | undefined = undefined;
void publicProfileTypes;

// shared-ui-store-profile-SC-01: the surface resolves from the public entry,
// and nothing else is exported for it; the type half is the tuple above.
describe("store-profile public entry", () => {
  it("exports exactly the three profile components", () => {
    const profileExports = Object.keys(publicEntry).filter((name) =>
      name.startsWith("Profile"),
    );
    expect(profileExports.sort()).toEqual([
      "ProfileCard",
      "ProfileDetails",
      "ProfileForm",
    ]);
    expect([
      publicEntry.ProfileCard,
      publicEntry.ProfileDetails,
      publicEntry.ProfileForm,
    ]).toEqual([
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    ]);
  });
});
