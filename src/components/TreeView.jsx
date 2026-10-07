import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Info, Compass } from 'lucide-react';
import { computeTreeLayout } from '../logic/treeLayout.js';
import NodeModal from './NodeModal.jsx';

export default function TreeView({ nodesDict, currentNodeId, targetNodeId, capacity, maxProfit }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);

  const containerRef = useRef(null);

  // Compute neat non-overlapping layout
  const { layoutNodes, totalWidth, totalHeight, nodeMap } = computeTreeLayout(nodesDict, 0);

  // Auto-pan to center current active node when it changes
  useEffect(() => {
    const focusId = targetNodeId !== null ? targetNodeId : currentNodeId;
    if (focusId !== null && nodeMap[focusId] && containerRef.current) {
      const target = nodeMap[focusId];
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // Center horizontally and vertically around the active node with smooth feel
      const newX = containerWidth / 2 - target.x * zoom;
      const newY = containerHeight / 3 - target.y * zoom;
      setPan({ x: Math.min(100, Math.max(-totalWidth * zoom, newX)), y: Math.min(100, Math.max(-totalHeight * zoom, newY)) });
    }
  }, [currentNodeId, targetNodeId, zoom]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.4));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 40, y: 20 });
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('.interactive-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Tree header with controls and legend */}
      <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-sky-600" />
          <h2 className="text-sm font-bold text-slate-800">
            Branch &amp; Bound Flow Chart (Search Tree)
          </h2>
          <span className="text-xs text-slate-400 font-medium hidden xl:inline">
            (Click any node to inspect details)
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 ring-2 ring-sky-200" />
            <span>Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-400" />
            <span>In Queue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-400" />
            <span>Pruned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            <span>Optimal</span>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 ml-2 shadow-2xs">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive SVG tree canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full flex-1 min-h-[580px] bg-slate-50/60 overflow-hidden select-none cursor-${isDragging ? 'grabbing' : 'grab'}`}
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 0.75px, transparent 0.75px)',
          backgroundSize: '20px 20px'
        }}
      >
        <svg
          width="100%"
          height="100%"
          className="w-full h-full"
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Draw Branches (Connections) first so they sit behind nodes */}
            {layoutNodes.map((item) => {
              const node = item.node;
              if (node.parentId === null) return null;
              const parent = nodeMap[node.parentId];
              if (!parent) return null;

              const isChildCurrent = node.id === currentNodeId || node.id === targetNodeId;
              const isChildOptimal = node.isOptimalPath && parent.node.isOptimalPath;
              const isChildPruned = node.status === 'pruned';

              // Curve path
              const startX = parent.x;
              const startY = parent.y + parent.height / 2;
              const endX = item.x;
              const endY = item.y - item.height / 2;
              const midY = (startY + endY) / 2;

              const pathD = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
              const midX = (startX + endX) / 2;

              return (
                <g key={`edge-${node.id}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={
                      isChildOptimal
                        ? '#059669'
                        : isChildCurrent
                        ? '#0284c7'
                        : isChildPruned
                        ? '#cbd5e1'
                        : '#94a3b8'
                    }
                    strokeWidth={isChildOptimal ? 3.5 : isChildCurrent ? 2.5 : 1.75}
                    strokeDasharray={isChildPruned ? '4,4' : 'none'}
                    className="transition-colors duration-300"
                  />
                  {/* Branch label on edge */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-32"
                      y="-11"
                      width="64"
                      height="20"
                      rx="10"
                      fill="#ffffff"
                      stroke={node.decision === 'INCLUDE' ? '#38bdf8' : '#94a3b8'}
                      strokeWidth="1.2"
                      className="shadow-2xs"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="bold"
                      fill={node.decision === 'INCLUDE' ? '#0369a1' : '#475569'}
                      className="font-sans"
                    >
                      {node.decision === 'INCLUDE' ? 'Take' : 'Skip'} {node.itemConsidered ? node.itemConsidered.name : ''}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {layoutNodes.map((item) => {
              const node = item.node;
              const isCurrent = node.id === currentNodeId || node.id === targetNodeId;
              const isOptimal = node.status === 'solution';
              const isPruned = node.status === 'pruned';
              const isWaiting = node.status === 'waiting';

              const cardWidth = item.width;
              const cardHeight = item.height;
              const topLeftX = item.x - cardWidth / 2;
              const topLeftY = item.y - cardHeight / 2;

              let strokeColor = '#cbd5e1';
              let fillColor = '#ffffff';
              let strokeWidth = 1.5;

              if (isOptimal) {
                strokeColor = '#10b981';
                strokeWidth = 3;
                fillColor = '#f0fdf4';
              } else if (isCurrent) {
                strokeColor = '#0284c7';
                strokeWidth = 3;
                fillColor = '#f0f9ff';
              } else if (isPruned) {
                strokeColor = '#f43f5e';
                strokeWidth = 1.5;
                fillColor = '#fff1f2';
              } else if (isWaiting) {
                strokeColor = '#38bdf8';
                strokeWidth = 1.8;
                fillColor = '#ffffff';
              }

              return (
                <g
                  key={`node-${node.id}`}
                  transform={`translate(${topLeftX}, ${topLeftY})`}
                  onClick={() => setSelectedNode(node)}
                  className="interactive-node cursor-pointer group"
                >
                  {/* Subtle card drop shadow */}
                  <rect
                    x="0"
                    y="0"
                    width={cardWidth}
                    height={cardHeight}
                    rx="10"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    className="transition-all duration-200 group-hover:filter group-hover:drop-shadow-md"
                  />

                  {/* Header bar inside node */}
                  <rect
                    x="0"
                    y="0"
                    width={cardWidth}
                    height="24"
                    rx="10"
                    fill={
                      isOptimal
                        ? '#059669'
                        : isCurrent
                        ? '#0284c7'
                        : isPruned
                        ? '#e11d48'
                        : '#f1f5f9'
                    }
                  />
                  {/* Square off bottom corners of header */}
                  <rect
                    x="0"
                    y="14"
                    width={cardWidth}
                    height="10"
                    fill={
                      isOptimal
                        ? '#059669'
                        : isCurrent
                        ? '#0284c7'
                        : isPruned
                        ? '#e11d48'
                        : '#f1f5f9'
                    }
                  />

                  {/* Title / Decision */}
                  <text
                    x={cardWidth / 2}
                    y="16"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill={isOptimal || isCurrent || isPruned ? '#ffffff' : '#1e293b'}
                    className="font-sans"
                  >
                    {node.decisionLabel}
                  </text>

                  {/* Metrics text */}
                  <text
                    x="12"
                    y="42"
                    fontSize="10"
                    fontWeight="600"
                    fill={node.weight > capacity ? '#e11d48' : '#334155'}
                    className="font-mono"
                  >
                    W = {node.weight}
                  </text>

                  <text
                    x={cardWidth - 12}
                    y="42"
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#047857"
                    className="font-mono"
                  >
                    P = ₹{node.profit}
                  </text>

                  <text
                    x="12"
                    y="60"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#0369a1"
                    className="font-mono"
                  >
                    Bound = ₹{node.bound > 0 ? node.bound.toFixed(1) : '0'}
                  </text>

                  {/* Node Status Tag / Reason pill at bottom */}
                  {isOptimal ? (
                    <g transform={`translate(${cardWidth / 2}, 86)`}>
                      <rect x="-42" y="-10" width="84" height="17" rx="8.5" fill="#10b981" />
                      <text x="0" y="2" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ffffff">
                        ★ OPTIMAL
                      </text>
                    </g>
                  ) : isPruned ? (
                    <g transform={`translate(${cardWidth / 2}, 86)`}>
                      <rect x="-46" y="-10" width="92" height="17" rx="8.5" fill="#fda4af" />
                      <text x="0" y="2" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#9f1239">
                        {node.weight > capacity ? 'CAP EXCEEDED' : 'PRUNED: ≤ BEST'}
                      </text>
                    </g>
                  ) : isCurrent ? (
                    <g transform={`translate(${cardWidth / 2}, 86)`}>
                      <rect x="-38" y="-10" width="76" height="17" rx="8.5" fill="#0284c7" />
                      <text x="0" y="2" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#ffffff">
                        ACTIVE
                      </text>
                    </g>
                  ) : (
                    <g transform={`translate(${cardWidth / 2}, 86)`}>
                      <rect x="-32" y="-10" width="64" height="17" rx="8.5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
                      <text x="0" y="2" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#64748b">
                        #{node.id} {isWaiting ? 'Queued' : 'Done'}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating helper overlay */}
        <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 px-2.5 py-1 rounded text-[10px] text-slate-500 shadow-2xs">
          Drag background to pan canvas • Nodes rendered: {layoutNodes.length}
        </div>
      </div>

      {/* Node Inspector Modal */}
      {selectedNode && (
        <NodeModal
          node={selectedNode}
          capacity={capacity}
          maxProfit={maxProfit}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
