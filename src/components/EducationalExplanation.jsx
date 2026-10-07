import React from 'react';
import { Lightbulb, BookOpen } from 'lucide-react';

export default function EducationalExplanation({ currentStep }) {
  if (!currentStep) return null;

  const { educationalNote, action } = currentStep;

  return (
    <div className="bg-sky-50/60 border border-sky-200/80 rounded-xl p-4 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-300 flex items-center justify-center text-sky-700 shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900">
              Seminar Concept Note
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white text-sky-800 border border-sky-200">
              {action}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {educationalNote || 'Branch and Bound explores promising combinatorial states while mathematically pruning hopeless branches.'}
          </p>
        </div>
      </div>
    </div>
  );
}
