import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserProgress, Badge } from '../types';
import { loadUserProgress, saveUserProgress, resetUserProgress, getLevelFromXP } from '../services/storage';
import { BADGES } from '../data/badges';

interface LearningContextType {
  progress: UserProgress;
  addXP: (amount: number, reason?: string) => void;
  completeLesson: (lessonId: string, xpReward: number) => void;
  completeQuiz: (quizId: string, xpReward: number) => void;
  toggleFavoriteDriver: (driverId: string) => void;
  toggleFavoriteTeam: (teamId: string) => void;
  inspectComponent: (componentId: string) => void;
  resetAllProgress: () => void;
  currentToast: { message: string; type: 'xp' | 'badge' | 'level'; subtext?: string } | null;
  dismissToast: () => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [currentToast, setCurrentToast] = useState<{ message: string; type: 'xp' | 'badge' | 'level'; subtext?: string } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#D94355', '#F3C8D8', '#DCD5F7', '#D5E5D5', '#FFF200'],
    });
  };

  const showToast = (message: string, type: 'xp' | 'badge' | 'level', subtext?: string) => {
    setCurrentToast({ message, type, subtext });
  };

  const dismissToast = () => setCurrentToast(null);

  const checkBadgeUnlocks = (newXP: number, inspected: string[], lessons: string[]) => {
    const newlyEarned: string[] = [];

    // Check badges
    BADGES.forEach((badge) => {
      if (progress.earnedBadgeIds.includes(badge.id)) return;

      let unlocked = false;
      if (badge.id === 'aero_whisperer' && inspected.length >= 5) unlocked = true;
      if (badge.id === 'circuit_connoisseur' && newXP >= 250) unlocked = true;
      if (badge.id === 'race_winner' && newXP >= 500) unlocked = true;
      if (badge.id === 'world_champion' && newXP >= 1000) unlocked = true;
      if (badge.xpRequired && newXP >= badge.xpRequired) unlocked = true;

      if (unlocked) {
        newlyEarned.push(badge.id);
        showToast(`Badge Unlocked: ${badge.title}! 🏆`, 'badge', badge.description);
        triggerCelebration();
      }
    });

    return newlyEarned;
  };

  const addXP = (amount: number, reason?: string) => {
    setProgress((prev) => {
      const newXP = prev.xp + amount;
      const oldLevel = prev.level;
      const newLevel = getLevelFromXP(newXP);
      
      const newBadges = checkBadgeUnlocks(newXP, prev.inspectedComponentIds, prev.completedLessonIds);

      if (newLevel !== oldLevel) {
        showToast(`Level Up: ${newLevel}! 🏁`, 'level', 'You earned a promotion on the grid!');
        triggerCelebration();
      } else if (reason) {
        showToast(`+${amount} XP: ${reason}`, 'xp');
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        earnedBadgeIds: [...prev.earnedBadgeIds, ...newBadges],
      };
    });
  };

  const completeLesson = (lessonId: string, xpReward: number) => {
    if (progress.completedLessonIds.includes(lessonId)) return;
    
    setProgress((prev) => {
      const updatedLessons = [...prev.completedLessonIds, lessonId];
      const newXP = prev.xp + xpReward;
      const newLevel = getLevelFromXP(newXP);
      const newBadges = checkBadgeUnlocks(newXP, prev.inspectedComponentIds, updatedLessons);

      showToast(`Lesson Complete! +${xpReward} XP`, 'xp');
      triggerCelebration();

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        completedLessonIds: updatedLessons,
        earnedBadgeIds: [...prev.earnedBadgeIds, ...newBadges],
      };
    });
  };

  const completeQuiz = (quizId: string, xpReward: number) => {
    if (progress.completedQuizIds.includes(quizId)) {
      showToast(`Quiz completed again!`, 'xp');
      return;
    }

    setProgress((prev) => {
      const updatedQuizzes = [...prev.completedQuizIds, quizId];
      const newXP = prev.xp + xpReward;
      const newLevel = getLevelFromXP(newXP);
      const newBadges = checkBadgeUnlocks(newXP, prev.inspectedComponentIds, prev.completedLessonIds);

      showToast(`Quiz Mastered! +${xpReward} XP 🎯`, 'xp');
      triggerCelebration();

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        completedQuizIds: updatedQuizzes,
        earnedBadgeIds: [...prev.earnedBadgeIds, ...newBadges],
      };
    });
  };

  const toggleFavoriteDriver = (driverId: string) => {
    setProgress((prev) => {
      const exists = prev.favoriteDriverIds.includes(driverId);
      const updated = exists 
        ? prev.favoriteDriverIds.filter((id) => id !== driverId)
        : [...prev.favoriteDriverIds, driverId];
      return { ...prev, favoriteDriverIds: updated };
    });
  };

  const toggleFavoriteTeam = (teamId: string) => {
    setProgress((prev) => {
      const exists = prev.favoriteTeamIds.includes(teamId);
      const updated = exists 
        ? prev.favoriteTeamIds.filter((id) => id !== teamId)
        : [...prev.favoriteTeamIds, teamId];
      return { ...prev, favoriteTeamIds: updated };
    });
  };

  const inspectComponent = (componentId: string) => {
    setProgress((prev) => {
      if (prev.inspectedComponentIds.includes(componentId)) return prev;
      const updated = [...prev.inspectedComponentIds, componentId];
      const newXP = prev.xp + 10;
      const newLevel = getLevelFromXP(newXP);
      const newBadges = checkBadgeUnlocks(newXP, updated, prev.completedLessonIds);
      
      showToast(`Component Inspected! +10 XP 🔧`, 'xp');

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        inspectedComponentIds: updated,
        earnedBadgeIds: [...prev.earnedBadgeIds, ...newBadges],
      };
    });
  };

  const resetAllProgress = () => {
    const fresh = resetUserProgress();
    setProgress(fresh);
    showToast('Progress has been reset.', 'xp');
  };

  return (
    <LearningContext.Provider
      value={{
        progress,
        addXP,
        completeLesson,
        completeQuiz,
        toggleFavoriteDriver,
        toggleFavoriteTeam,
        inspectComponent,
        resetAllProgress,
        currentToast,
        dismissToast,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
