import React, { useEffect, useRef } from 'react';
import { FileCode2 } from 'lucide-react';
import { PSEUDOCODE_LINES } from '../logic/codeDefinitions.js';

export default function PseudocodePanel({ activeLineId }) {
  const activeLineRef = useRef(null);

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeLineId]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-[400px]">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-sky-600" />
          <h2 className="text-sm font-bold text-slate-800">
            Algorithm Pseudocode
          </h2>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
          Line {activeLineId || '—'}
        </span>
      </div>

      <div className="p-3 overflow-y-auto flex-1 font-mono text-xs space-y-0.5 scrollbar-thin bg-slate-50/30">
        {PSEUDOCODE_LINES.map((line) => {
          const isActive = line.id === activeLineId;
          return (
            <div
              key={line.id}
              ref={isActive ? activeLineRef : null}
              className={`px-2.5 py-1 rounded transition-colors duration-200 flex items-start gap-2 ${
                isActive
                  ? 'bg-sky-100 text-sky-950 font-bold border-l-3 border-sky-600 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100/60'
              }`}
            >
              <span className={`text-[11px] w-6 text-right select-none ${isActive ? 'text-sky-700 font-bold' : 'text-slate-400'}`}>
                {line.id}
              </span>
              <span className="flex-1 whitespace-pre-wrap leading-relaxed">
                {line.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
