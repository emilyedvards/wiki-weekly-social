import type { PropsWithChildren } from 'react';
import type { AssetType } from '../../types/wiki';
import { EXPORT_SIZES } from '../../lib/exportImage';

type TemplateFrameProps = PropsWithChildren<{
  assetType: AssetType;
  className?: string;
}>;

export function TemplateFrame({ assetType, className = '', children }: TemplateFrameProps) {
  const size = EXPORT_SIZES[assetType];

  return (
    <article
      className={`social-template ${className}`}
      style={{ width: `${size.width}px`, height: `${size.height}px` }}
      data-export-width={size.width}
      data-export-height={size.height}
    >
      {children}
    </article>
  );
}
