type NodeData = {
  label: string;
  featureInstanceCardinalityMin: string;
  featureInstanceCardinalityMax: string;
  groupTypeCardinalityMin: string;
  groupTypeCardinalityMax: string;
  groupInstanceCardinalityMin: string;
  groupInstanceCardinalityMax: string;
  parentId: string;
};

type Node = {
  id: string;
  data: NodeData;
};

type Constraint = {
  id: string;
  source: string;
  target: string;
  relation: string;
  card1Min: string;
  card1Max: string;
  card2Min: string;
  card2Max: string;
};

export const exportFeatureModel = (
  nodes: Node[],
  constraints: Constraint[]
): string => {
  // Helper: convert min/max to numbers, handle "*" as Infinity
  const parseCardinality = (min: string, max: string) => ({
    intervals: [
      {
        lower: parseInt(min, 10),
        upper: max === "*" ? "*" : parseInt(max, 10),
      },
    ],
  });

  // Map node.id -> JSON node
  const nodeMap = new Map<string, any>();
  nodes.forEach((node) => {
    nodeMap.set(node.id, {
      name: node.data.label,
      instance_cardinality: parseCardinality(
        node.data.featureInstanceCardinalityMin,
        node.data.featureInstanceCardinalityMax
      ),
      group_type_cardinality: parseCardinality(
        node.data.groupTypeCardinalityMin,
        node.data.groupTypeCardinalityMax
      ),
      group_instance_cardinality: parseCardinality(
        node.data.groupInstanceCardinalityMin,
        node.data.groupInstanceCardinalityMax
      ),
      children: [],
    });
  });

  // Build hierarchy using parentId
  let root: any = null;
  nodes.forEach((node) => {
    const parentId = node.data.parentId;
    if (parentId && nodeMap.has(parentId)) {
      const parent = nodeMap.get(parentId);
      parent.children.push(nodeMap.get(node.id));
    } else {
      // No parentId or parent not found → root node
      root = nodeMap.get(node.id);
    }
  });

  if (!root) {
    throw new Error("Root node not found (node with no parentId).");
  }

  // Format constraints
  const formattedConstraints = constraints.map((c) => ({
    require: c.relation.toLowerCase() === "require",
    first_feature_name: c.source,
    first_cardinality: parseCardinality(c.card1Min, c.card1Max),
    second_feature_name: c.target,
    second_cardinality: parseCardinality(c.card2Min, c.card2Max),
  }));

  const exportJson = {
    root,
    constraints: formattedConstraints,
  };

  return JSON.stringify(exportJson, null, 2);
};
