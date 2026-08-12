import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  heartbeatDue,
  normalizeOverviewDescription,
  parseUserCountLabel,
  snapshotDataChanged,
} from "../scripts/sync-chrome-web-store.mjs";

const [catalog, snapshot] = await Promise.all([
  readFile(new URL("../data/extensions.json", import.meta.url), "utf8").then(JSON.parse),
  readFile(new URL("../data/chrome-web-store.json", import.meta.url), "utf8").then(JSON.parse),
]);

test("parses the public Chrome Web Store user-count formats used for sorting", () => {
  assert.deepEqual(parseUserCountLabel("199 users"), { userCount: 199, userCountText: "199 users" });
  assert.deepEqual(parseUserCountLabel("1,234 users"), { userCount: 1_234, userCountText: "1,234 users" });
  assert.deepEqual(parseUserCountLabel("1.5K+ users"), { userCount: 1_500, userCountText: "1.5K+ users" });
  assert.throws(() => parseUserCountLabel("many users"), /Unsupported Chrome Web Store user count/);
});

test("preserves the complete Overview structure while normalizing incidental spacing", () => {
  assert.equal(
    normalizeOverviewDescription(" Short summary.\r\n\r\n  Key features: \r\n  First feature  \r\n  Second feature "),
    "Short summary.\n\nKey features:\nFirst feature\nSecond feature",
  );
});

test("keeps the static extension catalog and generated snapshot complete and unique", () => {
  assert.equal(catalog.length, 10);
  assert.equal(new Set(catalog.map((item) => item.id)).size, catalog.length);
  assert.equal(new Set(catalog.map((item) => item.storeUrl)).size, catalog.length);
  assert.equal(snapshot.schemaVersion, 1);
  assert.match(snapshot.checkedAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.deepEqual(
    snapshot.items.map((item) => item.id).sort(),
    catalog.map((item) => item.id).sort(),
  );

  for (const item of snapshot.items) {
    assert.ok(Number.isSafeInteger(item.userCount) && item.userCount >= 0);
    assert.match(item.userCountText, /users?$/i);
    assert.ok(item.englishDescription.length >= 10 && item.englishDescription.length <= 15_000);
  }
  assert.ok(snapshot.items.some((item) => item.englishDescription.length > 500));
  assert.ok(snapshot.items.some((item) => item.englishDescription.includes("\n\n")));
});

test("detects content changes without treating check timestamps as new store data", () => {
  const laterSnapshot = structuredClone(snapshot);
  laterSnapshot.checkedAt = "2099-01-01T00:00:00.000Z";
  assert.equal(snapshotDataChanged(snapshot, laterSnapshot), false);

  laterSnapshot.items[0].userCount += 1;
  assert.equal(snapshotDataChanged(snapshot, laterSnapshot), true);
});

test("requests a low-noise maintenance commit at most every 30 inactive days", () => {
  const now = new Date("2026-08-12T00:00:00.000Z");
  assert.equal(heartbeatDue("2026-08-01T00:00:00.000Z", now), false);
  assert.equal(heartbeatDue("2026-07-01T00:00:00.000Z", now), true);
  assert.equal(heartbeatDue(null, now), true);
});
