/**
 * FIFO Branch and Bound Simulation Engine for 0/1 Knapsack
 * Generates an exact, deterministic step-by-step history of the execution.
 */

import { calculateDetailedBound } from './boundCalculator.js';

/**
 * Deep clone helper for node structures and state
 */
function cloneState(nodes, queue, bestSolution) {
  const clonedNodes = {};
  for (const id in nodes) {
    clonedNodes[id] = {
      ...nodes[id],
      path: [...nodes[id].path],
      childrenIds: [...nodes[id].childrenIds],
      boundDetails: nodes[id].boundDetails ? { ...nodes[id].boundDetails } : null
    };
  }
  return {
    nodes: clonedNodes,
    queue: [...queue],
    bestSolution: bestSolution ? {
      ...bestSolution,
      itemsTaken: [...bestSolution.itemsTaken]
    } : null
  };
}

/**
 * Main function to generate all discrete simulation steps
 */
export function generateSimulationSteps(rawItems, capacity) {
  // 1. Sort items by decreasing ratio: P[i] / W[i]
  const sortedItems = rawItems.map((item, idx) => ({
    id: item.id || idx + 1,
    name: item.name || `Item ${idx + 1}`,
    weight: Number(item.weight),
    profit: Number(item.profit),
    ratio: Math.round((Number(item.profit) / Number(item.weight)) * 100) / 100
  })).sort((a, b) => {
    if (b.ratio !== a.ratio) return b.ratio - a.ratio;
    // Tie breaker: higher profit first
    return b.profit - a.profit;
  });

  const steps = [];
  const nodes = {};
  let queue = [];
  let maxProfit = 0;
  let bestSolution = {
    profit: 0,
    weight: 0,
    nodeId: null,
    itemsTaken: []
  };

  let nodeIdCounter = 0;
  let nodesGenerated = 0;
  let nodesExplored = 0;
  let nodesPruned = 0;

  function pushStep({
    action,
    title,
    message,
    currentNodeId = null,
    targetNodeId = null,
    boundCalculation = null,
    pseudocodeLineId = 1,
    javaLineId = 82,
    statusBadge = { label: 'RUNNING', type: 'info' },
    educationalNote = ''
  }) {
    const snapshot = cloneState(nodes, queue, bestSolution);
    steps.push({
      stepNumber: steps.length + 1,
      action,
      title,
      message,
      currentNodeId,
      targetNodeId,
      nodes: snapshot.nodes,
      queue: snapshot.queue,
      maxProfit,
      bestSolution: snapshot.bestSolution,
      boundCalculation,
      pseudocodeLineId,
      javaLineId,
      statusBadge,
      educationalNote,
      stats: {
        nodesGenerated,
        nodesExplored,
        nodesPruned
      }
    });
  }

  // STEP: Sort Items
  pushStep({
    action: 'SORT_ITEMS',
    title: 'Sort Items by Profit-to-Weight Ratio',
    message: `All ${sortedItems.length} items have been sorted in descending order of P / W ratio: ${sortedItems.map(it => `${it.name} (${it.ratio})`).join(' > ')}.`,
    pseudocodeLineId: 1,
    javaLineId: 83,
    statusBadge: { label: 'PREPARE', type: 'info' },
    educationalNote: 'Branch and Bound requires items sorted by profit-to-weight ratio (P/W) to compute the tightest possible optimistic upper bounds via fractional knapsack relaxation.'
  });

  // STEP: Create Root Node
  const rootId = 0;
  nodeIdCounter++;
  nodesGenerated++;
  nodes[rootId] = {
    id: rootId,
    level: -1,
    weight: 0,
    profit: 0,
    bound: 0,
    decision: 'ROOT',
    decisionLabel: 'ROOT',
    itemConsidered: null,
    parentId: null,
    childrenIds: [],
    status: 'current',
    pruneReason: null,
    path: [],
    boundDetails: null,
    depth: 0
  };

  pushStep({
    action: 'CREATE_ROOT',
    title: 'Initialize Root Node',
    message: 'Created ROOT node with level = -1, weight = 0 kg, profit = ₹0.',
    currentNodeId: rootId,
    targetNodeId: rootId,
    pseudocodeLineId: 2,
    javaLineId: 46,
    statusBadge: { label: 'ROOT', type: 'info' },
    educationalNote: 'The root node represents the initial knapsack state before any item inclusion or exclusion decisions have been made.'
  });

  // STEP: Calculate Root Bound
  const rootBoundDetails = calculateDetailedBound(nodes[rootId], capacity, sortedItems);
  nodes[rootId].bound = rootBoundDetails.bound;
  nodes[rootId].boundDetails = rootBoundDetails;

  pushStep({
    action: 'CALCULATE_ROOT_BOUND',
    title: 'Calculate Root Bound',
    message: `Calculated root optimistic bound: ₹${rootBoundDetails.bound.toFixed(2)}. This is the maximum theoretical profit possible across any branch in the entire search space.`,
    currentNodeId: rootId,
    targetNodeId: rootId,
    boundCalculation: rootBoundDetails,
    pseudocodeLineId: 3,
    javaLineId: 47,
    statusBadge: { label: 'BOUND CALC', type: 'info' },
    educationalNote: 'The upper bound is found by greedily filling the remaining capacity with whole items, plus a fraction of the first item that does not fully fit.'
  });

  // STEP: Enqueue Root
  queue.push(rootId);
  nodes[rootId].status = 'waiting';

  pushStep({
    action: 'ENQUEUE_ROOT',
    title: 'Insert Root into FIFO Queue',
    message: 'Added Root node to the FIFO Queue (Queue size: 1). Initialized maxProfit = ₹0.',
    targetNodeId: rootId,
    boundCalculation: rootBoundDetails,
    pseudocodeLineId: 4,
    javaLineId: 48,
    statusBadge: { label: 'ENQUEUED', type: 'keep' },
    educationalNote: 'In FIFO Branch and Bound, nodes enter a first-in, first-out queue (LinkedList in Java). Nodes are processed in the strict order they are generated.'
  });

  // MAIN FIFO LOOP
  while (queue.length > 0) {
    // 1. Dequeue from FRONT
    const currentId = queue.shift();
    const currentNode = nodes[currentId];
    currentNode.status = 'current';
    nodesExplored++;

    pushStep({
      action: 'DEQUEUE_NODE',
      title: `Dequeue Node #${currentNode.id} (${currentNode.decisionLabel})`,
      message: `Removed Node #${currentNode.id} from FRONT of FIFO queue to explore. Current W = ${currentNode.weight} kg, P = ₹${currentNode.profit}, Bound = ₹${currentNode.bound.toFixed(2)}.`,
      currentNodeId: currentId,
      targetNodeId: currentId,
      boundCalculation: currentNode.boundDetails,
      pseudocodeLineId: 7,
      javaLineId: 52,
      statusBadge: { label: 'EXPLORING', type: 'current' },
      educationalNote: 'FIFO means First-In, First-Out. The node waiting at the FRONT of the queue is always dequeued next, regardless of its bound value (unlike Best-First Search).'
    });

    // 2. Check if all items processed (Leaf node)
    if (currentNode.level === sortedItems.length - 1) {
      currentNode.status = 'explored';
      pushStep({
        action: 'LEAF_REACHED',
        title: `Leaf Node #${currentNode.id} Reached`,
        message: `Node #${currentNode.id} has evaluated all ${sortedItems.length} items. Cannot branch further.`,
        currentNodeId: currentId,
        pseudocodeLineId: 8,
        javaLineId: 53,
        statusBadge: { label: 'LEAF', type: 'info' },
        educationalNote: 'When a node reaches the bottom level (level = n - 1), all item decisions are complete for this path. No further child branches can be spawned.'
      });
      continue;
    }

    const nextLevel = currentNode.level + 1;
    const itemToBranch = sortedItems[nextLevel];

    // ==========================================
    // BRANCH 1: INCLUDE CHILD (Take item)
    // ==========================================
    const includeId = nodeIdCounter++;
    nodesGenerated++;
    const includeWeight = currentNode.weight + itemToBranch.weight;
    const includeProfit = currentNode.profit + itemToBranch.profit;

    const includeNode = {
      id: includeId,
      level: nextLevel,
      weight: includeWeight,
      profit: includeProfit,
      bound: 0,
      decision: 'INCLUDE',
      decisionLabel: `Take ${itemToBranch.name}`,
      itemConsidered: itemToBranch,
      parentId: currentId,
      childrenIds: [],
      status: 'waiting',
      pruneReason: null,
      path: [...currentNode.path, { item: itemToBranch, taken: true }],
      boundDetails: null,
      depth: currentNode.depth + 1
    };
    nodes[includeId] = includeNode;
    currentNode.childrenIds.push(includeId);

    pushStep({
      action: 'CREATE_INCLUDE_NODE',
      title: `Branch 1: INCLUDE Item ${itemToBranch.name}`,
      message: `Generated child node to TAKE ${itemToBranch.name} (+${itemToBranch.weight} kg, +₹${itemToBranch.profit}). Resulting Weight = ${includeWeight} kg, Profit = ₹${includeProfit}.`,
      currentNodeId: currentId,
      targetNodeId: includeId,
      pseudocodeLineId: 9,
      javaLineId: 56,
      statusBadge: { label: 'NEW BRANCH', type: 'info' },
      educationalNote: `Binary branching generates two alternatives at level ${nextLevel}: including item ${itemToBranch.name} or excluding it.`
    });

    // Check Capacity
    if (includeWeight <= capacity) {
      // Valid weight!
      let newBestFound = false;
      if (includeProfit > maxProfit) {
        maxProfit = includeProfit;
        bestSolution = {
          profit: includeProfit,
          weight: includeWeight,
          nodeId: includeId,
          itemsTaken: includeNode.path.filter(p => p.taken).map(p => p.item)
        };
        newBestFound = true;

        pushStep({
          action: 'UPDATE_BEST_PROFIT',
          title: `New Best Solution Found! (₹${maxProfit})`,
          message: `Feasible solution with Profit ₹${includeProfit} beats previous best. Updated maxProfit = ₹${maxProfit} (Weight = ${includeWeight} kg).`,
          currentNodeId: currentId,
          targetNodeId: includeId,
          pseudocodeLineId: 11,
          javaLineId: 64,
          statusBadge: { label: 'NEW BEST', type: 'best' },
          educationalNote: `Because this node fits in the knapsack, its actual 0/1 profit (₹${includeProfit}) is a legitimate complete or partial solution. It raises our baseline maxProfit!`
        });
      }

      // Calculate Bound for Include
      const includeBoundDetails = calculateDetailedBound(includeNode, capacity, sortedItems);
      includeNode.bound = includeBoundDetails.bound;
      includeNode.boundDetails = includeBoundDetails;

      pushStep({
        action: 'CALCULATE_INCLUDE_BOUND',
        title: `Calculate Bound for "Take ${itemToBranch.name}"`,
        message: `Optimistic upper bound for Node #${includeId} = ₹${includeBoundDetails.bound.toFixed(2)}. Current Best = ₹${maxProfit}.`,
        currentNodeId: currentId,
        targetNodeId: includeId,
        boundCalculation: includeBoundDetails,
        pseudocodeLineId: 12,
        javaLineId: 65,
        statusBadge: { label: 'BOUND CALC', type: 'info' },
        educationalNote: 'The bound calculates the absolute best possible profit achievable down this subtree by greedily relaxing remaining items to fractional portions.'
      });

      // Compare Bound vs MaxProfit
      if (includeNode.bound > maxProfit) {
        // KEEP AND ENQUEUE
        queue.push(includeId);
        includeNode.status = 'waiting';

        pushStep({
          action: 'KEEP_INCLUDE_NODE',
          title: `KEEP Node #${includeId} (Bound ₹${includeNode.bound.toFixed(2)} > Best ₹${maxProfit})`,
          message: `Bound ₹${includeNode.bound.toFixed(2)} > Current Best ₹${maxProfit}. Node #${includeId} has potential to yield a better solution, so it is ADDED to the FIFO queue at REAR.`,
          currentNodeId: currentId,
          targetNodeId: includeId,
          boundCalculation: includeBoundDetails,
          pseudocodeLineId: 13,
          javaLineId: 67,
          statusBadge: { label: 'KEEP', type: 'keep' },
          educationalNote: `Since Bound (₹${includeNode.bound.toFixed(2)}) > Current Best (₹${maxProfit}), exploring this subtree might beat our best solution. It is queued for future exploration.`
        });
      } else {
        // PRUNE BY BOUND
        includeNode.status = 'pruned';
        nodesPruned++;
        const pruneReason = `Bound ₹${includeNode.bound.toFixed(2)} ≤ Best ₹${maxProfit}`;
        includeNode.pruneReason = pruneReason;

        pushStep({
          action: 'PRUNE_INCLUDE_BOUND',
          title: `PRUNED Node #${includeId} (Bound ₹${includeNode.bound.toFixed(2)} ≤ Best ₹${maxProfit})`,
          message: `PRUNED: Optimistic bound ₹${includeNode.bound.toFixed(2)} cannot exceed current best profit ₹${maxProfit}. This entire branch is pruned!`,
          currentNodeId: currentId,
          targetNodeId: includeId,
          boundCalculation: includeBoundDetails,
          pseudocodeLineId: 14,
          javaLineId: 66,
          statusBadge: { label: 'PRUNED', type: 'pruned' },
          educationalNote: `This branch cannot possibly beat the best known solution of ₹${maxProfit}, even under the most generous fractional relaxation. Pruning saves exploring all its descendents!`
        });
      }
    } else {
      // Infeasible weight! PRUNE BY CAPACITY
      includeNode.status = 'pruned';
      nodesPruned++;
      const pruneReason = `Weight ${includeWeight} kg > Capacity ${capacity} kg`;
      includeNode.pruneReason = pruneReason;
      const infeasibleBound = {
        bound: 0,
        baseWeight: includeWeight,
        baseProfit: includeProfit,
        capacity,
        steps: [],
        explanation: `Weight ${includeWeight} kg exceeds capacity ${capacity} kg.`
      };
      includeNode.boundDetails = infeasibleBound;

      pushStep({
        action: 'PRUNE_INCLUDE_CAPACITY',
        title: `PRUNED Node #${includeId} (Capacity Exceeded)`,
        message: `PRUNED: Node #${includeId} weight (${includeWeight} kg) exceeds knapsack capacity (${capacity} kg). This branch violates the capacity constraint and is pruned immediately.`,
        currentNodeId: currentId,
        targetNodeId: includeId,
        boundCalculation: infeasibleBound,
        pseudocodeLineId: 15,
        javaLineId: 62,
        statusBadge: { label: 'PRUNED (CAPACITY)', type: 'pruned' },
        educationalNote: 'Any knapsack node exceeding total capacity is infeasible in the 0/1 knapsack problem and must be pruned immediately without further exploration.'
      });
    }

    // ==========================================
    // BRANCH 2: EXCLUDE CHILD (Skip item)
    // ==========================================
    const excludeId = nodeIdCounter++;
    nodesGenerated++;
    const excludeWeight = currentNode.weight;
    const excludeProfit = currentNode.profit;

    const excludeNode = {
      id: excludeId,
      level: nextLevel,
      weight: excludeWeight,
      profit: excludeProfit,
      bound: 0,
      decision: 'EXCLUDE',
      decisionLabel: `Skip ${itemToBranch.name}`,
      itemConsidered: itemToBranch,
      parentId: currentId,
      childrenIds: [],
      status: 'waiting',
      pruneReason: null,
      path: [...currentNode.path, { item: itemToBranch, taken: false }],
      boundDetails: null,
      depth: currentNode.depth + 1
    };
    nodes[excludeId] = excludeNode;
    currentNode.childrenIds.push(excludeId);

    pushStep({
      action: 'CREATE_EXCLUDE_NODE',
      title: `Branch 2: EXCLUDE Item ${itemToBranch.name}`,
      message: `Generated child node to SKIP ${itemToBranch.name}. Weight remains ${excludeWeight} kg, Profit remains ₹${excludeProfit}.`,
      currentNodeId: currentId,
      targetNodeId: excludeId,
      pseudocodeLineId: 16,
      javaLineId: 70,
      statusBadge: { label: 'NEW BRANCH', type: 'info' },
      educationalNote: `Excluding item ${itemToBranch.name} preserves the remaining capacity for potentially lighter items with remaining fractional value later in the list.`
    });

    // Calculate Bound for Exclude
    const excludeBoundDetails = calculateDetailedBound(excludeNode, capacity, sortedItems);
    excludeNode.bound = excludeBoundDetails.bound;
    excludeNode.boundDetails = excludeBoundDetails;

    pushStep({
      action: 'CALCULATE_EXCLUDE_BOUND',
      title: `Calculate Bound for "Skip ${itemToBranch.name}"`,
      message: `Optimistic upper bound for Node #${excludeId} = ₹${excludeBoundDetails.bound.toFixed(2)}. Current Best = ₹${maxProfit}.`,
      currentNodeId: currentId,
      targetNodeId: excludeId,
      boundCalculation: excludeBoundDetails,
      pseudocodeLineId: 17,
      javaLineId: 75,
      statusBadge: { label: 'BOUND CALC', type: 'info' },
      educationalNote: 'Since this branch skips the high-ratio item, its bound relies on subsequent items. If those cannot match current best, it can be pruned!'
    });

    // Compare Bound vs MaxProfit
    if (excludeNode.bound > maxProfit) {
      // KEEP AND ENQUEUE
      queue.push(excludeId);
      excludeNode.status = 'waiting';

      pushStep({
        action: 'KEEP_EXCLUDE_NODE',
        title: `KEEP Node #${excludeId} (Bound ₹${excludeNode.bound.toFixed(2)} > Best ₹${maxProfit})`,
        message: `Bound ₹${excludeNode.bound.toFixed(2)} > Current Best ₹${maxProfit}. Node #${excludeId} ADDED to FIFO queue at REAR.`,
        currentNodeId: currentId,
        targetNodeId: excludeId,
        boundCalculation: excludeBoundDetails,
        pseudocodeLineId: 18,
        javaLineId: 77,
        statusBadge: { label: 'KEEP', type: 'keep' },
        educationalNote: 'Because the bound exceeds current best profit, skipping this item might allow a better combination of subsequent items. It is enqueued.'
      });
    } else {
      // PRUNE BY BOUND
      excludeNode.status = 'pruned';
      nodesPruned++;
      const pruneReason = `Bound ₹${excludeNode.bound.toFixed(2)} ≤ Best ₹${maxProfit}`;
      excludeNode.pruneReason = pruneReason;

      pushStep({
        action: 'PRUNE_EXCLUDE_BOUND',
        title: `PRUNED Node #${excludeId} (Bound ₹${excludeNode.bound.toFixed(2)} ≤ Best ₹${maxProfit})`,
        message: `PRUNED: Bound ₹${excludeNode.bound.toFixed(2)} ≤ Current Best ₹${maxProfit}. Node #${excludeId} cannot produce a better solution.`,
        currentNodeId: currentId,
        targetNodeId: excludeId,
        boundCalculation: excludeBoundDetails,
        pseudocodeLineId: 19,
        javaLineId: 76,
        statusBadge: { label: 'PRUNED', type: 'pruned' },
        educationalNote: `Skipping item ${itemToBranch.name} limits maximum potential profit to ₹${excludeNode.bound.toFixed(2)}, which cannot exceed ₹${maxProfit}. Pruned!`
      });
    }

    // Mark current node as explored after finishing both children
    currentNode.status = 'explored';
  }

  // SIMULATION FINISHED! Mark the optimal solution node and path
  if (bestSolution && bestSolution.nodeId !== null && nodes[bestSolution.nodeId]) {
    // Trace path back to root
    let curr = nodes[bestSolution.nodeId];
    while (curr) {
      curr.isOptimalPath = true;
      if (curr.id === bestSolution.nodeId) {
        curr.status = 'solution';
      }
      curr = curr.parentId !== null ? nodes[curr.parentId] : null;
    }
  }

  pushStep({
    action: 'COMPLETE',
    title: 'Simulation Complete — Optimal Solution Found',
    message: `FIFO Branch and Bound search finished! Maximum Profit = ₹${maxProfit}, Knapsack Weight = ${bestSolution.weight} kg, Selected Items = [${bestSolution.itemsTaken.map(it => it.name).join(', ')}].`,
    currentNodeId: bestSolution ? bestSolution.nodeId : null,
    targetNodeId: bestSolution ? bestSolution.nodeId : null,
    pseudocodeLineId: 20,
    javaLineId: 79,
    statusBadge: { label: 'OPTIMAL', type: 'optimal' },
    educationalNote: `Optimal solution verified! Branch and Bound safely avoided exploring all 2^${sortedItems.length} combinations by pruning unpromising subtrees early.`
  });

  return {
    sortedItems,
    capacity,
    steps,
    finalStats: {
      totalSteps: steps.length,
      nodesGenerated,
      nodesExplored,
      nodesPruned,
      maxProfit,
      bestSolution,
      bruteForceCombinations: Math.pow(2, sortedItems.length)
    }
  };
}
