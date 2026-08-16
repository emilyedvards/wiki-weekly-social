import type { AssetType, WikiWeeklyCategory } from '../types/wiki';
import { EXPORT_SIZES } from '../lib/exportImage';
import { SocialTemplate } from './templates/SocialTemplate';

type SocialPreviewProps = {
  assetType: AssetType;
  category: WikiWeeklyCategory;
};

export function SocialPreview({ assetType, category }: SocialPreviewProps) {
  const size = EXPORT_SIZES[assetType];
  const maxWidth = assetType === 'top-4x5' ? 520 : 390;
  const maxHeight = 720;
  const scale = Math.min(maxWidth / size.width, maxHeight / size.height);

  return (
    <section className="preview-panel" aria-label="Preview">
      <div className="preview-header">
        <span>Preview</span>
        <span>
          {size.width} x {size.height}
        </span>
      </div>
      <div
        className="preview-stage"
        style={{
          width: `${size.width * scale}px`,
          height: `${size.height * scale}px`,
        }}
      >
        <div className="preview-scaler" style={{ transform: `scale(${scale})` }}>
          <SocialTemplate assetType={assetType} category={category} />
        </div>
      </div>
    </section>
  );
}
