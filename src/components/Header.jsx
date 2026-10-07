import React from 'react';
import { Network, GraduationCap, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-300 flex items-center justify-center text-sky-600 shadow-xs">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                FIFO Branch &amp; Bound
              </h1>
              <span className="bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-200">
                0/1 Knapsack
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Watch every branch, bound, queue operation and pruning decision happen step by step.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg self-start md:self-auto">
          <GraduationCap className="w-4 h-4 text-sky-600" />
          <span>Interactive Seminar Simulator</span>
          <span className="text-slate-300">•</span>
          <span className="font-mono text-slate-500">Pure FIFO (Queue)</span>
        </div>
      </div>
    </header>
  );
}
