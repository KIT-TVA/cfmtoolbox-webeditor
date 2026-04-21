type Interval = {
  lower: string,
  upper: string,
};

export type CompoundInterval = Interval[];

export interface NodeData {
  label: string;
  featureInstanceCardinality: CompoundInterval;
  groupTypeCardinality: CompoundInterval;
  groupInstanceCardinality: CompoundInterval;
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
