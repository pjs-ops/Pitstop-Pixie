import React, { useState, useEffect, useRef } from 'react';
import { CIRCUITS } from '../../data/circuits';
import { Circuit, Hotspot } from '../../types';
import { Compass, Flag, Gauge, Zap, Sparkles, Scale, Info, Play, Pause } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const CircuitSafariView: React.FC = () => {
  const { addXP } = useLearning();

  const [selectedCircuit, setSelectedCircuit] = useState<Circuit>(CIRCUITS[0]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(CIRCUITS[0].hotspots[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [compareCircuitA, setCompareCircuitA] = useState<Circuit>(CIRCUITS[0]);
  const [compareCircuitB, setCompareCircuitB] = useState<Circuit>(CIRCUITS[1]);
  const [activeTab, setActiveTab] = useState<'safari' | 'compare'>('safari');

  // Mini-car animation along SVG path
  const pathRef = useRef<SVGPathElement>(null);
  const carDotRef = useRef<SVGGElement>(null);
  const progressRef = useRef<number>(0);
  const animFrameRef = useRef<number>();

  useEffect(() => {
    setSelectedHotspot(selectedCircuit.hotspots[0]);
    progressRef.current = 0;
  }, [selectedCircuit]);

  useEffect(() => {
    let lastTime = performance.now();

    const animateCar = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlaying && pathRef.current && carDotRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        progressRef.current = (progressRef.current + delta * 0.12) % 1; // 1 full lap every ~8.3 seconds
        const currentDistance = progressRef.current * pathLength;
        const point = pathRef.current.getPointAtLength(currentDistance);

        // Get angle
        const pointAhead = pathRef.current.getPointAtLength((currentDistance + 2) % pathLength);
        const angle = Math.atan2(pointAhead.y - point.y, pointAhead.x - point.x) * (180 / Math.PI);

        carDotRef.current.setAttribute('transform', `translate(${point.x}, ${point.y}) rotate(${angle})`);
      }

      animFrameRef.current = requestAnimationFrame(animateCar);
    };

    animFrameRef.current = requestAnimationFrame(animateCar);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, selectedCircuit]);

  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    addXP(10, `Explored ${hotspot.name}! 🗺️`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-racing mb-2">
            <span className="w-2 h-2 rounded-full bg-racing" />
            <span>Interactive Track Visualizer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-plum tracking-tight">
            Circuit Safari
          </h1>
          <p className="text-sm sm:text-base text-plum/70 max-w-2xl mt-1">
            Follow the miniature F1 car along sacred asphalt, discover legendary corners, and master DRS overtaking zones.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white p-1.5 rounded-2xl border border-cosmic-200 shadow-sm">
          <button
            onClick={() => setActiveTab('safari')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'safari'
                ? 'bg-plum text-white shadow-sm'
                : 'text-plum/70 hover:text-plum hover:bg-cosmic-100'
            }`}
          >
            Track Explorer
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'compare'
                ? 'bg-plum text-white shadow-sm'
                : 'text-plum/70 hover:text-plum hover:bg-cosmic-100'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Track Comparator</span>
          </button>
        </div>
      </div>

      {activeTab === 'safari' && (
        <>
          {/* Circuit Selection Pills */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-4 mb-6">
            {CIRCUITS.map((circuit) => {
              const isSelected = selectedCircuit.id === circuit.id;
              return (
                <button
                  key={circuit.id}
                  onClick={() => setSelectedCircuit(circuit)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-racing text-white border-racing shadow-md shadow-racing/20 scale-105'
                      : 'bg-white text-plum/80 hover:bg-cosmic-100 border-cosmic-200'
                  }`}
                >
                  <span className="text-sm">{circuit.flag}</span>
                  <span>{circuit.name}</span>
                </button>
              );
            })}
          </div>

          {/* Main 2-Column Track Experience */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
            {/* Interactive SVG Track Arena */}
            <div className="lg:col-span-8 bg-[#18131E] rounded-3xl p-6 sm:p-8 border border-plum/30 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[520px]">
              {/* Circuit Header Over Track */}
              <div className="flex items-start justify-between z-10">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-blush font-semibold uppercase tracking-wider mb-1">
                    <span>{selectedCircuit.flag}</span>
                    <span>{selectedCircuit.location}, {selectedCircuit.country}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-sage">{selectedCircuit.trackDirection}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                    {selectedCircuit.name}
                  </h2>
                </div>

                {/* Animation Pause/Play */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md"
                  title={isPlaying ? 'Pause telemetry car' : 'Resume telemetry car'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-racing" />}
                </button>
              </div>

              {/* SVG Canvas Map */}
              <div className="relative my-4 flex-1 flex items-center justify-center">
                <svg
                  viewBox={selectedCircuit.svgViewBox}
                  className="w-full h-[320px] sm:h-[380px] drop-shadow-[0_0_20px_rgba(217,67,85,0.2)]"
                >
                  {/* Outer Glow Path */}
                  <path
                    d={selectedCircuit.svgPath}
                    fill="none"
                    stroke="#D94355"
                    strokeWidth="14"
                    strokeOpacity="0.15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Track Surface Border */}
                  <path
                    d={selectedCircuit.svgPath}
                    fill="none"
                    stroke="#332C39"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Central Racing Line Spline */}
                  <path
                    ref={pathRef}
                    d={selectedCircuit.svgPath}
                    fill="none"
                    stroke="#F3C8D8"
                    strokeWidth="3.5"
                    strokeDasharray="8 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Animated Miniature F1 Car Dot */}
                  <g ref={carDotRef}>
                    {/* Car Silhouette Marker */}
                    <rect x="-10" y="-4" width="20" height="8" rx="3" fill="#D94355" />
                    {/* Front Wing Flap */}
                    <rect x="8" y="-5" width="2.5" height="10" rx="1" fill="#FFFFFF" />
                    {/* Rear Wing Flap */}
                    <rect x="-10" y="-6" width="3" height="12" rx="1" fill="#FFF200" />
                    {/* Pulsing beacon */}
                    <circle cx="0" cy="0" r="12" fill="#D94355" fillOpacity="0.3" className="animate-ping" />
                  </g>
                </svg>

                {/* Hotspot Floating Buttons Over Track Viewport */}
                {selectedCircuit.hotspots.map((spot) => {
                  const isSelected = selectedHotspot?.id === spot.id;
                  return (
                    <button
                      key={spot.id}
                      onClick={() => handleHotspotClick(spot)}
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all group z-20 ${
                        isSelected
                          ? 'bg-racing text-white ring-4 ring-racing/40 scale-125'
                          : 'bg-plum-dark/90 text-cosmic-100 border border-white/20 hover:scale-110 hover:border-blush'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-current block" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded-md bg-plum-dark text-[10px] font-semibold text-cosmic-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
                        {spot.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Hotspot Legend & Tips */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/60 pt-3 border-t border-white/10 z-10">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-racing" />
                    <span>Selected Corner</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-blush" />
                    <span>DRS / Braking Hotspot</span>
                  </span>
                </div>
                <span>Click any point on the track to inspect telemetry & tactical secrets</span>
              </div>
            </div>

            {/* Right: Selected Hotspot & Circuit Fact File */}
            <div className="lg:col-span-4 space-y-6">
              {/* Selected Hotspot Card */}
              {selectedHotspot && (
                <div className="bg-white rounded-3xl p-6 border border-cosmic-200 shadow-pixie">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-racing-light/20 text-racing border border-racing/30">
                      {selectedHotspot.type.toUpperCase()} HOTSPOT
                    </span>
                    <span className="text-xs font-mono font-bold text-plum/70">
                      {selectedHotspot.gearSpeed}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-plum mb-3">
                    {selectedHotspot.name}
                  </h3>

                  <p className="text-sm text-plum/80 leading-relaxed mb-4">
                    {selectedHotspot.description}
                  </p>

                  <div className="bg-blush-light/50 border border-blush/60 rounded-2xl p-4">
                    <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-racing mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Racing Significance</span>
                    </div>
                    <p className="text-xs text-plum/85 leading-relaxed font-medium">
                      {selectedHotspot.racingSignificance}
                    </p>
                  </div>
                </div>
              )}

              {/* Circuit DNA & Stats */}
              <div className="bg-white rounded-3xl p-6 border border-cosmic-200 shadow-pixie">
                <h4 className="text-xs font-bold uppercase tracking-wider text-plum/60 mb-4">
                  Circuit DNA & Technical Specs
                </h4>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-cosmic-50 p-3 rounded-xl border border-cosmic-200/70">
                    <span className="block text-[10px] text-plum/50 font-bold uppercase">Lap Length</span>
                    <span className="block text-sm font-extrabold text-plum">{selectedCircuit.lengthKm} km</span>
                  </div>
                  <div className="bg-cosmic-50 p-3 rounded-xl border border-cosmic-200/70">
                    <span className="block text-[10px] text-plum/50 font-bold uppercase">Grand Prix Laps</span>
                    <span className="block text-sm font-extrabold text-plum">{selectedCircuit.laps} Laps</span>
                  </div>
                  <div className="bg-cosmic-50 p-3 rounded-xl border border-cosmic-200/70">
                    <span className="block text-[10px] text-plum/50 font-bold uppercase">Downforce Demand</span>
                    <span className="block text-sm font-extrabold text-racing">{selectedCircuit.downforceDemand}</span>
                  </div>
                  <div className="bg-cosmic-50 p-3 rounded-xl border border-cosmic-200/70">
                    <span className="block text-[10px] text-plum/50 font-bold uppercase">Overtaking</span>
                    <span className="block text-sm font-extrabold text-plum">{selectedCircuit.overtakingDifficulty}</span>
                  </div>
                </div>

                {/* Lap Record Callout */}
                <div className="bg-cosmic-100/70 p-3.5 rounded-2xl border border-cosmic-200 mb-4 text-xs">
                  <span className="block font-bold text-plum/60 uppercase text-[10px] mb-0.5">
                    Official Lap Record
                  </span>
                  <span className="font-mono font-extrabold text-plum text-sm">
                    {selectedCircuit.lapRecord.time}
                  </span>
                  <span className="text-plum/70 ml-2">
                    by {selectedCircuit.lapRecord.driver} ({selectedCircuit.lapRecord.year})
                  </span>
                </div>

                {/* Memorable Moment */}
                <div className="text-xs text-plum/80 leading-relaxed border-t border-cosmic-200 pt-3">
                  <span className="font-bold text-racing block mb-1">🏁 Legendary Moment:</span>
                  {selectedCircuit.memorableMoment}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TRACK COMPARISON TAB */}
      {activeTab === 'compare' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-pixie">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold font-display text-plum">
              Track vs Track Comparison
            </h2>
            <p className="text-xs sm:text-sm text-plum/70 mt-1">
              Compare downforce setups, lap distances, tire stress, and corner challenges between legendary circuits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-cosmic-100/70 p-4 rounded-2xl border border-cosmic-200">
              <label className="block text-xs font-bold text-plum/60 uppercase mb-2">Circuit 1</label>
              <select
                value={compareCircuitA.id}
                onChange={(e) => setCompareCircuitA(CIRCUITS.find((c) => c.id === e.target.value) || CIRCUITS[0])}
                className="w-full p-2.5 rounded-xl bg-white border border-cosmic-200 text-sm font-bold text-plum focus:outline-none focus:border-racing"
              >
                {CIRCUITS.map((c) => (
                  <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-cosmic-100/70 p-4 rounded-2xl border border-cosmic-200">
              <label className="block text-xs font-bold text-plum/60 uppercase mb-2">Circuit 2</label>
              <select
                value={compareCircuitB.id}
                onChange={(e) => setCompareCircuitB(CIRCUITS.find((c) => c.id === e.target.value) || CIRCUITS[1])}
                className="w-full p-2.5 rounded-xl bg-white border border-cosmic-200 text-sm font-bold text-plum focus:outline-none focus:border-racing"
              >
                {CIRCUITS.map((c) => (
                  <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Circuit A Card */}
            <div className="bg-cosmic-50 p-6 rounded-3xl border border-cosmic-200">
              <div className="text-3xl mb-2">{compareCircuitA.flag}</div>
              <h3 className="text-xl font-bold font-display text-plum mb-1">{compareCircuitA.name}</h3>
              <p className="text-xs text-plum/60 mb-5">{compareCircuitA.location}, {compareCircuitA.country}</p>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-cosmic-200">
                  <span className="text-plum/60">Lap Length</span>
                  <span className="font-bold text-plum">{compareCircuitA.lengthKm} km</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cosmic-200">
                  <span className="text-plum/60">Corners</span>
                  <span className="font-bold text-plum">{compareCircuitA.corners}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cosmic-200">
                  <span className="text-plum/60">Downforce Aero Level</span>
                  <span className="font-bold text-racing">{compareCircuitA.downforceDemand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cosmic-200">
                  <span className="text-plum/60">Tire Wear</span>
                  <span className="font-bold text-plum">{compareCircuitA.tireDegradation}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-plum/60">Overtaking Ease</span>
                  <span className="font-bold text-plum">{compareCircuitA.overtakingDifficulty}</span>
                </div>
              </div>
            </div>

            {/* Circuit B Card */}
            <div className="bg-cosmic-50 p-6 rounded-3xl border border-cosmic-200">
              <div className="text-3xl mb-2">{compareCircuitB.flag}</div>
              <h3 className="text-xl font-bold font-display text-plum mb-1">{compareCircuitB.name}</h3>
              <p className="text-xs text-plum/60 mb-5">{compareCircuitB.location}, {compareCircuitB.country}</p>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-cosmic-200">
                  <span className="text-plum/60">Lap Length</span>
                  <span className="font-bold text-plum">{compareCircuitB.lengthKm} km</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cosmic-200">
                  <span className="text-plum/60">Corners</span>
                  <span className="font-bold text-plum">{compareCircuitB.corners}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cosmic-200">
                  <span className="text-plum/60">Downforce Aero Level</span>
                  <span className="font-bold text-racing">{compareCircuitB.downforceDemand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-cosmic-200">
                  <span className="text-plum/60">Tire Wear</span>
                  <span className="font-bold text-plum">{compareCircuitB.tireDegradation}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-plum/60">Overtaking Ease</span>
                  <span className="font-bold text-plum">{compareCircuitB.overtakingDifficulty}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
