import { sampleWikiData } from '../data/sampleData';
import { loadTwowLiveData } from './twowLiveData';
import type { WikiWeeklyCategory } from '../types/wiki';

export async function loadWikiData(): Promise<WikiWeeklyCategory[]> {
  try {
    const liveData = await loadTwowLiveData();
    return liveData.length > 0 ? liveData : sampleWikiData;
  } catch {
    return sampleWikiData;
  }
}
