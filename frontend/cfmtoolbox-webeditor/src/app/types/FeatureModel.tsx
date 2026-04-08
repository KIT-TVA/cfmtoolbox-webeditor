interface NodeData {
  label: string;
  featureInstanceCardinalityMin: string;
  featureInstanceCardinalityMax: string;
  groupTypeCardinalityMin: string;
  groupTypeCardinalityMax: string;
  groupInstanceCardinalityMin: string;
  groupInstanceCardinalityMax: string;
  parentId: string;
};

export interface Node {
  id: string;
  data: NodeData;
};

export interface Constraint {
  id: string;
  source: string;
  target: string;
  relation: string;
  card1Min: string;
  card1Max: string;
  card2Min: string;
  card2Max: string;
};
