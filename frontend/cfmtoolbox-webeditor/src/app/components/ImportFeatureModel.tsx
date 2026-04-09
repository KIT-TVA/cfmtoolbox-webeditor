import { DisplayNode, Edge } from "../types/Editor";
import { Constraint } from "../types/FeatureModel";

type SerializedInterval = {
  lower: number
  upper: number
}

type SerializedCardinality = {
  intervals: SerializedInterval[]
}

/**
 * Parse the cardinality compound interval and fill missing bound values.
 * @param cardinality Object containing the serialized compound intervals of a cardinality type
 * @returns parsed compound interval with filled 0 or *
 */
function parseCardinality(cardinality: null | SerializedCardinality) {
  console.log("parseCardinality: ", cardinality);
  return cardinality?.intervals.map((interval: SerializedInterval) => {
    return {
      lower: interval.lower?.toString() ?? "0",
      upper: interval.upper?.toString() ?? "*"
    }
  })
  ?? [];
}

/**
 * Function to import a cardinality-based feature model from a JSON object.
 * @param json The JSON object representing the cardinality-based feature model.
 * @returns nodes, edges and constraints representing the feature model in a format suitable for the reactflow editor.
 */
export function importFeatureModel(json: any): {
  nodes: DisplayNode[];
  edges: Edge[];
  constraints: Constraint[];
} {
  const nodes: DisplayNode[] = [];
  const edges: Edge[] = [];

  // Recursive function to process features and their children
  function processFeature(
    feature: any,
    parentId: string,
    positionX: number,
    positionY: number,
    level: number
  ) {
    const id = feature.name;
    const nodeType = parentId === "0" ? "root" : "feature";

    // Create Node
    const node: DisplayNode = {
      id,
      type: nodeType,
      position: {
        x: positionX,
        y: positionY,
      },
      data: {
        label: feature.name,
        featureInstanceCardinality: parseCardinality(feature.instance_cardinality),
        groupTypeCardinality: parseCardinality(feature.group_type_cardinality),
        groupInstanceCardinality: parseCardinality(feature.group_instance_cardinality),
        parentId: parentId, // Root has parentId "0"
      },
    };

    nodes.push(node);

    // Create Edge (if not root)
    if (parentId !== "0") {
      const edge: Edge = {
        id: `e-${parentId}-${id}`,
        source: parentId,
        target: id,
        type: "edge",
        data: {
          cardinality: "1..n", // Or calculate if needed
        },
      };
      edges.push(edge);
    }

    // Process children recursively
    feature.children?.forEach((child: any, index: number) => {
      const childX = positionX + index * 250; // simple horizontal spacing
      const childY = positionY + 150; // simple vertical spacing
      processFeature(child, id, childX, childY, level + 1);
    });
  }

  // Start processing from the root feature
  processFeature(json.root, "0", 100, 100, 0);

  // Process constraints
  const constraints: Constraint[] = (json.constraints ?? []).map((c: any) => ({
    id: `${c.first_feature_name}-${c.second_feature_name}`,
    source: c.first_feature_name,
    target: c.second_feature_name,
    relation: c.require ? "require" : "exclude",
    card1Min: c.first_cardinality?.intervals?.[0]?.lower?.toString() ?? "0",
    card1Max: c.first_cardinality?.intervals?.[0]?.upper?.toString() ?? "*",
    card2Min: c.second_cardinality?.intervals?.[0]?.lower?.toString() ?? "0",
    card2Max: c.second_cardinality?.intervals?.[0]?.upper?.toString() ?? "*",
  }));

  return { nodes, edges, constraints };
}
