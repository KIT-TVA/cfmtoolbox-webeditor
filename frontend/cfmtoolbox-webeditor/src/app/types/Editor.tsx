import { Node } from "./FeatureModel";

export interface DisplayNode extends Node {
  // Node with additional information for Display (relative position, etc)
  type: string;
  position: { x: number; y: number };
};

export type Edge = {
  id: string;
  source: string;
  target: string;
  type: string;
  data: {
    cardinality: string;
  };
};
