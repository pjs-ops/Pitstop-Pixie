import React, { useState } from 'react';
import { COMPONENT_QUIZZES, FLAG_QUIZZES, STRATEGY_QUIZZES, DAILY_CHALLENGES } from '../../data/quizzes';
import { BADGES } from '../../data/badges';
import { QuizQuestion, Badge } from '../../types';
import { Trophy, Award, Flame, RotateCcw, CheckCircle, Sparkles, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

type QuizCategory = 'daily' | 'components' | 'flags' | 'strategy';

export const PitSchoolView: React.FC = () => {
  const { progress, completeQuiz, resetAllProgress } = useLearning();

  const [activeCategory, setActiveCategory] = useState<QuizCategory>('daily');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Active question set
  const getQuestions = (): QuizQuestion[] => {
    switch (activeCategory) {
      case 'components': return COMPONENT_QUIZZES;
      case 'flags': return FLAG_QUIZZES;
      case 'strategy': return STRATEGY_QUIZZES;
      case 'daily':
      default: return DAILY_CHALLENGES;
    }
  };

  const questions = getQuestions();
  const currentQ = questions[currentQuestionIdx] || questions[0];

  const handleCategoryChange = (cat: QuizCategory) => {
    setActiveCategory(cat);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswer === currentQ.correctIndex) {
      completeQuiz(currentQ.id, 40);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };

  // XP level calculation
  const getNextLevelInfo = () => {
    if (progress.xp < 200) return { next: 'Reserve Driver', target: 200, current: progress.xp };
    if (progress.xp < 500) return { next: 'Race Winner', target: 500, current: progress.xp };
    if (progress.xp < 1000) return { next: 'World Champion', target: 1000, current: progress.xp };
    return { next: 'Legendary Champion', target: 1000, current: progress.xp };
  };

  const levelInfo = getNextLevelInfo();
  const progressPercent = Math.min(100, Math.round((levelInfo.current / levelInfo.target) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-racing mb-2">
            <span className="w-2 h-2 rounded-full bg-racing" />
            <span>F1 Gamification & Academy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-plum tracking-tight">
            Pit School
          </h1>
          <p className="text-sm sm:text-base text-plum/70 max-w-2xl mt-1">
            Test your motorsport intuition, climb the licensing ladder from Rookie to World Champion, and unlock badges.
          </p>
        </div>

        {/* Reset Progress Trigger */}
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-xs font-medium text-plum/50 hover:text-racing transition-colors flex items-center space-x-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Progress</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-cosmic-200 shadow-2xl">
            <AlertTriangle className="w-10 h-10 text-racing mb-3" />
            <h3 className="text-xl font-bold font-display text-plum mb-2">Reset Learning Journey?</h3>
            <p className="text-xs text-plum/70 leading-relaxed mb-6">
              This will clear your accumulated XP, earned badges, and quiz records on this device.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  resetAllProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-racing text-white text-xs font-bold hover:bg-racing-dark"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-cosmic-100 text-plum text-xs font-semibold hover:bg-cosmic-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver License & Progression Card */}
      <div className="bg-gradient-to-br from-plum-dark via-plum to-plum-deep text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl mb-10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-racing/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-racing/20 border border-racing/40 flex items-center justify-center text-3xl shadow-lg">
              🏎️
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs text-blush font-semibold tracking-wider uppercase mb-0.5">
                <span>FIA Rookie Superlicense</span>
                <span>•</span>
                <span className="flex items-center text-amber-300">
                  <Flame className="w-3.5 h-3.5 fill-current mr-0.5" />
                  {progress.streakDays} Day Streak
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                Rank: {progress.level}
              </h2>
            </div>
          </div>

          <div className="w-full md:w-80">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-cosmic-100/70">Next Rank: {levelInfo.next}</span>
              <span className="text-blush font-mono">{progress.xp} / {levelInfo.target} XP</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/15">
              <div
                className="h-full bg-gradient-to-r from-racing to-blush rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Quiz & Badges Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Quiz Arena */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-pixie">
          {/* Quiz Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 border-b border-cosmic-200">
            {[
              { id: 'daily', label: 'Daily Challenge', icon: Flame },
              { id: 'components', label: 'Car Part Quiz', icon: Sparkles },
              { id: 'flags', label: 'Flag Master', icon: Trophy },
              { id: 'strategy', label: 'Race Strategy', icon: Award },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
                    activeCategory === cat.id
                      ? 'bg-plum text-white border-plum shadow-sm'
                      : 'bg-cosmic-50 text-plum/70 hover:bg-cosmic-100 border-cosmic-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Question Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-plum/50 font-bold uppercase tracking-wider mb-2">
              <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
              <span className="text-racing">+40 XP</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-plum leading-snug">
              {currentQ.question}
            </h3>
            {currentQ.subtitle && (
              <p className="text-xs text-plum/60 mt-1 font-medium">{currentQ.subtitle}</p>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === currentQ.correctIndex;

              let style = 'bg-cosmic-50/70 hover:bg-cosmic-100 border-cosmic-200 text-plum';
              if (isAnswerSubmitted) {
                if (isCorrect) style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                else if (isSelected && !isCorrect) style = 'bg-rose-50 border-rose-500 text-rose-900 line-through';
              } else if (isSelected) {
                style = 'bg-blush-light border-racing text-plum font-bold ring-2 ring-racing/20';
              }

              return (
                <button
                  key={i}
                  disabled={isAnswerSubmitted}
                  onClick={() => setSelectedAnswer(i)}
                  className={`w-full text-left p-4 rounded-2xl border text-sm transition-all ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Action Button & Explanation */}
          {!isAnswerSubmitted ? (
            <button
              disabled={selectedAnswer === null}
              onClick={handleSubmit}
              className="px-6 py-3 rounded-2xl bg-racing hover:bg-racing-dark disabled:opacity-40 text-white text-xs font-bold shadow-md transition-all"
            >
              Confirm Answer
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-cosmic-100 p-4 rounded-2xl border border-cosmic-200 text-xs">
                <span className="font-bold text-plum block mb-1">
                  {selectedAnswer === currentQ.correctIndex ? '🎯 Spot on!' : '💡 Technical Explanation:'}
                </span>
                <p className="text-plum/80 leading-relaxed font-normal">
                  {currentQ.explanation}
                </p>
              </div>

              {currentQuestionIdx < questions.length - 1 && (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-2xl bg-plum hover:bg-plum-dark text-white text-xs font-bold shadow-md transition-all"
                >
                  Next Question
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Badges Trophy Shelf */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-cosmic-200 shadow-pixie">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display text-plum">
              Earned Badges
            </h3>
            <span className="text-xs font-bold text-racing">
              {progress.earnedBadgeIds.length} / {BADGES.length} Unlocked
            </span>
          </div>

          <div className="space-y-3">
            {BADGES.map((badge) => {
              const isEarned = progress.earnedBadgeIds.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start space-x-3 ${
                    isEarned
                      ? 'bg-blush-light/30 border-blush/60 shadow-sm'
                      : 'bg-cosmic-50/50 border-cosmic-200/60 opacity-50 grayscale'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isEarned ? 'bg-racing text-white shadow-sm' : 'bg-cosmic-200 text-plum/40'
                    }`}
                  >
                    🏆
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-plum mb-0.5">
                      {badge.title}
                    </h4>
                    <p className="text-[11px] text-plum/70 leading-relaxed mb-1">
                      {badge.description}
                    </p>
                    <span className="text-[10px] font-semibold text-racing block">
                      {badge.conditionDescription}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
