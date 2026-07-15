import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the private personal digital garden", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]+lang="zh-Hant"/i);
  assert.match(html, /［公開顯示名稱］/);
  assert.match(html, /從物理、科技與系統出發/);
  assert.match(html, /長期核心興趣/);
  assert.match(html, /我如何思考/);
  assert.match(html, /我重視的生活/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|工作經驗|公司成就/i);
});
