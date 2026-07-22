import assert from "node:assert/strict";
import test from "node:test";

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
  assert.match(html, /<img[^>]+class="brand-avatar"[^>]+src="brand-avatar\.png"/);
  assert.match(html, /Starting with physics, technology, and systems/);
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
  assert.match(homeHtml, /從物理、科技與系統出發/);
  assert.match(homeHtml, /<img[^>]+class="brand-avatar"[^>]+src="\.\.\/brand-avatar\.png"/);
  assert.match(homeHtml, /href="\/zh\/interests"/);
  assert.match(homeHtml, /href="\/"/);
  assert.doesNotMatch(homeHtml, /Starting with physics, technology, and systems/);

  assert.match(interestsHtml, /長期核心興趣/);
  assert.match(interestsHtml, /href="\/zh\/interests" aria-current="page"/);
  assert.match(thinkingHtml, /我如何思考/);
  assert.match(thinkingHtml, /href="\/zh\/thinking" aria-current="page"/);
  assert.match(valuesHtml, /我重視的生活/);
  assert.match(valuesHtml, /href="\/zh\/values" aria-current="page"/);
  assert.match(extensionsHtml, /我製作的擴充功能/);
  assert.match(extensionsHtml, /href="\/zh\/extensions" aria-current="page"/);
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

  assert.match(interestsHtml, /id="interests"/);
  assert.match(interestsHtml, /Core long-term interests/);
  assert.match(interestsHtml, /Learning is not collecting answers/);
  assert.match(interestsHtml, /Questions worth returning to/);
  assert.match(interestsHtml, /href="\/interests" aria-current="page"/);

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

  assert.match(homeHtml, /Starting with physics, technology, and systems/);
  assert.match(homeHtml, /<img[^>]+class="brand-avatar"[^>]+src="\.\.\/brand-avatar\.png"/);
  assert.match(homeHtml, /href="\/interests"/);
  assert.match(extensionsHtml, /\.\.\/\.\.\/extension-icons\/website-auto-refresh\.png/);
});
