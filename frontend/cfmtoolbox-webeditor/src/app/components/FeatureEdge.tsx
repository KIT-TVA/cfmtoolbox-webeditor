import React from "react";
import { StraightEdgeProps, StraightEdge } from "@xyflow/react";

/**
 * Definition of the feature edge component for the reactflow editor.
 * @param sourceX
 * @param sourceY
 * @param targetX
 * @param targetY
 * @param markerEnd
 * @returns html element representing a feature edge.
 */
const FeatureEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
}: StraightEdgeProps) => {
  return (
    <>
      <StraightEdge
        markerEnd={markerEnd}
        style={{ pointerEvents: "none" }}
        sourceX={sourceX}
        sourceY={sourceY}
        targetX={targetX}
        targetY={targetY}
      />
    </>
  );
};

export default FeatureEdge;
