import { appendFile, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const catalogUrl = new URL("../data/extensions.json", import.meta.url);
const snapshotUrl = new URL("../data/chrome-web-store.json", import.meta.url);
const heartbeatIntervalMs = 30 * 24 * 60 * 60 * 1000;
const maximumAttempts = 3;

function compactWhitespace(value) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

export function normalizeOverviewDescription(value) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[\t ]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n+(?:See more|Show less)\s*$/i, "")
    .trim();
}

export function parseUserCountLabel(label) {
  const normalizedLabel = compactWhitespace(label);
  const match = normalizedLabel.match(/^([\d,.]+(?:\.\d+)?)\s*([KMB])?(\+)?\s+users?$/i);
  if (!match) throw new Error(`Unsupported Chrome Web Store user count: ${label}`);

  const numericPart = Number.parseFloat(match[1].replace(/,/g, ""));
  const multiplier = { K: 1_000, M: 1_000_000, B: 1_000_000_000 }[match[2]?.toUpperCase()] ?? 1;
  const userCount = Math.round(numericPart * multiplier);
  if (!Number.isSafeInteger(userCount) || userCount < 0) {
    throw new Error(`Invalid Chrome Web Store user count: ${label}`);
  }

  return {
    userCount,
    userCountText: normalizedLabel,
  };
}

function comparableItems(items) {
  return items
    .map(({ id, userCount, userCountText, englishDescription }) => ({
      id,
      userCount,
      userCountText,
      englishDescription,
    }))
    .sort((left, right) => left.id.localeCompare(right.id));
}

export function snapshotDataChanged(previousSnapshot, nextSnapshot) {
  return JSON.stringify(comparableItems(previousSnapshot.items ?? []))
    !== JSON.stringify(comparableItems(nextSnapshot.items ?? []));
}

export function heartbeatDue(previousCheckedAt, now = new Date()) {
  if (!previousCheckedAt) return true;
  const previousTimestamp = Date.parse(previousCheckedAt);
  return !Number.isFinite(previousTimestamp) || now.getTime() - previousTimestamp >= heartbeatIntervalMs;
}

async function extractStoreData(page, extension) {
  const storeUrl = new URL(extension.storeUrl);
  storeUrl.searchParams.set("hl", "en");

  await page.goto(storeUrl.href, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.getByRole("heading", { level: 1, name: extension.name, exact: true })
    .waitFor({ state: "visible", timeout: 30_000 });
  await page.waitForFunction(
    () => /([\d,.]+(?:\.\d+)?\s*[KMB]?\+?)\s+users?\b/i.test(document.querySelector("main")?.innerText ?? ""),
    undefined,
    { timeout: 30_000 },
  );

  const extracted = await page.evaluate(() => {
    const main = document.querySelector("main");
    const mainText = main?.innerText?.replace(/\u00a0/g, " ") ?? "";
    const userCountText = mainText.match(/([\d,.]+(?:\.\d+)?\s*[KMB]?\+?)\s+users?\b/i)?.[0] ?? null;
    const overviewHeading = [...document.querySelectorAll("h2")].find(
      (heading) => heading.textContent?.trim().toLowerCase() === "overview",
    );
    const overviewContent = overviewHeading?.parentElement?.nextElementSibling;
    const englishDescription = overviewContent?.innerText?.trim() ?? null;

    return {
      pageTitle: document.querySelector("h1")?.textContent?.trim() ?? null,
      userCountText,
      englishDescription,
    };
  });

  if (!extracted.userCountText) throw new Error("The public user count was not found");
  if (!extracted.englishDescription || extracted.englishDescription.length < 10 || extracted.englishDescription.length > 15_000) {
    throw new Error("The English overview description was missing or outside the expected length");
  }
  if (extracted.pageTitle !== extension.name) {
    throw new Error(`Unexpected store title: ${extracted.pageTitle ?? "missing"}`);
  }

  return {
    id: extension.id,
    ...parseUserCountLabel(extracted.userCountText),
    englishDescription: normalizeOverviewDescription(extracted.englishDescription),
  };
}

async function extractWithRetries(browser, extension) {
  let lastError;
  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    const page = await browser.newPage({ locale: "en-US" });
    try {
      const result = await extractStoreData(page, extension);
      console.log(`${extension.name}: ${result.userCountText}`);
      return result;
    } catch (error) {
      lastError = error;
      console.warn(`${extension.name}: attempt ${attempt} failed (${error.message})`);
      if (attempt < maximumAttempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1_500));
      }
    } finally {
      await page.close();
    }
  }

  throw new Error(`${extension.name}: ${lastError?.message ?? "unknown extraction error"}`);
}

async function writeGitHubOutputs(outputs) {
  if (!process.env.GITHUB_OUTPUT) return;
  const lines = Object.entries(outputs).map(([key, value]) => `${key}=${value}\n`).join("");
  await appendFile(process.env.GITHUB_OUTPUT, lines, "utf8");
}

export async function syncChromeWebStore() {
  const [{ chromium }, catalog, previousSnapshot] = await Promise.all([
    import("playwright"),
    readFile(catalogUrl, "utf8").then(JSON.parse),
    readFile(snapshotUrl, "utf8").then(JSON.parse),
  ]);

  const browser = await chromium.launch({ headless: true });
  const checkedAt = new Date();
  try {
    const items = [];
    for (const extension of catalog) {
      items.push(await extractWithRetries(browser, extension));
      await new Promise((resolve) => setTimeout(resolve, 750));
    }

    const nextSnapshot = {
      schemaVersion: 1,
      checkedAt: checkedAt.toISOString(),
      items,
    };
    const dataChanged = snapshotDataChanged(previousSnapshot, nextSnapshot);
    const isHeartbeatDue = heartbeatDue(previousSnapshot.checkedAt, checkedAt);
    const shouldCommit = dataChanged || isHeartbeatDue;

    await writeFile(snapshotUrl, `${JSON.stringify(nextSnapshot, null, 2)}\n`, "utf8");
    await writeGitHubOutputs({
      data_changed: dataChanged,
      heartbeat_due: isHeartbeatDue,
      should_commit: shouldCommit,
    });
    console.log(`Snapshot written to ${fileURLToPath(snapshotUrl).replace(`${projectRoot}\\`, "")}`);
    console.log(`Data changed: ${dataChanged}; heartbeat due: ${isHeartbeatDue}`);
  } finally {
    await browser.close();
  }
}

const invokedDirectly = process.argv[1]
  && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (invokedDirectly) {
  syncChromeWebStore().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
