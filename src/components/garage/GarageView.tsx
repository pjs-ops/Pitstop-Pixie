import React, { useState } from 'react';
import { CAR_COMPONENTS } from '../../data/carComponents';
import { CarViewer } from '../3d/CarViewer';
import { ComponentDetail } from './ComponentDetail';
import { Sparkles, HelpCircle, Compass, Play, ChevronLeft, ChevronRight, RotateCcw, CheckCircle, Search } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

type GarageMode = 'explore' | 'tour' | 'assembly' | 'quiz';

interface GarageViewProps {
  initialComponentId?: string | null;
}

export const GarageView: React.FC<GarageViewProps> = ({ initialComponentId }) => {
  const { addXP } = useLearning();

  const [selectedComponentId, setSelectedComponentId] = useState<string>(initialComponentId || 'front_wing');
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);

  // Sync if initialComponentId changes
  React.useEffect(() => {
    if (initialComponentId) {
      setSelectedComponentId(initialComponentId);
    }
  }, [initialComponentId]);
  const [explodeFactor, setExplodeFactor] = useState<number>(0.0);
  const [cameraPreset, setCameraPreset] = useState<string>('iso');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Learning Modes
  const [mode, setMode] = useState<GarageMode>('explore');
  const [tourIndex, setTourIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Guided Tour
  const startGuidedTour = () => {
    setMode('tour');
    setTourIndex(0);
    setSelectedComponentId(CAR_COMPONENTS[0].id);
    setCameraPreset(CAR_COMPONENTS[0].id);
    setExplodeFactor(0.35);
    setAutoRotate(false);
  };

  const nextTourStep = () => {
    if (tourIndex < CAR_COMPONENTS.length - 1) {
      const nextIdx = tourIndex + 1;
      setTourIndex(nextIdx);
      setSelectedComponentId(CAR_COMPONENTS[nextIdx].id);
    } else {
      // Tour completed!
      addXP(75, 'Completed Guided F1 Car Tour! 🏎️');
      setMode('explore');
    }
  };

  const prevTourStep = () => {
    if (tourIndex > 0) {
      const prevIdx = tourIndex - 1;
      setTourIndex(prevIdx);
      setSelectedComponentId(CAR_COMPONENTS[prevIdx].id);
    }
  };

  // Filtered components
  const filteredComponents = CAR_COMPONENTS.filter((comp) => {
    const matchesCategory = activeCategory === 'all' || comp.category === activeCategory;
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedComponent = CAR_COMPONENTS.find((c) => c.id === selectedComponentId) || CAR_COMPONENTS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-racing mb-2">
            <span className="w-2 h-2 rounded-full bg-racing" />
            <span>Interactive 3D Engineering Lab</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-plum tracking-tight">
            The Garage
          </h1>
          <p className="text-sm sm:text-base text-plum/70 max-w-2xl mt-1">
            Explore every titanium bolt, carbon wing cascade, and 1,000-horsepower hybrid component in full 3D.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap items-center bg-white p-1.5 rounded-2xl border border-cosmic-200 shadow-sm">
          <button
            onClick={() => { setMode('explore'); setExplodeFactor(0); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              mode === 'explore'
                ? 'bg-plum text-white shadow-sm'
                : 'text-plum/70 hover:text-plum hover:bg-cosmic-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Freely</span>
          </button>

          <button
            onClick={startGuidedTour}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              mode === 'tour'
                ? 'bg-racing text-white shadow-sm'
                : 'text-plum/70 hover:text-plum hover:bg-cosmic-100'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Guided Tour</span>
          </button>

          <button
            onClick={() => { setMode('explore'); setExplodeFactor(0.85); }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-plum/70 hover:text-plum hover:bg-cosmic-100 transition-all"
          >
            Exploded View
          </button>
        </div>
      </div>

      {/* Guided Tour Banner if Active */}
      {mode === 'tour' && (
        <div className="mb-6 bg-plum-dark text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-racing/40 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-racing flex items-center justify-center font-bold text-sm shadow-md">
              {tourIndex + 1}
            </div>
            <div>
              <div className="text-xs text-blush font-semibold tracking-wider uppercase">
                Step {tourIndex + 1} of {CAR_COMPONENTS.length}
              </div>
              <div className="text-base font-bold font-display">
                {CAR_COMPONENTS[tourIndex].name}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={prevTourStep}
              disabled={tourIndex === 0}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextTourStep}
              className="px-4 py-2 rounded-xl bg-racing hover:bg-racing-dark text-white font-semibold text-xs transition-all flex items-center space-x-1 shadow-md"
            >
              <span>{tourIndex === CAR_COMPONENTS.length - 1 ? 'Finish Tour' : 'Next Part'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMode('explore')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all"
            >
              Exit
            </button>
          </div>
        </div>
      )}

      {/* 3D Viewer & Details Panel 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-12">
        {/* Left: 3D Canvas Container */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <CarViewer
            theme="studio-ivory"
            explodeFactor={explodeFactor}
            onExplodeChange={setExplodeFactor}
            selectedComponentId={selectedComponentId}
            hoveredComponentId={hoveredComponentId}
            onSelectComponent={(id) => setSelectedComponentId(id)}
            onHoverComponent={setHoveredComponentId}
            cameraPreset={cameraPreset}
            onCameraPresetChange={setCameraPreset}
            autoRotate={autoRotate}
            onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
          />

          {/* Category Filter Pills below 3D */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Components' },
              { id: 'aerodynamics', label: 'Aerodynamics' },
              { id: 'chassis', label: 'Chassis & Safety' },
              { id: 'suspension', label: 'Suspension' },
              { id: 'tires', label: 'Tires & Brakes' },
              { id: 'powertrain', label: 'Hybrid Powertrain' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-plum text-white border-plum'
                    : 'bg-white text-plum/70 hover:bg-cosmic-100 border-cosmic-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Rich Educational Details Panel */}
        <div className="lg:col-span-4 h-[580px] lg:h-[640px]">
          <ComponentDetail
            component={selectedComponent}
            onSelectRelated={(id) => setSelectedComponentId(id)}
          />
        </div>
      </div>

      {/* Component Library Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-pixie">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-plum">
              Engineering Component Library
            </h2>
            <p className="text-xs sm:text-sm text-plum/60 mt-0.5">
              Click any card to focus and highlight the 3D model above.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-plum/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-cosmic-100 border border-cosmic-200 focus:outline-none focus:border-racing text-plum"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComponents.map((comp) => {
            const isSelected = comp.id === selectedComponentId;
            return (
              <button
                key={comp.id}
                onClick={() => {
                  setSelectedComponentId(comp.id);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-blush-light/50 border-racing shadow-sm ring-2 ring-racing/20'
                    : 'bg-cosmic-50/50 hover:bg-white border-cosmic-200 hover:border-plum/20 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-plum/50">
                    {comp.categoryLabel}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-racing animate-pulse" />
                  )}
                </div>
                <h4 className="text-sm font-bold text-plum mb-1">
                  {comp.name}
                </h4>
                <p className="text-xs text-plum/70 line-clamp-2">
                  {comp.analogy}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
