import type { WikiWeeklyCategory, WikiWeeklyPage } from '../types/wiki';
import { firstSentence } from './textUtils';

type WikimediaTopArticle = {
  article: string;
  views: number;
};

type WikimediaTopResponse = {
  items: Array<{ articles: WikimediaTopArticle[] }>;
};

type RankedArticle = {
  title: string;
  slug: string;
  views: number;
  categories?: string[];
  thumbnailUrl?: string;
  extract?: string;
};

type WikipediaCategoriesResponse = {
  continue?: {
    clcontinue?: string;
    continue?: string;
  };
  query?: {
    pages?: Record<
      string,
      {
        title?: string;
        categories?: Array<{ title: string }>;
      }
    >;
  };
};

type WikipediaImageResponse = {
  query?: {
    pages?: Record<
      string,
      {
        title?: string;
        thumbnail?: { source?: string };
      }
    >;
  };
};

type WikipediaSummaryResponse = {
  extract?: string;
  thumbnail?: { source?: string };
};

const CATEGORIES = [
  'Overall',
  'Music',
  'Movies',
  'TV',
  'Celebrities',
  'Internet Culture',
  'Sports',
  'Politics',
  'Current Events',
] as const;

type Category = (typeof CATEGORIES)[number];

function getToday(): Date {
  return new Date();
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getCurrentWeekRange(today = getToday()): { monday: Date; sunday: Date } {
  const localToday = startOfLocalDay(today);
  const day = localToday.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  const monday = addDays(localToday, -daysSinceMonday);
  return { monday, sunday: addDays(monday, 6) };
}

function getCompletedDaysForCurrentWeek(today = getToday()): Date[] {
  const { monday } = getCurrentWeekRange(today);
  const localToday = startOfLocalDay(today);
  const completedDays: Date[] = [];

  for (let day = new Date(monday); day.getTime() < localToday.getTime(); day = addDays(day, 1)) {
    completedDays.push(new Date(day));
  }

  return completedDays;
}

function getPreviousWeekDays(today = getToday()): Date[] {
  const { monday } = getCurrentWeekRange(today);
  const previousMonday = addDays(monday, -7);
  return Array.from({ length: 7 }, (_, index) => addDays(previousMonday, index));
}

function formatApiDate(date: Date): { year: string; month: string; day: string } {
  return {
    year: String(date.getFullYear()),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    day: String(date.getDate()).padStart(2, '0'),
  };
}

function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function formatDateRange(monday: Date, sunday: Date): string {
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(monday);
  const sameMonth = monday.getMonth() === sunday.getMonth();
  const sameYear = monday.getFullYear() === sunday.getFullYear();

  if (sameMonth && sameYear) {
    return `${month} ${monday.getDate()}-${sunday.getDate()}, ${sunday.getFullYear()}`;
  }

  if (sameYear) {
    return `${formatDisplayDate(monday)}-${formatDisplayDate(sunday)}, ${sunday.getFullYear()}`;
  }

  return `${formatDisplayDate(monday)}, ${monday.getFullYear()}-${formatDisplayDate(sunday)}, ${sunday.getFullYear()}`;
}

function readableTitle(slug: string): string {
  return decodeURIComponent(slug).replaceAll('_', ' ');
}

function articleUrl(slug: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(slug).replaceAll('%2F', '/')}`;
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size));
  return chunks;
}

function isArticlePage(slug: string): boolean {
  const title = readableTitle(slug).trim();
  const normalized = title.toLowerCase();
  const blockedPrefixes = [
    'api/',
    'book:',
    'category:',
    'draft:',
    'file:',
    'help:',
    'mediawiki:',
    'module:',
    'portal:',
    'special:',
    'talk:',
    'template:',
    'user:',
    'wikipedia:',
  ];
  const blockedExactTitles = new Set(['', '.xyz', 'main page', 'neatsville, kentucky', 'search', 'wikimedia foundation', 'wikipedia']);

  if (blockedExactTitles.has(normalized)) return false;
  if (/^\.[a-z0-9-]{2,63}$/.test(normalized)) return false;
  if (blockedPrefixes.some((prefix) => normalized.startsWith(prefix))) return false;
  return !normalized.includes('404.php') && !normalized.includes('undefined');
}

function categoryMatches(article: RankedArticle, category: Category): boolean {
  if (category === 'Overall') return true;

  const title = article.title.toLowerCase();
  const categoryText = (article.categories ?? []).join(' ').toLowerCase();
  const haystack = `${title} ${categoryText}`;
  const currentYear = String(getToday().getFullYear());
  const forcedCategories: Partial<Record<Category, string[]>> = {
    Movies: ['the odyssey (2026 film)', 'obsession (2025 film)'],
    TV: ['house of the dragon', 'ted lasso'],
    Celebrities: ['tom holland'],
    'Current Events': ['pan am flight 103', '2026 iran war'],
  };
  const excludedCategories: Partial<Record<Category, string[]>> = {
    Sports: ['ted lasso', 'tom holland'],
    Movies: ['house of the dragon', 'odyssey', 'ted lasso'],
    Celebrities: ['obsession (2025 film)'],
    Politics: ['christopher nolan', 'pan am flight 103'],
  };

  if (excludedCategories[category]?.includes(title)) return false;
  if (forcedCategories[category]?.includes(title)) return true;

  const isPerson = /\b(living people|births|deaths|actors|actresses|singers|rappers|musicians|athletes|players|people from|models|stylists|directors|writers|businesspeople|entrepreneurs|chief executives|podcasters|media personalities|bodyguards|comedians)\b/.test(categoryText);
  const isFilm = /\b(film|films|movie|movies|cinema)\b/.test(haystack);
  const isTelevision = /\b(television series|tv series|television show|television program|television episode|streaming television|sitcom|miniseries|soap opera|game show|reality television series)\b/.test(haystack);
  const isVideoGame = /\b(video game|video games|playstation|xbox|nintendo)\b/.test(haystack);
  const isSexPosition = /\b(sex position|sex positions|sexual position|sexual positions)\b/.test(haystack);
  const isSports = /\b(sport|sports|football|soccer|basketball|baseball|tennis|wimbledon|golf|cricket|ufc|mma|fighter|athlete|olympic|fifa|nba|nfl|mlb|nhl|wrestl)\b/.test(haystack);
  const isPoliticalPerson = /\b(politician|politicians|president|presidents|prime minister|prime ministers|government minister|government ministers|cabinet member|cabinet members|senator|senators|representative|representatives|governor|governors|mayor|mayors|heads of state|heads of government|members of parliament|members of congress|members of the lok sabha)\b/.test(categoryText);
  const isPoliticalTopic =
    /\b(election|elections|referendum|referendums|political party|political parties|legislature|legislatures|parliament|parliamentary|congress|congressional|senate|cabinet|government agency|government agencies|government ministry|government ministries|supreme court|constitutional court|legislation|treaty|treaties|diplomacy|diplomatic)\b/.test(haystack) ||
    /\b(law|laws|bill|bills)\b/.test(categoryText);
  const isPoliticalAdjacentPerson = /\b(journalist|journalists|bodyguard|bodyguards|security guards|media personalities|podcaster|podcasters|commentator|commentators)\b/.test(`${title} ${categoryText}`);
  const isCelebrityRole = /\b(actor|actors|actress|actresses|singer|singers|rapper|rappers|musician|musicians|athlete|athletes|footballer|basketball player|baseball player|tennis player|fighter|wrestler|comedian|comedians)\b/.test(categoryText);
  const hasMajorPoliticalOffice = /\b(president|presidents|prime minister|prime ministers|government minister|government ministers|cabinet member|cabinet members|senator|senators|representative|representatives|governor|governors|heads of state|heads of government|members of parliament|members of congress|members of the lok sabha)\b/.test(categoryText);
  const isMusicWork = /\b(\d{4} (albums|songs|singles|eps)|studio albums|live albums|compilation albums|soundtrack albums|debut albums|songs by|singles by|albums by|extended plays|concert tours|music festivals|record labels|discographies)\b/.test(categoryText);
  const isMusicArtist = /\b(singer|singers|rapper|rappers|musician|musicians|songwriter|songwriters|record producer|record producers|musical artist|musical artists|band|bands|music groups|musical groups)\b/.test(categoryText);
  const hasExplicitMusicTitle = /\((song|album|ep|soundtrack)\)|\bdiscography\b/.test(title);
  const isCurrentEventTopic =
    (title.includes(currentYear) || /\b(war|attack|disaster|earthquake|hurricane|protest|summit|trial|conflict|crisis|incident|assassination|shooting|murder)\b/.test(title)) &&
    /\b(event|events|war|attack|disaster|earthquake|hurricane|protest|summit|trial|conflict|crisis|incident|tournament|world cup|championship|awards|ceremony|assassination|shooting|murder)\b/.test(haystack);

  switch (category) {
    case 'Music':
      return !isSports && !isPoliticalPerson && (!(isFilm || isTelevision || isVideoGame) || hasExplicitMusicTitle) && (isMusicWork || isMusicArtist || hasExplicitMusicTitle);
    case 'Movies':
      return !isTelevision && /\b(film|films|movie|movies|cinema|box office)\b/.test(haystack) && !isPerson;
    case 'TV':
      return !isPerson && !isSports && !isFilm && isTelevision;
    case 'Celebrities':
      return /\b(celebrity|actor|actress|model|stylist|stylists|influencer|youtuber|tiktoker|media personality|socialite|royalty|singer|rapper|musician)\b/.test(haystack);
    case 'Internet Culture':
      return !isSports && !isPoliticalPerson && !isPoliticalTopic && !isMusicArtist && !isCurrentEventTopic && !isSexPosition && !isFilm && !/\b(television series|tv series|television show|television program|streaming television|sitcom|miniseries|soap opera|game show)\b/.test(haystack) && /\b(internet meme|internet memes|meme|memes|viral video|viral videos|viral phenomenon|viral phenomena|viral trend|viral trends|viral phrase|viral phrases|internet slang|online slang|slang|catchphrase|catchphrases|internet culture|online culture|digital culture|web culture|tiktok trend|tiktok trends|hashtag|hashtags|challenge|challenges|creepypasta|reaction image|reaction images|emoji|emojis|content creator|content creators|online creator|online creators|youtuber|youtubers|tiktoker|tiktokers|streamer|streamers|influencer|influencers|social media platform|social media platforms|online platform|online platforms|video-sharing platform|video-sharing platforms|mobile app|mobile apps|social media app|social media apps|online community|online communities|internet forum|internet forums|message board|message boards|internet phenomenon|internet phenomena|online phenomenon|online phenomena|collectible toy|collectible toys|designer toy|designer toys|art toy|art toys)\b/.test(haystack);
    case 'Sports':
      return isSports;
    case 'Politics':
      return !isCurrentEventTopic && !isPoliticalAdjacentPerson && (!isCelebrityRole || hasMajorPoliticalOffice) && (isPoliticalPerson || (!isPerson && isPoliticalTopic)) && !isSports;
    case 'Current Events':
      return !isPoliticalPerson && !isPoliticalTopic && !isPerson && !title.startsWith('list of ') && isCurrentEventTopic;
  }
}

async function fetchTopArticlesForDay(date: Date): Promise<WikimediaTopArticle[]> {
  const { year, month, day } = formatApiDate(date);
  const endpoint = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia.org/all-access/${year}/${month}/${day}`;
  const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Wikimedia returned ${response.status} for ${year}-${month}-${day}.`);
  const data = (await response.json()) as WikimediaTopResponse;
  return data.items[0]?.articles ?? [];
}

async function fetchArticleCategories(articles: RankedArticle[]): Promise<Map<string, string[]>> {
  const categories = new Map<string, string[]>();

  for (const articleChunk of chunkArray(articles, 50)) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      prop: 'categories',
      cllimit: 'max',
      titles: articleChunk.map((article) => article.slug).join('|'),
    });

    while (true) {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?${params.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Wikipedia categories returned ${response.status}.`);
      const data = (await response.json()) as WikipediaCategoriesResponse;

      for (const page of Object.values(data.query?.pages ?? {})) {
        if (!page.title) continue;
        const existing = categories.get(page.title) ?? [];
        const returned = (page.categories ?? []).map((item) => item.title.replace(/^Category:/, ''));
        categories.set(page.title, [...existing, ...returned]);
      }

      if (!data.continue?.clcontinue) break;
      params.set('clcontinue', data.continue.clcontinue);
      params.set('continue', data.continue.continue ?? '');
    }
  }

  return categories;
}

async function fetchArticleThumbnails(slugs: string[]): Promise<Map<string, string>> {
  const thumbnails = new Map<string, string>();

  for (const slugChunk of chunkArray(slugs, 50)) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      redirects: '1',
      prop: 'pageimages',
      piprop: 'thumbnail',
      pithumbsize: '900',
      pilicense: 'any',
      titles: slugChunk.join('|'),
    });
    const response = await fetch(`https://en.wikipedia.org/w/api.php?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) continue;
    const data = (await response.json()) as WikipediaImageResponse;
    for (const page of Object.values(data.query?.pages ?? {})) {
      if (page.title && page.thumbnail?.source) thumbnails.set(page.title, page.thumbnail.source);
    }
  }

  return thumbnails;
}

async function fetchSummary(article: RankedArticle): Promise<Pick<RankedArticle, 'extract' | 'thumbnailUrl'>> {
  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(article.slug)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return {};
    const summary = (await response.json()) as WikipediaSummaryResponse;
    return {
      extract: summary.extract,
      thumbnailUrl: summary.thumbnail?.source,
    };
  } catch {
    return {};
  }
}

async function getRankedArticlesForDays(days: Date[]): Promise<RankedArticle[]> {
  const dailyResults = await Promise.allSettled(days.map(fetchTopArticlesForDay));
  const fulfilledResults = dailyResults.filter((result) => result.status === 'fulfilled');
  const totals = new Map<string, number>();

  if (fulfilledResults.length === 0) throw new Error('No Wikimedia pageview data was available.');

  for (const result of fulfilledResults) {
    for (const article of result.value) {
      if (!isArticlePage(article.article)) continue;
      totals.set(article.article, (totals.get(article.article) ?? 0) + article.views);
    }
  }

  const articles = Array.from(totals.entries())
    .map(([slug, views]) => ({ title: readableTitle(slug), slug, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 1000);

  const categoryMap = await fetchArticleCategories(articles).catch(() => new Map<string, string[]>());
  return articles.map((article) => ({ ...article, categories: categoryMap.get(article.title) ?? [] }));
}

function toPage(article: RankedArticle, rank: number): WikiWeeklyPage {
  return {
    rank,
    title: article.title,
    views: article.views,
    extract: firstSentence(article.extract ?? `${article.title} is a Wikipedia article included in this week's top viewed pages.`),
    thumbnail: article.thumbnailUrl,
    wikipediaUrl: articleUrl(article.slug),
  };
}

export async function loadTwowLiveData(): Promise<WikiWeeklyCategory[]> {
  const { monday, sunday } = getCurrentWeekRange();
  let days = getCompletedDaysForCurrentWeek();

  if (days.length === 0) days = getPreviousWeekDays();

  const articles = await getRankedArticlesForDays(days);
  const thumbnails = await fetchArticleThumbnails(articles.map((article) => article.slug)).catch(() => new Map<string, string>());
  const withThumbnails = articles.map((article) => ({ ...article, thumbnailUrl: thumbnails.get(article.title) }));
  const categories = CATEGORIES.map((category) => ({
    category,
    articles: withThumbnails.filter((article) => categoryMatches(article, category)).slice(0, 10),
  }));

  const summaryTargets = categories.map((category) => category.articles[0]).filter(Boolean);
  const summaries = await Promise.all(summaryTargets.map(fetchSummary));
  const summaryMap = new Map(summaryTargets.map((article, index) => [article.title, summaries[index]]));

  return categories.map(({ category, articles }) => ({
    category,
    weekRange: `Week of: ${formatDateRange(monday, sunday)}`,
    weekStart: formatApiDate(days[0] ?? monday).year + '-' + formatApiDate(days[0] ?? monday).month + '-' + formatApiDate(days[0] ?? monday).day,
    source: 'live',
    pages: articles.map((article, index) => {
      const summary = summaryMap.get(article.title);
      return toPage({ ...article, extract: summary?.extract, thumbnailUrl: summary?.thumbnailUrl ?? article.thumbnailUrl }, index + 1);
    }),
  }));
}
