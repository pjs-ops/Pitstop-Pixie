import React from 'react';
import { Bookmark, CheckCircle2, ChevronRight, Radio, Sparkles, AlertCircle } from 'lucide-react';
import { RadioMessage, UserRadioRecord } from '../../types/radio';

interface RadioMessageCardProps {
  message: RadioMessage;
  record?: UserRadioRecord;
  isBookmarked: boolean;
  onSelect: () => void;
  onToggleBookmark: (e: React.MouseEvent) => void;
}

export const RadioMessageCard: React.FC<RadioMessageCardProps> = ({
  message,
  record,
  isBookmarked,
  onSelect,
  onToggleBookmark,
}) => {
  const isCompleted = !!record?.completed;
  const isMastered = !!record?.firstAttemptCorrect;
  const hasAttempted = (record?.attemptsCount || 0) > 0;

  const categoryLabels: Record<string, string> = {
    team_orders: 'Team Orders',
    tire_management: 'Tire Deg',
    pit_stops: 'Pit Stops',
    overtaking_drs: 'Overtaking & DRS',
    safety_car_flags: 'Safety Car & Flags',
    race_strategy: 'Race Strategy',
  };

  const difficultyColors: Record<string, string> = {
    rookie: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    intermediate: 'bg-amber-100 text-amber-900 border-amber-200',
    paddock_pro: 'bg-purple-100 text-purple-900 border-purple-200',
  };

  const difficultyLabels: Record<string, string> = {
    rookie: 'Rookie',
    intermediate: 'Intermediate',
    paddock_pro: 'Paddock Pro',
  };

  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer rounded-3xl p-5 sm:p-6 border transition-all text-left flex flex-col justify-between relative overflow-hidden ${
        isCompleted
          ? 'bg-white/95 border-emerald-300 shadow-sm hover:shadow-pixie hover:border-emerald-500'
          : 'bg-white border-cosmic-200/90 shadow-pixie hover:shadow-pixie-hover hover:border-racing/50'
      }`}
    >
      {/* Top Meta Line: Category, Difficulty, Bookmark */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-lavender/60 text-plum border border-lavender">
              {categoryLabels[message.category] || message.category}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                difficultyColors[message.difficulty]
              }`}
            >
              {difficultyLabels[message.difficulty]}
            </span>
          </div>

          <button
            onClick={onToggleBookmark}
            className={`p-1.5 rounded-xl transition-colors ${
              isBookmarked
                ? 'text-racing bg-racing/10'
                : 'text-plum/30 hover:text-plum hover:bg-cosmic-100'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark message'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Radio Phrase Quote */}
        <h4 className="font-display font-bold text-base sm:text-lg text-plum line-clamp-2 leading-snug group-hover:text-racing transition-colors mb-2">
          {message.phrase}
        </h4>

        {/* Speaker & Context line */}
        <div className="flex items-center space-x-1.5 text-xs text-plum/60 mb-4">
          <Radio className="w-3.5 h-3.5 text-racing shrink-0" />
          <span className="font-semibold text-plum/80">{message.speakerName}</span>
          <span>•</span>
          <span className="truncate">{message.circuitName}</span>
        </div>
      </div>

      {/* Bottom Status & Action Bar */}
      <div className="pt-3.5 border-t border-cosmic-200/80 flex items-center justify-between text-xs">
        {/* Completion Status */}
        <div>
          {isCompleted ? (
            <span className="flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100 text-emerald-600" />
              <span>{isMastered ? 'Decoded (100%)' : 'Completed'}</span>
            </span>
          ) : hasAttempted ? (
            <span className="flex items-center space-x-1 text-amber-700 font-bold text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Needs Review</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-plum/40 font-semibold text-[11px]">
              <span>Ready to decode</span>
            </span>
          )}
        </div>

        {/* XP Reward & Arrow */}
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-racing/10 text-racing border border-racing/20">
            +{message.xpReward} XP
          </span>
          <div className="w-6 h-6 rounded-xl bg-cosmic-100 group-hover:bg-racing group-hover:text-white flex items-center justify-center transition-colors text-plum/60">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
