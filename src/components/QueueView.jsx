import React from 'react';
import { Layers, ArrowRight, CornerDownRight, Info } from 'lucide-react';

export default function QueueView({ queue, nodesDict }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-600" />
          <h2 className="text-sm font-bold text-slate-800">
            FIFO Queue (LinkedList)
          </h2>
          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono font-semibold">
            {queue.length} {queue.length === 1 ? 'node' : 'nodes'} waiting
          </span>
        </div>

        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
          <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>Strict FIFO: First in, first explored. Not prioritized by bound.</span>
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="py-6 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-lg">
          <p className="text-xs text-slate-500 font-medium">
            Queue is currently empty.
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            (All generated branch candidates have either been explored or pruned)
          </span>
        </div>
      ) : (
        <div>
          {/* Header indicator: FRONT -> REAR */}
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2 px-1">
            <span className="text-sky-700 uppercase tracking-wider flex items-center gap-1">
              ▼ Next to explore (FRONT)
            </span>
            <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1">
              Latest added (REAR) ▲
            </span>
          </div>

          {/* Queue items strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
            {queue.map((nodeId, idx) => {
              const node = nodesDict[nodeId];
              if (!node) return null;
              const isFront = idx === 0;
              const isRear = idx === queue.length - 1;

              return (
                <React.Fragment key={nodeId}>
                  <div
                    className={`shrink-0 w-44 rounded-lg p-2.5 border transition-all ${
                      isFront
                        ? 'bg-sky-50/70 border-sky-300 ring-2 ring-sky-200/60 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        Node #{node.id}
                      </span>
                      {isFront && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-sky-200/80 text-sky-800 rounded">
                          FRONT
                        </span>
                      )}
                      {isRear && !isFront && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                          REAR
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-slate-700 truncate mb-1.5">
                      {node.decisionLabel}
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[11px] bg-slate-50/80 p-1 rounded font-mono border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[9px]">W</span>
                        <span className="font-semibold text-slate-800">{node.weight}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">P</span>
                        <span className="font-semibold text-emerald-700">₹{node.profit}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">BOUND</span>
                        <span className="font-semibold text-sky-700">₹{node.bound.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  {idx < queue.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
