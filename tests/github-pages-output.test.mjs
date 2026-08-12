import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const [extensionCatalog, webStoreSnapshot] = await Promise.all([
  readFile(new URL("../data/extensions.json", import.meta.url), "utf8").then(JSON.parse),
  readFile(new URL("../data/chrome-web-store.json", import.meta.url), "utf8").then(JSON.parse),
]);
const webStoreItemsById = new Map(webStoreSnapshot.items.map((item) => [item.id, item]));
const expectedExtensionOrder = extensionCatalog
  .map((extension, catalogIndex) => ({
    ...extension,
    catalogIndex,
    userCount: webStoreItemsById.get(extension.id)?.userCount ?? -1,
  }))
  .sort((left, right) => right.userCount - left.userCount || left.catalogIndex - right.catalogIndex)
  .map((extension) => extension.name);

function renderedExtensionNames(html) {
  return [...html.matchAll(/<span class="extension-name" id="extension-card-title-\d+">([^<]+)<\/span>/g)]
    .map((match) => match[1]);
}

test("exports a GitHub Pages-ready static site", async () => {
  const [html, interestsHtml, thinkingHtml, valuesHtml, extensionsHtml, chineseHtml, chineseExtensionsHtml, englishAliasHtml] = await Promise.all([
    readFile(new URL("../out/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/interests/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/thinking/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/values/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/extensions/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/zh/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/zh/extensions/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/en/index.html", import.meta.url), "utf8"),
  ]);

  assert.match(html, /<html[^>]+lang="en"/i);
  assert.match(html, /<link rel="icon" href="https:\/\/test-user\.github\.io\/personal-website\/favicon-rounded\.png"[^>]+type="image\/png"[^>]+sizes="256x256"/);
  assert.doesNotMatch(html, /rel="(?:shortcut )?icon"[^>]+favicon\.svg/);
  assert.match(html, /<h1 id="about-title">About Me<\/h1>/);
  assert.match(html, /university student from Hong Kong/);
  assert.doesNotMatch(html, /22-year-old/);
  assert.match(html, /This website is where I share my browser extensions/);
  assert.match(html, /<img[^>]+class="brand-avatar"[^>]+src="brand-avatar\.png"/);
  assert.match(html, /\/personal-website\/_next\//);
  assert.match(html, /href="\/personal-website\/interests\/"/);
  assert.match(html, /href="\/personal-website\/zh\/"/);
  assert.doesNotMatch(html, /property="og:image"/);
  assert.doesNotMatch(html, /http:\/\/localhost:3000/);

  assert.match(interestsHtml, /Hobbies &amp; interests/);
  assert.match(interestsHtml, /Science, space &amp; psychology/);
  assert.match(interestsHtml, /Aquatic worlds &amp; collecting/);
  assert.equal((interestsHtml.match(/class="interest-card glass"/g) ?? []).length, 8);
  assert.match(thinkingHtml, /How I think/);
  assert.match(thinkingHtml, /Start with first principles/);
  assert.match(thinkingHtml, /Explain to understand/);
  assert.equal((thinkingHtml.match(/<li>/g) ?? []).length, 5);
  assert.match(valuesHtml, /The life I value/);
  assert.match(extensionsHtml, /Extensions I have built/);
  assert.equal((extensionsHtml.match(/class="extension-card glass"/g) ?? []).length, 10);
  assert.equal((extensionsHtml.match(/aria-expanded="false" aria-controls="extension-details-\d+"/g) ?? []).length, 10);
  assert.equal((extensionsHtml.match(/data-extension-panel="[01]"/g) ?? []).length, 2);
  assert.deepEqual(renderedExtensionNames(extensionsHtml), expectedExtensionOrder);
  assert.equal((extensionsHtml.match(/class="extension-users"/g) ?? []).length, extensionCatalog.length);
  assert.match(extensionsHtml, /English descriptions sync with the store every six hours/);
  assert.match(extensionsHtml, /Better Instagram: Stop Scrolling helps you take control/);
  assert.match(extensionsHtml, /<h4>Privacy &amp; data<\/h4>/);
  assert.match(extensionsHtml, /\.\.\/extension-icons\/better-instagram\.png/);

  assert.match(chineseHtml, /<main[^>]+lang="zh-Hant"/i);
  assert.match(chineseHtml, /<h1 id="about-title">關於我<\/h1>/);
  assert.match(chineseHtml, /來自香港的大學生/);
  assert.doesNotMatch(chineseHtml, /22 歲|22歲/);
  assert.match(chineseHtml, /<img[^>]+class="brand-avatar"[^>]+src="\.\.\/brand-avatar\.png"/);
  assert.match(chineseHtml, /href="\/personal-website\/zh\/interests\/"/);
  assert.match(chineseHtml, /href="\/personal-website\/"/);
  assert.match(chineseExtensionsHtml, /我製作的擴充功能/);
  assert.deepEqual(renderedExtensionNames(chineseExtensionsHtml), expectedExtensionOrder);
  assert.match(chineseExtensionsHtml, /英文簡介會每六小時與商店頁面同步/);
  assert.match(chineseExtensionsHtml, /\.\.\/\.\.\/extension-icons\/better-instagram\.png/);

  assert.match(englishAliasHtml, /<h1 id="about-title">About Me<\/h1>/);
  assert.match(englishAliasHtml, /href="\/personal-website\/interests\/"/);

  await Promise.all([
    access(new URL("../out/favicon.svg", import.meta.url)),
    access(new URL("../out/favicon-rounded.png", import.meta.url)),
    access(new URL("../out/brand-avatar.png", import.meta.url)),
    access(new URL("../out/extension-icons/website-auto-refresh.png", import.meta.url)),
    access(new URL("../out/extension-icons/youtube-search-history-hider.png", import.meta.url)),
  ]);
});
