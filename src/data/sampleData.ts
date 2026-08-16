import type { WikiWeeklyCategory } from '../types/wiki';

const thumbnail = (label: string, initials: string, tone = '#f3f3f3') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700"><rect width="900" height="700" fill="${tone}"/><rect x="54" y="54" width="792" height="592" fill="#fff" stroke="#111" stroke-width="5"/><text x="96" y="140" font-family="Georgia,serif" font-size="34" fill="#111">${label}</text><text x="96" y="430" font-family="Georgia,serif" font-size="210" font-weight="700" fill="#111">${initials}</text><line x1="96" y1="488" x2="804" y2="488" stroke="#111" stroke-width="5"/><text x="96" y="548" font-family="Arial,sans-serif" font-size="24" fill="#333">sample Wikipedia thumbnail</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const sampleWikiData: WikiWeeklyCategory[] = [
  {
    category: 'Sports',
    weekRange: 'Aug 10-16, 2026',
    weekStart: '2026-08-10',
    pages: [
      {
        rank: 1,
        title: 'Caitlin Clark',
        views: 1845293,
        extract:
          'Caitlin Clark is an American professional basketball player for the Indiana Fever of the Women\'s National Basketball Association.',
        thumbnail: thumbnail('Sports', 'CC'),
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Caitlin_Clark',
      },
      {
        rank: 2,
        title: '2026 FIFA World Cup qualification',
        views: 1604822,
        extract:
          'The 2026 FIFA World Cup qualification process is a series of tournaments organized by the six FIFA confederations.',
        thumbnail: thumbnail('Football', 'WC', '#f7f7f7'),
        wikipediaUrl: 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification',
      },
      {
        rank: 3,
        title: 'Simone Biles',
        views: 1439201,
        extract: 'Simone Biles is an American artistic gymnast.',
        thumbnail: thumbnail('Gymnastics', 'SB'),
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Simone_Biles',
      },
      { rank: 4, title: 'Dallas Cowboys', views: 1202881, extract: 'The Dallas Cowboys are a professional American football team based in the Dallas-Fort Worth metroplex.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Dallas_Cowboys' },
      { rank: 5, title: 'Shohei Ohtani', views: 984300, extract: 'Shohei Ohtani is a Japanese professional baseball pitcher and designated hitter.', thumbnail: thumbnail('Baseball', 'SO'), wikipediaUrl: 'https://en.wikipedia.org/wiki/Shohei_Ohtani' },
      { rank: 6, title: 'LeBron James', views: 904221, extract: 'LeBron James is an American professional basketball player.', wikipediaUrl: 'https://en.wikipedia.org/wiki/LeBron_James' },
      { rank: 7, title: 'Wimbledon Championships', views: 804112, extract: 'The Wimbledon Championships is the oldest tennis tournament in the world.', thumbnail: thumbnail('Tennis', 'W'), wikipediaUrl: 'https://en.wikipedia.org/wiki/Wimbledon_Championships' },
      { rank: 8, title: 'Lionel Messi', views: 765432, extract: 'Lionel Messi is an Argentine professional footballer.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Lionel_Messi' },
      { rank: 9, title: 'Patrick Mahomes', views: 543210, extract: 'Patrick Mahomes is an American football quarterback.', thumbnail: thumbnail('Football', 'PM'), wikipediaUrl: 'https://en.wikipedia.org/wiki/Patrick_Mahomes' },
      { rank: 10, title: 'Naomi Osaka', views: 432198, extract: 'Naomi Osaka is a Japanese professional tennis player.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Naomi_Osaka' },
    ],
  },
  {
    category: 'Culture',
    weekRange: 'Aug 10-16, 2026',
    weekStart: '2026-08-10',
    pages: [
      {
        rank: 1,
        title: 'Taylor Swift',
        views: 2256784,
        extract:
          'Taylor Swift is an American singer-songwriter whose autobiographical songwriting and artistic reinventions have received extensive media coverage.',
        thumbnail: thumbnail('Music', 'TS'),
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Taylor_Swift',
      },
      { rank: 2, title: 'KPop Demon Hunters', views: 1903450, extract: 'KPop Demon Hunters is an animated musical fantasy film.', thumbnail: thumbnail('Film', 'KD'), wikipediaUrl: 'https://en.wikipedia.org/wiki/KPop_Demon_Hunters' },
      { rank: 3, title: 'The Beatles', views: 1320201, extract: 'The Beatles were an English rock band formed in Liverpool in 1960.', wikipediaUrl: 'https://en.wikipedia.org/wiki/The_Beatles' },
      { rank: 4, title: 'Academy Award for Best Picture', views: 1044098, extract: 'The Academy Award for Best Picture is one of the Academy Awards presented annually by the Academy of Motion Picture Arts and Sciences.', thumbnail: thumbnail('Awards', 'BP'), wikipediaUrl: 'https://en.wikipedia.org/wiki/Academy_Award_for_Best_Picture' },
      { rank: 5, title: 'One Hundred Years of Solitude', views: 890214, extract: 'One Hundred Years of Solitude is a 1967 novel by Colombian author Gabriel Garcia Marquez.', wikipediaUrl: 'https://en.wikipedia.org/wiki/One_Hundred_Years_of_Solitude' },
      { rank: 6, title: 'Barbie', views: 720844, extract: 'Barbie is a fashion doll manufactured by American toy company Mattel.', thumbnail: thumbnail('Culture', 'B'), wikipediaUrl: 'https://en.wikipedia.org/wiki/Barbie' },
      { rank: 7, title: 'Renaissance art', views: 690005, extract: 'Renaissance art is the painting, sculpture, and decorative arts of the European Renaissance.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Renaissance_art' },
      { rank: 8, title: 'Dune', views: 612900, extract: 'Dune is a 1965 epic science fiction novel by American author Frank Herbert.', thumbnail: thumbnail('Books', 'D'), wikipediaUrl: 'https://en.wikipedia.org/wiki/Dune_(novel)' },
      { rank: 9, title: 'Eurovision Song Contest', views: 590122, extract: 'The Eurovision Song Contest is an international song competition organized annually by the European Broadcasting Union.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Eurovision_Song_Contest' },
      { rank: 10, title: 'Studio Ghibli', views: 515433, extract: 'Studio Ghibli is a Japanese animation studio based in Koganei, Tokyo.', thumbnail: thumbnail('Animation', 'SG'), wikipediaUrl: 'https://en.wikipedia.org/wiki/Studio_Ghibli' },
    ],
  },
  {
    category: 'Science & Technology',
    weekRange: 'Aug 10-16, 2026',
    weekStart: '2026-08-10',
    pages: [
      {
        rank: 1,
        title: 'James Webb Space Telescope',
        views: 1522109,
        extract:
          'The James Webb Space Telescope is a space telescope designed to conduct infrared astronomy and observe some of the most distant objects in the universe.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/James_Webb_Space_Telescope',
      },
      { rank: 2, title: 'Artificial intelligence', views: 1487650, extract: 'Artificial intelligence is the capability of computational systems to perform tasks typically associated with human intelligence.', thumbnail: thumbnail('Technology', 'AI'), wikipediaUrl: 'https://en.wikipedia.org/wiki/Artificial_intelligence' },
      { rank: 3, title: 'Perseid meteor shower', views: 1177231, extract: 'The Perseids are a prolific meteor shower associated with the comet Swift-Tuttle.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Perseids' },
      { rank: 4, title: 'Quantum computing', views: 998432, extract: 'Quantum computing is a multidisciplinary field comprising aspects of computer science, physics, and mathematics.', thumbnail: thumbnail('Computing', 'QC'), wikipediaUrl: 'https://en.wikipedia.org/wiki/Quantum_computing' },
      { rank: 5, title: 'Very-long-baseline interferometry', views: 871006, extract: 'Very-long-baseline interferometry is a type of astronomical interferometry used in radio astronomy.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Very-long-baseline_interferometry' },
      { rank: 6, title: 'CRISPR gene editing', views: 809542, extract: 'CRISPR gene editing is a genetic engineering technique in molecular biology by which the genomes of living organisms may be modified.', thumbnail: thumbnail('Biology', 'CR'), wikipediaUrl: 'https://en.wikipedia.org/wiki/CRISPR_gene_editing' },
      { rank: 7, title: 'Solar flare', views: 704420, extract: 'A solar flare is a relatively intense, localized emission of electromagnetic radiation in the Sun\'s atmosphere.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Solar_flare' },
      { rank: 8, title: 'Large language model', views: 699138, extract: 'A large language model is a language model notable for its ability to achieve general-purpose language generation and other natural language processing tasks.', thumbnail: thumbnail('AI', 'LL'), wikipediaUrl: 'https://en.wikipedia.org/wiki/Large_language_model' },
      { rank: 9, title: 'Hurricane forecasting', views: 600412, extract: 'Tropical cyclone forecasting is the science of forecasting where a tropical cyclone\'s center and its effects are expected to be at some point in the future.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Tropical_cyclone_forecasting' },
      { rank: 10, title: 'Graphene', views: 521903, extract: 'Graphene is an allotrope of carbon consisting of a single layer of atoms arranged in a two-dimensional honeycomb lattice.', thumbnail: thumbnail('Materials', 'G'), wikipediaUrl: 'https://en.wikipedia.org/wiki/Graphene' },
    ],
  },
];
