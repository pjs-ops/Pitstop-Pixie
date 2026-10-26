import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, BookOpen, ExternalLink, Lightbulb, CheckCircle2 } from 'lucide-react';
import { RadioMessage, UserRadioRecord } from '../../types/radio';
import { RadioMessagePlayer } from './RadioMessagePlayer';
import { DecodeQuestion } from './DecodeQuestion';
import { ScenarioDecision } from './ScenarioDecision';
import { RadioGlossaryModal } from './RadioGlossaryModal';

interface RadioDecoderViewProps {
  message: RadioMessage;
  record?: UserRadioRecord;
  onBack: () => void;
  onSaveProgress: (
    messageId: string,
    isCorrect: boolean,
    optionId: string,
    scenarioChoiceId?: string
  ) => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  onNavigateTab?: (tabId: string) => void;
  currentIndex?: number;
  totalMessages?: number;
}

export const RadioDecoderView: React.FC<RadioDecoderViewProps> = ({
  message,
  record,
  onBack,
  onSaveProgress,
  onNavigateNext,
  onNavigatePrev,
  onNavigateTab,
  currentIndex,
  totalMessages,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(record?.selectedOptionId || null);
  const [selectedScenarioChoiceId, setSelectedScenarioChoiceId] = useState<string | null>(
    record?.selectedScenarioChoiceId || null
  );
  const [isAnswered, setIsAnswered] = useState<boolean>(!!record?.completed);
  const [glossaryModalOpen, setGlossaryModalOpen] = useState<boolean>(false);
  const [activeGlossaryTermId, setActiveGlossaryTermId] = useState<string | null>(null);

  const handleAnswerSelected = (optionId: string, isCorrect: boolean) => {
    setSelectedOptionId(optionId);
    setIsAnswered(true);
    onSaveProgress(message.id, isCorrect, optionId, selectedScenarioChoiceId || undefined);
  };

  const handleScenarioChoice = (choiceId: string) => {
    setSelectedScenarioChoiceId(choiceId);
    if (selectedOptionId) {
      const isCorrect = message.question.options.find((o) => o.id === selectedOptionId)?.isCorrect || false;
      onSaveProgress(message.id, isCorrect, selectedOptionId, choiceId);
    }
  };

  const openGlossary = (termId: string) => {
    setActiveGlossaryTermId(termId);
    setGlossaryModalOpen(true);
  };

  const categoryLabels: Record<string, string> = {
    team_orders: 'Team Orders',
    tire_management: 'Tire Management',
    pit_stops: 'Pit Stops',
    overtaking_drs: 'Overtaking & DRS',
    safety_car_flags: 'Safety Car & Flags',
    race_strategy: 'Race Strategy',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in text-left">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-2xl bg-white border border-cosmic-200 text-plum font-bold text-xs flex items-center space-x-2 hover:bg-cosmic-100 hover:border-racing/50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-racing" />
          <span>Back to Radio Room</span>
        </button>

        <div className="flex items-center space-x-2">
          {currentIndex !== undefined && totalMessages !== undefined && (
            <span className="text-xs font-mono font-bold text-plum/60 px-3 py-1 rounded-xl bg-cosmic-200/50">
              Transmission {currentIndex + 1} of {totalMessages}
            </span>
          )}

          <div className="flex items-center space-x-1">
            {onNavigatePrev && (
              <button
                onClick={onNavigatePrev}
                className="p-2 rounded-xl bg-white border border-cosmic-200 hover:bg-cosmic-100 text-plum/70 text-xs font-bold"
                title="Previous message"
              >
                ←
              </button>
            )}
            {onNavigateNext && (
              <button
                onClick={onNavigateNext}
                className="p-2 rounded-xl bg-white border border-cosmic-200 hover:bg-cosmic-100 text-plum/70 text-xs font-bold"
                title="Next message"
              >
                →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION A: Audio Player & Live Transmission */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-lavender text-plum border border-lavender">
            {categoryLabels[message.category] || message.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-racing/10 text-racing border border-racing/20 font-mono">
            +{message.xpReward} XP Reward
          </span>
        </div>

        <RadioMessagePlayer message={message} />
      </div>

      {/* SECTION B: Decode Question */}
      <DecodeQuestion
        prompt={message.question.prompt}
        subtext={message.question.subtext}
        options={message.question.options}
        onAnswerSelected={handleAnswerSelected}
        alreadyAnsweredOptionId={record?.selectedOptionId}
      />

      {/* SECTION C: Educational Translation & Debrief (Revealed once submitted) */}
      {isAnswered && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-pixie space-y-6 animate-fade-in">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-racing mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Decoded Transmission Briefing</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-plum">
              Plain-English Breakdown & Tactical Context
            </h3>
          </div>

          {/* Plain Translation Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-cosmic-50 border border-cosmic-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-plum/50 block mb-1">
              Plain-English Translation:
            </span>
            <p className="text-sm sm:text-base font-semibold text-plum leading-relaxed">
              "{message.plainTranslation}"
            </p>
          </div>

          {/* Technical Context & Significance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-cosmic-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-plum/50 block mb-1">
                Technical Mechanism:
              </span>
              <p className="text-xs sm:text-sm text-plum/80 leading-relaxed">
                {message.technicalExplanation}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-cosmic-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-plum/50 block mb-1">
                Strategic Importance:
              </span>
              <p className="text-xs sm:text-sm text-plum/80 leading-relaxed">
                {message.whyItMatters}
              </p>
            </div>
          </div>

          {/* Race Engineer's Insider Tip */}
          <div className="p-4 rounded-2xl bg-blush-light/50 border border-blush/60 flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-racing shrink-0 mt-0.5" />
            <div className="text-xs text-plum/90 leading-relaxed">
              <strong className="text-racing block mb-0.5">Pit Wall Pro Tip:</strong>
              {message.engineerTip}
            </div>
          </div>

          {/* Related Terminology Chips */}
          {message.relatedTerms.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-plum/50 block mb-2">
                Click terminology to open glossary definition:
              </span>
              <div className="flex flex-wrap gap-2">
                {message.relatedTerms.map((termSlug) => (
                  <button
                    key={termSlug}
                    onClick={() => openGlossary(termSlug)}
                    className="px-3 py-1.5 rounded-xl bg-lavender/50 hover:bg-lavender text-plum font-bold text-xs flex items-center space-x-1.5 border border-lavender transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-racing" />
                    <span className="capitalize">{termSlug.replace(/_/g, ' ')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION D: Signature Branching Race Scenario Decision */}
      {isAnswered && (
        <ScenarioDecision
          scenario={message.followUpScenario}
          onChoiceSelected={handleScenarioChoice}
          savedChoiceId={record?.selectedScenarioChoiceId}
        />
      )}

      {/* SECTION E: Next Transmission Footer */}
      {isAnswered && (
        <div className="p-6 rounded-3xl bg-plum text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold font-display text-sm sm:text-base text-white">
                Transmission Decoded & Logged!
              </h4>
              <p className="text-xs text-cosmic-200/70">
                You earned +{message.xpReward} XP. Ready for the next pit wall call?
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {message.relatedSection && onNavigateTab && (
              <button
                onClick={() => onNavigateTab(message.relatedSection!.tabId)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center space-x-1.5 transition-all"
              >
                <span>{message.relatedSection.label}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            {onNavigateNext ? (
              <button
                onClick={onNavigateNext}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-racing hover:bg-racing-dark text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                <span>Next Transmission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onBack}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-racing hover:bg-racing-dark text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                <span>Return to Radio Room</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Terminology Glossary Modal */}
      <RadioGlossaryModal
        isOpen={glossaryModalOpen}
        onClose={() => setGlossaryModalOpen(false)}
        initialTermId={activeGlossaryTermId}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
};
