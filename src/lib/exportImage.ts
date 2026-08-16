import { toPng } from 'html-to-image';
import type { AssetType, ExportSize, WikiWeeklyCategory } from '../types/wiki';
import { slugify } from './textUtils';

export const EXPORT_SIZES: Record<AssetType, ExportSize> = {
  'top-4x5': { width: 1080, height: 1350 },
  'top-9x16': { width: 1080, height: 1920 },
  'ranking-9x16': { width: 1080, height: 1920 },
};

export const ASSET_LABELS: Record<AssetType, string> = {
  'top-4x5': '#1 Page - 4:5',
  'top-9x16': '#1 Page - 9:16',
  'ranking-9x16': 'Ranking - 9:16',
};

export function getExportFilename(category: WikiWeeklyCategory, assetType: AssetType) {
  const suffix: Record<AssetType, string> = {
    'top-4x5': 'top-page-feed',
    'top-9x16': 'top-page-story',
    'ranking-9x16': 'ranking-story',
  };

  return `wiki-weekly-${slugify(category.category)}-${category.weekStart}-${suffix[assetType]}.png`;
}

export async function exportNodeAsPng(node: HTMLElement, filename: string, size: ExportSize) {
  await document.fonts.ready;

  const dataUrl = await toPng(node, {
    width: size.width,
    height: size.height,
    pixelRatio: 1,
    cacheBust: true,
    backgroundColor: '#ffffff',
    style: {
      width: `${size.width}px`,
      height: `${size.height}px`,
      transform: 'none',
    },
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();

  return dataUrl;
}
