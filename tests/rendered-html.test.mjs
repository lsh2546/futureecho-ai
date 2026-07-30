import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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

test("server-renders the FutureEcho product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /FutureEcho AI/);
  assert.match(html, /See the Future\. Change the Outcome\./);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("keeps the defining product and trust layers in source", async () => {
  const [page, layout, css, readme] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);
  assert.match(page, /AI FUTURES EXPLORER/);
  assert.match(page, /FUTURE MEMORY/);
  assert.match(page, /DECISION CONFIDENCE/);
  assert.match(page, /DATA SOURCES USED/);
  assert.match(page, /MODEL ASSUMPTIONS/);
  assert.match(page, /UNCERTAINTY/);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /og\.png/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /focus-visible/);
  assert.match(readme, /decision support, not certainty/i);
});
