import type { WikiWeeklyCategory } from '../../types/wiki';
import { formatViews } from '../../lib/formatViews';
import { TemplateFrame } from './TemplateFrame';

type RankingProps = {
  category: WikiWeeklyCategory;
};

export function Ranking916({ category }: RankingProps) {
  return (
    <TemplateFrame assetType="ranking-9x16" className="ranking-template">
      <header className="twow-template-head">
        <p className="twow-logo">T.W.O.W.</p>
        <p className="twow-kicker">This Week on Wikipedia</p>
      </header>
      <p className="template-date">{category.weekRange}</p>
      <h1>Top pages in {category.category}.</h1>
      <div className="template-rule" />
      <ol className="ranking-list">
        {category.pages.length === 0 ? (
          <li className="ranking-row empty-ranking-row">
            <span className="ranking-empty">No rankings. Pages in this category have not reached Wikipedia's top 1,000 viewed yet.</span>
          </li>
        ) : (
          category.pages.map((page) => (
            <li key={page.wikipediaUrl} className="ranking-row">
              <span className="rank">{page.rank}.</span>
              <span className="ranking-title">{page.title}</span>
              <span className="ranking-views">{formatViews(page.views)}</span>
            </li>
          ))
        )}
      </ol>
      <p className="site-footer">wiki-weekly.com</p>
    </TemplateFrame>
  );
}
