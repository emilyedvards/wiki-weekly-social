import type { WikiWeeklyCategory } from '../../types/wiki';
import { formatViews } from '../../lib/formatViews';
import { firstSentence } from '../../lib/textUtils';
import { TemplateFrame } from './TemplateFrame';

type TopPageProps = {
  category: WikiWeeklyCategory;
};

export function TopPage45({ category }: TopPageProps) {
  const page = category.pages[0];

  if (!page) {
    return (
      <TemplateFrame assetType="top-4x5" className="top-page top-page-45 no-thumbnail">
        <header className="twow-template-head">
          <p className="twow-logo">T.W.O.W.</p>
          <p className="twow-kicker">This Week on Wikipedia</p>
        </header>
        <div className="template-copy">
          <p className="template-date">{category.weekRange}</p>
          <h1>Top page in {category.category}.</h1>
          <div className="template-rule" />
          <p className="empty-template-message">No rankings. Pages in this category have not reached Wikipedia's top 1,000 viewed yet.</p>
        </div>
        <p className="site-footer">wiki-weekly.com</p>
      </TemplateFrame>
    );
  }

  return (
    <TemplateFrame assetType="top-4x5" className={`top-page top-page-45 ${page.thumbnail ? '' : 'no-thumbnail'}`}>
      <header className="twow-template-head">
        <p className="twow-logo">T.W.O.W.</p>
        <p className="twow-kicker">This Week on Wikipedia</p>
      </header>
      <div className="template-copy">
        <p className="template-date">{category.weekRange}</p>
        <h1>Top page in {category.category}.</h1>
        <div className="template-rule" />
        <h2>{page.title}</h2>
        <p className="views">{formatViews(page.views)}</p>
        <p className="extract">{firstSentence(page.extract, 180)}</p>
      </div>
      {page.thumbnail ? <img className="article-image" src={page.thumbnail} alt="" /> : null}
      <p className="site-footer">wiki-weekly.com</p>
    </TemplateFrame>
  );
}
