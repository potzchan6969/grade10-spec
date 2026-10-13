import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { readMapping, rename, retitle, rewriteText } from "./rename.mjs";

describe("rewriteText", () => {
  const maps = {
    ids: new Map([
      [
        "pages-legal--privacy-policy",
        "site-carried-surfaces-legal--privacy-policy",
      ],
    ]),
    prefixes: new Map([["pages-legal", "site-carried-surfaces-legal"]]),
    titles: [["Pages/Legal", "Site/Carried Surfaces/Legal"]],
  };

  it("rewrites an exact id, an id under an old title, a glob and a quoted title path", () => {
    const text = [
      '::story{id="pages-legal--privacy-policy"}',
      "`pages-legal--not-built-yet` and `pages-legal--*`",
      'The `Pages/Legal` story, and "Pages/Legal/Terms"',
    ].join("\n");
    assert.equal(
      rewriteText(text, maps),
      [
        '::story{id="site-carried-surfaces-legal--privacy-policy"}',
        "`site-carried-surfaces-legal--not-built-yet` and `site-carried-surfaces-legal--*`",
        'The `Site/Carried Surfaces/Legal` story, and "Site/Carried Surfaces/Legal/Terms"',
      ].join("\n"),
    );
  });

  it("leaves a longer id, an unquoted mention and a CSS variable alone", () => {
    const text =
      "xpages-legal--privacy-policy Pages/Legal var(--pages-legal--x)";
    assert.equal(rewriteText(text, maps), text);
  });
});

describe("retitle", () => {
  it("replaces the title literal and nothing else", () => {
    const text =
      "const meta = {\n  title: 'Pages/Legal',\n  component: LegalPage,\n};";
    const start = text.indexOf("'Pages");
    assert.equal(
      retitle(
        text,
        { start, end: start + "'Pages/Legal'".length },
        "Site/Carried Surfaces/Legal",
      ),
      "const meta = {\n  title: 'Site/Carried Surfaces/Legal',\n  component: LegalPage,\n};",
    );
  });
});

describe("rename", () => {
  it("retitles a story file and rewrites what cites its stories", async () => {
    const root = mkdtempSync(join(tmpdir(), "storybook-rename-"));
    const write = (path, text) => {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), text);
    };
    write(
      "apps/preview/src/pages/site/carried-surfaces/legal-page.stories.tsx",
      'const meta = { title: "Pages/Legal", tags: ["autodocs"] };\nexport default meta;\nexport const PrivacyPolicy = {};\n',
    );
    write(
      "docs/legal.md",
      '::story{id="pages-legal--privacy-policy"}\n[docs](?path=/docs/pages-legal--docs)\n',
    );
    execFileSync("git", ["init", "-q"], { cwd: root });
    execFileSync("git", ["add", "."], { cwd: root });

    const { ids } = await rename({
      root,
      mapping: readMapping(
        "# old\tnew\nPages/Legal\tSite/Carried Surfaces/Legal\n",
      ),
    });
    assert.deepEqual(Object.fromEntries(ids), {
      "pages-legal--docs": "site-carried-surfaces-legal--docs",
      "pages-legal--privacy-policy":
        "site-carried-surfaces-legal--privacy-policy",
    });
    assert.match(
      readFileSync(
        join(
          root,
          "apps/preview/src/pages/site/carried-surfaces/legal-page.stories.tsx",
        ),
        "utf8",
      ),
      /title: "Site\/Carried Surfaces\/Legal"/,
    );
    assert.equal(
      readFileSync(join(root, "docs/legal.md"), "utf8"),
      '::story{id="site-carried-surfaces-legal--privacy-policy"}\n[docs](?path=/docs/site-carried-surfaces-legal--docs)\n',
    );
    rmSync(root, { recursive: true, force: true });
  });
});
