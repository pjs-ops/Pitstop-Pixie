import { RadioProgressState, UserRadioRecord, RadioCategory } from '../types/radio';
import { RADIO_MESSAGES } from '../data/radioMessages';

export type { RadioProgressState };

const RADIO_STORAGE_KEY = 'pitstop_pixie_radio_progress_v1';

export const INITIAL_RADIO_STATE: RadioProgressState = {
  records: {},
  guidedChallengeCompleted: false,
  guidedChallengeScore: 0,
  bookmarkedIds: [],
};

export function loadRadioProgress(): RadioProgressState {
  try {
    const raw = localStorage.getItem(RADIO_STORAGE_KEY);
    if (!raw) return INITIAL_RADIO_STATE;
    const parsed = JSON.parse(raw);
    return {
      records: parsed.records || {},
      guidedChallengeCompleted: !!parsed.guidedChallengeCompleted,
      guidedChallengeScore: parsed.guidedChallengeScore || 0,
      bookmarkedIds: Array.isArray(parsed.bookmarkedIds) ? parsed.bookmarkedIds : [],
    };
  } catch (e) {
    console.error('Failed to load radio progress:', e);
    return INITIAL_RADIO_STATE;
  }
}

export function saveRadioProgress(state: RadioProgressState): void {
  try {
    localStorage.setItem(RADIO_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save radio progress:', e);
  }
}

export interface RadioStats {
  totalAvailable: number;
  completedCount: number;
  firstAttemptAccuracy: number; // percentage 0-100
  streak: number;
  categoryStats: Record<RadioCategory, { completed: number; total: number; accuracy: number }>;
  incorrectReviewList: string[]; // message IDs with incorrect first attempts
  allCompleted: boolean;
}

export function computeRadioStats(state: RadioProgressState): RadioStats {
  const totalAvailable = RADIO_MESSAGES.length;
  const records = Object.values(state.records);
  const completedRecords = records.filter((r) => r.completed);
  const completedCount = completedRecords.length;

  const correctFirstAttempts = completedRecords.filter((r) => r.firstAttemptCorrect).length;
  const firstAttemptAccuracy = completedCount > 0 
    ? Math.round((correctFirstAttempts / completedCount) * 100) 
    : 100;

  // Streak (consecutive correct completions in recent records)
  let streak = 0;
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
  );
  for (const rec of sortedRecords) {
    if (rec.firstAttemptCorrect) {
      streak += 1;
    } else {
      break;
    }
  }

  // Categories
  const categories: RadioCategory[] = [
    'team_orders',
    'tire_management',
    'pit_stops',
    'overtaking_drs',
    'safety_car_flags',
    'race_strategy',
  ];

  const categoryStats = {} as Record<RadioCategory, { completed: number; total: number; accuracy: number }>;

  categories.forEach((cat) => {
    const catMessages = RADIO_MESSAGES.filter((m) => m.category === cat);
    const catTotal = catMessages.length;
    const catCompleted = catMessages.filter((m) => state.records[m.id]?.completed).length;
    const catCorrect = catMessages.filter((m) => state.records[m.id]?.firstAttemptCorrect).length;
    const accuracy = catCompleted > 0 ? Math.round((catCorrect / catCompleted) * 100) : 0;

    categoryStats[cat] = {
      completed: catCompleted,
      total: catTotal,
      accuracy,
    };
  });

  const incorrectReviewList = records
    .filter((r) => !r.firstAttemptCorrect)
    .map((r) => r.messageId);

  return {
    totalAvailable,
    completedCount,
    firstAttemptAccuracy,
    streak,
    categoryStats,
    incorrectReviewList,
    allCompleted: completedCount === totalAvailable && totalAvailable > 0,
  };
}
