import { Node, Constraint, CompoundInterval } from "../types/FeatureModel";

/**
 * Function to export the current feature model to a JSON string in the cardinality-based format.
 * @param nodes Nodes of the feature model
 * @param constraints Constraints of the feature model
 * @returns
 */
export const exportFeatureModel = (
  nodes: Node[],
  constraints: Constraint[]
): string => {
  // Helper: convert min/max to numbers, handle "*" as null
  const parseCardinality = (cardinality: CompoundInterval) => {
    return {
      intervals: cardinality.map((interval) => {
        return {
          lower: parseInt(interval.lower, 10),
          upper: interval.upper === "*" ? null : parseInt(interval.upper, 10),
        }
    })}
  };

  // Helper: set of parentIds to check for leaf nodes
  const parentIdSet = new Set<string>(nodes.map((node) => node.data.parentId));

  // Map node.id -> JSON node
  const nodeMap = new Map<string, any>();
  nodes.forEach((node) => {
    nodeMap.set(node.id, {
      name: node.data.label,
      instance_cardinality: parseCardinality(
        node.data.featureInstanceCardinality
      ),
      group_type_cardinality: parentIdSet.has(node.id)
        ? parseCardinality(
            node.data.groupTypeCardinality
          )
        : { intervals: [] }, // If leaf, no group type cardinality
      group_instance_cardinality: parentIdSet.has(node.id)
        ? parseCardinality(
            node.data.groupInstanceCardinality
          )
        : { intervals: [] }, // If leaf, no group instance cardinality
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
    first_cardinality: parseCardinality([{ lower: c.card1Min, upper: c.card1Max}]),
    second_feature_name: c.target,
    second_cardinality: parseCardinality([{ lower: c.card2Min, upper: c.card2Max }]),
  }));

  const exportJson = {
    root,
    constraints: formattedConstraints,
  };

  return JSON.stringify(exportJson, null, 2);
};
