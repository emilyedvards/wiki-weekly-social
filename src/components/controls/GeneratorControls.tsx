import type { AssetType, WikiWeeklyCategory } from '../../types/wiki';
import { ASSET_LABELS } from '../../lib/exportImage';

type GeneratorControlsProps = {
  data: WikiWeeklyCategory[];
  selectedWeek: string;
  selectedCategory: string;
  selectedAssetType: AssetType;
  isExporting: boolean;
  onWeekChange: (week: string) => void;
  onCategoryChange: (category: string) => void;
  onAssetTypeChange: (assetType: AssetType) => void;
  onExport: () => void;
  onBatchExport: () => void;
};

const assetTypes = Object.entries(ASSET_LABELS) as [AssetType, string][];

export function GeneratorControls({
  data,
  selectedWeek,
  selectedCategory,
  selectedAssetType,
  isExporting,
  onWeekChange,
  onCategoryChange,
  onAssetTypeChange,
  onExport,
  onBatchExport,
}: GeneratorControlsProps) {
  const weeks = [...new Map(data.map((item) => [item.weekRange, item])).keys()];
  const categories = data.filter((item) => item.weekRange === selectedWeek);

  return (
    <form className="controls" onSubmit={(event) => event.preventDefault()}>
      <label>
        <span>Week / date range</span>
        <select value={selectedWeek} onChange={(event) => onWeekChange(event.target.value)}>
          {weeks.map((week) => (
            <option key={week} value={week}>
              {week}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Category</span>
        <select value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value)}>
          {categories.map((item) => (
            <option key={`${item.weekRange}-${item.category}`} value={item.category}>
              {item.category}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Asset type</span>
        <select value={selectedAssetType} onChange={(event) => onAssetTypeChange(event.target.value as AssetType)}>
          {assetTypes.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <div className="button-stack">
        <button type="button" onClick={onExport} disabled={isExporting}>
          {isExporting ? 'Exporting...' : 'Export PNG'}
        </button>
        <button type="button" onClick={onBatchExport} disabled={isExporting}>
          Generate All
        </button>
      </div>
    </form>
  );
}
