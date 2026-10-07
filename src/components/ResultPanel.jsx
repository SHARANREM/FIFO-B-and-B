import React from 'react';
import { Award, CheckCheck, GitFork, Scissors, Zap, BarChart2 } from 'lucide-react';

export default function ResultPanel({ stats, bestSolution, capacity, numItems, onRestart }) {
  if (!stats) return null;

  const {
    nodesGenerated,
    nodesExplored,
    nodesPruned,
    bruteForceCombinations,
    maxProfit
  } = stats;

  const items = bestSolution ? bestSolution.itemsTaken : [];

  return (
    <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-emerald-950">
                Optimal Solution Found
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">
                Search Terminated
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-0.5">
              FIFO queue is completely exhausted. The global optimum is mathematically verified.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="self-start md:self-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          Replay Simulation
        </button>
      </div>

      {/* Solution details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        <div className="bg-white border border-emerald-200 rounded-lg p-3.5 text-center shadow-2xs">
          <span className="text-xs font-medium text-emerald-700 block uppercase">
            Maximum Profit
          </span>
          <span className="text-2xl font-extrabold text-emerald-900 font-mono">
            ₹{maxProfit}
          </span>
        </div>

        <div className="bg-white border border-emerald-200 rounded-lg p-3.5 text-center shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block uppercase">
            Knapsack Weight
          </span>
          <span className="text-2xl font-bold text-slate-800 font-mono">
            {bestSolution ? bestSolution.weight : 0} <span className="text-xs font-normal text-slate-500">/ {capacity} kg</span>
          </span>
        </div>

        <div className="bg-white border border-emerald-200 rounded-lg p-3.5 text-center shadow-2xs">
          <span className="text-xs font-medium text-sky-700 block uppercase">
            Selected Items
          </span>
          <span className="text-lg font-bold text-sky-950 font-mono">
            {items.length > 0 ? items.map(it => it.name).join(' + ') : 'None'}
          </span>
        </div>
      </div>

      {/* Algorithm Performance & Seminar Comparison */}
      <div className="bg-white border border-emerald-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Branch and Bound Search Statistics vs Brute Force
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="block text-[11px] text-slate-500 font-medium">Nodes Generated</span>
            <strong className="text-base font-bold text-slate-800 font-mono">{nodesGenerated}</strong>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="block text-[11px] text-sky-700 font-medium">Nodes Explored</span>
            <strong className="text-base font-bold text-sky-800 font-mono">{nodesExplored}</strong>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="block text-[11px] text-rose-700 font-medium">Nodes Pruned</span>
            <strong className="text-base font-bold text-rose-800 font-mono">{nodesPruned}</strong>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="block text-[11px] text-purple-700 font-medium">Brute Force (2<sup>{numItems}</sup>)</span>
            <strong className="text-base font-bold text-purple-800 font-mono">{bruteForceCombinations}</strong>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
          <strong>Seminar Takeaway:</strong> A naive exhaustive brute force search would blindly check all 2<sup>{numItems}</sup> = {bruteForceCombinations} leaf combinations.
          By computing upper bounds with fractional knapsack relaxation, Branch and Bound pruned <strong>{nodesPruned} nodes</strong> early, avoiding the generation and evaluation of entire subtrees.
        </p>
      </div>
    </div>
  );
}
