import React from 'react';
import { X, CheckCircle2, XCircle, Award, Compass, Calculator, Layers } from 'lucide-react';

export default function NodeModal({ node, capacity, maxProfit, onClose }) {
  if (!node) return null;

  const isPruned = node.status === 'pruned';
  const isOptimal = node.status === 'solution' || node.isOptimalPath;
  const isCurrent = node.status === 'current';
  const isWaiting = node.status === 'waiting';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-slate-900">
              NODE #{node.id}
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-bold font-sans bg-slate-100 text-slate-700">
              {node.decisionLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-50 border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Current Node Status:
            </span>
            {isOptimal && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Award className="w-3.5 h-3.5" />
                OPTIMAL SOLUTION
              </span>
            )}
            {isPruned && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded bg-rose-100 text-rose-800 border border-rose-300">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                PRUNED
              </span>
            )}
            {isCurrent && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded bg-sky-100 text-sky-800 border border-sky-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                CURRENTLY ACTIVE
              </span>
            )}
            {isWaiting && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded bg-slate-200 text-slate-700">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                WAITING IN QUEUE
              </span>
            )}
            {!isOptimal && !isPruned && !isCurrent && !isWaiting && (
              <span className="text-xs font-bold text-slate-600">
                {node.status.toUpperCase()}
              </span>
            )}
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Level</span>
              <span className="text-sm font-bold text-slate-800">{node.level}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Weight</span>
              <span className="text-sm font-bold text-slate-800">{node.weight} kg</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Profit</span>
              <span className="text-sm font-bold text-emerald-700">₹{node.profit}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Bound</span>
              <span className="text-sm font-bold text-sky-700">₹{node.bound.toFixed(2)}</span>
            </div>
          </div>

          {/* Decision Path */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <span className="font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              Decision Path from Root:
            </span>
            <div className="font-mono text-[11px] text-slate-600 space-y-0.5">
              {node.path.length === 0 ? (
                <span>ROOT (No decisions made)</span>
              ) : (
                node.path.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-slate-400">Step {i + 1}:</span>
                    <strong className={p.taken ? 'text-sky-700' : 'text-slate-600'}>
                      {p.taken ? `Take ${p.item.name}` : `Skip ${p.item.name}`}
                    </strong>
                    <span className="text-slate-400">
                      (W: {p.item.weight} kg, P: ₹{p.item.profit})
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Prune / Keep Explanation */}
          <div className="p-3 rounded-lg border text-xs bg-slate-50 border-slate-200">
            <span className="font-semibold text-slate-800 block mb-1">
              Why was this node {isPruned ? 'PRUNED' : 'KEPT'}?
            </span>
            {isPruned ? (
              <p className="text-rose-700">
                {node.pruneReason || (node.weight > capacity ? `Weight ${node.weight} exceeds capacity ${capacity}` : `Bound ₹${node.bound} ≤ Best Known ₹${maxProfit}`)}
                <br />
                <span className="text-slate-500 text-[11px] mt-1 block">
                  Branch and Bound safely abandons this node because it mathematically cannot produce a better feasible 0/1 solution.
                </span>
              </p>
            ) : (
              <p className="text-emerald-800">
                Optimistic upper bound (₹{node.bound.toFixed(2)}) was strictly greater than the current best profit (₹{maxProfit}) and weight ({node.weight} kg) did not exceed capacity ({capacity} kg).
              </p>
            )}
          </div>

          {/* Bound details if available */}
          {node.boundDetails && (
            <div className="bg-sky-50/50 p-3 rounded-lg border border-sky-200 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-sky-900 mb-1">
                <Calculator className="w-3.5 h-3.5 text-sky-600" />
                <span>Bound Calculation Formula:</span>
              </div>
              <p className="font-mono text-[11px] text-slate-700">
                {node.boundDetails.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
