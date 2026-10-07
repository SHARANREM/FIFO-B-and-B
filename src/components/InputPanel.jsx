import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, ArrowDownUp, AlertCircle, Sparkles } from 'lucide-react';

export default function InputPanel({
  items,
  capacity,
  onUpdateItems,
  onUpdateCapacity,
  onResetToDefault,
  isSimulationRunning,
  onApplyInputs
}) {
  const [errorMsg, setErrorMsg] = useState(null);

  // Compute live sorted preview
  const previewSorted = [...items]
    .map(it => ({
      ...it,
      ratio: it.weight > 0 ? (it.profit / it.weight).toFixed(2) : 0
    }))
    .sort((a, b) => {
      const rA = a.weight > 0 ? a.profit / a.weight : 0;
      const rB = b.weight > 0 ? b.profit / b.weight : 0;
      return rB - rA;
    });

  const handleCapacityChange = (e) => {
    const val = Number(e.target.value);
    if (val < 0) {
      setErrorMsg("Capacity cannot be negative");
      return;
    }
    setErrorMsg(null);
    onUpdateCapacity(val);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    if (field === 'name') {
      updated[index].name = value.trim() || `Item ${index + 1}`;
    } else {
      const num = Number(value);
      if (num < 0) {
        setErrorMsg("Weights and profits must be positive numbers");
        return;
      }
      updated[index][field] = num;
    }
    setErrorMsg(null);
    onUpdateItems(updated);
  };

  const handleAddItem = () => {
    if (items.length >= 10) {
      setErrorMsg("For seminar demonstration speed and clarity, max 10 items recommended.");
      return;
    }
    const nextChar = String.fromCharCode(65 + items.length);
    const newItem = {
      id: Date.now(),
      name: nextChar,
      weight: 3,
      profit: 45
    };
    setErrorMsg(null);
    onUpdateItems([...items, newItem]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) {
      setErrorMsg("At least one item is required for the knapsack problem.");
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setErrorMsg(null);
    onUpdateItems(updated);
  };

  const validateAndApply = () => {
    if (capacity <= 0) {
      setErrorMsg("Knapsack capacity must be greater than 0.");
      return;
    }
    for (const it of items) {
      if (!it.weight || it.weight <= 0) {
        setErrorMsg(`Item ${it.name} must have weight greater than 0.`);
        return;
      }
      if (it.profit === undefined || it.profit < 0) {
        setErrorMsg(`Item ${it.name} must have a valid non-negative profit.`);
        return;
      }
    }
    setErrorMsg(null);
    onApplyInputs();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Top row: Knapsack capacity & Quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold text-slate-800">
            Knapsack Capacity (W):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="200"
              value={capacity}
              onChange={handleCapacityChange}
              disabled={isSimulationRunning}
              className="w-24 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 disabled:opacity-60"
            />
            <span className="text-xs text-slate-500 font-medium">kg</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetToDefault}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Reset to college seminar standard dataset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Load Seminar Example</span>
          </button>
          <button
            type="button"
            onClick={handleAddItem}
            disabled={items.length >= 10 || isSimulationRunning}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Items table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <th className="py-2 px-3">Item</th>
              <th className="py-2 px-3">Weight (W<sub>i</sub>)</th>
              <th className="py-2 px-3">Profit (P<sub>i</sub>)</th>
              <th className="py-2 px-3">Profit / Weight</th>
              <th className="py-2 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {items.map((item, idx) => {
              const ratio = item.weight > 0 ? (item.profit / item.weight).toFixed(2) : '—';
              return (
                <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                      disabled={isSimulationRunning}
                      className="w-16 px-2 py-1 text-xs font-sans font-bold border border-slate-200 rounded focus:ring-1 focus:ring-sky-500 bg-white"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1 font-sans">
                      <input
                        type="number"
                        min="1"
                        value={item.weight}
                        onChange={(e) => handleItemChange(idx, 'weight', e.target.value)}
                        disabled={isSimulationRunning}
                        className="w-20 px-2 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-sky-500 bg-white"
                      />
                      <span className="text-slate-400 text-[11px]">kg</span>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1 font-sans">
                      <span className="text-slate-400 text-xs">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={item.profit}
                        onChange={(e) => handleItemChange(idx, 'profit', e.target.value)}
                        disabled={isSimulationRunning}
                        className="w-20 px-2 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-sky-500 bg-white"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                      {item.profit} / {item.weight} = <strong className="text-sky-700">{ratio}</strong>
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length <= 1 || isSimulationRunning}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sorted Preview indicator */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-sky-50/60 p-3 rounded-lg border border-sky-100">
        <div className="flex items-center gap-2 text-xs text-sky-900">
          <ArrowDownUp className="w-4 h-4 text-sky-600 shrink-0" />
          <span className="font-semibold">Items are sorted by Profit / Weight ratio:</span>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            {previewSorted.map((it, idx) => (
              <span key={idx} className="bg-white border border-sky-200 px-2 py-0.5 rounded font-medium text-slate-800 shadow-2xs">
                {it.name} <span className="text-sky-600">({it.ratio})</span>
                {idx < previewSorted.length - 1 && <span className="text-slate-400 ml-1.5">&gt;</span>}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={validateAndApply}
          className="self-end md:self-auto text-xs font-semibold px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Apply &amp; Rebuild Simulation</span>
        </button>
      </div>
    </div>
  );
}
