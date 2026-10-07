import React from 'react';
import { Layers, Calculator, FileCode2, Code2, Activity, CheckCircle2, XCircle, Award, Compass, Trophy } from 'lucide-react';
import QueueView from './QueueView.jsx';
import BoundCalculation from './BoundCalculation.jsx';
import PseudocodePanel from './PseudocodePanel.jsx';
import JavaCodePanel from './JavaCodePanel.jsx';

export default function RightInspectorPanel({
  activeTab,
  setActiveTab,
  currentStep,
  capacity,
  maxProfit,
  bestSolution
}) {
  if (!currentStep) return null;

  const {
    title,
    message,
    currentNodeId,
    targetNodeId,
    nodes,
    queue,
    boundCalculation,
    pseudocodeLineId,
    javaLineId,
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

  const tabs = [
    {
      id: 'queue',
      label: 'FIFO Queue',
      icon: Layers,
      badge: `${queue.length}`
    },
    {
      id: 'bound',
      label: 'Bound Calculation',
      icon: Calculator,
      badge: boundCalculation && boundCalculation.bound !== undefined ? `₹${boundCalculation.bound}` : null
    },
    {
      id: 'algo',
      label: 'Algorithm (Pseudocode)',
      icon: FileCode2,
      badge: `L${pseudocodeLineId}`
    },
    {
      id: 'java',
      label: 'Java Code',
      icon: Code2,
      badge: `L${javaLineId}`
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-full min-h-[580px]">
      {/* 1. Header with Compact Active Step & Status Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              CURRENT OPERATION
            </h3>
          </div>

          {/* Status pill */}
          {isOptimal && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Award className="w-3 h-3" />
              OPTIMAL
            </span>
          )}
          {isNewBest && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <CheckCircle2 className="w-3 h-3 text-amber-700" />
              NEW BEST: ₹{maxProfit}
            </span>
          )}
          {isKept && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
              <CheckCircle2 className="w-3 h-3 text-sky-600" />
              KEEP
            </span>
          )}
          {isPruned && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
              <XCircle className="w-3 h-3 text-rose-600" />
              PRUNED
            </span>
          )}
          {!isOptimal && !isNewBest && !isKept && !isPruned && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <Activity className="w-3 h-3 text-slate-500" />
              {statusBadge.label}
            </span>
          )}
        </div>

        <div className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
          {title}
        </div>
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
          {message}
        </p>

        {/* Quick metrics chip row */}
        {activeNode && (
          <div className="flex items-center justify-between gap-1.5 pt-2 mt-2 border-t border-slate-200/60 font-mono text-[11px]">
            <div className="bg-white border border-slate-200 px-2 py-0.5 rounded">
              <span className="text-slate-400 font-sans text-[10px]">Node:</span> #{activeNode.id}
            </div>
            <div className="bg-white border border-slate-200 px-2 py-0.5 rounded">
              <span className="text-slate-400 font-sans text-[10px]">W:</span> {activeNode.weight}/{capacity}kg
            </div>
            <div className="bg-white border border-slate-200 px-2 py-0.5 rounded text-emerald-700 font-bold">
              <span className="text-slate-400 font-sans text-[10px]">P:</span> ₹{activeNode.profit}
            </div>
            <div className="bg-white border border-slate-200 px-2 py-0.5 rounded text-sky-700 font-bold">
              <span className="text-slate-400 font-sans text-[10px]">Bound:</span> ₹{activeNode.bound ? activeNode.bound.toFixed(1) : '0'}
            </div>
            <div className="bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-amber-800 font-bold">
              <span className="text-amber-500 font-sans text-[10px]">Best:</span> ₹{maxProfit}
            </div>
          </div>
        )}
      </div>

      {/* 2. User Choice Tab Selector */}
      <div className="bg-slate-100/80 p-1.5 border-b border-slate-200 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-white text-sky-900 shadow-xs border border-sky-300 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
              <span className="truncate">{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. The Selected Component (Only ONE shown based on user choice) */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/20">
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <QueueView
              queue={queue}
              nodesDict={nodes}
            />
            {/* Quick seminar reminder for queue */}
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-sky-900">
              <strong className="block mb-1">Classroom Note: FIFO Dequeue Rule</strong>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Nodes are explored in the exact sequence they entered the queue. Notice how 
                node arrival order dictates exploration order, in contrast to Best-First search which orders by bound.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'bound' && (
          <div className="space-y-4">
            <BoundCalculation
              calculationData={boundCalculation}
              capacity={capacity}
            />
          </div>
        )}

        {activeTab === 'algo' && (
          <div className="space-y-3">
            <PseudocodePanel activeLineId={pseudocodeLineId} />
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Synchronized Highlighting:</span> Line {pseudocodeLineId} reflects the exact micro-operation being carried out right now.
            </div>
          </div>
        )}

        {activeTab === 'java' && (
          <div className="space-y-3">
            <JavaCodePanel activeLineId={javaLineId} />
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Synchronized Java Line:</span> Line {javaLineId} matches the active loop, node instantiation, bound calculation, or enqueue/prune condition.
            </div>
          </div>
        )}
      </div>

      {/* 4. Mini Footer showing Best Known Summary */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] flex items-center justify-between text-slate-600">
        <span className="flex items-center gap-1 font-medium">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          Best Profit: <strong className="text-amber-700 font-mono">₹{maxProfit}</strong>
        </span>
        <span className="font-mono text-slate-500">
          Items: {bestSolution && bestSolution.itemsTaken.length > 0 ? bestSolution.itemsTaken.map(it => it.name).join('+') : 'None'}
        </span>
      </div>
    </div>
  );
}
