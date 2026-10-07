import React, { useEffect, useRef } from 'react';
import { Code2 } from 'lucide-react';
import { JAVA_CODE_LINES } from '../logic/codeDefinitions.js';

export default function JavaCodePanel({ activeLineId }) {
  const activeLineRef = useRef(null);

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeLineId]);

  // Simple token highlighter for Java keywords and syntax
  const formatJavaLine = (text) => {
    if (!text) return '\u00A0';

    // Highlight comments
    if (text.trim().startsWith('//')) {
      return <span className="text-emerald-600 italic">{text}</span>;
    }

    // Split words while preserving spaces
    const parts = text.split(/(\s+|[(){}[\];,.<>=+\-*\/])/);

    return parts.map((part, index) => {
      const keywords = ['import', 'class', 'public', 'static', 'void', 'int', 'double', 'new', 'return', 'while', 'if', 'else', 'continue'];
      const types = ['Item', 'Node', 'Queue', 'LinkedList', 'Arrays', 'Double', 'System', 'String', 'FIFOKnapsack'];
      
      if (keywords.includes(part)) {
        return <span key={index} className="text-purple-700 font-bold">{part}</span>;
      }
      if (types.includes(part)) {
        return <span key={index} className="text-amber-700 font-semibold">{part}</span>;
      }
      if (part.startsWith('"') && part.endsWith('"')) {
        return <span key={index} className="text-green-700">{part}</span>;
      }
      if (/^\d+(\.\d+)?$/.test(part)) {
        return <span key={index} className="text-cyan-700 font-semibold">{part}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-[400px]">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-sky-600" />
          <h2 className="text-sm font-bold text-slate-800">
            Java Reference Implementation
          </h2>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
          Line {activeLineId || '—'}
        </span>
      </div>

      <div className="p-3 overflow-y-auto flex-1 font-mono text-[11px] space-y-0.5 scrollbar-thin bg-slate-50/20">
        {JAVA_CODE_LINES.map((line) => {
          const isActive = line.id === activeLineId;
          return (
            <div
              key={line.id}
              ref={isActive ? activeLineRef : null}
              className={`px-2 py-0.5 rounded transition-colors duration-150 flex items-start gap-2.5 ${
                isActive
                  ? 'bg-sky-100 text-sky-950 font-bold border-l-3 border-sky-600 shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-100/60'
              }`}
            >
              <span className={`text-[10px] w-5 text-right select-none ${isActive ? 'text-sky-700 font-bold' : 'text-slate-400'}`}>
                {line.id}
              </span>
              <span className="flex-1 whitespace-pre leading-relaxed">
                {formatJavaLine(line.text)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
