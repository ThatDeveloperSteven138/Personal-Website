import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const expectedExtensionOrder = [
  "Better Instagram: Stop Scrolling",
  "YouTube Search History Hider",
  "ChatGPT Message Queue",
  "Browser Statistic",
  "Google Sign-out Button Blocker",
  "Better Youtube: Reduce Distraction",
  "Video Watch Time Statistic Pro",
  "Video Watched Time Companion",
  "Website Auto Refresh",
  "QuoteSpark",
];

function renderedExtensionNames(html) {
  return [...html.matchAll(/<span class="extension-name" id="extension-card-title-\d+">([^<]+)<\/span>/g)]
    .map((match) => match[1]);
}

test("language menu spans the complete header width", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /\.language-menu \{ position: static;/);
  assert.match(css, /\.language-menu::after \{[^}]*width: 100%;[^}]*left: 0;/s);
  assert.match(css, /\.language-menu-panel \{ width: 100%;[^}]*left: 0; right: 0;/s);
});

test("About Me uses one heading, an equally sized star, and blank lines between paragraphs", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /\.about-heading \{ display: flex; align-items: center;/);
  assert.match(css, /\.about-star, \.about-hero h1 \{ font-size: clamp\(3rem, 5vw, 5rem\); \}/);
  assert.match(css, /\.about-body \{ display: block; max-width: 1040px; \}/);
  assert.match(css, /\.about-body p \{[^}]*color: var\(--muted\);/);
  assert.doesNotMatch(css, /\.about-body (?:\.about-intro|p:last-child) \{[^}]*color:/);
  assert.match(css, /\.about-body p \+ p \{ margin-top: 1\.78em; \}/);
});

test("language menu stays open throughout the header and dropdown hover region", async () => {
  const source = await readFile(new URL("../app/site-page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(source, /LANGUAGE_MENU_CLOSE_DELAY_MS|languageMenuCloseTimerRef|scheduleLanguageMenuClose/);
  assert.match(source, /<header[\s\S]*?className="site-header glass"[\s\S]*?onPointerLeave=\{\(event\) => \{[\s\S]*?setLanguageMenuOpen\(false\);[\s\S]*?\}\}[\s\S]*?>/);
  assert.match(source, /className="language-menu"[\s\S]*?onPointerEnter=\{\(event\) => \{[\s\S]*?setLanguageMenuOpen\(true\);[\s\S]*?\}\}/);
});

test("extension reveal measures its final layout and scrolls in the same animation", async () => {
  const [source, css] = await Promise.all([
    readFile(new URL("../app/site-page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(source, /setTimeout|scrollIntoView/);
  assert.match(source, /useLayoutEffect\(\(\) => \{[\s\S]*?cloneNode\(true\)[\s\S]*?animateWindowScroll\(targetY, duration\)/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.extension-grid \{[^}]*overflow-anchor: none;/);
  assert.match(css, /\.extension-wide-reveal \{ --extension-reveal-duration: 420ms;/);
  assert.match(css, /\.extension-inline-reveal \{ --extension-reveal-duration: 320ms;/);
});

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders English as the default language", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]+lang="en"/i);
  assert.match(html, /<main[^>]+lang="en"/i);
  assert.match(html, /That Developer Steven/);
  const iconLink = html.match(/<link rel="icon"[^>]*>/)?.[0] ?? "";
  assert.match(iconLink, /href="http:\/\/localhost:3000\/favicon-rounded\.png"/);
  assert.match(iconLink, /type="image\/png"/);
  assert.match(iconLink, /sizes="256x256"/);
  assert.match(html, /<link rel="shortcut icon" href="http:\/\/localhost:3000\/favicon-rounded\.png"/);
  assert.doesNotMatch(html, /rel="(?:shortcut )?icon"[^>]+favicon\.svg/);
  assert.match(html, /<img[^>]+class="brand-avatar"[^>]+src="brand-avatar\.png"/);
  assert.match(html, /<div class="about-heading"><p class="about-star" aria-hidden="true">✦<\/p><h1 id="about-title">About Me<\/h1><\/div>/);
  assert.doesNotMatch(html, /<p class="eyebrow"[^>]*>[^<]*<span[^>]*>✦<\/span>\s*ABOUT ME/);
  assert.match(html, /university student from Hong Kong/);
  assert.doesNotMatch(html, /22-year-old/);
  assert.match(html, /go to the gym regularly/);
  assert.match(html, /heavier use of short-form video platforms/);
  assert.match(html, /personal struggle inspired me to create browser extensions/);
  assert.match(html, /originally created these extensions to help myself/);
  assert.match(html, /This website is where I share my browser extensions/);
  assert.doesNotMatch(html, /Starting with physics, technology, and systems|system-portrait|hero-actions/);
  assert.match(html, /href="\/" aria-current="page">About me<\/a>/);
  assert.match(html, /href="\/interests"/);
  assert.match(html, /href="\/thinking"/);
  assert.match(html, /href="\/values"/);
  assert.match(html, /href="\/extensions"/);
  assert.doesNotMatch(html, /id="interests"|id="thinking"|id="values"/);
  assert.match(html, /<button[^>]+aria-label="Choose site language"[^>]+aria-expanded="false"/);
  assert.match(html, /id="language-menu-panel"/);
  assert.match(html, /Choose a language/);
  assert.match(html, /🌐/);
  assert.match(html, /href="\/zh"/);
  assert.match(html, /繁體中文/);
  assert.match(html, /English/);
  assert.doesNotMatch(html, /從物理、科技與系統出發/);
  assert.doesNotMatch(html, /aria-pressed=/);
  assert.doesNotMatch(html, /<select\b/i);
  assert.doesNotMatch(html, /href="#about"|id="about"|ABOUT THIS SPACE|A WAY OF SEEING/i);
  assert.doesNotMatch(html, /一個整理長期好奇心|還有沒有其他合理的解釋|A personal digital garden for|Could there be another reasonable explanation/i);
  assert.doesNotMatch(html, /class="principles"|class="values-orbit"|證據先於信心|Evidence before confidence/i);
  assert.doesNotMatch(html, /我認為理想生活不只來自成就|I believe a good life is shaped not only by achievement/i);
  assert.doesNotMatch(html, /［公開顯示名稱］|\[Public Display Name\]|codex-preview|react-loading-skeleton|工作經驗|公司成就/i);
});

test("server-renders Traditional Chinese as independent, linkable pages", async () => {
  const [homeResponse, interestsResponse, thinkingResponse, valuesResponse, extensionsResponse] = await Promise.all([
    render("/zh"),
    render("/zh/interests"),
    render("/zh/thinking"),
    render("/zh/values"),
    render("/zh/extensions"),
  ]);

  for (const response of [homeResponse, interestsResponse, thinkingResponse, valuesResponse, extensionsResponse]) {
    assert.equal(response.status, 200);
  }

  const [homeHtml, interestsHtml, thinkingHtml, valuesHtml, extensionsHtml] = await Promise.all([
    homeResponse.text(),
    interestsResponse.text(),
    thinkingResponse.text(),
    valuesResponse.text(),
    extensionsResponse.text(),
  ]);

  assert.match(homeHtml, /<main[^>]+lang="zh-Hant"/i);
  assert.match(homeHtml, /<h1 id="about-title">關於我<\/h1>/);
  assert.match(homeHtml, /來自香港的大學生/);
  assert.doesNotMatch(homeHtml, /22 歲|22歲/);
  assert.match(homeHtml, /我定期健身/);
  assert.match(homeHtml, /較頻繁使用短影音平台/);
  assert.match(homeHtml, /促使我製作瀏覽器擴充功能/);
  assert.match(homeHtml, /這個網站是我分享瀏覽器擴充功能/);
  assert.doesNotMatch(homeHtml, /從物理、科技與系統出發|system-portrait|hero-actions/);
  assert.match(homeHtml, /href="\/zh" aria-current="page">關於我<\/a>/);
  assert.match(homeHtml, /<img[^>]+class="brand-avatar"[^>]+src="\.\.\/brand-avatar\.png"/);
  assert.match(homeHtml, /href="\/zh\/interests"/);
  assert.match(homeHtml, /href="\/"/);
  assert.doesNotMatch(homeHtml, /Starting with physics, technology, and systems/);

  assert.match(interestsHtml, /href="\/zh">關於我<\/a>/);
  assert.match(interestsHtml, /href="\/zh\/interests" aria-current="page"/);
  assert.doesNotMatch(interestsHtml, /長期核心興趣|學習不是收集答案|值得長期追問的問題|class="interest-card/);
  assert.match(thinkingHtml, /我如何思考/);
  assert.match(thinkingHtml, /href="\/zh\/thinking" aria-current="page"/);
  assert.match(valuesHtml, /我重視的生活/);
  assert.match(valuesHtml, /href="\/zh\/values" aria-current="page"/);
  assert.match(extensionsHtml, /我製作的擴充功能/);
  assert.match(extensionsHtml, /href="\/zh\/extensions" aria-current="page"/);
  assert.deepEqual(renderedExtensionNames(extensionsHtml), expectedExtensionOrder);
  assert.match(extensionsHtml, /\.\.\/\.\.\/extension-icons\/website-auto-refresh\.png/);
});

test("server-renders each default English navigation destination as a separate page", async () => {
  const [interestsResponse, thinkingResponse, valuesResponse, extensionsResponse] = await Promise.all([
    render("/interests"),
    render("/thinking"),
    render("/values"),
    render("/extensions"),
  ]);

  for (const response of [interestsResponse, thinkingResponse, valuesResponse, extensionsResponse]) {
    assert.equal(response.status, 200);
  }

  const [interestsHtml, thinkingHtml, valuesHtml, extensionsHtml] = await Promise.all([
    interestsResponse.text(),
    thinkingResponse.text(),
    valuesResponse.text(),
    extensionsResponse.text(),
  ]);

  assert.match(interestsHtml, /href="\/">About me<\/a>/);
  assert.match(interestsHtml, /href="\/interests" aria-current="page"/);
  assert.doesNotMatch(interestsHtml, /Core long-term interests|Learning is not collecting answers|Questions worth returning to|class="interest-card/);

  assert.match(thinkingHtml, /id="thinking"/);
  assert.match(thinkingHtml, /How I think/);
  assert.match(thinkingHtml, /href="\/thinking" aria-current="page"/);
  assert.doesNotMatch(thinkingHtml, /id="interests"|id="values"/);

  assert.match(valuesHtml, /id="values"/);
  assert.match(valuesHtml, /The life I value/);
  assert.match(valuesHtml, /href="\/values" aria-current="page"/);
  assert.doesNotMatch(valuesHtml, /id="interests"|id="thinking"/);

  assert.match(extensionsHtml, /id="extensions"/);
  assert.match(extensionsHtml, /Extensions I have built/);
  assert.match(extensionsHtml, /<img[^>]+class="brand-avatar"[^>]+src="\.\.\/brand-avatar\.png"/);
  assert.match(extensionsHtml, /href="\/extensions" aria-current="page"/);
  assert.equal((extensionsHtml.match(/class="extension-card glass"/g) ?? []).length, 10);
  assert.equal((extensionsHtml.match(/aria-expanded="false" aria-controls="extension-details-\d+"/g) ?? []).length, 10);
  assert.equal((extensionsHtml.match(/data-extension-panel="[01]"/g) ?? []).length, 2);
  assert.equal((extensionsHtml.match(/class="extension-wide-reveal glass"/g) ?? []).length, 2);
  assert.deepEqual(renderedExtensionNames(extensionsHtml), expectedExtensionOrder);
  assert.match(extensionsHtml, /\.\.\/extension-icons\/website-auto-refresh\.png/);
  assert.match(extensionsHtml, /chromewebstore\.google\.com\/detail\/quotespark\/nmnfklkcpjkglpjekmjocbagneignlfi/);
  assert.doesNotMatch(extensionsHtml, /id="interests"|id="thinking"|id="values"/);
});

test("keeps the previous /en URLs as English compatibility pages", async () => {
  const [homeResponse, extensionsResponse] = await Promise.all([
    render("/en"),
    render("/en/extensions"),
  ]);

  assert.equal(homeResponse.status, 200);
  assert.equal(extensionsResponse.status, 200);

  const [homeHtml, extensionsHtml] = await Promise.all([
    homeResponse.text(),
    extensionsResponse.text(),
  ]);

  assert.match(homeHtml, /<h1 id="about-title">About Me<\/h1>/);
  assert.match(homeHtml, /This website is where I share my browser extensions/);
  assert.match(homeHtml, /<img[^>]+class="brand-avatar"[^>]+src="\.\.\/brand-avatar\.png"/);
  assert.match(homeHtml, /href="\/interests"/);
  assert.match(extensionsHtml, /\.\.\/\.\.\/extension-icons\/website-auto-refresh\.png/);
});
