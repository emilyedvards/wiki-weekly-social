import type { WikiWeeklyCategory } from '../../types/wiki';
import { formatViews } from '../../lib/formatViews';
import { firstSentence } from '../../lib/textUtils';
import { TemplateFrame } from './TemplateFrame';

type TopPageProps = {
  category: WikiWeeklyCategory;
};

export function TopPage916({ category }: TopPageProps) {
  const page = category.pages[0];

  if (!page) {
    return (
      <TemplateFrame assetType="top-9x16" className="top-page top-page-916 no-thumbnail">
        <header className="twow-template-head">
          <p className="twow-logo">T.W.O.W.</p>
          <p className="twow-kicker">This Week on Wikipedia</p>
        </header>
        <p className="template-date">{category.weekRange}</p>
        <h1>Top page in {category.category}.</h1>
        <div className="template-rule" />
        <p className="empty-template-message">No rankings. Pages in this category have not reached Wikipedia's top 1,000 viewed yet.</p>
        <p className="site-footer">wiki-weekly.com</p>
      </TemplateFrame>
    );
  }

  return (
    <TemplateFrame assetType="top-9x16" className={`top-page top-page-916 ${page.thumbnail ? '' : 'no-thumbnail'}`}>
      <header className="twow-template-head">
        <p className="twow-logo">T.W.O.W.</p>
        <p className="twow-kicker">This Week on Wikipedia</p>
      </header>
      <p className="template-date">{category.weekRange}</p>
      <h1>Top page in {category.category}.</h1>
      <div className="template-rule" />
      {page.thumbnail ? <img className="article-image" src={page.thumbnail} alt="" /> : null}
      <section className="story-copy">
        <h2>{page.title}</h2>
        <p className="views">{formatViews(page.views)}</p>
        <p className="extract">{firstSentence(page.extract, 260)}</p>
      </section>
      <p className="site-footer">wiki-weekly.com</p>
    </TemplateFrame>
  );
}
