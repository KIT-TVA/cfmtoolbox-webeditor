import React from "react";
import {
 StraightEdgeProps,
  StraightEdge,
  
} from "@xyflow/react";

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
        style={{ pointerEvents: "none" }} sourceX={sourceX} sourceY={sourceY} targetX={targetX} targetY={targetY}      />
      
    </>
  );
};

export default FeatureEdge;
