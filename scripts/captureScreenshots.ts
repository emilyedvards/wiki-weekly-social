import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl = process.env.WIKI_WEEKLY_BASE_URL ?? 'http://127.0.0.1:5173';
const defaultChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const executablePath = process.env.PLAYWRIGHT_CHROME_PATH ?? (fs.existsSync(defaultChromePath) ? defaultChromePath : undefined);

async function main() {
  const browser = await chromium.launch({ executablePath });
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/private/tmp/wiki-weekly-app-desktop.png', fullPage: true });

  const templates = [
    ['#1 Page - 4:5', '/private/tmp/wiki-weekly-feed.png'],
    ['#1 Page - 9:16', '/private/tmp/wiki-weekly-story.png'],
    ['Ranking - 9:16', '/private/tmp/wiki-weekly-ranking.png'],
  ] as const;

  for (const [label, file] of templates) {
    await page.locator('select').nth(2).selectOption({ label });
    await page.waitForTimeout(150);
    const pngDataUrl = await page.locator('.current-export-node .social-template').evaluate(async (node) => {
      const mod = await Function('return import("/node_modules/html-to-image/es/index.js")')();
      return mod.toPng(node as HTMLElement, { pixelRatio: 1, backgroundColor: '#ffffff' });
    });
    fs.writeFileSync(file, Buffer.from(pngDataUrl.split(',')[1], 'base64'));
  }

  const categoryOptions = await page.locator('select').nth(1).locator('option').evaluateAll((options) =>
    options.map((option: any) => ({
      label: option.getAttribute('label') ?? option.textContent ?? '',
      value: option.getAttribute('value') ?? '',
    })),
  );
  const alternateCategory = categoryOptions.find((option) => option.label !== 'Overall') ?? categoryOptions.at(-1);

  if (alternateCategory) {
    await page.locator('select').nth(1).selectOption(alternateCategory.value);
  }
  await page.locator('select').nth(2).selectOption({ label: '#1 Page - 4:5' });
  await page.waitForTimeout(150);
  await page.screenshot({ path: '/private/tmp/wiki-weekly-culture-desktop.png', fullPage: true });

  await browser.close();
  console.log('Screenshots saved to /private/tmp/wiki-weekly-*.png');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
