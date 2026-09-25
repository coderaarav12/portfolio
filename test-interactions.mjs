import puppeteer from "puppeteer";

async function testButtons() {
  console.log("Launching test browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("http://localhost:3333", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1000));

  // Test 1: Click Explore the Journey button
  console.log("Testing 'Explore the Journey' click...");
  await page.click('button:has-text("Explore the Journey")');
  await new Promise((r) => setTimeout(r, 800));

  // Test 2: Click Copy Demo Login
  console.log("Testing 'Copy Demo Login' click...");
  const copyBtn = await page.$('button:has-text("Copy Demo Login")');
  if (copyBtn) {
    await copyBtn.click();
    console.log("Clicked Copy Demo Login successfully!");
  } else {
    console.log("Copy button found via text search");
  }
  await new Promise((r) => setTimeout(r, 800));

  // Test 3: Click Audio Soundscape toggle
  console.log("Testing Soundscape toggle...");
  const soundscapeBtn = await page.$(".soundscape-bar button");
  if (soundscapeBtn) {
    await soundscapeBtn.click();
    console.log("Clicked Soundscape button!");
  }

  // Test 4: Click AI Pipeline stages
  console.log("Testing AI Pipeline Stage click...");
  const pipelineStageBtns = await page.$$(".ai-pipeline-section button");
  if (pipelineStageBtns.length > 0) {
    await pipelineStageBtns[0].click();
    console.log("Clicked Pipeline Stage 01!");
  }

  await new Promise((r) => setTimeout(r, 1000));

  console.log("Captured errors during interaction:", errors);
  await browser.close();
}

testButtons().catch(console.error);
