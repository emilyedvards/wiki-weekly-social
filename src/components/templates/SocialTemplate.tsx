import type { AssetType, WikiWeeklyCategory } from '../../types/wiki';
import { Ranking916 } from './Ranking916';
import { TopPage45 } from './TopPage45';
import { TopPage916 } from './TopPage916';

type SocialTemplateProps = {
  assetType: AssetType;
  category: WikiWeeklyCategory;
};

export function SocialTemplate({ assetType, category }: SocialTemplateProps) {
  if (assetType === 'top-4x5') return <TopPage45 category={category} />;
  if (assetType === 'top-9x16') return <TopPage916 category={category} />;
  return <Ranking916 category={category} />;
}
