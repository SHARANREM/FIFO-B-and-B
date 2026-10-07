import React from 'react';
import { Trophy, CheckCheck, PackageCheck, Sparkles } from 'lucide-react';

export default function CurrentBestPanel({ bestSolution, maxProfit, capacity }) {
  const items = bestSolution ? bestSolution.itemsTaken : [];
  const totalWeight = bestSolution ? bestSolution.weight : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-800">
            Current Best Solution (Global Max)
          </h2>
        </div>
        <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          maxProfit: ₹{maxProfit}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-amber-50/50 border border-amber-200/70 rounded-lg p-3 text-center">
          <span className="text-[11px] font-medium text-amber-800 block uppercase">
            Best Profit
          </span>
          <span className="text-xl font-extrabold text-amber-700 font-mono">
            ₹{maxProfit}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <span className="text-[11px] font-medium text-slate-500 block uppercase">
            Knapsack Weight
          </span>
          <span className="text-xl font-bold text-slate-800 font-mono">
            {totalWeight} <span className="text-xs text-slate-500 font-normal">/ {capacity} kg</span>
          </span>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1.5">
          <PackageCheck className="w-3.5 h-3.5 text-sky-600" />
          <span>Selected Items:</span>
        </div>

        {items.length === 0 ? (
          <span className="text-slate-400 font-mono text-[11px]">
            None selected yet (Initial baseline = 0)
          </span>
        ) : (
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex flex-wrap items-center gap-1.5">
              {items.map((it, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800 font-bold shadow-2xs"
                >
                  {it.name} (W={it.weight}, P=₹{it.profit})
                </span>
              ))}
            </div>

            <div className="text-slate-500 pt-1 text-[11px]">
              Weight: {items.map(it => it.weight).join(' + ')} = <strong>{totalWeight} kg</strong>
              <br />
              Profit: {items.map(it => `₹${it.profit}`).join(' + ')} = <strong className="text-amber-700">₹{maxProfit}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
