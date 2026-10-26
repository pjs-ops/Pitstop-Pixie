import React, { useState } from 'react';
import { CarViewer } from '../3d/CarViewer';
import { Sparkles, ArrowRight, Trophy, Flag, Wrench, Compass, BookOpen, Flame, CheckCircle2, Radio } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { BADGES } from '../../data/badges';
import { LESSONS } from '../../data/lessons';

interface HomeViewProps {
  onNavigate: (tabId: string, param?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { progress } = useLearning();

  // Check user preference for reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 3D Hero states
  const [explodeFactor, setExplodeFactor] = useState<number>(0.0);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [cameraPreset, setCameraPreset] = useState<string>('iso');
  const [autoRotate, setAutoRotate] = useState<boolean>(!prefersReducedMotion);

  const completedCount = progress.completedLessonIds.length;
  const nextLesson = LESSONS.find((l) => !progress.completedLessonIds.includes(l.id)) || LESSONS[0];

  return (
    <div className="space-y-16 lg:space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Left: Editorial Copy & CTAs */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blush-light border border-blush text-racing text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Rookie HQ • Season 2025</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-plum tracking-tight leading-[1.08]">
              Your first lap into the world of{' '}
              <span className="text-racing underline decoration-blush decoration-wavy decoration-2">
                F1
              </span>
              .
            </h1>

            <p className="text-base sm:text-lg text-plum/75 leading-relaxed font-normal">
              Meet the drivers, understand the machines, and discover the magic behind every race. Powered by interactive 3D engineering and rookie-friendly storytelling.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('garage')}
                className="px-6 py-3.5 rounded-2xl bg-racing hover:bg-racing-dark text-white font-bold text-sm transition-all shadow-lg shadow-racing/25 flex items-center space-x-2 group scale-100 hover:scale-105 active:scale-95"
              >
                <span>Explore the Car in 3D</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('raceday')}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-cosmic-100 text-plum font-bold text-sm border border-cosmic-200 transition-all shadow-sm"
              >
                Start My Rookie Journey
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 border-t border-cosmic-200/80 flex items-center space-x-6 text-xs text-plum/60 font-medium">
              <div>
                <span className="block font-black font-mono text-plum text-base">16</span>
                <span>3D Components</span>
              </div>
              <div className="w-px h-8 bg-cosmic-200" />
              <div>
                <span className="block font-black font-mono text-plum text-base">6</span>
                <span>Sacred Tracks</span>
              </div>
              <div className="w-px h-8 bg-cosmic-200" />
              <div>
                <span className="block font-black font-mono text-racing text-base">1,000+</span>
                <span>Hybrid Horsepower</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Interactive 3D Car Studio */}
          <div className="lg:col-span-7">
            <CarViewer
              theme="studio-ivory"
              explodeFactor={explodeFactor}
              onExplodeChange={setExplodeFactor}
              selectedComponentId={selectedComponentId}
              hoveredComponentId={hoveredComponentId}
              onSelectComponent={(id) => onNavigate('garage', id)}
              onHoverComponent={setHoveredComponentId}
              cameraPreset={cameraPreset}
              onCameraPresetChange={setCameraPreset}
              autoRotate={autoRotate}
              onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
            />
          </div>
        </div>
      </section>

      {/* 2. CONTINUE LEARNING & CONCEPT OF THE DAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Continue Learning Card */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-cosmic-200 shadow-pixie flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-lavender-light text-plum border border-lavender/60">
                  Continue Learning
                </span>
                <span className="text-xs font-semibold text-plum/50">
                  {completedCount} of {LESSONS.length} completed
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-display text-plum mb-1">
                {nextLesson.title}
              </h3>
              <p className="text-xs sm:text-sm text-plum/70 leading-relaxed mb-4">
                {nextLesson.overview}
              </p>
            </div>

            <div className="pt-4 border-t border-cosmic-200 flex items-center justify-between">
              <span className="text-xs font-bold text-racing flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+{nextLesson.xpReward} XP upon completion</span>
              </span>
              <button
                onClick={() => onNavigate('raceday')}
                className="px-4 py-2 rounded-xl bg-plum hover:bg-plum-dark text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>Jump Into Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Concept of the Day Card */}
          <div className="bg-blush-light/50 rounded-3xl p-6 sm:p-7 border border-blush/60 shadow-pixie flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-racing mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Concept of the Day</span>
              </div>
              <h3 className="text-xl font-bold font-display text-plum mb-2">
                What is an "Undercut"?
              </h3>
              <p className="text-xs text-plum/80 leading-relaxed mb-4">
                Pitting 1 lap before the car ahead onto fresh rubber. Your grip advantage lets you jump them when they pit on the next lap!
              </p>
            </div>

            <button
              onClick={() => onNavigate('raceday')}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-cosmic-100 border border-blush text-racing text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm"
            >
              <span>Learn in Race Day 101</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. FIVE CORE LEARNING PORTALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-racing mb-1">
            Curated Curriculum
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-plum">
            Explore the F1 Universe
          </h2>
          <p className="text-xs sm:text-sm text-plum/70 mt-1">
            Choose your learning path through engineering, driver personalities, circuits, and racecraft lessons.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: 'garage',
              title: 'The Garage',
              subtitle: '3D Engineering Lab',
              description: 'Inspect 16 separable parts in real-time 3D: titanium Halos, carbon diffusers, and 15,000-RPM V6 turbo engines.',
              icon: Wrench,
              color: 'bg-racing/10 text-racing',
              badge: 'Signature Feature',
            },
            {
              id: 'paddock',
              title: 'The Paddock',
              subtitle: 'Drivers & Constructors',
              description: 'Official 2024/2025 lineups, career timelines, driving styles, and the head-to-head Driver Duel comparison tool.',
              icon: Trophy,
              color: 'bg-lavender text-plum',
              badge: 'Profiles & Stats',
            },
            {
              id: 'circuits',
              title: 'Circuit Safari',
              subtitle: 'Interactive Track Explorer',
              description: 'Animated miniature cars running through Monaco, Spa, Silverstone, and Monza. Inspect DRS zones and elevation bottlenecks.',
              icon: Compass,
              color: 'bg-emerald-100 text-emerald-800',
              badge: 'Interactive Maps',
            },
            {
              id: 'raceday',
              title: 'Race Day 101',
              subtitle: 'Visual Beginner Course',
              description: 'Step-by-step interactive lessons on Q1-Q2-Q3 qualifying, flag signals, tire compounds, and 1.80-second pit stops.',
              icon: Flag,
              color: 'bg-amber-100 text-amber-900',
              badge: 'Essential Lessons',
            },
            {
              id: 'school',
              title: 'Pit School',
              subtitle: 'Quizzes & Badges',
              description: 'Gamified quiz arena with parts guessing, flag challenges, daily streak challenges, and the climb to World Champion.',
              icon: BookOpen,
              color: 'bg-blush-light text-racing',
              badge: 'Gamification & XP',
            },
            {
              id: 'radio',
              title: 'Radio Decoder',
              subtitle: 'Pit Wall Communications',
              description: 'Decode 24 authentic driver-engineer radio transmissions, unpack strategic jargon, and make live branching tactical calls.',
              icon: Radio,
              color: 'bg-racing/10 text-racing',
              badge: 'New Interactive Lab',
            },
          ].map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                onClick={() => onNavigate(portal.id)}
                className="cursor-pointer group bg-white rounded-3xl p-6 border border-cosmic-200/90 shadow-pixie hover:shadow-pixie-hover hover:border-racing/50 transition-all flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${portal.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cosmic-100 text-plum/70">
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-plum mb-0.5 group-hover:text-racing transition-colors">
                    {portal.title}
                  </h3>
                  <p className="text-xs font-semibold text-plum/50 mb-3">
                    {portal.subtitle}
                  </p>
                  <p className="text-xs text-plum/70 leading-relaxed">
                    {portal.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-cosmic-200 flex items-center justify-between text-xs font-bold text-racing">
                  <span>Enter {portal.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PROGRESSION & BADGES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-pixie">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-racing mb-1">
                Your Motorsport Career
              </div>
              <h2 className="text-2xl font-bold font-display text-plum">
                License & Badges Showcase
              </h2>
            </div>

            <button
              onClick={() => onNavigate('school')}
              className="px-4 py-2 rounded-xl bg-cosmic-100 hover:bg-cosmic-200 text-plum text-xs font-bold transition-all flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <span>View Full Trophy Cabinet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {BADGES.map((badge) => {
              const isEarned = progress.earnedBadgeIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isEarned
                      ? 'bg-blush-light/30 border-blush/60'
                      : 'bg-cosmic-50/50 border-cosmic-200/50 opacity-40 grayscale'
                  }`}
                >
                  <div className="text-2xl mb-1">🏆</div>
                  <h4 className="text-[11px] font-bold text-plum truncate">{badge.title}</h4>
                  <span className="text-[9px] text-plum/60 block truncate">
                    {isEarned ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
