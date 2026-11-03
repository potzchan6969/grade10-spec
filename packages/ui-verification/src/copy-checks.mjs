// What a reviewer is told about one translation, measured against the
// English it translates. Pure and dependency-free: the server runs it over
// every catalog value and the page runs the same module while someone types.

const HAN = /\p{Script=Han}/u;
const HANGUL = /\p{Script=Hangul}/u;
const LETTERS = /\p{L}.*\p{L}/su;
// Whether a message says anything in words once its arguments and tags are gone.
const hasWords = (text) =>
  LETTERS.test(text.replace(/\{[^{}]*\}|<\/?[\w-]+>/g, ""));

// Characters that exist only in one script. A character both scripts write
// (后, 台, 里, 系, 制…) is left out, so a hit is never a false alarm.
const SCRIPT_PAIRS =
  "们們这這个個为為时時发發会會过過还還对對买買卖賣价價单單货貨运運费費钱錢账賬号號网網页頁码碼认認证證设設选選择擇务務实實现現开開关關门門问問题題应應该該无無与與东東车車长長动動场場产產员員级級线線结結给給让讓请請说說读讀写寫视視览覽标標签簽记記录錄历歷输輸删刪竞競赢贏优優条條规規则則订訂额額资資讯訊邮郵际際处處帐帳户戶络絡机機种種类類显顯当當从從业業状狀态態达達进進项項细細节節购購软軟换換汇匯银銀币幣积積区區华華国國链鏈将將头頭图圖张張备備续續详詳确確错錯误誤败敗赛賽届屆间間钟鐘点點数數计計统統总總获獲胜勝负負经經营營验驗质質评評鉴鑒仓倉库庫递遞联聯载載隐隱协協议議权權责責声聲语語简簡体體铺鋪销銷档檔报報损損坏壞补補偿償电電话話锁鎖启啟闭閉么麼吗嗎难難虽雖并並尽盡";

const SIMPLIFIED_ONLY = new Set();
const TRADITIONAL_ONLY = new Set();
for (let i = 0; i < SCRIPT_PAIRS.length; i += 2) {
  SIMPLIFIED_ONLY.add(SCRIPT_PAIRS[i]);
  TRADITIONAL_ONLY.add(SCRIPT_PAIRS[i + 1]);
}

const BRITISH =
  /\b(?:(?:authori|organi|recogni|prioriti|finali|customi|minimi|maximi|categori|apologi|reali|utili|personali|initiali|summari|emphasi|speciali)s(?:e|ed|es|ing|ation)|colours?|favour\w*|behaviour\w*|honour\w*|centres?|catalogues?|cheques?|jewellery|enrol(?:s|ment)?|travell(?:ed|ing|er))\b/giu;

/**
 * Parses an ICU message far enough to name its arguments and rich-text tags,
 * and to say where its braces stop balancing.
 */
export function parseMessage(text) {
  const args = new Set();
  const tags = new Set();
  let i = 0;

  const fail = (reason) => {
    throw new Error(`${reason} at character ${i + 1}`);
  };
  const skipSpace = () => {
    while (/\s/.test(text[i] ?? "")) i++;
  };

  const readText = (nested, plural) => {
    while (i < text.length) {
      const c = text[i];
      if (c === "'") {
        const next = text[i + 1];
        if (next === "'") i += 2;
        else if (next === "{" || next === "}" || (plural && next === "#")) {
          const close = text.indexOf("'", i + 1);
          i = close === -1 ? text.length : close + 1;
        } else i++;
      } else if (c === "{") {
        i++;
        readArgument();
      } else if (c === "}") {
        if (nested) return;
        fail("Unmatched “}”");
      } else if (c === "<") {
        const tag = /^<\/?([A-Za-z][\w-]*)>/.exec(text.slice(i));
        if (tag) tags.add(tag[1]);
        i += tag ? tag[0].length : 1;
      } else i++;
    }
    if (nested) fail("Unclosed “{”");
  };

  const readArgument = () => {
    const head = /^\s*([A-Za-z_]\w*)\s*(?:,\s*(\w+)\s*)?/.exec(text.slice(i));
    if (!head) fail("Expected an argument name");
    i += head[0].length;
    args.add(head[1]);
    const type = head[2];
    if (i >= text.length) fail("Unclosed “{”");
    if (text[i] === "}") {
      i++;
      return;
    }
    if (text[i] !== ",") fail("Expected “,” or “}”");
    i++;
    if (type === "plural" || type === "selectordinal" || type === "select") {
      for (;;) {
        skipSpace();
        if (text[i] === "}") {
          i++;
          return;
        }
        const selector = /^(?:offset:\d+|=\d+|[\w-]+)/.exec(text.slice(i));
        if (!selector) fail("Expected a plural or select case");
        i += selector[0].length;
        if (selector[0].startsWith("offset:")) continue;
        skipSpace();
        if (text[i] !== "{") fail(`Expected “{” after “${selector[0]}”`);
        i++;
        readText(true, type !== "select");
        i++;
      }
    }
    const close = text.indexOf("}", i);
    if (close === -1) fail("Unclosed “{”");
    i = close + 1;
  };

  try {
    readText(false, false);
    return { args, tags, error: null };
  } catch (error) {
    return { args, tags, error: error.message };
  }
}

const difference = (a, b) => [...a].filter((item) => !b.has(item));

const listed = (items, wrap) => items.map((item) => wrap(item)).join(", ");

/**
 * Every finding for one value. `reference` is the English the value
 * translates, or undefined when nothing English answers the key.
 * Severity: "error" breaks rendering or meaning, "warn" needs a reader's
 * judgment, "info" is worth a glance.
 */
export function checkValue({ locale, value, reference }) {
  const issues = [];
  const add = (severity, kind, message) =>
    issues.push({ severity, kind, message });

  if (value === undefined) {
    add("error", "missing", "Missing — this language falls back to another");
    return issues;
  }

  const parsed = parseMessage(value);
  if (parsed.error) add("error", "syntax", parsed.error);

  if (reference !== undefined && locale !== "en") {
    const source = parseMessage(reference);
    const lost = difference(source.args, parsed.args);
    const extra = difference(parsed.args, source.args);
    if (lost.length)
      add("error", "placeholder", `Drops ${listed(lost, (a) => `{${a}}`)}`);
    if (extra.length)
      add(
        "error",
        "placeholder",
        `Adds ${listed(extra, (a) => `{${a}}`)}, which English does not pass`,
      );
    const lostTags = difference(source.tags, parsed.tags);
    const extraTags = difference(parsed.tags, source.tags);
    if (lostTags.length || extraTags.length)
      add(
        "error",
        "tag",
        `Tags differ from English: ${listed([...lostTags, ...extraTags], (t) => `<${t}>`)}`,
      );
    if (value === reference && hasWords(reference))
      add("info", "untranslated", "Same as English");
  }

  if (value.trim() !== value)
    add("warn", "whitespace", "Leading or trailing space");
  if (/ {2}/.test(value)) add("warn", "whitespace", "Double space");
  if (value === "" && reference) add("warn", "empty", "Empty");

  if (locale === "en") {
    if (/['"]/.test(value))
      add("warn", "quotes", "Straight quote — use ’ “ ” in English copy");
    if (value.includes("...")) add("warn", "ellipsis", "Three dots — use …");
    const british = value.match(BRITISH);
    if (british)
      add(
        "warn",
        "spelling",
        `British spelling: ${[...new Set(british)].join(", ")}`,
      );
  }

  const translated = hasWords(value) && reference && value !== reference;
  if (locale.startsWith("zh") && translated && !HAN.test(value))
    add("warn", "script", "No Chinese characters");
  if (locale === "ko" && translated && !HANGUL.test(value))
    add("warn", "script", "No Hangul");

  const wrongScript =
    locale === "zh-Hant"
      ? [...value].filter((c) => SIMPLIFIED_ONLY.has(c))
      : locale === "zh-Hans"
        ? [...value].filter((c) => TRADITIONAL_ONLY.has(c))
        : [];
  if (wrongScript.length)
    add(
      "warn",
      "variant",
      `${locale === "zh-Hant" ? "Simplified" : "Traditional"} characters: ${[...new Set(wrongScript)].join(" ")}`,
    );

  return issues;
}

/** An edit with an error cannot be approved; a warning is the approver's call. */
export const blocksApproval = (issues) =>
  issues.some((issue) => issue.severity === "error");
