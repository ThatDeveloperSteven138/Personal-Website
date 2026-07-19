import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("exports a GitHub Pages-ready static site", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

  assert.match(html, /<html[^>]+lang="zh-Hant"/i);
  assert.match(html, /從物理、科技與系統出發/);
  assert.match(html, /\/personal-website\/_next\//);
  assert.match(html, /https:\/\/test-user\.github\.io\/personal-website\/og\.png/);
  assert.doesNotMatch(html, /http:\/\/localhost:3000/);

  await Promise.all([
    access(new URL("../out/og.png", import.meta.url)),
    access(new URL("../out/favicon.svg", import.meta.url)),
  ]);
});
