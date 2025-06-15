import React, { useState, useEffect, useRef } from "react";
import {
  EdgeProps,
  getStraightPath,
  BaseEdge,
  EdgeLabelRenderer,
} from "@xyflow/react";

const FeatureEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  const [cardinality, setCardinality] = useState(data?.cardinality ?? "1..1");
  const [showToolbar, setShowToolbar] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const handleEdgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowToolbar(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node)
      ) {
        setShowToolbar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{ pointerEvents: "none" }}
      />
      <EdgeLabelRenderer>
        <div
          onClick={handleEdgeClick}
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            background: "white",
            padding: "2px 4px",
            borderRadius: 4,
            border: "1px solid #999",
            pointerEvents: "all",
            zIndex: 1000,
            cursor: "pointer",
          }}
        >
          ⟨{String(cardinality)}⟩
        </div>
        {showToolbar && (
          <div
            ref={toolbarRef}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${
                labelY + 20
              }px)`,
              background: "#f0f0f0",
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid #ccc",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              zIndex: 1001,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              pointerEvents: "all",
            }}
          >
            <label>Cardinality</label>
            <input
              value={String(cardinality)}
              onChange={(e) => setCardinality(e.target.value)}
            />
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default FeatureEdge;
