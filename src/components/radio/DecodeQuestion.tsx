import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { RadioOption } from '../../types/radio';

interface DecodeQuestionProps {
  prompt: string;
  subtext?: string;
  options: RadioOption[];
  onAnswerSelected: (optionId: string, isCorrect: boolean) => void;
  alreadyAnsweredOptionId?: string;
  disabled?: boolean;
}

export const DecodeQuestion: React.FC<DecodeQuestionProps> = ({
  prompt,
  subtext,
  options,
  onAnswerSelected,
  alreadyAnsweredOptionId,
  disabled = false,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(alreadyAnsweredOptionId || null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!alreadyAnsweredOptionId);

  useEffect(() => {
    if (alreadyAnsweredOptionId) {
      setSelectedOptionId(alreadyAnsweredOptionId);
      setIsSubmitted(true);
    } else {
      setSelectedOptionId(null);
      setIsSubmitted(false);
    }
  }, [alreadyAnsweredOptionId, prompt]);

  // Keyboard shortcut listener for options (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted || disabled) return;
      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= options.length) {
        e.preventDefault();
        const chosen = options[keyNum - 1];
        if (chosen) {
          handleSelect(chosen.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, disabled, options]);

  const handleSelect = (optionId: string) => {
    if (isSubmitted || disabled) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted || disabled) return;
    const option = options.find((o) => o.id === selectedOptionId);
    if (!option) return;

    setIsSubmitted(true);
    onAnswerSelected(option.id, option.isCorrect);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200/90 shadow-pixie text-left space-y-6">
      {/* Question Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-racing mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Decode Challenge • Tactical Question</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-display text-plum leading-snug">
          {prompt}
        </h3>
        {subtext && (
          <p className="text-xs sm:text-sm text-plum/70 mt-1">
            {subtext}
          </p>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          let containerStyle = 'border-cosmic-200 bg-white hover:border-racing/60 hover:bg-cosmic-50/50';
          let badgeStyle = 'bg-cosmic-100 text-plum/80 border-cosmic-200';

          if (isSubmitted) {
            if (option.isCorrect) {
              containerStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 shadow-sm';
              badgeStyle = 'bg-emerald-500 text-white border-emerald-600';
            } else if (isSelected && !option.isCorrect) {
              containerStyle = 'border-rose-400 bg-rose-50/70 text-rose-950 shadow-sm';
              badgeStyle = 'bg-rose-500 text-white border-rose-600';
            } else {
              containerStyle = 'border-cosmic-200/60 bg-cosmic-50/40 opacity-60 text-plum/50';
            }
          } else if (isSelected) {
            containerStyle = 'border-racing bg-blush-light/40 shadow-sm ring-2 ring-racing/20';
            badgeStyle = 'bg-racing text-white border-racing';
          }

          return (
            <div
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`p-4 sm:p-4.5 rounded-2xl border transition-all cursor-pointer ${containerStyle} ${
                disabled || isSubmitted ? 'cursor-default' : ''
              }`}
            >
              <div className="flex items-start space-x-3.5">
                {/* Option Letter Badge & Keyboard Hint */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-display border shrink-0 transition-colors ${badgeStyle}`}
                >
                  {option.label}
                </div>

                <div className="flex-1 text-sm font-medium leading-relaxed pt-0.5">
                  <span>{option.text}</span>

                  {/* Feedback Explanation displayed once submitted */}
                  {isSubmitted && (
                    <div
                      className={`mt-2.5 pt-2.5 border-t text-xs leading-relaxed flex items-start space-x-2 ${
                        option.isCorrect
                          ? 'border-emerald-200 text-emerald-800'
                          : 'border-rose-200 text-rose-800'
                      }`}
                    >
                      {option.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                      )}
                      <span>{option.explanation}</span>
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                {!isSubmitted && (
                  <span className="hidden sm:inline-block text-[10px] font-mono text-plum/30 px-2 py-0.5 rounded-md border border-cosmic-200">
                    Press {index + 1}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Action */}
      {!isSubmitted && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!selectedOptionId || disabled}
            className={`px-7 py-3 rounded-2xl font-bold font-display text-xs flex items-center space-x-2 transition-all shadow-md ${
              selectedOptionId
                ? 'bg-racing hover:bg-racing-dark text-white cursor-pointer hover:scale-[1.02]'
                : 'bg-cosmic-200 text-plum/40 cursor-not-allowed'
            }`}
          >
            <span>Confirm Interpretation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
