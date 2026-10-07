import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.jsx';
import InputPanel from './components/InputPanel.jsx';
import SimulationControls from './components/SimulationControls.jsx';
import TreeView from './components/TreeView.jsx';
import RightInspectorPanel from './components/RightInspectorPanel.jsx';
import ResultPanel from './components/ResultPanel.jsx';
import { generateSimulationSteps } from './logic/branchAndBound.js';

// Seminar Default Data
const DEFAULT_CAPACITY = 7;
const DEFAULT_ITEMS = [
  { id: 1, name: 'A', weight: 2, profit: 40 },
  { id: 2, name: 'B', weight: 3, profit: 50 },
  { id: 3, name: 'C', weight: 4, profit: 65 },
  { id: 4, name: 'D', weight: 5, profit: 70 }
];

export default function App() {
  const [capacity, setCapacity] = useState(DEFAULT_CAPACITY);
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [runKey, setRunKey] = useState(0);

  // Layout state: Show/hide inputs drawer
  const [showInputs, setShowInputs] = useState(false);

  // Inspector tab choice: 'queue' | 'bound' | 'algo' | 'java'
  const [inspectorTab, setInspectorTab] = useState('queue');

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speed, setSpeed] = useState(800);

  // Generate deterministic simulation steps whenever items or capacity changes
  const simulation = useMemo(() => {
    try {
      return generateSimulationSteps(items, capacity);
    } catch (err) {
      console.error("Simulation generation error:", err);
      return generateSimulationSteps(DEFAULT_ITEMS, DEFAULT_CAPACITY);
    }
  }, [items, capacity, runKey]);

  const { steps, finalStats, sortedItems } = simulation;
  const currentStep = steps[currentStepIndex] || steps[0];
  const isCompleted = currentStepIndex >= steps.length - 1;

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => {
    // Hide inputs immediately on Play to show ONLY the 2 sections!
    setShowInputs(false);
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleStepForward = () => {
    setShowInputs(false);
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleResetToDefault = () => {
    setIsPlaying(false);
    setCapacity(DEFAULT_CAPACITY);
    setItems(DEFAULT_ITEMS);
    setCurrentStepIndex(0);
    setRunKey((k) => k + 1);
  };

  const handleApplyInputs = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setShowInputs(false);
    setRunKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="max-w-[1600px] mx-auto w-full px-3 sm:px-5 py-4 space-y-4 flex-1 flex flex-col">
        {/* Simulation Controls Top Bar */}
        <SimulationControls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          onStepForward={handleStepForward}
          onStepBack={handleStepBack}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          speed={speed}
          onSpeedChange={setSpeed}
          isCompleted={isCompleted}
          showInputs={showInputs}
          onToggleInputs={() => setShowInputs((prev) => !prev)}
        />

        {/* Collapsible Input Configuration (Hidden by default / on Play) */}
        {showInputs && (
          <div className="transition-all duration-300">
            <InputPanel
              items={items}
              capacity={capacity}
              onUpdateItems={(newItems) => {
                setItems(newItems);
                setCurrentStepIndex(0);
              }}
              onUpdateCapacity={(newCap) => {
                setCapacity(newCap);
                setCurrentStepIndex(0);
              }}
              onResetToDefault={handleResetToDefault}
              isSimulationRunning={isPlaying}
              onApplyInputs={handleApplyInputs}
            />
          </div>
        )}

        {/* 
          ONLY 2 SECTIONS MAIN VIEW:
          Section 1 (Left): Flow Chart (Branch & Bound Tree)
          Section 2 (Right): Single Inspector Section with user choice (FIFO Queue, Bound Calculation, Algo, Java)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch">
          {/* SECTION 1: FLOW CHART */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col min-h-[580px]">
            <TreeView
              nodesDict={currentStep.nodes}
              currentNodeId={currentStep.currentNodeId}
              targetNodeId={currentStep.targetNodeId}
              capacity={capacity}
              maxProfit={currentStep.maxProfit}
            />
          </div>

          {/* SECTION 2: FIFO QUEUE, BOUND CALCULATION, ALGO & JAVA (User Choice Tab) */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col min-h-[580px]">
            <RightInspectorPanel
              activeTab={inspectorTab}
              setActiveTab={setInspectorTab}
              currentStep={currentStep}
              capacity={capacity}
              maxProfit={currentStep.maxProfit}
              bestSolution={currentStep.bestSolution}
            />
          </div>
        </div>

        {/* Result Banner when Search Finishes */}
        {isCompleted && (
          <div className="mt-2">
            <ResultPanel
              stats={finalStats}
              bestSolution={currentStep.bestSolution}
              capacity={capacity}
              numItems={sortedItems.length}
              onRestart={() => setCurrentStepIndex(0)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
