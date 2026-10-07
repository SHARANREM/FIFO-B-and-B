import React from 'react';
import { Calculator, HelpCircle, ArrowDown, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function BoundCalculation({ calculationData, capacity }) {
  if (!calculationData) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
          <Calculator className="w-4 h-4 text-sky-600" />
          <h2 className="text-sm font-bold text-slate-800">
            Bound Calculation Breakdown
          </h2>
        </div>
        <p className="text-xs text-slate-400 py-4 text-center">
          Select or advance to a node calculation step to view arithmetic details.
        </p>
      </div>
    );
  }

  const {
    bound,
    baseWeight,
    baseProfit,
    steps = [],
    fractionalItem,
    isFeasible,
    explanation
  } = calculationData;

  const startingRemaining = capacity - baseWeight;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-sky-600" />
          <h2 className="text-sm font-bold text-slate-800">
            Bound Calculation (Fractional Relaxation)
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500">Result:</span>
          <span className="text-sm font-bold font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            ₹{bound.toFixed(2)}
          </span>
        </div>
      </div>

      {!isFeasible ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Infeasible Branch (Weight Exceeds Capacity)
          </div>
          <p>
            Current weight ({baseWeight} kg) &gt; Knapsack capacity ({capacity} kg).
            Bound is set to 0 and this node cannot yield any valid solution.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Starting State */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Knapsack Capacity (W):</span>
              <strong className="text-slate-900">{capacity} kg</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Starting Node Weight:</span>
              <strong className="text-slate-900">{baseWeight} kg</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Starting Node Profit:</span>
              <strong className="text-slate-900">₹{baseProfit}</strong>
            </div>
            <div className="flex justify-between text-sky-800 pt-1 border-t border-slate-200">
              <span>Remaining Capacity:</span>
              <strong>{capacity} − {baseWeight} = {startingRemaining} kg</strong>
            </div>
          </div>

          {/* Sequential Item Fill */}
          <div className="space-y-2 text-xs">
            {steps.length === 0 ? (
              <div className="text-slate-400 text-center py-2 text-xs">
                No subsequent items can fit or all items already decided.
              </div>
            ) : (
              steps.map((st, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg border font-mono ${
                    st.type === 'fractional'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="flex items-center gap-1.5 font-sans">
                      {st.type === 'fractional' ? (
                        <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 text-[10px] font-bold rounded">
                          FRACTIONAL FILL
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                          FULL ITEM
                        </span>
                      )}
                      <span>Item {st.item.name}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-600">
                      W={st.item.weight} kg, P=₹{st.item.profit} (Ratio: {st.item.ratio})
                    </span>
                  </div>

                  {st.type === 'full' ? (
                    <div className="text-[11px] space-y-0.5 text-slate-700">
                      <div>Weight: +{st.weightAdded} kg → Total: {st.accumulatedWeight} kg</div>
                      <div>Profit: +₹{st.profitAdded} → Total: ₹{st.accumulatedProfit}</div>
                      <div className="text-slate-500">
                        Remaining Capacity: {st.remainingCapacity} kg
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] space-y-0.5 text-amber-900">
                      <div className="font-semibold">
                        Cannot fit completely! Take fraction of Item {st.item.name}:
                      </div>
                      <div className="bg-white/80 p-1.5 rounded border border-amber-200/80 my-1">
                        Remaining Capacity = {st.weightAdded} kg
                        <br />
                        Fraction = {st.weightAdded} / {st.item.weight} = {(st.fraction).toFixed(3)}
                        <br />
                        Fractional Profit = {(st.fraction).toFixed(3)} × ₹{st.item.profit} = <strong>+₹{st.profitAdded.toFixed(2)}</strong>
                      </div>
                      <div>Knapsack is now 100% full (Remaining: 0 kg)</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Final Formula Sum */}
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs font-mono">
            <span className="block text-[11px] font-sans font-bold text-sky-900 uppercase mb-1">
              Final Bound Arithmetic Sum:
            </span>
            <div className="text-slate-700 leading-relaxed">
              Bound = Base ₹{baseProfit}
              {steps.map(s => ` + ₹${s.profitAdded.toFixed(s.type === 'fractional' ? 2 : 0)}`).join('')}
              <br />
              <strong className="text-sky-900 text-sm mt-1 inline-block">
                = ₹{bound.toFixed(2)}
              </strong>
            </div>
          </div>

          {/* Educational Note on Fractional Relaxation */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">
                Fractional items are used ONLY to calculate the optimistic bound:
              </strong>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Actual 0/1 knapsack solutions only accept whole items (take or skip).
                The fractional knapsack solution serves as an upper bound guaranteeing that no 0/1 combination down this subtree can ever exceed ₹{bound.toFixed(2)}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
