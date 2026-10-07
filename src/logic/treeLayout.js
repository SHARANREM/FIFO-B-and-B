/**
 * Tidy Tree Layout Algorithm for Branch and Bound Tree Visualization
 * Computes non-overlapping (x, y) coordinates for all nodes in the tree.
 */

export function computeTreeLayout(nodesDict, rootId = 0) {
  const root = nodesDict[rootId];
  if (!root) {
    return { layoutNodes: [], width: 800, height: 400 };
  }

  const NODE_WIDTH = 136;
  const NODE_HEIGHT = 104;
  const HORIZONTAL_GAP = 28;
  const VERTICAL_GAP = 80;

  // Build local tree representation based on existing nodes in this step
  function getChildren(nodeId) {
    const node = nodesDict[nodeId];
    if (!node || !node.childrenIds) return [];
    return node.childrenIds
      .filter(childId => Boolean(nodesDict[childId]))
      .map(childId => nodesDict[childId]);
  }

  // Pass 1: Compute subtree widths from leaves up
  function computeSubtreeWidth(nodeId) {
    const children = getChildren(nodeId);
    if (children.length === 0) {
      return NODE_WIDTH + HORIZONTAL_GAP;
    }

    let totalWidth = 0;
    for (const child of children) {
      totalWidth += computeSubtreeWidth(child.id);
    }
    return Math.max(totalWidth, NODE_WIDTH + HORIZONTAL_GAP);
  }

  const layout = {};

  // Pass 2: Position nodes recursively
  function assignCoordinates(nodeId, leftX, depth) {
    const node = nodesDict[nodeId];
    const children = getChildren(nodeId);
    const y = depth * (NODE_HEIGHT + VERTICAL_GAP) + 60;

    if (children.length === 0) {
      const x = leftX + (NODE_WIDTH + HORIZONTAL_GAP) / 2;
      layout[nodeId] = {
        id: nodeId,
        x,
        y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        node
      };
      return;
    }

    let currentLeft = leftX;
    const childCenters = [];

    for (const child of children) {
      const childSubtreeWidth = computeSubtreeWidth(child.id);
      assignCoordinates(child.id, currentLeft, depth + 1);
      childCenters.push(layout[child.id].x);
      currentLeft += childSubtreeWidth;
    }

    // Parent is centered above its children
    const x = (childCenters[0] + childCenters[childCenters.length - 1]) / 2;
    layout[nodeId] = {
      id: nodeId,
      x,
      y,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      node
    };
  }

  assignCoordinates(rootId, 40, 0);

  // Collect all nodes and bounds
  const layoutNodes = Object.values(layout);
  let minX = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const item of layoutNodes) {
    if (item.x - NODE_WIDTH / 2 < minX) minX = item.x - NODE_WIDTH / 2;
    if (item.x + NODE_WIDTH / 2 > maxX) maxX = item.x + NODE_WIDTH / 2;
    if (item.y + NODE_HEIGHT > maxY) maxY = item.y + NODE_HEIGHT;
  }

  // If minX is negative or too close to 0, shift everything
  const padding = 60;
  const offsetX = minX < padding ? padding - minX : 0;

  if (offsetX !== 0) {
    for (const item of layoutNodes) {
      item.x += offsetX;
    }
    maxX += offsetX;
  }

  const totalWidth = Math.max(800, maxX + padding);
  const totalHeight = Math.max(500, maxY + padding);

  return {
    layoutNodes,
    totalWidth,
    totalHeight,
    nodeMap: layout
  };
}
