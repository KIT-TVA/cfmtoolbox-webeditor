import { Constraint } from "./Constraints";

type Node = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    featureInstanceCardinalityMin: string;
    featureInstanceCardinalityMax: string;
    groupTypeCardinalityMin: string;
    groupTypeCardinalityMax: string;
    groupInstanceCardinalityMin: string;
    groupInstanceCardinalityMax: string;
    parentId: string;
  };
};

type Edge = {
  id: string;
  source: string;
  target: string;
  type: string;
  data: {
    cardinality: string;
  };
};

export function importFeatureModel(json: any): {
  nodes: Node[];
  edges: Edge[];
  constraints: Constraint[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function processFeature(
    feature: any,
    parentId: string,
    positionX: number,
    positionY: number,
    level: number
  ) {
    const hasChildren = feature.children && feature.children.length > 0;
    const id = feature.name;
    const fMin =
      feature.instance_cardinality?.intervals?.[0]?.lower?.toString() ?? "0";
    const fMax =
      feature.instance_cardinality?.intervals?.[0]?.upper?.toString() ?? "*";
    const gtMin = hasChildren
      ? feature.group_type_cardinality?.intervals?.[0]?.lower?.toString() ?? "0"
      : "";
    const gtMax = hasChildren
      ? feature.group_type_cardinality?.intervals?.[0]?.upper?.toString() ?? "*"
      : "";
    const giMin = hasChildren
      ? feature.group_instance_cardinality?.intervals?.[0]?.lower?.toString() ??
        "0"
      : "";
    const giMax = hasChildren
      ? feature.group_instance_cardinality?.intervals?.[0]?.upper?.toString() ??
        "*"
      : "";

    const nodeType = parentId === "0" ? "root" : "feature";

    // Create Node
    const node: Node = {
      id,
      type: nodeType,
      position: {
        x: positionX,
        y: positionY,
      },
      data: {
        label: feature.name,
        featureInstanceCardinalityMin: fMin,
        featureInstanceCardinalityMax: fMax,
        groupTypeCardinalityMin: gtMin,
        groupTypeCardinalityMax: gtMax,
        groupInstanceCardinalityMin: giMin,
        groupInstanceCardinalityMax: giMax,
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

  // Start with root
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
