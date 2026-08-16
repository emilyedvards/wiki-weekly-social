export type WikiWeeklyPage = {
  rank: number;
  title: string;
  views: number;
  extract: string;
  thumbnail?: string;
  wikipediaUrl: string;
};

export type WikiWeeklyCategory = {
  category: string;
  weekRange: string;
  weekStart: string;
  source?: 'live' | 'sample';
  pages: WikiWeeklyPage[];
};

export type AssetType = 'top-4x5' | 'top-9x16' | 'ranking-9x16';

export type ExportSize = {
  width: number;
  height: number;
};
