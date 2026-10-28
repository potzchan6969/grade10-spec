import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { caseIdErrors, missingCaseIds, needsCaseId } from "./case-ids.mjs";
import { loaderOf, parseStoryFile } from "./story-index.mjs";

const ID_A = "vc_00000000-0000-4000-8000-000000000001";
const ID_B = "vc_00000000-0000-4000-8000-000000000002";

const parse = (text) => {
  const path = "apps/preview/src/pages/auction/x/x.stories.tsx";
  return { [path]: parseStoryFile(path, text, loaderOf(null)) };
};

const file = (body, title = "Auction/Display/Screens/Thing") =>
  `const meta = { title: "${title}" };\nexport default meta;\n${body}`;

describe("which stories need a case id", () => {
  it("holds Auction stories, bar State Tests", () => {
    assert.equal(needsCaseId("Auction/Display/Screens/Lot Details"), true);
    assert.equal(
      needsCaseId("Auction/Bidding/Screens/Bid Panel/State Tests/Setup"),
      false,
    );
    assert.equal(needsCaseId("Store/Cart/Screens/Cart"), false);
    assert.equal(needsCaseId("Store/Flows/Guest Buys A Card"), true);
  });
});

describe("case ids", () => {
  it("passes a story that carries its own id", () => {
    const parsed = parse(
      file(
        `export const A = { parameters: { verification: { caseId: "${ID_A}" } } };`,
      ),
    );
    assert.deepEqual(caseIdErrors(parsed), []);
  });

  it("refuses a story without an id", () => {
    const [error] = caseIdErrors(parse(file("export const A = {};")));
    assert.match(error, /"A" has no verification caseId/);
  });

  it("refuses an id that is not vc_<uuid>", () => {
    const parsed = parse(
      file(
        `export const A = { parameters: { verification: { caseId: "nope" } } };`,
      ),
    );
    assert.match(caseIdErrors(parsed)[0], /is not vc_<uuid>/);
  });

  it("refuses two stories that share an id", () => {
    const withId = `parameters: { verification: { caseId: "${ID_A}" } }`;
    const parsed = parse(
      file(`export const A = { ${withId} };\nexport const B = { ${withId} };`),
    );
    assert.match(caseIdErrors(parsed)[0], /repeats the caseId/);
  });

  it("lets a one-story file take its id from the meta", () => {
    const parsed = parse(
      `const meta = { title: "Auction/Display/Screens/Thing", parameters: { verification: { caseId: "${ID_A}" } } };\nexport default meta;\nexport const A = {};`,
    );
    assert.deepEqual(caseIdErrors(parsed), []);
  });

  it("asks a many-story file for an id on each story", () => {
    const parsed = parse(
      `const meta = { title: "Auction/Display/Screens/Thing", parameters: { verification: { caseId: "${ID_A}" } } };\nexport default meta;\nexport const A = {};\nexport const B = {};`,
    );
    assert.equal(caseIdErrors(parsed).length, 2);
  });

  it("ignores stories outside the verified domains", () => {
    const parsed = parse(file("export const A = {};", "Store/Cart/Screens/X"));
    assert.deepEqual(caseIdErrors(parsed), []);
  });
});

describe("where a missing id goes", () => {
  const place = (body) =>
    missingCaseIds(parse(file(body))).missing[0]?.story.edit;

  it("opens parameters on a story that has none", () => {
    assert.equal(place("export const A = {};").kind, "story");
  });

  it("joins the parameters a story already has", () => {
    assert.equal(
      place("export const A = { parameters: { layout: 'padded' } };").kind,
      "parameters",
    );
  });

  it("wraps parameters that name a shared object", () => {
    assert.equal(
      place("const P = {};\nexport const A = { parameters: P };").kind,
      "wrap",
    );
  });

  it("assigns beside a story built by a helper", () => {
    assert.equal(
      place("export const A = make();\nA.play = async () => {};").kind,
      "assign",
    );
  });

  it("does not add a second id where an assignment has one", () => {
    const parsed = parse(
      file(
        `export const A = make();\nA.parameters = { ...A.parameters, verification: { caseId: "${ID_B}" } };`,
      ),
    );
    assert.deepEqual(caseIdErrors(parsed), []);
  });
});
