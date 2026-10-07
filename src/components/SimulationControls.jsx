import React from 'react';
import { Play, Pause, RotateCcw, StepForward, StepBack, FastForward, Gauge } from 'lucide-react';

export default function SimulationControls({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBack,
  currentStepIndex,
  totalSteps,
  speed,
  onSpeedChange,
  isCompleted,
  showInputs,
  onToggleInputs
}) {
  const progressPercent = totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Primary Execution Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {isPlaying ? (
          <button
            type="button"
            onClick={onPause}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors"
          >
            <Pause className="w-4 h-4 fill-white" />
            <span>PAUSE</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onPlay}
            disabled={isCompleted}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>PLAY</span>
          </button>
        )}

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Step Back */}
        <button
          type="button"
          onClick={onStepBack}
          disabled={currentStepIndex <= 0 || isPlaying}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-colors disabled:cursor-not-allowed"
          title="Step back to previous state"
        >
          <StepBack className="w-3.5 h-3.5" />
          <span>Step Back</span>
        </button>

        {/* Step Forward */}
        <button
          type="button"
          onClick={onStepForward}
          disabled={currentStepIndex >= totalSteps - 1 || isPlaying}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 disabled:opacity-40 font-semibold text-xs rounded-lg border border-sky-200 transition-colors disabled:cursor-not-allowed"
          title="Execute exactly one algorithm operation"
        >
          <span>Step Forward</span>
          <StepForward className="w-3.5 h-3.5 text-sky-600" />
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium text-xs rounded-lg border border-transparent hover:border-slate-200 transition-colors ml-1"
          title="Reset simulation to beginning (keeps item inputs)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        {/* Toggle Inputs button */}
        {onToggleInputs && (
          <button
            type="button"
            onClick={onToggleInputs}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ml-1 ${
              showInputs
                ? 'bg-sky-50 text-sky-800 border-sky-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>{showInputs ? 'Hide Inputs' : 'Edit Inputs & Capacity'}</span>
          </button>
        )}
      </div>

      {/* Step scrubber & Progress */}
      <div className="flex-1 max-w-md mx-2 flex flex-col justify-center gap-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <span className="font-mono text-[11px] text-sky-700 font-semibold">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
          <div
            className="bg-sky-500 h-full rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
        <Gauge className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-500 font-medium">Speed:</span>
        <div className="flex items-center gap-1">
          {[
            { id: 'slow', label: 'Slow (1.6s)', val: 1600 },
            { id: 'normal', label: 'Normal (0.8s)', val: 800 },
            { id: 'fast', label: 'Fast (0.3s)', val: 300 }
          ].map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSpeedChange(s.val)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                speed === s.val
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {s.id.charAt(0).toUpperCase() + s.id.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
