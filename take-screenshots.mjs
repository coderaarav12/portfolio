import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const dir = "screenshots";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // Listen to console errors
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error("PAGE ERROR:", msg.text());
    }
  });

  page.on("pageerror", (err) => {
    console.error("PAGE JS EXCEPTION:", err);
  });

  console.log("Navigating to http://localhost:3333...");
  await page.goto("http://localhost:3333", { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  console.log("Capturing 01-hero...");
  await page.screenshot({ path: path.join(dir, "01-hero.png") });

  console.log("Scrolling to roadmap...");
  await page.evaluate(() => {
    document.getElementById("roadmap-start")?.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(dir, "02-roadmap.png") });

  console.log("Scrolling to monument...");
  await page.evaluate(() => {
    document.getElementById("monument")?.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(dir, "03-monument.png") });

  console.log("Scrolling to intelligence...");
  await page.evaluate(() => {
    document.getElementById("intelligence")?.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(dir, "04-intelligence.png") });

  console.log("Scrolling to landmarks...");
  await page.evaluate(() => {
    document.getElementById("landmarks")?.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(dir, "05-landmarks.png") });

  console.log("Scrolling to ecosystem...");
  await page.evaluate(() => {
    document.getElementById("ecosystem")?.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(dir, "06-ecosystem.png") });

  console.log("Scrolling to contact...");
  await page.evaluate(() => {
    document.getElementById("contact")?.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(dir, "07-contact.png") });

  console.log("Taking full page screenshot...");
  await page.screenshot({ path: path.join(dir, "fullpage.png"), fullPage: true });

  console.log("Done!");
  await browser.close();
}

run().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
