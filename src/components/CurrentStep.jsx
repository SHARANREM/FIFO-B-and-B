import React from 'react';
import { Activity, CheckCircle2, XCircle, ArrowRight, Award, Compass } from 'lucide-react';

export default function CurrentStep({ currentStep, capacity }) {
  if (!currentStep) return null;

  const {
    title,
    message,
    currentNodeId,
    targetNodeId,
    nodes,
    maxProfit,
    statusBadge
  } = currentStep;

  // Active node to inspect
  const activeNode = (targetNodeId !== null && nodes[targetNodeId]) 
    ? nodes[targetNodeId] 
    : (currentNodeId !== null ? nodes[currentNodeId] : null);

  const isPruned = statusBadge.type === 'pruned' || (activeNode && activeNode.status === 'pruned');
  const isKept = statusBadge.type === 'keep';
  const isOptimal = statusBadge.type === 'optimal' || (activeNode && activeNode.status === 'solution');
  const isNewBest = statusBadge.type === 'best';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            CURRENT STEP
          </h2>
        </div>

        {/* Dynamic Status Tag */}
        {isOptimal && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Award className="w-3.5 h-3.5" />
            OPTIMAL SOLUTION
          </span>
        )}
        {isNewBest && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-bounce">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
            NEW BEST: ₹{maxProfit}
          </span>
        )}
        {isKept && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            KEEP — Bound &gt; Best
          </span>
        )}
        {isPruned && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            PRUNED
          </span>
        )}
        {!isOptimal && !isNewBest && !isKept && !isPruned && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Activity className="w-3.5 h-3.5 text-slate-500" />
            {statusBadge.label}
          </span>
        )}
      </div>

      {/* Main Title & Action Explanation */}
      <h3 className="text-base font-bold text-slate-900 mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-600 leading-relaxed mb-4">
        {message}
      </p>

      {/* Node Metrics Cards */}
      {activeNode ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
            <span className="block text-[11px] font-medium text-slate-400 uppercase">Level</span>
            <span className="text-sm font-bold text-slate-800">
              {activeNode.level === -1 ? 'Root (-1)' : activeNode.level}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
            <span className="block text-[11px] font-medium text-slate-400 uppercase">Weight</span>
            <span className={`text-sm font-bold ${activeNode.weight > capacity ? 'text-rose-600' : 'text-slate-800'}`}>
              {activeNode.weight} <span className="text-xs font-normal text-slate-500">/ {capacity} kg</span>
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
            <span className="block text-[11px] font-medium text-slate-400 uppercase">Profit</span>
            <span className="text-sm font-bold text-emerald-700">
              ₹{activeNode.profit}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
            <span className="block text-[11px] font-medium text-slate-400 uppercase">Bound</span>
            <span className="text-sm font-bold text-sky-700">
              ₹{activeNode.bound > 0 ? activeNode.bound.toFixed(2) : '0'}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center col-span-2 sm:col-span-1">
            <span className="block text-[11px] font-medium text-slate-400 uppercase">Current Best</span>
            <span className="text-sm font-bold text-amber-700">
              ₹{maxProfit}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-400 py-2">
          Preparing simulation state...
        </div>
      )}

      {/* Decision Path breadcrumbs if activeNode has items */}
      {activeNode && activeNode.path && activeNode.path.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600 flex-wrap">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            Decision Path:
          </span>
          <span className="text-slate-400 font-mono text-[11px]">ROOT</span>
          {activeNode.path.map((step, idx) => (
            <React.Fragment key={idx}>
              <ArrowRight className="w-3 h-3 text-slate-300" />
              <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold border ${
                step.taken 
                  ? 'bg-sky-50 text-sky-800 border-sky-200' 
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {step.taken ? `Take ${step.item.name}` : `Skip ${step.item.name}`}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
