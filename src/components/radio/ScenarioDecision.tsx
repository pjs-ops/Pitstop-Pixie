import React, { useState } from 'react';
import { GitBranch, Check, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { BranchingScenario, ScenarioChoice } from '../../types/radio';

interface ScenarioDecisionProps {
  scenario: BranchingScenario;
  onChoiceSelected: (choiceId: string) => void;
  savedChoiceId?: string;
}

export const ScenarioDecision: React.FC<ScenarioDecisionProps> = ({
  scenario,
  onChoiceSelected,
  savedChoiceId,
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(savedChoiceId || null);

  const handleSelect = (choice: ScenarioChoice) => {
    setSelectedChoiceId(choice.id);
    onChoiceSelected(choice.id);
  };

  const activeChoice = scenario.choices.find((c) => c.id === selectedChoiceId);

  return (
    <div className="bg-gradient-to-br from-white via-cosmic-50 to-blush-light/30 rounded-3xl p-6 sm:p-8 border border-blush/60 shadow-pixie text-left space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-racing mb-2">
          <GitBranch className="w-4 h-4" />
          <span>Branching Race Decision • Tactical Strategy</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-display text-plum">
          {scenario.title}
        </h3>
        <p className="text-xs sm:text-sm text-plum/80 leading-relaxed mt-2 p-3.5 rounded-2xl bg-white border border-cosmic-200">
          <strong>Race Situation:</strong> {scenario.situation}
        </p>
      </div>

      {/* Decision Prompt */}
      <div>
        <span className="text-xs font-bold font-display text-plum uppercase tracking-wider block mb-3">
          {scenario.prompt}
        </span>

        {/* Choices List */}
        <div className="space-y-3">
          {scenario.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;

            return (
              <button
                key={choice.id}
                onClick={() => handleSelect(choice)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? choice.isOptimal
                      ? 'border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-400/30'
                      : 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-400/30'
                    : 'border-cosmic-200 bg-white hover:border-racing/50 hover:bg-cosmic-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-bold font-display text-sm text-plum flex items-center space-x-2">
                      <span>{choice.label}</span>
                      {isSelected && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${
                            choice.isOptimal ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}
                        >
                          {choice.isOptimal ? 'Optimal Strategy ✨' : 'High Risk Trade-off ⚠️'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-plum/70 leading-relaxed">
                      {choice.action}
                    </p>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? choice.isOptimal
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-amber-600 text-white border-amber-600'
                        : 'border-cosmic-200 bg-cosmic-100 text-plum/40'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Consequence Reveal Panel */}
      {activeChoice && (
        <div
          className={`p-5 rounded-2xl border transition-all ${
            activeChoice.isOptimal
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : 'bg-amber-50/90 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-2">
            {activeChoice.isOptimal ? (
              <Sparkles className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span>Tactical Consequence Outcome</span>
          </div>

          <p className="text-sm font-medium leading-relaxed mb-3">
            {activeChoice.consequence}
          </p>

          <div className="pt-2.5 border-t border-black/10 text-xs text-plum/70">
            <strong>Pit Wall Assessment:</strong> {activeChoice.tacticalTradeoff}
          </div>
        </div>
      )}
    </div>
  );
};
