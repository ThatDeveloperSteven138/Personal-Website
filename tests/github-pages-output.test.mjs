import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("exports a GitHub Pages-ready static site", async () => {
  const [html, interestsHtml, thinkingHtml, valuesHtml, extensionsHtml, englishHtml, englishExtensionsHtml] = await Promise.all([
    readFile(new URL("../out/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/interests/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/thinking/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/values/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/extensions/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/en/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/en/extensions/index.html", import.meta.url), "utf8"),
  ]);

  assert.match(html, /<html[^>]+lang="zh-Hant"/i);
  assert.match(html, /從物理、科技與系統出發/);
  assert.match(html, /\/personal-website\/_next\//);
  assert.match(html, /href="\/personal-website\/interests\/"/);
  assert.match(html, /href="\/personal-website\/en\/"/);
  assert.doesNotMatch(html, /property="og:image"/);
  assert.doesNotMatch(html, /http:\/\/localhost:3000/);

  assert.match(interestsHtml, /長期核心興趣/);
  assert.match(thinkingHtml, /我如何思考/);
  assert.match(valuesHtml, /我重視的生活/);
  assert.match(extensionsHtml, /我製作的擴充功能/);
  assert.equal((extensionsHtml.match(/class="extension-card glass"/g) ?? []).length, 10);
  assert.equal((extensionsHtml.match(/aria-expanded="false" aria-controls="extension-details-\d+"/g) ?? []).length, 10);
  assert.equal((extensionsHtml.match(/data-extension-panel="[01]"/g) ?? []).length, 2);
  assert.match(extensionsHtml, /\.\.\/extension-icons\/better-instagram\.png/);

  assert.match(englishHtml, /<main[^>]+lang="en"/i);
  assert.match(englishHtml, /Starting with physics, technology, and systems/);
  assert.match(englishHtml, /href="\/personal-website\/en\/interests\/"/);
  assert.match(englishHtml, /href="\/personal-website\/"/);
  assert.match(englishExtensionsHtml, /Extensions I have built/);
  assert.match(englishExtensionsHtml, /\.\.\/\.\.\/extension-icons\/better-instagram\.png/);

  await Promise.all([
    access(new URL("../out/favicon.svg", import.meta.url)),
    access(new URL("../out/extension-icons/website-auto-refresh.png", import.meta.url)),
    access(new URL("../out/extension-icons/youtube-search-history-hider.png", import.meta.url)),
  ]);
});
