/**
 * Bound Calculator for 0/1 Knapsack
 * Implements fractional knapsack relaxation to compute an optimistic upper bound.
 */

export function calculateDetailedBound(node, capacity, items) {
  const baseWeight = node.weight;
  const baseProfit = node.profit;

  // Infeasible branch: weight already exceeds knapsack capacity
  if (baseWeight > capacity) {
    return {
      bound: 0,
      baseWeight,
      baseProfit,
      capacity,
      steps: [],
      isFeasible: false,
      reason: `Weight (${baseWeight}) exceeds capacity (${capacity})`,
      explanation: `Node weight of ${baseWeight} kg exceeds knapsack capacity of ${capacity} kg. This branch is infeasible and must be pruned.`
    };
  }

  let profitBound = baseProfit;
  let totalWeight = baseWeight;
  let j = node.level + 1;
  const calculationSteps = [];

  // Greedy addition of complete items
  while (j < items.length && totalWeight + items[j].weight <= capacity) {
    const item = items[j];
    const prevWeight = totalWeight;
    const prevProfit = profitBound;
    totalWeight += item.weight;
    profitBound += item.profit;

    calculationSteps.push({
      item,
      type: 'full',
      itemIndex: j,
      weightAdded: item.weight,
      profitAdded: item.profit,
      accumulatedWeight: totalWeight,
      accumulatedProfit: profitBound,
      remainingCapacity: capacity - totalWeight,
      formula: `Add Item ${item.name} entirely: +${item.weight} kg, +₹${item.profit}`,
      description: `Item ${item.name} fits completely (${item.weight} kg <= ${capacity - prevWeight} kg remaining). Accumulated profit = ₹${prevProfit} + ₹${item.profit} = ₹${profitBound}.`
    });
    j++;
  }

  // Fractional addition if knapsack still has remaining capacity and items remain
  let fractionalItem = null;
  if (j < items.length) {
    const remaining = capacity - totalWeight;
    if (remaining > 0) {
      const item = items[j];
      const fraction = remaining / item.weight;
      const fracProfit = Math.round(remaining * item.ratio * 100) / 100;
      const prevProfit = profitBound;
      profitBound += fracProfit;

      fractionalItem = {
        item,
        type: 'fractional',
        itemIndex: j,
        fraction,
        weightAdded: remaining,
        profitAdded: fracProfit,
        accumulatedWeight: capacity,
        accumulatedProfit: profitBound,
        remainingCapacity: 0,
        formula: `Fractional Item ${item.name}: (${remaining} / ${item.weight}) × ₹${item.profit} = ₹${fracProfit}`,
        description: `Item ${item.name} (${item.weight} kg) cannot fully fit into remaining ${remaining} kg. Take fractional portion: ${remaining}/${item.weight} (${(fraction * 100).toFixed(1)}%) × ₹${item.profit} = +₹${fracProfit}.`
      };
      calculationSteps.push(fractionalItem);
    }
  }

  const roundedBound = Math.round(profitBound * 100) / 100;

  return {
    bound: roundedBound,
    baseWeight,
    baseProfit,
    capacity,
    steps: calculationSteps,
    fractionalItem,
    isFeasible: true,
    totalWeight,
    explanation: `Starting from current P = ₹${baseProfit}, greedy fractional fill yields an optimistic upper bound of ₹${roundedBound.toFixed(2)}.`
  };
}
