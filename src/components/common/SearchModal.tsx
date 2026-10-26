import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { DRIVERS } from '../../data/drivers';
import { TEAMS } from '../../data/teams';
import { CIRCUITS } from '../../data/circuits';
import { CAR_COMPONENTS } from '../../data/carComponents';
import { GLOSSARY } from '../../data/glossary';
import { LESSONS } from '../../data/lessons';
import { RADIO_MESSAGES } from '../../data/radioMessages';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string, itemParam?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Results
  const matchedDrivers = q ? DRIVERS.filter((d) => d.name.toLowerCase().includes(q) || d.teamName.toLowerCase().includes(q)) : [];
  const matchedTeams = q ? TEAMS.filter((t) => t.name.toLowerCase().includes(q) || t.fullName.toLowerCase().includes(q)) : [];
  const matchedComponents = q ? CAR_COMPONENTS.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) : [];
  const matchedCircuits = q ? CIRCUITS.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)) : [];
  const matchedLessons = q ? LESSONS.filter((l) => l.title.toLowerCase().includes(q) || l.overview.toLowerCase().includes(q)) : [];
  const matchedTerms = q ? GLOSSARY.filter((g) => g.term.toLowerCase().includes(q) || g.simpleDefinition.toLowerCase().includes(q)) : [];
  const matchedRadios = q ? RADIO_MESSAGES.filter((r) => r.phrase.toLowerCase().includes(q) || r.plainTranslation.toLowerCase().includes(q) || r.speakerName.toLowerCase().includes(q)) : [];

  const totalResults = matchedDrivers.length + matchedTeams.length + matchedComponents.length +
                       matchedCircuits.length + matchedLessons.length + matchedTerms.length + matchedRadios.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-cosmic-200 shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-cosmic-200 flex items-center space-x-3">
          <Search className="w-5 h-5 text-racing shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search drivers, 3D parts, circuits, rules, or F1 terms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base sm:text-lg font-medium text-plum focus:outline-none placeholder:text-plum/30"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-cosmic-100 text-plum/50 hover:text-plum transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {q.length === 0 ? (
            <div className="text-center py-8 text-plum/50 text-xs">
              <Sparkles className="w-6 h-6 text-blush mx-auto mb-2 animate-bounce" />
              <span>Type to search across all components, circuits, drivers, and lessons.</span>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-plum/50 text-xs">
              <span>No results found for "{query}". Try "wing", "Verstappen", "Monaco", or "DRS".</span>
            </div>
          ) : (
            <>
              {/* Components */}
              {matchedComponents.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-plum/40 mb-2">
                    3D Car Components ({matchedComponents.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedComponents.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onNavigate('garage', c.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-cosmic-100 flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <span className="font-bold text-plum">{c.name}</span>
                          <span className="text-plum/50 ml-2">({c.categoryLabel})</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-racing" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Drivers */}
              {matchedDrivers.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-plum/40 mb-2">
                    Drivers ({matchedDrivers.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedDrivers.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          onNavigate('paddock');
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-cosmic-100 flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <span className="font-bold text-plum">{d.flag} {d.name}</span>
                          <span className="text-plum/50 ml-2">#{d.number} • {d.teamName}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-racing" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Circuits */}
              {matchedCircuits.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-plum/40 mb-2">
                    Circuits ({matchedCircuits.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedCircuits.map((circ) => (
                      <button
                        key={circ.id}
                        onClick={() => {
                          onNavigate('circuits');
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-cosmic-100 flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <span className="font-bold text-plum">{circ.flag} {circ.name}</span>
                          <span className="text-plum/50 ml-2">{circ.location}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-racing" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lessons */}
              {matchedLessons.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-plum/40 mb-2">
                    Race Day 101 Lessons ({matchedLessons.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedLessons.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          onNavigate('raceday');
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-cosmic-100 flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <span className="font-bold text-plum">{l.title}</span>
                          <span className="text-plum/50 ml-2">({l.estimatedMinutes} min)</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-racing" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Radio Transmissions */}
              {matchedRadios.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-plum/40 mb-2">
                    Pit Wall Radio Transmissions ({matchedRadios.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedRadios.slice(0, 4).map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          onNavigate('radio', r.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-cosmic-100 flex items-center justify-between text-xs transition-colors border border-cosmic-200/50"
                      >
                        <div>
                          <span className="font-bold text-plum italic">"{r.phrase}"</span>
                          <span className="text-racing block text-[10px] mt-0.5">{r.speakerName} • {r.circuitName}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-racing shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Glossary Terms */}
              {matchedTerms.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-plum/40 mb-2">
                    F1 Terminology ({matchedTerms.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedTerms.map((term, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-cosmic-50 text-xs">
                        <span className="font-bold text-plum">{term.term}</span>
                        <p className="text-plum/70 mt-0.5">{term.simpleDefinition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
