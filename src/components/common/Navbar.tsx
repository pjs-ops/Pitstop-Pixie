import React, { useState } from 'react';
import { Sparkles, Search, Menu, X, Flame, Shield, Trophy } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
}) => {
  const { progress } = useLearning();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'garage', label: 'The Garage' },
    { id: 'paddock', label: 'The Paddock' },
    { id: 'circuits', label: 'Circuit Safari' },
    { id: 'raceday', label: 'Race Day 101' },
    { id: 'school', label: 'Pit School' },
    { id: 'strategy', label: 'Strategy Room' },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-cosmic-100/90 backdrop-blur-md border-b border-cosmic-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer flex items-center space-x-3 group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-racing to-blush flex items-center justify-center text-white shadow-md shadow-racing/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🏎️</span>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-extrabold font-display text-lg sm:text-xl text-plum tracking-tight">
                PITSTOP PIXIE
              </span>
              <Sparkles className="w-3.5 h-3.5 text-racing animate-pulse" />
            </div>
            <p className="text-[10px] text-plum/60 tracking-wider font-semibold uppercase -mt-0.5">
              A little magic, a lot of motorsport
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-plum text-white shadow-sm'
                    : 'text-plum/70 hover:text-plum hover:bg-cosmic-200/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Search & XP Indicator */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-cosmic-200 text-xs font-semibold text-plum/70 hover:text-plum hover:border-racing transition-all shadow-sm"
            title="Search anything (Press /)"
          >
            <Search className="w-3.5 h-3.5 text-racing" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-cosmic-100 rounded text-plum/50 border border-cosmic-200">
              /
            </kbd>
          </button>

          {/* XP & Level Indicator Badge */}
          <div
            onClick={() => handleNavClick('school')}
            className="cursor-pointer flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-cosmic-200 shadow-sm hover:border-racing transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-racing animate-ping" />
            <div className="text-left text-[11px] leading-tight">
              <span className="font-extrabold text-plum block">
                {progress.level}
              </span>
              <span className="text-racing font-bold font-mono">
                {progress.xp} XP
              </span>
            </div>
            {progress.streakDays > 0 && (
              <span className="hidden md:flex items-center text-[10px] text-amber-600 font-bold ml-1">
                <Flame className="w-3 h-3 fill-current text-amber-500 mr-0.5" />
                {progress.streakDays}d
              </span>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white border border-cosmic-200 text-plum hover:bg-cosmic-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cosmic-100 border-b border-cosmic-200 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-plum text-white shadow-sm'
                    : 'text-plum hover:bg-cosmic-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
