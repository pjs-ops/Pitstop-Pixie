import React, { useState } from 'react';
import { Cpu, Zap, CloudRain, Timer, ArrowRight, Sparkles, Scale, Info } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

type StrategyTab = 'tire_deg' | 'undercut' | 'stops' | 'weather';

export const StrategyRoomView: React.FC = () => {
  const { addXP } = useLearning();

  const [activeTab, setActiveTab] = useState<StrategyTab>('tire_deg');

  // Simulation 1: Tire Deg Parameters
  const [trackTemp, setTrackTemp] = useState<number>(38); // °C
  const [tireDegMultiplier, setTireDegMultiplier] = useState<number>(1.0);
  const [hoveredLap, setHoveredLap] = useState<number | null>(null);

  // Simulation 2: Undercut Calculator
  const [gapToLeader, setGapToLeader] = useState<number>(1.8); // seconds ahead
  const [freshTirePaceGain, setFreshTirePaceGain] = useState<number>(1.6); // seconds faster on out-lap
  const [inLapPushDelta, setInLapPushDelta] = useState<number>(0.4); // seconds gained on in-lap
  const [pitStopDelta, setPitStopDelta] = useState<number>(0.0); // pit stop difference

  // Simulation 3: 1-Stop vs 2-Stop
  const [pitLossSeconds, setPitLossSeconds] = useState<number>(22.0); // seconds lost traversing pit lane
  const [totalLaps, setTotalLaps] = useState<number>(50);

  // Simulation 4: Weather Crossover
  const [rainfallRate, setRainfallRate] = useState<number>(3.5); // mm / hr

  // 1. Generate Tire Degradation Curve Data
  const generateTireDegData = () => {
    const data = [];
    const baseLap = 88.0; // 1:28.000 in seconds
    const tempFactor = (trackTemp - 25) * 0.008;

    for (let lap = 1; lap <= 35; lap++) {
      const softPace = baseLap - 0.9 + Math.pow(lap * 0.16 * tireDegMultiplier * (1 + tempFactor), 1.45);
      const medPace = baseLap - 0.3 + Math.pow(lap * 0.09 * tireDegMultiplier * (1 + tempFactor * 0.7), 1.35);
      const hardPace = baseLap + 0.4 + Math.pow(lap * 0.045 * tireDegMultiplier, 1.2);

      data.push({
        lap,
        Soft: parseFloat(softPace.toFixed(2)),
        Medium: parseFloat(medPace.toFixed(2)),
        Hard: parseFloat(hardPace.toFixed(2)),
      });
    }
    return data;
  };

  const tireData = generateTireDegData();

  // 2. Undercut Calculation
  const totalGain = freshTirePaceGain + inLapPushDelta - pitStopDelta;
  const undercutSucceeds = totalGain > gapToLeader;
  const margin = Math.abs(totalGain - gapToLeader).toFixed(2);

  // 3. 1-Stop vs 2-Stop Total Race Time
  const oneStopTime = 50 * 89.2 + pitLossSeconds;
  const twoStopTime = 50 * 88.5 + (2 * pitLossSeconds);
  const stopsDiff = (oneStopTime - twoStopTime).toFixed(1);

  // 4. Weather Tyre Recommendation
  const getWeatherRecommendation = () => {
    if (rainfallRate < 1.0) return { compound: 'Dry Slicks (Soft/Medium/Hard)', note: 'Dry or greasy track with dry line visible.' };
    if (rainfallRate < 5.0) return { compound: 'Intermediate (Green)', note: 'Standing damp water, spray clearing, no deep puddles.' };
    return { compound: 'Full Wet (Blue)', note: 'Torrential standing water, high aquaplaning risk.' };
  };

  const weatherAdvice = getWeatherRecommendation();

  // SVG Chart Geometry
  const svgWidth = 640;
  const svgHeight = 280;
  const padL = 45;
  const padR = 25;
  const padT = 20;
  const padB = 35;
  const plotW = svgWidth - padL - padR;
  const plotH = svgHeight - padT - padB;

  const minY = 86.5;
  const maxY = 94.0;

  const getX = (lap: number) => padL + ((lap - 1) / 34) * plotW;
  const getY = (sec: number) => padT + plotH - ((sec - minY) / (maxY - minY)) * plotH;

  const buildPath = (key: 'Soft' | 'Medium' | 'Hard') => {
    return tireData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.lap)} ${getY(d[key])}`).join(' ');
  };

  const activeLapData = hoveredLap ? tireData.find((d) => d.lap === hoveredLap) : tireData[14];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-racing mb-2">
            <span className="w-2 h-2 rounded-full bg-racing" />
            <span>Interactive Race Strategy Lab</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-plum tracking-tight">
            Strategy Room
          </h1>
          <p className="text-sm sm:text-base text-plum/70 max-w-2xl mt-1">
            Simulate tire degradation curves, pit window crossovers, undercut timings, and weather switches like a chief race strategist.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-white p-1.5 rounded-2xl border border-cosmic-200 shadow-sm overflow-x-auto">
          {[
            { id: 'tire_deg', label: 'Tire Degradation', icon: Zap },
            { id: 'undercut', label: 'Undercut Calculator', icon: Timer },
            { id: 'stops', label: '1-Stop vs 2-Stop', icon: Scale },
            { id: 'weather', label: 'Weather Crossover', icon: CloudRain },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  addXP(10, 'Analyzed strategy simulation! 📈');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === tab.id
                    ? 'bg-plum text-white shadow-sm'
                    : 'text-plum/70 hover:text-plum hover:bg-cosmic-100'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Illustrative Disclaimer Notice */}
      <div className="bg-cosmic-100/80 border border-cosmic-200 rounded-2xl p-3.5 mb-8 flex items-center space-x-2.5 text-xs text-plum/70">
        <Info className="w-4 h-4 text-racing shrink-0" />
        <span>
          <strong>Educational Model:</strong> Simulation calculations use mathematical models of F1 degradation, tire thermal crossover, and pit loss for conceptual learning.
        </span>
      </div>

      {/* MODULE 1: TIRE DEGRADATION CURVE */}
      {activeTab === 'tire_deg' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chart Display */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-pixie">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <div>
                <h3 className="text-xl font-bold font-display text-plum">
                  Pirelli Compound Degradation Trajectory
                </h3>
                <p className="text-xs text-plum/60 mt-0.5">
                  Hover along the timeline to compare lap times (lower is faster).
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-bold">
                <span className="flex items-center space-x-1 text-red-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Soft (C5)</span>
                </span>
                <span className="flex items-center space-x-1 text-yellow-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span>Medium (C3)</span>
                </span>
                <span className="flex items-center space-x-1 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span>Hard (C1)</span>
                </span>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto cursor-crosshair select-none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const xRel = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, (xRel - (padL * rect.width) / svgWidth) / ((plotW * rect.width) / svgWidth)));
                  const lapNum = Math.round(1 + ratio * 34);
                  setHoveredLap(lapNum);
                }}
                onMouseLeave={() => setHoveredLap(null)}
              >
                {/* Horizontal Gridlines */}
                {[88, 90, 92, 94].map((sec) => (
                  <g key={sec}>
                    <line
                      x1={padL}
                      y1={getY(sec)}
                      x2={padL + plotW}
                      y2={getY(sec)}
                      stroke="#F0EBE5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padL - 8}
                      y={getY(sec) + 4}
                      fill="#9CA3AF"
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="JetBrains Mono"
                    >
                      {sec}s
                    </text>
                  </g>
                ))}

                {/* X Axis Lap Marks */}
                {[1, 5, 10, 15, 20, 25, 30, 35].map((lap) => (
                  <g key={lap}>
                    <line
                      x1={getX(lap)}
                      y1={padT + plotH}
                      x2={getX(lap)}
                      y2={padT + plotH + 5}
                      stroke="#D1D5DB"
                    />
                    <text
                      x={getX(lap)}
                      y={padT + plotH + 18}
                      fill="#9CA3AF"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="JetBrains Mono"
                    >
                      L{lap}
                    </text>
                  </g>
                ))}

                {/* Compound Lines */}
                <path d={buildPath('Soft')} fill="none" stroke="#D94355" strokeWidth="3" />
                <path d={buildPath('Medium')} fill="none" stroke="#EAB308" strokeWidth="3" />
                <path d={buildPath('Hard')} fill="none" stroke="#332C39" strokeWidth="3" />

                {/* Hover vertical crosshair */}
                {activeLapData && (
                  <g>
                    <line
                      x1={getX(activeLapData.lap)}
                      y1={padT}
                      x2={getX(activeLapData.lap)}
                      y2={padT + plotH}
                      stroke="#D94355"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle cx={getX(activeLapData.lap)} cy={getY(activeLapData.Soft)} r="4" fill="#D94355" stroke="#FFF" strokeWidth="2" />
                    <circle cx={getX(activeLapData.lap)} cy={getY(activeLapData.Medium)} r="4" fill="#EAB308" stroke="#FFF" strokeWidth="2" />
                    <circle cx={getX(activeLapData.lap)} cy={getY(activeLapData.Hard)} r="4" fill="#332C39" stroke="#FFF" strokeWidth="2" />
                  </g>
                )}
              </svg>
            </div>

            {/* Lap Telemetry Snapshot Pill */}
            {activeLapData && (
              <div className="mt-4 p-3.5 rounded-2xl bg-cosmic-50 border border-cosmic-200 flex flex-wrap items-center justify-between text-xs">
                <span className="font-bold text-plum font-mono">Lap {activeLapData.lap} Pace:</span>
                <span className="text-racing font-bold font-mono">Soft: {activeLapData.Soft}s</span>
                <span className="text-yellow-600 font-bold font-mono">Medium: {activeLapData.Medium}s</span>
                <span className="text-plum font-bold font-mono">Hard: {activeLapData.Hard}s</span>
              </div>
            )}
          </div>

          {/* Controls & Tactical Insights */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-cosmic-200 shadow-pixie">
              <h4 className="text-xs font-bold uppercase tracking-wider text-plum/60 mb-4">
                Track Variables
              </h4>

              {/* Track Temp Slider */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs font-semibold text-plum">
                  <span>Track Asphalt Temp</span>
                  <span className="font-mono text-racing">{trackTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="55"
                  value={trackTemp}
                  onChange={(e) => setTrackTemp(parseInt(e.target.value))}
                  className="w-full accent-racing h-1.5 bg-cosmic-200 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-plum/60 block">
                  Higher track temperatures cook soft tires, triggering thermal degradation earlier.
                </span>
              </div>

              {/* Deg Multiplier */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-semibold text-plum">
                  <span>Track Abrasion Level</span>
                  <span className="font-mono text-racing">{tireDegMultiplier}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.1"
                  value={tireDegMultiplier}
                  onChange={(e) => setTireDegMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-racing h-1.5 bg-cosmic-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Strategist Conclusion */}
              <div className="bg-blush-light/60 p-4 rounded-2xl border border-blush/60 text-xs">
                <span className="font-bold text-racing block mb-1">
                  💡 Strategist Takeaway:
                </span>
                <p className="text-plum/80 leading-relaxed font-normal">
                  The Soft tire is unbeatable for the first 10-12 laps, but by Lap 15, the Medium overtakes it in pace. By Lap 22, the Hard tire becomes the fastest car on track as the Soft falls off the proverbial "cliff".
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: UNDERCUT CALCULATOR */}
      {activeTab === 'undercut' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-pixie space-y-5">
            <h3 className="text-xl font-bold font-display text-plum mb-2">
              Undercut Window Calculator
            </h3>
            <p className="text-xs text-plum/70 leading-relaxed mb-4">
              Can you jump the car ahead by pitting one lap earlier onto fresh rubber?
            </p>

            <div>
              <div className="flex justify-between text-xs font-semibold text-plum mb-1.5">
                <span>Gap to Car Ahead (seconds)</span>
                <span className="font-mono font-bold text-racing">+{gapToLeader}s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.1"
                value={gapToLeader}
                onChange={(e) => setGapToLeader(parseFloat(e.target.value))}
                className="w-full accent-racing h-1.5 bg-cosmic-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-plum mb-1.5">
                <span>Fresh Tire Out-Lap Advantage (seconds)</span>
                <span className="font-mono font-bold text-racing">{freshTirePaceGain}s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={freshTirePaceGain}
                onChange={(e) => setFreshTirePaceGain(parseFloat(e.target.value))}
                className="w-full accent-racing h-1.5 bg-cosmic-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-plum mb-1.5">
                <span>Driver In-Lap Push Delta (seconds)</span>
                <span className="font-mono font-bold text-racing">+{inLapPushDelta}s</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.5"
                step="0.1"
                value={inLapPushDelta}
                onChange={(e) => setInLapPushDelta(parseFloat(e.target.value))}
                className="w-full accent-racing h-1.5 bg-cosmic-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div
              className={`rounded-3xl p-6 sm:p-8 border shadow-pixie transition-all ${
                undercutSucceeds
                  ? 'bg-emerald-50/80 border-emerald-300'
                  : 'bg-rose-50/80 border-rose-300'
              }`}
            >
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    undercutSucceeds ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                <span className={undercutSucceeds ? 'text-emerald-800' : 'text-rose-800'}>
                  Simulation Outcome
                </span>
              </div>

              <h2
                className={`text-2xl sm:text-3xl font-extrabold font-display mb-3 ${
                  undercutSucceeds ? 'text-emerald-950' : 'text-rose-950'
                }`}
              >
                {undercutSucceeds ? 'Undercut SUCCEEDS! 🎉' : 'Undercut FAILS ❌'}
              </h2>

              <p className="text-xs sm:text-sm text-plum/80 leading-relaxed mb-6 font-medium">
                {undercutSucceeds
                  ? `Your combined out-lap and in-lap gain (${totalGain.toFixed(2)}s) wiped out the ${gapToLeader}s gap. You will emerge ahead as your rival exits the pit lane by ${margin} seconds!`
                  : `Your combined pace gain (${totalGain.toFixed(2)}s) was insufficient to overcome the ${gapToLeader}s gap. You will rejoin ${margin} seconds behind your rival in dirty air.`}
              </p>

              <div className="bg-white/80 p-4 rounded-2xl border border-black/5 text-xs space-y-1 text-plum/70">
                <span className="font-bold text-plum block mb-1">Race Engineer Radio:</span>
                <p className="italic">
                  {undercutSucceeds
                    ? '"Hammer time! Push on the out-lap, we got him!"'
                    : '"Gap is too large to undercut this lap. Stay out, conserve front tires for clean air."'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: 1-STOP VS 2-STOP */}
      {activeTab === 'stops' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-pixie">
          <div className="max-w-xl mb-6">
            <h3 className="text-xl font-bold font-display text-plum">
              1-Stop vs 2-Stop Race Strategy Comparison
            </h3>
            <p className="text-xs sm:text-sm text-plum/70 mt-1">
              Is it faster to nurse tires over a 1-stop distance or make an extra 22-second pit stop to push flat-out on grippier rubber?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-cosmic-50 p-5 rounded-2xl border border-cosmic-200/80">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-plum text-white mb-3 inline-block">
                Strategy A: 1-Stop (Medium → Hard)
              </span>
              <p className="text-xs text-plum/80 leading-relaxed mb-3">
                1 pit stop at Lap 24. Low pit lane risk, but severe tire management required in the final 10 laps.
              </p>
              <div className="text-xs font-mono font-bold text-plum">
                Estimated Total Race Time: ~{oneStopTime.toFixed(1)}s
              </div>
            </div>

            <div className="bg-cosmic-50 p-5 rounded-2xl border border-cosmic-200/80">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-racing text-white mb-3 inline-block">
                Strategy B: 2-Stop (Soft → Medium → Soft)
              </span>
              <p className="text-xs text-plum/80 leading-relaxed mb-3">
                2 pit stops at Lap 15 and Lap 33. Loses an extra {pitLossSeconds}s in the pits, but laps ~0.7s/lap faster throughout.
              </p>
              <div className="text-xs font-mono font-bold text-racing">
                Estimated Total Race Time: ~{twoStopTime.toFixed(1)}s
              </div>
            </div>
          </div>

          {/* Pit Loss Slider */}
          <div className="max-w-md space-y-2 mb-6">
            <div className="flex justify-between text-xs font-semibold text-plum">
              <span>Pit Lane Stationary + Transit Loss</span>
              <span className="font-mono text-racing">{pitLossSeconds} seconds</span>
            </div>
            <input
              type="range"
              min="16"
              max="28"
              step="0.5"
              value={pitLossSeconds}
              onChange={(e) => setPitLossSeconds(parseFloat(e.target.value))}
              className="w-full accent-racing h-1.5 bg-cosmic-200 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] text-plum/60 block">
              If pit loss is low (e.g. at Silverstone or under Safety Car), 2-stop wins easily. At tracks with long pit lanes, 1-stop is king.
            </span>
          </div>

          <div className="bg-lavender-light/50 p-4 rounded-2xl border border-lavender/60 text-xs text-plum/80">
            <strong>Verdict: </strong>
            {parseFloat(stopsDiff) > 0
              ? `The 2-Stop strategy is currently faster by ${Math.abs(parseFloat(stopsDiff))} seconds over the Grand Prix distance!`
              : `The 1-Stop strategy wins by ${Math.abs(parseFloat(stopsDiff))} seconds because pit lane transit penalty is too high!`}
          </div>
        </div>
      )}

      {/* MODULE 4: WEATHER CROSSOVER */}
      {activeTab === 'weather' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-pixie">
          <div className="max-w-xl mb-6">
            <h3 className="text-xl font-bold font-display text-plum">
              Track Moisture & Rain Crossover Window
            </h3>
            <p className="text-xs sm:text-sm text-plum/70 mt-1">
              Adjust rainfall rate to observe the exact meteorological threshold where slick tires lose grip and wet weather compounds take over.
            </p>
          </div>

          <div className="max-w-md space-y-2 mb-8">
            <div className="flex justify-between text-xs font-semibold text-plum">
              <span>Rainfall Intensity</span>
              <span className="font-mono font-bold text-racing">{rainfallRate} mm/hour</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="12.0"
              step="0.5"
              value={rainfallRate}
              onChange={(e) => setRainfallRate(parseFloat(e.target.value))}
              className="w-full accent-racing h-1.5 bg-cosmic-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-cosmic-50 p-6 rounded-3xl border border-cosmic-200 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-plum/50 block mb-2">
              Mandatory Tire Choice For Conditions:
            </span>
            <h4 className="text-2xl font-bold font-display text-racing mb-2">
              {weatherAdvice.compound}
            </h4>
            <p className="text-sm text-plum/80 leading-relaxed font-medium">
              {weatherAdvice.note}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
