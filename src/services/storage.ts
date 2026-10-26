import { UserProgress } from '../types';

const STORAGE_KEY = 'pitstop_pixie_progress_v1';

export const INITIAL_PROGRESS: UserProgress = {
  xp: 45, // give rookies an initial taste of accomplishment!
  level: 'Rookie',
  completedLessonIds: [],
  completedQuizIds: [],
  earnedBadgeIds: ['first_gear'],
  favoriteDriverIds: ['verstappen', 'hamilton'],
  favoriteTeamIds: ['ferrari'],
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  inspectedComponentIds: [],
};

export function getLevelFromXP(xp: number): UserProgress['level'] {
  if (xp >= 1000) return 'World Champion';
  if (xp >= 500) return 'Race Winner';
  if (xp >= 200) return 'Reserve Driver';
  return 'Rookie';
}

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    
    // Check streak
    const today = new Date().toISOString().split('T')[0];
    let streak = parsed.streakDays || 1;
    if (parsed.lastActiveDate) {
      const lastDate = new Date(parsed.lastActiveDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak += 1;
      } else if (diffDays > 1) {
        streak = 1;
      }
    }

    const xp = parsed.xp || 0;
    return {
      ...INITIAL_PROGRESS,
      ...parsed,
      xp,
      level: getLevelFromXP(xp),
      streakDays: streak,
      lastActiveDate: today,
    };
  } catch (e) {
    console.error('Failed to load user progress:', e);
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
}

export function resetUserProgress(): UserProgress {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset progress:', e);
  }
  return INITIAL_PROGRESS;
}
