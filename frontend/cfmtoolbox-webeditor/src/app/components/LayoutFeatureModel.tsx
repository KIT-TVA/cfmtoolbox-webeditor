import { Node as RFNode } from "reactflow";

export interface FeatureNode {
  id: string;
  name: string;
  parentId: string | null;
}

interface TreeFeature extends FeatureNode {
  parent: TreeFeature | null;
  children: TreeFeature[];
}

interface Point {
  x: number;
  y: number;
}

export function layoutFeatureModel(
  flatNodes: FeatureNode[],
  maxNodeWidth: number
): Record<string, Point> {
  const scaleText = 6;
  const pos: Record<string, Point> = {};
  const shift: Record<string, number> = {};

  // Step 1: Build tree from flat array
  const idToNode: Record<string, TreeFeature> = {};
  flatNodes.forEach((node) => {
    idToNode[node.id] = { ...node, parent: null, children: [] };
  });

  const ids = new Set(flatNodes.map((node) => node.id));

  let root: TreeFeature | null = null;

  flatNodes.forEach((node) => {
    const treeNode = idToNode[node.id];
    if (node.parentId && ids.has(node.parentId)) {
      const parent = idToNode[node.parentId];
      if (!parent) {
        throw new Error(
          `Invalid parentId "${node.parentId}" for node "${node.id}".`
        );
      }
      treeNode.parent = parent;
      parent.children.push(treeNode);
    } else {
      if (root) {
        console.warn(
          `Multiple root nodes found (e.g. "${root.id}" and "${treeNode.id}").`
        );
      }
      root = treeNode;
    }
  });

  if (!root) {
    throw new Error("No root node found (node with null parentId).");
  }

  flatNodes.forEach((n) => {
    pos[n.id] = { x: 0, y: 0 };
    shift[n.id] = 0;
  });

  function computeY(node: TreeFeature, depth: number) {
    pos[node.id].y = 100 + depth * 150;
    node.children.forEach((child) => computeY(child, depth + 1));
  }

  function computeShift(node: TreeFeature): [number[], number[]] {
    const nameLength = node.name.length;
    const left = [
      Math.floor(Math.max(-scaleText * nameLength, -maxNodeWidth / 2)),
    ];
    const right = [
      Math.ceil(Math.min(scaleText * nameLength, maxNodeWidth / 2)),
    ];

    const children = node.children;
    if (children.length === 0) return [left, right];

    const childContours: Record<string, [number[], number[]]> = {};
    children.forEach((child) => {
      childContours[child.id] = computeShift(child);
    });

    const d = new Array(children.length).fill(0);
    let currRight = childContours[children[0].id][1];
    const currLeft = childContours[children[0].id][0];

    for (let i = 1; i < children.length; i++) {
      let sumLeft = 0;
      let sumRight = 0;
      const nextLeft = childContours[children[i].id][0];

      for (let j = 0; j < Math.min(currRight.length, nextLeft.length); j++) {
        sumLeft += nextLeft[j];
        sumRight += currRight[j];
        d[i] = Math.max(d[i], sumRight - sumLeft);
      }
      d[i] += 50;

      const newRight = [...childContours[children[i].id][1]];
      const heightRight = newRight.length;
      if (currRight.length > heightRight) {
        newRight.push(
          -sum(newRight) - d[i] + sum(currRight.slice(0, heightRight + 1))
        );
        newRight.push(...currRight.slice(heightRight + 1));
      }
      currRight = newRight;

      const heightLeft = currLeft.length;
      const nextLeftContour = childContours[children[i].id][0];
      if (nextLeftContour.length > heightLeft) {
        currLeft.push(
          -sum(currLeft) + d[i] + sum(nextLeftContour.slice(0, heightLeft + 1))
        );
        currLeft.push(...nextLeftContour.slice(heightLeft + 1));
      }
    }

    const totalDist = sum(d);
    let acc = 0;
    for (let i = 0; i < children.length; i++) {
      acc += d[i];
      shift[children[i].id] = acc - Math.ceil(totalDist / 2);
    }

    left.push(
      shift[children[0].id] +
        childContours[children[0].id][0][0] +
        Math.ceil(Math.min(scaleText * nameLength, maxNodeWidth / 2))
    );
    left.push(...currLeft.slice(1));

    right.push(
      shift[children[children.length - 1].id] +
        childContours[children[children.length - 1].id][1][0] -
        Math.ceil(Math.min(scaleText * nameLength, maxNodeWidth / 2))
    );
    right.push(...currRight.slice(1));

    return [left, right];
  }

  function computeX(node: TreeFeature) {
    if (!node.parent) {
      pos[node.id].x = 100;
    } else {
      const parent = node.parent;
      if (!pos[parent.id]) {
        throw new Error(
          `Parent "${parent.id}" not yet positioned for "${node.id}"`
        );
      }
      pos[node.id].x = pos[parent.id].x + shift[node.id];
    }

    node.children.forEach((child) => computeX(child));
  }

  computeY(root, 0);
  computeShift(root);
  computeX(root);

  return pos;
}

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}
