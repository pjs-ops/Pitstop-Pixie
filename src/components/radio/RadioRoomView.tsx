import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Search, 
  Compass, 
  BookOpen, 
  Sparkles, 
  Trophy, 
  Flame, 
  Target, 
  CheckCircle2, 
  Play, 
  Filter, 
  RotateCcw,
  Headphones,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { RADIO_MESSAGES } from '../../data/radioMessages';
import { RadioMessage, RadioCategory, RadioDifficulty } from '../../types/radio';
import { 
  loadRadioProgress, 
  saveRadioProgress, 
  computeRadioStats, 
  RadioProgressState 
} from '../../services/radioStorage';
import { RadioMessageCard } from './RadioMessageCard';
import { RadioDecoderView } from './RadioDecoderView';
import { GuidedRadioChallenge } from './GuidedRadioChallenge';
import { RadioGlossaryModal } from './RadioGlossaryModal';

interface RadioRoomViewProps {
  initialRadioId?: string | null;
  onNavigateTab?: (tabId: string) => void;
}

export const RadioRoomView: React.FC<RadioRoomViewProps> = ({
  initialRadioId,
  onNavigateTab,
}) => {
  const { addXP } = useLearning();

  // Progress state
  const [radioState, setRadioState] = useState<RadioProgressState>(() => loadRadioProgress());
  const [activeMessageId, setActiveMessageId] = useState<string | null>(initialRadioId || null);
  const [guidedModeActive, setGuidedModeActive] = useState<boolean>(false);
  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(false);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'review' | 'bookmarked'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync progress changes to localStorage
  useEffect(() => {
    saveRadioProgress(radioState);
  }, [radioState]);

  // Compute live statistics
  const stats = computeRadioStats(radioState);

  // Featured Radio of the Day (determinstic based on day of month)
  const todayDay = new Date().getDate();
  const radioOfTheDay = RADIO_MESSAGES[todayDay % RADIO_MESSAGES.length] || RADIO_MESSAGES[0];

  // Handler for progress recording and XP distribution (awarded exactly once!)
  const handleSaveProgress = (
    messageId: string,
    isCorrect: boolean,
    optionId: string,
    scenarioChoiceId?: string
  ) => {
    setRadioState((prev: RadioProgressState) => {
      const existing = prev.records[messageId];
      const wasAlreadyCompleted = existing?.completed;

      // Only award XP if completing for the very first time!
      if (!wasAlreadyCompleted) {
        const msg = RADIO_MESSAGES.find((m) => m.id === messageId);
        const xpAmount = msg?.xpReward || 35;
        addXP(xpAmount, `Decoded Transmission: "${msg?.phrase.slice(0, 24)}..." 📻`);
      }

      const updatedRecord = {
        messageId,
        completed: true,
        firstAttemptCorrect: existing ? existing.firstAttemptCorrect : isCorrect,
        selectedOptionId: optionId,
        selectedScenarioChoiceId: scenarioChoiceId || existing?.selectedScenarioChoiceId,
        completedAt: new Date().toISOString(),
        bookmarked: existing ? existing.bookmarked : false,
        attemptsCount: (existing?.attemptsCount || 0) + 1,
      };

      return {
        ...prev,
        records: {
          ...prev.records,
          [messageId]: updatedRecord,
        },
      };
    });
  };

  const handleToggleBookmark = (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRadioState((prev: RadioProgressState) => {
      const current = prev.records[messageId];
      const newBookmarked = !current?.bookmarked;
      const updatedBookmarks = newBookmarked
        ? [...prev.bookmarkedIds.filter((id: string) => id !== messageId), messageId]
        : prev.bookmarkedIds.filter((id: string) => id !== messageId);

      return {
        ...prev,
        bookmarkedIds: updatedBookmarks,
        records: {
          ...prev.records,
          [messageId]: {
            messageId,
            completed: current?.completed || false,
            firstAttemptCorrect: current?.firstAttemptCorrect || false,
            selectedOptionId: current?.selectedOptionId || '',
            completedAt: current?.completedAt || '',
            selectedScenarioChoiceId: current?.selectedScenarioChoiceId,
            attemptsCount: current?.attemptsCount || 0,
            bookmarked: newBookmarked,
          },
        },
      };
    });
  };

  const handleCompleteGuided = (score: number, perfectScore: boolean) => {
    // Award bonus XP for completing the guided challenge
    const bonusXP = score * 30 + (perfectScore ? 100 : 0);
    addXP(bonusXP, `Completed Guided Radio Academy (${score}/5 correct) 🏆`);

    setRadioState((prev: RadioProgressState) => ({
      ...prev,
      guidedChallengeCompleted: true,
      guidedChallengeScore: Math.max(prev.guidedChallengeScore, score),
    }));
  };

  // Filter messages list
  const filteredMessages = RADIO_MESSAGES.filter((msg) => {
    // Category
    if (selectedCategory !== 'all' && msg.category !== selectedCategory) return false;

    // Difficulty
    if (selectedDifficulty !== 'all' && msg.difficulty !== selectedDifficulty) return false;

    // Status
    const rec = radioState.records[msg.id];
    if (statusFilter === 'completed' && !rec?.completed) return false;
    if (statusFilter === 'review' && (rec?.firstAttemptCorrect !== false || !rec?.completed)) return false;
    if (statusFilter === 'bookmarked' && !rec?.bookmarked) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inPhrase = msg.phrase.toLowerCase().includes(q);
      const inSpeaker = msg.speakerName.toLowerCase().includes(q);
      const inCircuit = msg.circuitName.toLowerCase().includes(q);
      const inTranslation = msg.plainTranslation.toLowerCase().includes(q);
      const inTerms = msg.relatedTerms.some((t) => t.toLowerCase().includes(q));
      if (!inPhrase && !inSpeaker && !inCircuit && !inTranslation && !inTerms) return false;
    }

    return true;
  });

  // If viewing an active decoder session
  if (activeMessageId) {
    const activeMsg = RADIO_MESSAGES.find((m) => m.id === activeMessageId) || RADIO_MESSAGES[0];
    const currentIndex = RADIO_MESSAGES.findIndex((m) => m.id === activeMessageId);

    const handleNavigateNext = () => {
      const nextIndex = (currentIndex + 1) % RADIO_MESSAGES.length;
      setActiveMessageId(RADIO_MESSAGES[nextIndex].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNavigatePrev = () => {
      const prevIndex = (currentIndex - 1 + RADIO_MESSAGES.length) % RADIO_MESSAGES.length;
      setActiveMessageId(RADIO_MESSAGES[prevIndex].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <RadioDecoderView
        message={activeMsg}
        record={radioState.records[activeMsg.id]}
        onBack={() => setActiveMessageId(null)}
        onSaveProgress={handleSaveProgress}
        onNavigateNext={handleNavigateNext}
        onNavigatePrev={handleNavigatePrev}
        onNavigateTab={onNavigateTab}
        currentIndex={currentIndex}
        totalMessages={RADIO_MESSAGES.length}
      />
    );
  }

  // If in Guided Mode
  if (guidedModeActive) {
    return (
      <GuidedRadioChallenge
        onBack={() => setGuidedModeActive(false)}
        onCompleteChallenge={handleCompleteGuided}
        onNavigateTab={onNavigateTab || (() => {})}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-left">
      {/* 1. EDITORIAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-racing mb-2">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Interactive Pit Wall Learning Lab</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-plum tracking-tight">
            Team Radio Decoder
          </h1>
          <p className="text-sm sm:text-base text-plum/70 max-w-2xl mt-1.5 leading-relaxed">
            Every message has a story. Learn to decode driver-engineer communications, untangle strategic jargon, and master real F1 tactical decisions.
          </p>
        </div>

        {/* Header Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setGlossaryOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-cosmic-200 text-plum font-bold text-xs flex items-center space-x-2 hover:bg-cosmic-100 hover:border-racing/50 transition-all shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-racing" />
            <span>Terminology Glossary</span>
          </button>

          <button
            onClick={() => setGuidedModeActive(true)}
            className="px-5 py-2.5 rounded-2xl bg-racing hover:bg-racing-dark text-white font-bold font-display text-xs flex items-center space-x-2 transition-all shadow-md shadow-racing/25 hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Guided Academy (5 Steps)</span>
          </button>
        </div>
      </div>

      {/* 2. METRICS & PROGRESS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-cosmic-200 shadow-pixie">
          <div className="flex items-center justify-between text-plum/60 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            <Target className="w-4 h-4 text-racing" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-display text-plum">
              {stats.completedCount}
            </span>
            <span className="text-xs text-plum/50 font-semibold font-mono">
              / {stats.totalAvailable}
            </span>
          </div>
          <div className="w-full bg-cosmic-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-racing h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.round((stats.completedCount / stats.totalAvailable) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-cosmic-200 shadow-pixie">
          <div className="flex items-center justify-between text-plum/60 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-display text-plum">
              {stats.firstAttemptAccuracy}%
            </span>
            <span className="text-[11px] text-plum/50 font-semibold">1st attempt</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
            Tactical precision rating
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-cosmic-200 shadow-pixie">
          <div className="flex items-center justify-between text-plum/60 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Radio Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-display text-plum">
              {stats.streak}
            </span>
            <span className="text-xs text-amber-600 font-bold font-mono">in a row</span>
          </div>
          <span className="text-[10px] text-plum/60 font-semibold block mt-1">
            Consecutive correct answers
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-cosmic-200 shadow-pixie">
          <div className="flex items-center justify-between text-plum/60 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Academy Rank</span>
            <Trophy className="w-4 h-4 text-racing" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold font-display text-plum truncate">
            {stats.completedCount >= 20 ? 'Pit Wall Chief 👑' : stats.completedCount >= 10 ? 'Senior Strategist 🎧' : stats.completedCount >= 5 ? 'Junior Engineer 🏎️' : 'Radio Rookie 🌱'}
          </div>
          <span className="text-[10px] text-racing font-bold font-mono block mt-1">
            {stats.totalAvailable - stats.completedCount} left to decode
          </span>
        </div>
      </div>

      {/* 3. FEATURED "RADIO OF THE DAY" HERO CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-plum via-[#2E2333] to-plum-dark text-white shadow-xl border border-blush/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-racing text-white shadow-sm">
              Radio of the Day 🌟
            </span>
            <span className="text-xs text-cosmic-200/80">
              {radioOfTheDay.circuitName} • {radioOfTheDay.lapContext}
            </span>
          </div>

          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white italic leading-tight">
            {radioOfTheDay.phrase}
          </h3>

          <p className="text-xs text-cosmic-200/90 leading-relaxed pt-1">
            <strong>Context:</strong> {radioOfTheDay.plainTranslation}
          </p>
        </div>

        <button
          onClick={() => setActiveMessageId(radioOfTheDay.id)}
          className="px-6 py-3.5 rounded-2xl bg-racing hover:bg-racing-dark text-white font-bold font-display text-xs flex items-center space-x-2 transition-all shadow-md shrink-0 hover:scale-105"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Decode Daily Radio (+{radioOfTheDay.xpReward} XP)</span>
        </button>
      </div>

      {/* 4. SEARCH & FILTER CONTROLS */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-cosmic-200 shadow-pixie space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-plum/40 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search radio phrases, drivers, circuits, or tactical keywords (e.g., Undercut, Deg, Box)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cosmic-50 border border-cosmic-200 focus:outline-none focus:border-racing text-sm font-medium text-plum placeholder:text-plum/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3 text-xs text-plum/40 hover:text-plum"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'all', label: 'All Transmissions' },
              { id: 'team_orders', label: 'Team Orders' },
              { id: 'tire_management', label: 'Tire Deg' },
              { id: 'pit_stops', label: 'Pit Stops' },
              { id: 'overtaking_drs', label: 'Overtaking & DRS' },
              { id: 'safety_car_flags', label: 'Safety Car & Flags' },
              { id: 'race_strategy', label: 'Race Strategy' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-plum text-white shadow-sm'
                    : 'bg-cosmic-50 text-plum/70 hover:bg-cosmic-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Difficulty & Status Selectors */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-cosmic-50 border border-cosmic-200 text-xs font-bold text-plum focus:outline-none cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="rookie">Rookie</option>
              <option value="intermediate">Intermediate</option>
              <option value="paddock_pro">Paddock Pro</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-cosmic-50 border border-cosmic-200 text-xs font-bold text-plum focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed Only</option>
              <option value="review">Needs Review ({stats.incorrectReviewList.length})</option>
              <option value="bookmarked">Bookmarked ({radioState.bookmarkedIds.length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. MESSAGES GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-plum/60">
            Showing {filteredMessages.length} of {RADIO_MESSAGES.length} Transmissions
          </span>

          {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || statusFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-racing hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {filteredMessages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMessages.map((msg) => (
              <RadioMessageCard
                key={msg.id}
                message={msg}
                record={radioState.records[msg.id]}
                isBookmarked={radioState.bookmarkedIds.includes(msg.id)}
                onSelect={() => {
                  setActiveMessageId(msg.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onToggleBookmark={(e) => handleToggleBookmark(msg.id, e)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-cosmic-200 shadow-pixie max-w-md mx-auto space-y-4">
            <Radio className="w-10 h-10 text-blush mx-auto animate-bounce" />
            <h4 className="font-bold font-display text-lg text-plum">
              No Transmissions Found
            </h4>
            <p className="text-xs text-plum/60 leading-relaxed">
              No radio messages matched your active filter or search criteria. Try loosening your filters or resetting your query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-racing hover:bg-racing-dark text-white font-bold text-xs shadow-sm transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Terminology Glossary Modal */}
      <RadioGlossaryModal
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
        onSelectRadioMessage={(radioId) => {
          setActiveMessageId(radioId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
};
