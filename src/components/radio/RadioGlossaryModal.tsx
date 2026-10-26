import React, { useState } from 'react';
import { X, Search, BookOpen, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { RADIO_GLOSSARY } from '../../data/radioGlossary';
import { RadioGlossaryItem } from '../../types/radio';

interface RadioGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTermId?: string | null;
  onSelectRadioMessage?: (radioId: string) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const RadioGlossaryModal: React.FC<RadioGlossaryModalProps> = ({
  isOpen,
  onClose,
  initialTermId,
  onSelectRadioMessage,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTermId, setSelectedTermId] = useState<string | null>(initialTermId || null);

  if (!isOpen) return null;

  const filteredTerms = RADIO_GLOSSARY.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.term.toLowerCase().includes(q) ||
      item.shortDefinition.toLowerCase().includes(q) ||
      (item.phoneticOrAlias && item.phoneticOrAlias.toLowerCase().includes(q))
    );
  });

  const activeTerm: RadioGlossaryItem = 
    RADIO_GLOSSARY.find((t) => t.id === selectedTermId) || 
    filteredTerms[0] || 
    RADIO_GLOSSARY[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] border border-cosmic-200 shadow-2xl flex flex-col overflow-hidden text-left">
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-cosmic-200 flex items-center justify-between bg-cosmic-50/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-lavender flex items-center justify-center text-plum text-lg shadow-sm">
              <BookOpen className="w-5 h-5 text-plum" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold font-display text-plum">
                  F1 Pit Wall Terminology Glossary
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-racing text-white uppercase tracking-wider">
                  {RADIO_GLOSSARY.length} Terms
                </span>
              </div>
              <p className="text-xs text-plum/60 mt-0.5">
                Every motorsport buzzword explained with relatable real-world analogies.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-cosmic-200 text-plum/50 hover:text-plum transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: Left terms list, Right detailed card */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: Search & Term Pills */}
          <div className="md:col-span-5 border-r border-cosmic-200 flex flex-col h-full bg-cosmic-50/30">
            {/* Search Input */}
            <div className="p-3.5 border-b border-cosmic-200 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-plum/40 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search jargon (e.g., Undercut, Box)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-cosmic-100/80 border border-cosmic-200 focus:outline-none focus:border-racing text-plum placeholder:text-plum/40"
                />
              </div>
            </div>

            {/* Terms List Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[350px] md:max-h-none">
              {filteredTerms.map((term) => {
                const isSelected = activeTerm.id === term.id;
                return (
                  <div
                    key={term.id}
                    onClick={() => setSelectedTermId(term.id)}
                    className={`p-3 rounded-2xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-plum text-white border-plum shadow-sm'
                        : 'bg-white hover:bg-cosmic-100 text-plum border-cosmic-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-display text-xs">
                        {term.term}
                      </span>
                      {term.phoneticOrAlias && (
                        <span
                          className={`text-[10px] font-mono ${
                            isSelected ? 'text-cosmic-200/70' : 'text-plum/50'
                          }`}
                        >
                          {term.phoneticOrAlias}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[11px] truncate mt-1 ${
                        isSelected ? 'text-cosmic-200/80' : 'text-plum/60'
                      }`}
                    >
                      {term.shortDefinition}
                    </p>
                  </div>
                );
              })}

              {filteredTerms.length === 0 && (
                <div className="text-center py-8 text-xs text-plum/50">
                  No terms matched "{searchQuery}".
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Term Card */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-5 bg-white">
            {activeTerm && (
              <>
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-racing mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Pit Wall Deep Dive</span>
                  </div>
                  <h2 className="text-2xl font-extrabold font-display text-plum">
                    {activeTerm.term}
                  </h2>
                  {activeTerm.phoneticOrAlias && (
                    <span className="text-xs font-mono text-plum/50">
                      {activeTerm.phoneticOrAlias}
                    </span>
                  )}
                </div>

                {/* Concise Definition */}
                <div className="p-4 rounded-2xl bg-cosmic-50 border border-cosmic-200 text-xs sm:text-sm text-plum/80 leading-relaxed">
                  <strong className="text-plum block mb-1">Definition:</strong>
                  {activeTerm.shortDefinition}
                </div>

                {/* Relatable Analogy */}
                <div className="p-4 rounded-2xl bg-blush-light/50 border border-blush/60 text-xs sm:text-sm text-plum/90 leading-relaxed">
                  <strong className="text-racing block mb-1">💡 Rookie Analogy:</strong>
                  {activeTerm.beginnerAnalogy}
                </div>

                {/* Race Significance */}
                <div className="space-y-1 text-xs text-plum/80 leading-relaxed">
                  <strong className="text-plum block">Why It Matters in a Grand Prix:</strong>
                  <p>{activeTerm.raceSignificance}</p>
                </div>

                {/* Radio Snippet Quote */}
                <div className="p-3.5 rounded-2xl bg-plum text-white text-xs border border-white/10 italic">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cosmic-200/60 block not-italic mb-1">
                    Example Pit Radio:
                  </span>
                  {activeTerm.exampleRadioSnippet}
                </div>

                {/* Actions: Jump to related message or learning tab */}
                <div className="pt-3 border-t border-cosmic-200 flex flex-wrap items-center gap-3">
                  {activeTerm.relatedRadioId && onSelectRadioMessage && (
                    <button
                      onClick={() => {
                        onSelectRadioMessage(activeTerm.relatedRadioId!);
                        onClose();
                      }}
                      className="px-4 py-2.5 rounded-xl bg-racing hover:bg-racing-dark text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-sm"
                    >
                      <span>Decode Related Radio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {activeTerm.relatedTab && onNavigateTab && (
                    <button
                      onClick={() => {
                        onNavigateTab(activeTerm.relatedTab!);
                        onClose();
                      }}
                      className="px-4 py-2.5 rounded-xl bg-cosmic-100 hover:bg-cosmic-200 text-plum font-bold text-xs flex items-center space-x-1.5 transition-all border border-cosmic-200"
                    >
                      <span>Open Learning Section</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
