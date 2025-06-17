import React, { useState } from "react";
import { Handle, Position, NodeToolbar } from "@xyflow/react";

type FeatureNodeData = {
  label: string;
  min?: number;
  max?: number;
  forceToolbarVisible: boolean;
  showGroupArc: boolean;
};

const FeatureNode = ({ data }: { data: FeatureNodeData }) => {
  const [label, setLabel] = useState(data.label);
  const width = 160;
  const arcHeight = 30;

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
    data.label = e.target.value;
  };

  return (
    <div className="p-2 border-2 rounded-lg shadow bg-white">
      <div className="font-bold text-blue-700">{data.label}</div>
      {data.min !== undefined && data.max !== undefined && (
        <div className="text-xs text-gray-600">
          ⟨{data.min}..{data.max}⟩
        </div>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      {data.showGroupArc && (
        <svg
          style={{
            position: "absolute",
            left: 0,
            top: "100%",
            width: "100%",
            height: arcHeight,
            pointerEvents: "none",
          }}
        >
          <path
            d={`M10,${arcHeight} Q${width / 2},0 ${width - 10},${arcHeight}`}
            stroke="black"
            fill="transparent"
            strokeWidth={2}
          />
        </svg>
      )}
      <NodeToolbar className="feature_toolbar"
        isVisible={data.forceToolbarVisible || undefined}
        position={Position.Left}
      >
        <label>Name</label>
        <input
          value={label}
          onChange={handleLabelChange}
          className="feature_toolbar_input"
        />
      </NodeToolbar>
    </div>
  );
};

export default FeatureNode;
