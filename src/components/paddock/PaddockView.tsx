import React, { useState } from 'react';
import { DRIVERS } from '../../data/drivers';
import { TEAMS } from '../../data/teams';
import { RIVALRIES } from '../../data/rivalries';
import { GLOSSARY } from '../../data/glossary';
import { Driver, Team } from '../../types';
import { Heart, Trophy, Flag, Shield, Flame, Scale, Search, Sparkles, BookOpen } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const PaddockView: React.FC = () => {
  const { progress, toggleFavoriteDriver, toggleFavoriteTeam } = useLearning();

  const [activeTab, setActiveTab] = useState<'drivers' | 'teams' | 'compare' | 'rivalries' | 'glossary'>('drivers');
  const [selectedDriver, setSelectedDriver] = useState<Driver>(DRIVERS[0]);
  const [compareDriverA, setCompareDriverA] = useState<Driver>(DRIVERS[0]);
  const [compareDriverB, setCompareDriverB] = useState<Driver>(DRIVERS[1]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDrivers = DRIVERS.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeams = TEAMS.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.base.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-racing mb-2">
            <span className="w-2 h-2 rounded-full bg-racing" />
            <span>2024 / 2025 Grid Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-plum tracking-tight">
            The Paddock
          </h1>
          <p className="text-sm sm:text-base text-plum/70 max-w-2xl mt-1">
            Meet the 20 fastest gladiators on Earth, explore team legacies, and compare your favorite drivers.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-white p-1.5 rounded-2xl border border-cosmic-200 shadow-sm overflow-x-auto">
          {[
            { id: 'drivers', label: 'Drivers' },
            { id: 'teams', label: 'Teams' },
            { id: 'compare', label: 'Driver Duel', icon: Scale },
            { id: 'rivalries', label: 'Epic Rivalries', icon: Flame },
            { id: 'glossary', label: 'Glossary', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

      {/* DRIVERS TAB */}
      {activeTab === 'drivers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Driver Cards Grid */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-plum/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search drivers or teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-2xl bg-white border border-cosmic-200 focus:outline-none focus:border-racing text-plum shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredDrivers.map((driver) => {
                const isSelected = selectedDriver.id === driver.id;
                const isFavorite = progress.favoriteDriverIds.includes(driver.id);

                return (
                  <div
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className={`cursor-pointer rounded-3xl p-5 border transition-all text-left relative overflow-hidden ${
                      isSelected
                        ? 'bg-white border-racing shadow-pixie-hover ring-2 ring-racing/20'
                        : 'bg-white/80 hover:bg-white border-cosmic-200/90 hover:shadow-pixie'
                    }`}
                  >
                    {/* Top Accent Stripe */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5"
                      style={{ backgroundColor: driver.teamColor }}
                    />

                    <div className="flex items-start justify-between mb-3 pt-1">
                      <div>
                        <span className="text-xs font-bold text-plum/50 flex items-center space-x-1">
                          <span>{driver.flag}</span>
                          <span>#{driver.number}</span>
                        </span>
                        <h3 className="text-lg font-bold font-display text-plum mt-0.5">
                          {driver.name}
                        </h3>
                        <p className="text-xs text-plum/70 font-medium">
                          {driver.teamName}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteDriver(driver.id);
                        }}
                        className={`p-2 rounded-xl transition-all ${
                          isFavorite
                            ? 'text-racing bg-blush-light'
                            : 'text-plum/30 hover:text-racing hover:bg-cosmic-100'
                        }`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-cosmic-100/60 border border-cosmic-200/60 text-center">
                      <div>
                        <span className="block text-[10px] text-plum/50 font-medium uppercase">Titles</span>
                        <span className="block text-sm font-extrabold text-plum">{driver.worldChampionships}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-plum/50 font-medium uppercase">Wins</span>
                        <span className="block text-sm font-extrabold text-racing">{driver.raceWins}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-plum/50 font-medium uppercase">Podiums</span>
                        <span className="block text-sm font-extrabold text-plum">{driver.podiums}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Driver Detailed Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-cosmic-200 shadow-pixie sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-lavender-light text-plum border border-lavender/60">
                  {selectedDriver.season} Official Profile
                </span>
                <span className="text-2xl">{selectedDriver.flag}</span>
              </div>

              <div className="flex items-center space-x-4 mb-5">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md"
                  style={{ backgroundColor: selectedDriver.teamColor }}
                >
                  {selectedDriver.number}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold font-display text-plum">
                    {selectedDriver.name}
                  </h2>
                  <p className="text-sm font-medium text-plum/70">
                    {selectedDriver.teamName}
                  </p>
                </div>
              </div>

              {/* Biography */}
              <p className="text-sm text-plum/80 leading-relaxed mb-5">
                {selectedDriver.biography}
              </p>

              {/* Driving Style Callout */}
              <div className="bg-cosmic-100/70 border border-cosmic-200/80 rounded-2xl p-4 mb-5">
                <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-racing mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Driving Style & Signature Trait</span>
                </div>
                <p className="text-xs text-plum/85 leading-relaxed">
                  {selectedDriver.drivingStyle}
                </p>
              </div>

              {/* Skills Attribute Bars */}
              <div className="space-y-2.5 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-plum/60 mb-2">
                  Driver Attributes
                </h4>
                {[
                  { label: 'Qualifying Precision', val: selectedDriver.stats.qualifyingPace },
                  { label: 'Racecraft & Overtaking', val: selectedDriver.stats.racecraft },
                  { label: 'Tire Whisperer', val: selectedDriver.stats.tireManagement },
                  { label: 'Wet Weather Feel', val: selectedDriver.stats.wetWeather },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-xs font-medium text-plum mb-1">
                      <span>{stat.label}</span>
                      <span className="font-mono font-bold">{stat.val}/100</span>
                    </div>
                    <div className="w-full bg-cosmic-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-racing h-full rounded-full transition-all duration-500"
                        style={{ width: `${stat.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Interesting Facts */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-plum/60 mb-2">
                  Did You Know?
                </h4>
                <ul className="space-y-1.5 text-xs text-plum/80 list-disc list-inside">
                  {selectedDriver.interestingFacts.map((fact, i) => (
                    <li key={i}>{fact}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEAMS TAB */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const isFavorite = progress.favoriteTeamIds.includes(team.id);

            return (
              <div
                key={team.id}
                className="bg-white rounded-3xl p-6 border border-cosmic-200 shadow-pixie flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-plum/50">
                      Est. {team.firstEntry}
                    </span>
                    <button
                      onClick={() => toggleFavoriteTeam(team.id)}
                      className={`p-2 rounded-xl transition-all ${
                        isFavorite
                          ? 'text-racing bg-blush-light'
                          : 'text-plum/30 hover:text-racing hover:bg-cosmic-100'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold font-display text-plum mb-1">
                    {team.fullName}
                  </h3>
                  <p className="text-xs text-plum/60 mb-3">
                    Base: {team.base} • Principal: {team.teamPrincipal}
                  </p>

                  <p className="text-sm text-plum/80 leading-relaxed mb-4">
                    {team.biography}
                  </p>

                  {/* Livery & Engine Pills */}
                  <div className="space-y-2 mb-4">
                    <div className="text-xs bg-cosmic-100 p-2.5 rounded-xl border border-cosmic-200/70">
                      <span className="font-bold text-plum">Power Unit:</span>{' '}
                      <span className="text-plum/80">{team.powerUnit}</span>
                    </div>
                    <div className="text-xs bg-cosmic-100 p-2.5 rounded-xl border border-cosmic-200/70">
                      <span className="font-bold text-plum">Livery:</span>{' '}
                      <span className="text-plum/80">{team.liveryDescription}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-cosmic-200 flex items-center justify-between">
                  <span className="text-xs text-plum/60 font-medium">Constructors Championships:</span>
                  <span className="text-base font-extrabold text-racing">
                    {team.worldChampionships} 🏆
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DRIVER DUEL COMPARISON TAB */}
      {activeTab === 'compare' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-pixie">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold font-display text-plum">
              Head-to-Head Driver Duel
            </h2>
            <p className="text-xs sm:text-sm text-plum/70 mt-1">
              Select any two drivers to compare career statistics, racecraft ratings, and championship milestones side by side.
            </p>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Driver A Selector */}
            <div className="bg-cosmic-100/70 p-4 rounded-2xl border border-cosmic-200">
              <label className="block text-xs font-bold text-plum/60 uppercase mb-2">Driver 1</label>
              <select
                value={compareDriverA.id}
                onChange={(e) => setCompareDriverA(DRIVERS.find((d) => d.id === e.target.value) || DRIVERS[0])}
                className="w-full p-2.5 rounded-xl bg-white border border-cosmic-200 text-sm font-bold text-plum focus:outline-none focus:border-racing"
              >
                {DRIVERS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.teamName})</option>
                ))}
              </select>
            </div>

            {/* Driver B Selector */}
            <div className="bg-cosmic-100/70 p-4 rounded-2xl border border-cosmic-200">
              <label className="block text-xs font-bold text-plum/60 uppercase mb-2">Driver 2</label>
              <select
                value={compareDriverB.id}
                onChange={(e) => setCompareDriverB(DRIVERS.find((d) => d.id === e.target.value) || DRIVERS[1])}
                className="w-full p-2.5 rounded-xl bg-white border border-cosmic-200 text-sm font-bold text-plum focus:outline-none focus:border-racing"
              >
                {DRIVERS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.teamName})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Side-by-side comparison stats */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              { label: 'World Championships', a: compareDriverA.worldChampionships, b: compareDriverB.worldChampionships },
              { label: 'Grand Prix Race Wins', a: compareDriverA.raceWins, b: compareDriverB.raceWins },
              { label: 'Career Podiums', a: compareDriverA.podiums, b: compareDriverB.podiums },
              { label: 'Pole Positions', a: compareDriverA.polePositions, b: compareDriverB.polePositions },
              { label: 'Qualifying Pace (Rating)', a: compareDriverA.stats.qualifyingPace, b: compareDriverB.stats.qualifyingPace },
              { label: 'Tire Management (Rating)', a: compareDriverA.stats.tireManagement, b: compareDriverB.stats.tireManagement },
              { label: 'Wet Weather Mastery (Rating)', a: compareDriverA.stats.wetWeather, b: compareDriverB.stats.wetWeather },
            ].map((metric) => {
              const aWins = metric.a > metric.b;
              const bWins = metric.b > metric.a;
              return (
                <div key={metric.label} className="bg-cosmic-50 p-3.5 rounded-2xl border border-cosmic-200/70">
                  <div className="flex items-center justify-between text-xs font-medium text-plum/70 mb-1">
                    <span className={`font-mono font-bold text-sm ${aWins ? 'text-racing font-extrabold' : 'text-plum'}`}>
                      {metric.a}
                    </span>
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-plum/80 text-center">
                      {metric.label}
                    </span>
                    <span className={`font-mono font-bold text-sm ${bWins ? 'text-racing font-extrabold' : 'text-plum'}`}>
                      {metric.b}
                    </span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-cosmic-200">
                    <div
                      className={`h-full ${aWins ? 'bg-racing' : 'bg-plum/40'}`}
                      style={{ width: `${(metric.a / (metric.a + metric.b || 1)) * 100}%` }}
                    />
                    <div
                      className={`h-full ${bWins ? 'bg-racing' : 'bg-plum/40'}`}
                      style={{ width: `${(metric.b / (metric.a + metric.b || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EPIC RIVALRIES TAB */}
      {activeTab === 'rivalries' && (
        <div className="space-y-6">
          {RIVALRIES.map((rivalry) => (
            <div
              key={rivalry.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-pixie"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-racing-light/20 text-racing border border-racing/30">
                  {rivalry.era}
                </span>
                <span className="text-xs font-semibold text-plum/50">Historic Rivalry</span>
              </div>

              <h3 className="text-2xl font-bold font-display text-plum mb-1">
                {rivalry.title}
              </h3>
              <p className="text-sm font-semibold text-racing mb-4">
                {rivalry.headline}
              </p>

              <p className="text-sm text-plum/80 leading-relaxed mb-5">
                {rivalry.story}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-cosmic-100/70 p-4 rounded-2xl border border-cosmic-200/80">
                  <h4 className="text-xs font-bold uppercase text-racing tracking-wider mb-1">
                    Decisive Clash
                  </h4>
                  <p className="text-xs text-plum/85 leading-relaxed font-normal">
                    {rivalry.keyClash}
                  </p>
                </div>

                <div className="bg-sage-light/60 p-4 rounded-2xl border border-sage/60">
                  <h4 className="text-xs font-bold uppercase text-emerald-800 tracking-wider mb-1">
                    Enduring Legacy
                  </h4>
                  <p className="text-xs text-emerald-900 leading-relaxed font-normal">
                    {rivalry.outcome}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GLOSSARY TAB */}
      {activeTab === 'glossary' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-pixie">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-display text-plum">
              F1 Rookie Glossary
            </h2>
            <p className="text-xs sm:text-sm text-plum/70 mt-1">
              Decode the radio chatter, aerodynamics jargon, and race terminology like a seasoned engineer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GLOSSARY.map((item, idx) => (
              <div
                key={idx}
                className="bg-cosmic-50/70 p-4 rounded-2xl border border-cosmic-200/80 hover:bg-white transition-all shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-base font-bold text-plum">
                    {item.term}
                  </h4>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-lavender-light text-plum">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs font-semibold text-racing mb-2">
                  {item.simpleDefinition}
                </p>
                <p className="text-xs text-plum/75 leading-relaxed mb-3">
                  {item.deepExplanation}
                </p>
                {item.exampleQuote && (
                  <div className="text-[11px] italic text-plum/60 bg-cosmic-100 p-2 rounded-xl border border-cosmic-200/60">
                    {item.exampleQuote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
