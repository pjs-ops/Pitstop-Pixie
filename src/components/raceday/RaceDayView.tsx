import React, { useState } from 'react';
import { LESSONS } from '../../data/lessons';
import { Lesson } from '../../types';
import { CheckCircle2, Clock, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Flag, Disc, Wrench, Trophy, Timer } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const RaceDayView: React.FC = () => {
  const { progress, completeLesson } = useLearning();

  const [selectedLesson, setSelectedLesson] = useState<Lesson>(LESSONS[0]);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Interactive visual sandbox states
  const [activeFlag, setActiveFlag] = useState<string>('yellow');
  const [activeTire, setActiveTire] = useState<string>('soft');

  const isCompleted = progress.completedLessonIds.includes(selectedLesson.id);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (selectedQuizAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedQuizAnswer === selectedLesson.knowledgeCheck.correctIndex) {
      completeLesson(selectedLesson.id, selectedLesson.xpReward);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-racing mb-2">
            <span className="w-2 h-2 rounded-full bg-racing" />
            <span>Beginner Racing Academy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-plum tracking-tight">
            Race Day 101
          </h1>
          <p className="text-sm sm:text-base text-plum/70 max-w-2xl mt-1">
            Visual interactive lessons to demystify qualifying shootouts, secret flag codes, tire wear, and supersonic pit stops.
          </p>
        </div>

        {/* Progress summary pill */}
        <div className="bg-white px-4 py-2 rounded-2xl border border-cosmic-200 shadow-sm flex items-center space-x-3 text-xs font-bold text-plum">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            {progress.completedLessonIds.length} of {LESSONS.length} Lessons Mastered
          </span>
        </div>
      </div>

      {/* 2-Column Lesson Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Lesson Navigation List */}
        <div className="lg:col-span-4 space-y-3">
          {LESSONS.map((lesson, idx) => {
            const isSelected = selectedLesson.id === lesson.id;
            const done = progress.completedLessonIds.includes(lesson.id);

            return (
              <button
                key={lesson.id}
                onClick={() => handleLessonSelect(lesson)}
                className={`w-full text-left p-4 rounded-3xl border transition-all flex items-start space-x-3.5 ${
                  isSelected
                    ? 'bg-white border-racing shadow-pixie-hover ring-2 ring-racing/20'
                    : 'bg-white/80 hover:bg-white border-cosmic-200 hover:shadow-sm'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    done
                      ? 'bg-emerald-100 text-emerald-700'
                      : isSelected
                      ? 'bg-racing text-white'
                      : 'bg-cosmic-200 text-plum'
                  }`}
                >
                  {done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-plum/50 mb-0.5">
                    <span className="capitalize">{lesson.category}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.estimatedMinutes} min</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-plum truncate">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-plum/60 truncate mt-0.5">
                    {lesson.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Active Lesson Interactive Content */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-pixie space-y-8">
          {/* Lesson Header */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-lavender-light text-plum border border-lavender/60">
                Lesson {LESSONS.findIndex((l) => l.id === selectedLesson.id) + 1} of {LESSONS.length}
              </span>
              <span className="text-xs font-bold text-racing flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+{selectedLesson.xpReward} XP</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-plum tracking-tight mb-2">
              {selectedLesson.title}
            </h2>
            <p className="text-sm text-plum/70 leading-relaxed">
              {selectedLesson.overview}
            </p>
          </div>

          {/* Interactive Lesson Visual Sandbox */}
          {selectedLesson.id === 'flags_safety_car' && (
            <div className="bg-[#1C1722] rounded-3xl p-6 text-white border border-plum/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blush mb-3">
                Interactive Track Flag Simulator
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { id: 'green', label: 'Green Flag', color: 'bg-emerald-500' },
                  { id: 'yellow', label: 'Single Yellow', color: 'bg-yellow-400 text-plum' },
                  { id: 'double_yellow', label: 'Double Yellow', color: 'bg-yellow-500 text-plum' },
                  { id: 'red', label: 'Red Flag', color: 'bg-racing' },
                  { id: 'blue', label: 'Blue Flag', color: 'bg-blue-500' },
                  { id: 'vsc', label: 'Virtual Safety Car', color: 'bg-amber-500 text-plum' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFlag(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeFlag === f.id
                        ? `${f.color} ring-2 ring-white scale-105 shadow-md`
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Live Flag Status Box */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs leading-relaxed">
                {activeFlag === 'green' && (
                  <div>
                    <span className="font-bold text-emerald-400 block mb-1">🟢 GREEN FLAG: TRACK CLEAR</span>
                    Hazard has been cleared. Full racing speeds resumed. Overtaking is permitted.
                  </div>
                )}
                {activeFlag === 'yellow' && (
                  <div>
                    <span className="font-bold text-yellow-300 block mb-1">🟡 SINGLE YELLOW: HAZARD BESIDE TRACK</span>
                    Reduce speed, no overtaking permitted in this marshal sector. Be alert for off-track recovery.
                  </div>
                )}
                {activeFlag === 'double_yellow' && (
                  <div>
                    <span className="font-bold text-yellow-400 block mb-1">⚠️ DOUBLE YELLOW: TRACK BLOCKED OR MARSHALS PRESENT</span>
                    Drastically reduce speed. You must abandon your lap time. Be prepared to change line or stop completely.
                  </div>
                )}
                {activeFlag === 'red' && (
                  <div>
                    <span className="font-bold text-racing block mb-1">🔴 RED FLAG: SESSION SUSPENDED IMMEDIATELY</span>
                    Extreme danger or unraceable monsoon. All cars must immediately return to pit lane. Clock stops.
                  </div>
                )}
                {activeFlag === 'blue' && (
                  <div>
                    <span className="font-bold text-blue-400 block mb-1">🔵 BLUE FLAG: LET THE LEADER PASS</span>
                    You are about to be lapped. Yield track position within 3 marshal posts or receive a 5s time penalty.
                  </div>
                )}
                {activeFlag === 'vsc' && (
                  <div>
                    <span className="font-bold text-amber-400 block mb-1">⚡ VIRTUAL SAFETY CAR (VSC): TARGET DELTA</span>
                    Maintain positive delta time on dashboard. Speed reduced by ~40% across whole track without bunching cars.
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedLesson.id === 'tire_compounds' && (
            <div className="bg-[#1C1722] rounded-3xl p-6 text-white border border-plum/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blush mb-3">
                Interactive Tire Compound Inspector
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                {[
                  { id: 'soft', name: 'Soft (C5)', color: 'border-red-500 text-red-400' },
                  { id: 'medium', name: 'Medium (C3)', color: 'border-yellow-400 text-yellow-400' },
                  { id: 'hard', name: 'Hard (C1)', color: 'border-white text-white' },
                  { id: 'inter', name: 'Inters', color: 'border-emerald-400 text-emerald-400' },
                  { id: 'wet', name: 'Full Wet', color: 'border-blue-400 text-blue-400' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTire(t.id)}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all text-center ${
                      activeTire === t.id
                        ? `${t.color} bg-white/10 ring-2 ring-white scale-105 shadow-md`
                        : 'border-white/10 text-white/60 hover:bg-white/5'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs space-y-2">
                {activeTire === 'soft' && (
                  <div>
                    <span className="font-bold text-red-400 block mb-1">🔴 SOFT TIRE (RED STRIPE): MAXIMUM GRIP</span>
                    Fastest lap times in qualifying and sprint starts. Lifespan: ~12-18 laps. Operating temp: 100-110°C.
                  </div>
                )}
                {activeTire === 'medium' && (
                  <div>
                    <span className="font-bold text-yellow-300 block mb-1">🟡 MEDIUM TIRE (YELLOW STRIPE): BALANCED WEAPON</span>
                    The default race-start choice. Ideal balance between aggressive turn-in grip and stint longevity (~25-35 laps).
                  </div>
                )}
                {activeTire === 'hard' && (
                  <div>
                    <span className="font-bold text-white block mb-1">⚪ HARD TIRE (WHITE STRIPE): MARATHON DISTANCE</span>
                    Resists thermal blistering and wear for up to 45 laps. Requires 1-2 hard warmup laps to switch on.
                  </div>
                )}
                {activeTire === 'inter' && (
                  <div>
                    <span className="font-bold text-emerald-400 block mb-1">🟢 INTERMEDIATE (GREEN STRIPE): DAMP & DRYING</span>
                    Treaded pattern evacuates 30 liters of water per second. Perfect for greasy, drying, or light rain conditions.
                  </div>
                )}
                {activeTire === 'wet' && (
                  <div>
                    <span className="font-bold text-blue-400 block mb-1">🔵 FULL WET (BLUE STRIPE): MONSOON FLOODING</span>
                    Deep grooved rain treads evacuate 85 liters of water per second at 300 km/h to prevent fatal aquaplaning.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key Learning Breakdown */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-plum/60">
              Core Principles
            </h4>
            {selectedLesson.keyPoints.map((point, i) => (
              <div key={i} className="bg-cosmic-50 p-4 rounded-2xl border border-cosmic-200/80">
                <h5 className="text-sm font-bold text-plum mb-1">
                  {point.title}
                </h5>
                <p className="text-xs text-plum/80 leading-relaxed mb-2 font-normal">
                  {point.explanation}
                </p>
                {point.analogy && (
                  <div className="flex items-start space-x-2 text-xs text-racing bg-blush-light/50 p-2.5 rounded-xl border border-blush/40 font-medium">
                    <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{point.analogy}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Terminology Mini-List */}
          <div className="bg-cosmic-100/60 p-5 rounded-2xl border border-cosmic-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-plum/60 mb-3">
              Essential Terminology
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {selectedLesson.terminology.map((t, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-cosmic-200/60">
                  <span className="font-bold text-plum block mb-0.5">{t.term}</span>
                  <span className="text-plum/70">{t.definition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Check Mini-Quiz */}
          <div className="pt-6 border-t border-cosmic-200">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-racing mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Knowledge Check • Earn +{selectedLesson.xpReward} XP</span>
            </div>

            <h4 className="text-lg font-bold font-display text-plum mb-4">
              {selectedLesson.knowledgeCheck.question}
            </h4>

            <div className="space-y-2.5 mb-5">
              {selectedLesson.knowledgeCheck.options.map((opt, i) => {
                const isSelected = selectedQuizAnswer === i;
                const isCorrect = i === selectedLesson.knowledgeCheck.correctIndex;

                let stateClass = 'bg-cosmic-50 hover:bg-cosmic-100 border-cosmic-200 text-plum';
                if (quizSubmitted) {
                  if (isCorrect) stateClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  else if (isSelected && !isCorrect) stateClass = 'bg-rose-50 border-rose-500 text-rose-900 line-through';
                } else if (isSelected) {
                  stateClass = 'bg-blush-light border-racing text-plum font-bold';
                }

                return (
                  <button
                    key={i}
                    disabled={quizSubmitted}
                    onClick={() => setSelectedQuizAnswer(i)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all ${stateClass}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                disabled={selectedQuizAnswer === null}
                onClick={handleQuizSubmit}
                className="px-6 py-2.5 rounded-2xl bg-racing hover:bg-racing-dark disabled:opacity-40 text-white text-xs font-bold shadow-md transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <div className="bg-cosmic-100 p-4 rounded-2xl border border-cosmic-200 text-xs">
                <span className="font-bold text-plum block mb-1">
                  {selectedQuizAnswer === selectedLesson.knowledgeCheck.correctIndex ? '🎉 Spot on!' : '💡 Good effort!'}
                </span>
                <p className="text-plum/80 leading-relaxed">
                  {selectedLesson.knowledgeCheck.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
