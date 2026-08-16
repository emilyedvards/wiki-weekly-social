import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function pngSize(buffer: Buffer) {
  if (buffer.toString('ascii', 1, 4) !== 'PNG') throw new Error('Not a PNG');
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

async function main() {
  const defaultChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const executablePath = process.env.PLAYWRIGHT_CHROME_PATH ?? (fs.existsSync(defaultChromePath) ? defaultChromePath : undefined);
  const browser = await chromium.launch({ executablePath });
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  const baseUrl = process.env.WIKI_WEEKLY_BASE_URL ?? 'http://127.0.0.1:5173';
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  const templateChecks = [
    ['#1 Page - 4:5', 1080, 1350],
    ['#1 Page - 9:16', 1080, 1920],
    ['Ranking - 9:16', 1080, 1920],
  ] as const;

  for (const [label, width, height] of templateChecks) {
    await page.locator('select').nth(2).selectOption({ label });
    await page.waitForTimeout(100);
    const box = await page.locator('.preview-stage').boundingBox();
    if (!box || box.width <= 0 || box.height <= 0) throw new Error(`Preview did not render for ${label}`);
    const pngDataUrl = await page.locator('.current-export-node .social-template').evaluate(async (node) => {
      const mod = await Function('return import("/node_modules/html-to-image/es/index.js")')();
      return mod.toPng(node as HTMLElement, { pixelRatio: 1, backgroundColor: '#ffffff' });
    });
    const buffer = Buffer.from(pngDataUrl.split(',')[1], 'base64');
    const size = await pngSize(buffer);
    if (size.width !== width || size.height !== height) {
      throw new Error(`${label} exported ${size.width}x${size.height}, expected ${width}x${height}`);
    }
  }

  const categoryOptions = await page.locator('select').nth(1).locator('option').evaluateAll((options) =>
    options.map((option: any) => ({
      label: option.getAttribute('label') ?? option.textContent ?? '',
      value: option.getAttribute('value') ?? '',
    })),
  );
  const verificationCategory = categoryOptions.find((option) => option.label === 'Science & Technology') ?? categoryOptions.at(-1);

  if (!verificationCategory) throw new Error('No category options were available.');

  await page.locator('select').nth(1).selectOption(verificationCategory.value);
  await page.locator('select').nth(2).selectOption({ label: '#1 Page - 4:5' });
  await page.waitForTimeout(100);
  const topPageCount = await page.locator('.current-export-node .top-page').count();
  if (topPageCount !== 1) throw new Error('Expected top-page template to render after category change');

  await page.locator('select').nth(2).selectOption({ label: 'Ranking - 9:16' });
  await page.waitForTimeout(100);
  const rows = await page.locator('.current-export-node .ranking-row').count();
  if (rows < 10) throw new Error(`Expected at least 10 ranking rows, found ${rows}`);

  await browser.close();
  console.log('Export verification passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
