import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { HomeView } from './components/home/HomeView';
import { GarageView } from './components/garage/GarageView';
import { PaddockView } from './components/paddock/PaddockView';
import { CircuitSafariView } from './components/circuit/CircuitSafariView';
import { RaceDayView } from './components/raceday/RaceDayView';
import { PitSchoolView } from './components/school/PitSchoolView';
import { StrategyRoomView } from './components/strategy/StrategyRoomView';
import { useLearning } from './context/LearningContext';
import { X, Sparkles, Trophy, Award } from 'lucide-react';

export const App: React.FC = () => {
  // Sync tab with URL hash for browser history and bookmarking
  const getInitialTab = (): string => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['home', 'garage', 'paddock', 'circuits', 'raceday', 'school', 'strategy'];
    return validTabs.includes(hash) ? hash : 'home';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [selectedGarageComponent, setSelectedGarageComponent] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const { currentToast, dismissToast } = useLearning();

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['home', 'garage', 'paddock', 'circuits', 'raceday', 'school', 'strategy'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTab = (tabId: string, param?: string) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    if (tabId === 'garage' && param) {
      setSelectedGarageComponent(param);
    }
  };

  // Keyboard shortcut '/' or 'Ctrl+K' for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cosmic-100 text-plum font-sans selection:bg-blush selection:text-plum-dark">
      {/* Top Application Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Page Area */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeView onNavigate={handleSelectTab} />}
        {activeTab === 'garage' && <GarageView initialComponentId={selectedGarageComponent} />}
        {activeTab === 'paddock' && <PaddockView />}
        {activeTab === 'circuits' && <CircuitSafariView />}
        {activeTab === 'raceday' && <RaceDayView />}
        {activeTab === 'school' && <PitSchoolView />}
        {activeTab === 'strategy' && <StrategyRoomView />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleSelectTab} />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleSelectTab}
      />

      {/* Celebratory Floating Toast Notification */}
      {currentToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-500">
          <div className="bg-plum-dark text-white px-5 py-4 rounded-3xl shadow-2xl border border-racing/60 flex items-start space-x-3.5 max-w-sm">
            <div className="p-2 rounded-2xl bg-racing text-white shadow-md">
              {currentToast.type === 'badge' ? (
                <Trophy className="w-5 h-5" />
              ) : currentToast.type === 'level' ? (
                <Award className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 pr-2">
              <h4 className="text-sm font-bold font-display text-white">
                {currentToast.message}
              </h4>
              {currentToast.subtext && (
                <p className="text-xs text-cosmic-200/80 mt-0.5">
                  {currentToast.subtext}
                </p>
              )}
            </div>

            <button
              onClick={dismissToast}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
