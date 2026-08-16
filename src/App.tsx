import { useEffect, useMemo, useRef, useState } from 'react';
import { GeneratorControls } from './components/controls/GeneratorControls';
import { SocialPreview } from './components/SocialPreview';
import { SocialTemplate } from './components/templates/SocialTemplate';
import { EXPORT_SIZES, getExportFilename, exportNodeAsPng } from './lib/exportImage';
import { loadWikiData } from './lib/loadWikiData';
import type { AssetType, WikiWeeklyCategory } from './types/wiki';

export default function App() {
  const [data, setData] = useState<WikiWeeklyCategory[]>([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>('top-4x5');
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const batchExportRefs = useRef<Partial<Record<AssetType, HTMLDivElement>>>({});

  useEffect(() => {
    loadWikiData().then((loadedData) => {
      setData(loadedData);
      setSelectedWeek(loadedData[0]?.weekRange ?? '');
      setSelectedCategory(loadedData[0]?.category ?? '');
    });
  }, []);

  const selectedItem = useMemo(() => {
    return data.find((item) => item.weekRange === selectedWeek && item.category === selectedCategory) ?? data[0];
  }, [data, selectedCategory, selectedWeek]);

  function handleWeekChange(week: string) {
    setSelectedWeek(week);
    const firstCategoryForWeek = data.find((item) => item.weekRange === week);
    if (firstCategoryForWeek) setSelectedCategory(firstCategoryForWeek.category);
  }

  async function handleExport() {
    if (!selectedItem || !exportRef.current) return;

    setIsExporting(true);
    try {
      await exportNodeAsPng(
        exportRef.current,
        getExportFilename(selectedItem, selectedAssetType),
        EXPORT_SIZES[selectedAssetType],
      );
    } finally {
      setIsExporting(false);
    }
  }

  async function handleBatchExport() {
    if (!selectedItem) return;

    setIsExporting(true);
    const assetTypes: AssetType[] = ['top-4x5', 'top-9x16', 'ranking-9x16'];

    try {
      for (const assetType of assetTypes) {
        const node = batchExportRefs.current[assetType];
        if (!node) continue;
        await exportNodeAsPng(node, getExportFilename(selectedItem, assetType), EXPORT_SIZES[assetType]);
      }
    } finally {
      setIsExporting(false);
    }
  }

  if (!selectedItem) {
    return <main className="app-shell">Loading...</main>;
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Wiki Weekly Social Generator</h1>
        <p>{selectedItem.source === 'live' ? 'Live T.W.O.W. / Wikimedia data' : 'Sample fallback data'}</p>
      </header>

      <div className="workspace">
        <GeneratorControls
          data={data}
          selectedWeek={selectedWeek}
          selectedCategory={selectedCategory}
          selectedAssetType={selectedAssetType}
          isExporting={isExporting}
          onWeekChange={handleWeekChange}
          onCategoryChange={setSelectedCategory}
          onAssetTypeChange={setSelectedAssetType}
          onExport={handleExport}
          onBatchExport={handleBatchExport}
        />

        <SocialPreview assetType={selectedAssetType} category={selectedItem} />
      </div>

      <div className="export-host" aria-hidden="true">
        <div ref={exportRef} className="current-export-node">
          <SocialTemplate assetType={selectedAssetType} category={selectedItem} />
        </div>
        {(['top-4x5', 'top-9x16', 'ranking-9x16'] as AssetType[]).map((assetType) => (
          <div
            key={assetType}
            className="batch-export-node"
            ref={(node) => {
              if (node) batchExportRefs.current[assetType] = node;
            }}
          >
            <SocialTemplate assetType={assetType} category={selectedItem} />
          </div>
        ))}
      </div>
    </main>
  );
}
