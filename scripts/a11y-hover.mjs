import puppeteer from "puppeteer";

const routes = [
  "/configurator",
  "/configurator/amr",
  "/configurator/maps",
  "/configurator/devices",
  "/supervisor",
  "/supervisor/live",
  "/supervisor/staging",
  "/supervisor/workflow/new",
  "/requester/history",
  "/requester/book",
  "/requester/book/material",
  "/requester/staging",
];
const baseUrl = process.env.A11Y_BASE_URL ?? "http://127.0.0.1:5173";
const minContrast = 4.5;

function parseRgb(value) {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const [r, g, b, a = "1"] = match[1].split(",").map((part) => part.trim());
  return { r: Number(r), g: Number(g), b: Number(b), a: Number(a) };
}

function channel(value) {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(color) {
  return (
    0.2126 * channel(color.r) +
    0.7152 * channel(color.g) +
    0.0722 * channel(color.b)
  );
}

function contrast(foreground, background) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();
const failures = [];

for (const route of routes) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle0" });
  const controls = await page.$$("button, a, [role='button']");

  for (const control of controls) {
    const box = await control.boundingBox();
    const label = await control.evaluate((element) =>
      element.textContent?.replace(/\s+/g, " ").trim(),
    );

    if (!box || !label) continue;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise((resolve) => setTimeout(resolve, 60));

    const samples = await control.evaluate((element) => {
      function backgroundFor(node) {
        let current = node;
        while (current) {
          const color = getComputedStyle(current).backgroundColor;
          if (!color.endsWith(", 0)") && color !== "transparent") return color;
          current = current.parentElement;
        }
        return "rgb(255, 255, 255)";
      }

      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const result = [];
      while (walker.nextNode()) {
        const text = walker.currentNode.textContent?.trim();
        const parent = walker.currentNode.parentElement;
        if (!text || !parent) continue;
        const style = getComputedStyle(parent);
        result.push({
          background: backgroundFor(parent),
          color: style.color,
          text,
        });
      }
      return result;
    });

    for (const sample of samples) {
      const foreground = parseRgb(sample.color);
      const background = parseRgb(sample.background);
      if (!foreground || !background) continue;
      const ratio = contrast(foreground, background);
      if (ratio < minContrast) {
        failures.push(
          `${route} "${sample.text}" hover contrast ${ratio.toFixed(2)} (${sample.color} on ${sample.background})`,
        );
      }
    }
  }
}

await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Hover contrast check passed.");
