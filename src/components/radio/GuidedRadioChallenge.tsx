import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Award, CheckCircle2, RotateCcw, Sparkles, Trophy, Radio } from 'lucide-react';
import { RADIO_MESSAGES } from '../../data/radioMessages';
import { RadioMessage } from '../../types/radio';
import { RadioMessagePlayer } from './RadioMessagePlayer';
import { DecodeQuestion } from './DecodeQuestion';

interface GuidedRadioChallengeProps {
  onBack: () => void;
  onCompleteChallenge: (score: number, perfectScore: boolean) => void;
  onNavigateTab: (tabId: string) => void;
}

export const GuidedRadioChallenge: React.FC<GuidedRadioChallengeProps> = ({
  onBack,
  onCompleteChallenge,
  onNavigateTab,
}) => {
  // Curate 5 representative messages covering the 5 key learning steps
  const guidedMessages: RadioMessage[] = [
    RADIO_MESSAGES.find((m) => m.id === 'msg_orders_01') || RADIO_MESSAGES[0],
    RADIO_MESSAGES.find((m) => m.id === 'msg_tire_01') || RADIO_MESSAGES[4],
    RADIO_MESSAGES.find((m) => m.id === 'msg_pit_01') || RADIO_MESSAGES[8],
    RADIO_MESSAGES.find((m) => m.id === 'msg_overtake_01') || RADIO_MESSAGES[12],
    RADIO_MESSAGES.find((m) => m.id === 'msg_sc_01') || RADIO_MESSAGES[16],
  ];

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, { optionId: string; isCorrect: boolean }>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentMessage = guidedMessages[stepIndex];
  const totalSteps = guidedMessages.length;
  const currentAnswer = answers[stepIndex];

  const handleAnswer = (optionId: string, isCorrect: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [stepIndex]: { optionId, isCorrect },
    }));
  };

  const handleNext = () => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      // Calculate final score
      const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
      const isPerfect = correctCount === totalSteps;
      setIsCompleted(true);
      onCompleteChallenge(correctCount, isPerfect);
    }
  };

  const handleRestart = () => {
    setStepIndex(0);
    setAnswers({});
    setIsCompleted(false);
  };

  const stepTitles = [
    '1. Basic Team Instruction',
    '2. Tire Degradation Call',
    '3. High-Stakes Pit Stop',
    '4. DRS & Overtaking Command',
    '5. Safety Car Reaction',
  ];

  if (isCompleted) {
    const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
    const isPerfect = correctCount === totalSteps;
    const pct = Math.round((correctCount / totalSteps) * 100);

    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-8 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-racing to-blush flex items-center justify-center text-white text-3xl mx-auto shadow-xl shadow-racing/25 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-racing">
            Guided Radio Academy Completed!
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-plum mt-1">
            {isPerfect ? 'Paddock Decoder Master! 🏆' : 'Great Decoding Drive! 🏁'}
          </h2>
          <p className="text-sm text-plum/70 max-w-md mx-auto mt-2">
            You scored {correctCount} of {totalSteps} ({pct}%) on real driver-engineer communications.
          </p>
        </div>

        {/* Score Card */}
        <div className="p-6 rounded-3xl bg-white border border-cosmic-200 shadow-pixie text-left space-y-4">
          <h4 className="font-bold font-display text-base text-plum">
            Transmission Accuracy Summary
          </h4>
          <div className="space-y-2">
            {guidedMessages.map((msg, idx) => {
              const ans = answers[idx];
              return (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl flex items-center justify-between text-xs border ${
                    ans?.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{stepTitles[idx]}</span>
                  </div>
                  <span className="font-bold">
                    {ans?.isCorrect ? 'Correct (+XP)' : 'Review Needed'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-cosmic-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-plum/70">Bonus XP Awarded:</span>
            <span className="font-mono font-bold text-racing text-sm">
              +{correctCount * 30 + (isPerfect ? 100 : 0)} XP
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-2xl bg-white border border-cosmic-200 text-plum font-bold text-xs flex items-center space-x-2 hover:bg-cosmic-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-racing" />
            <span>Retry Challenge</span>
          </button>

          <button
            onClick={() => onNavigateTab('paddock')}
            className="px-6 py-3 rounded-2xl bg-cosmic-100 border border-cosmic-200 text-plum font-bold text-xs flex items-center space-x-2 hover:bg-cosmic-200 transition-all"
          >
            <span>Explore The Paddock</span>
          </button>

          <button
            onClick={onBack}
            className="px-7 py-3 rounded-2xl bg-racing hover:bg-racing-dark text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md"
          >
            <span>Return to Radio Room</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left animate-fade-in">
      {/* Top Header & Step Progress Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-2xl bg-white border border-cosmic-200 text-plum font-bold text-xs flex items-center space-x-2 hover:bg-cosmic-100 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-racing" />
          <span>Exit Guided Mode</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold font-display text-plum uppercase tracking-wider">
            Step {stepIndex + 1} of {totalSteps}: {stepTitles[stepIndex]}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-racing text-white uppercase font-mono">
            GUIDED
          </span>
        </div>
      </div>

      {/* Visual Multi-step Progress Bar */}
      <div className="grid grid-cols-5 gap-2">
        {guidedMessages.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === stepIndex
                ? 'bg-racing'
                : idx < stepIndex
                ? 'bg-emerald-500'
                : 'bg-cosmic-200'
            }`}
          />
        ))}
      </div>

      {/* Transmission Player */}
      <RadioMessagePlayer message={currentMessage} />

      {/* Decode Question */}
      <DecodeQuestion
        prompt={currentMessage.question.prompt}
        subtext={currentMessage.question.subtext}
        options={currentMessage.question.options}
        onAnswerSelected={handleAnswer}
        alreadyAnsweredOptionId={currentAnswer?.optionId}
      />

      {/* Next Step / Complete Button */}
      {currentAnswer && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleNext}
            className="px-8 py-3.5 rounded-2xl bg-racing hover:bg-racing-dark text-white font-bold font-display text-xs flex items-center space-x-2 transition-all shadow-md hover:scale-[1.02]"
          >
            <span>{stepIndex === totalSteps - 1 ? 'View Final Debrief' : 'Proceed to Next Transmission'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
