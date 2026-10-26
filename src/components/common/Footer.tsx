import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-cosmic-200/80 bg-white/60 backdrop-blur-sm pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏎️</span>
              <span className="font-extrabold font-display text-xl text-plum tracking-tight">
                PITSTOP PIXIE
              </span>
              <Sparkles className="w-4 h-4 text-racing animate-pulse" />
            </div>
            <p className="text-xs text-plum/70 max-w-sm leading-relaxed">
              A little magic, a lot of motorsport. Designed to transform newcomers into passionate, racecraft-savvy Formula 1 fans through 3D engineering and playful storytelling.
            </p>
            <div className="text-[11px] italic text-plum/50 pt-2 border-t border-cosmic-200 max-w-sm">
              “To achieve anything in this sport, you must be prepared to dabble on the boundary of disaster.” — Sir Stirling Moss
            </div>
          </div>

          {/* Quick Links Column 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-plum mb-3">
              Explore The Sport
            </h4>
            <ul className="space-y-2 text-xs text-plum/70">
              <li>
                <button onClick={() => onNavigate('garage')} className="hover:text-racing transition-colors">
                  The Garage (3D Car)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('paddock')} className="hover:text-racing transition-colors">
                  The Paddock (Drivers & Teams)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('circuits')} className="hover:text-racing transition-colors">
                  Circuit Safari
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-plum mb-3">
              Learn & Test
            </h4>
            <ul className="space-y-2 text-xs text-plum/70">
              <li>
                <button onClick={() => onNavigate('raceday')} className="hover:text-racing transition-colors">
                  Race Day 101 Lessons
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('school')} className="hover:text-racing transition-colors">
                  Pit School Quizzes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('radio')} className="hover:text-racing transition-colors font-bold text-racing flex items-center space-x-1">
                  <span>Team Radio Decoder 📻</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Checkered Flag Motif */}
        <div className="pt-6 border-t border-cosmic-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-plum/50 gap-4">
          <div className="flex items-center space-x-2">
            <span>🏁</span>
            <span>Crafted with passion for Formula 1 fans everywhere. Independent educational platform.</span>
          </div>

          <div className="flex items-center space-x-1">
            <span>Formula 1, F1, and related marks are trademarks of Formula One Licensing B.V.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
