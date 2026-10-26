import React from 'react';
import { CarComponent } from '../../types';
import { CAR_COMPONENTS } from '../../data/carComponents';
import { Sparkles, Shield, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

interface ComponentDetailProps {
  component: CarComponent;
  onSelectRelated: (id: string) => void;
  onClose?: () => void;
}

export const ComponentDetail: React.FC<ComponentDetailProps> = ({
  component,
  onSelectRelated,
}) => {
  const { inspectComponent } = useLearning();

  React.useEffect(() => {
    inspectComponent(component.id);
  }, [component.id]);

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-7 shadow-pixie border border-cosmic-200/80 flex flex-col h-full overflow-y-auto overflow-x-hidden min-w-0 pr-3 scrollbar-thin">
      {/* Header Pill & Name */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-lavender-light text-plum tracking-wide uppercase mb-2 border border-lavender/60">
          {component.categoryLabel}
        </span>
        <h3 className="text-2xl font-bold font-display text-plum tracking-tight leading-snug">
          {component.name}
        </h3>
      </div>

      {/* Rookie Analogy Callout Box (Unclipped, Stable Icon & Flexible Text) */}
      <div className="bg-blush-light/60 border border-blush/60 rounded-2xl p-4 sm:p-4.5 mb-5 shadow-xs">
        <div className="flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-white shadow-sm text-racing flex items-center justify-center shrink-0 mt-0.5 border border-blush/50">
            <Sparkles className="w-4 h-4 text-racing" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-racing mb-1">
              Rookie Analogy
            </h4>
            <p className="text-xs sm:text-sm text-plum/90 font-medium leading-relaxed break-words">
              {component.analogy}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-plum/75 leading-relaxed mb-5">
        {component.description}
      </p>

      {/* Function & Significance Sections */}
      <div className="space-y-3.5 mb-6">
        <div className="bg-cosmic-50 border border-cosmic-200/70 rounded-2xl p-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-plum uppercase tracking-wider mb-1.5">
            <Zap className="w-3.5 h-3.5 text-racing shrink-0" />
            <span>Primary Function</span>
          </div>
          <p className="text-xs text-plum/80 leading-relaxed font-normal">
            {component.primaryFunction}
          </p>
        </div>

        <div className="bg-cosmic-50 border border-cosmic-200/70 rounded-2xl p-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-plum uppercase tracking-wider mb-1.5">
            <Shield className="w-3.5 h-3.5 text-plum shrink-0" />
            <span>Engineering Significance</span>
          </div>
          <p className="text-xs text-plum/80 leading-relaxed font-normal">
            {component.engineeringSignificance}
          </p>
        </div>

        <div className="bg-sage-light/60 border border-sage/60 rounded-2xl p-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>On-Track Performance Impact</span>
          </div>
          <p className="text-xs text-emerald-900/90 leading-relaxed font-normal">
            {component.performanceImplications}
          </p>
        </div>
      </div>

      {/* Key Specifications Grid */}
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-plum/60 mb-2.5">
          Technical Specifications
        </h4>
        <div className="grid grid-cols-2 gap-2.5">
          {component.keyStats.map((stat, i) => (
            <div key={i} className="bg-cosmic-100/60 p-3 rounded-xl border border-cosmic-200/60">
              <span className="block text-[11px] text-plum/60 font-medium mb-0.5">
                {stat.label}
              </span>
              <span className="block text-xs font-bold text-plum">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Components */}
      {component.relatedComponentIds.length > 0 && (
        <div className="mt-auto pt-4 border-t border-cosmic-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-plum/60 mb-2">
            Related Aerodynamic & Mechanical Parts
          </h4>
          <div className="flex flex-wrap gap-2">
            {component.relatedComponentIds.map((relId) => {
              const relComp = CAR_COMPONENTS.find((c) => c.id === relId);
              return (
                <button
                  key={relId}
                  onClick={() => onSelectRelated(relId)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cosmic-100 hover:bg-lavender-light hover:text-plum border border-cosmic-200/80 transition-all flex items-center space-x-1.5 text-plum/80"
                >
                  <span className="truncate max-w-[160px]">{relComp?.name || relId.replace(/_/g, ' ')}</span>
                  <ArrowRight className="w-3 h-3 text-racing shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
