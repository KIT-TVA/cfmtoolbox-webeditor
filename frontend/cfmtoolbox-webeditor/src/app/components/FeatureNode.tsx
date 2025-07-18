import { Handle, Position } from "@xyflow/react";

type FeatureNodeData = {
  label: string;
  featureInstanceCardinalityMin: string;
  featureInstanceCardinalityMax: string;
  groupTypeCardinalityMin?: string;
  groupTypeCardinalityMax?: string;
  groupInstanceCardinalityMin?: string;
  groupInstanceCardinalityMax?: string;
  parentId?: string;
};

const FeatureNode = ({ data }: { data: FeatureNodeData }) => {
  return (
    <div className="p-2 border-2 rounded-lg shadow bg-white relative">
      <div className="font-bold text-blue-700">{data.label}</div>

      {data.featureInstanceCardinalityMin !== "" &&
        data.featureInstanceCardinalityMax !== "" && (
          <div className="text-xs text-gray-600">
            ⟨{data.featureInstanceCardinalityMin},
            {data.featureInstanceCardinalityMax}⟩
          </div>
        )}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          width: "100%",
          marginTop: "5px",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#4B5563",
        }}
      >
        {data.groupTypeCardinalityMin !== "" &&
          data.groupTypeCardinalityMax !== "" && (
            <div>
              [{data.groupTypeCardinalityMin},{data.groupTypeCardinalityMax}]
            </div>
          )}

        {data.groupInstanceCardinalityMin !== "" &&
          data.groupInstanceCardinalityMax !== "" && (
            <div>
              ⟨{data.groupInstanceCardinalityMin},
              {data.groupInstanceCardinalityMax}⟩
            </div>
          )}
      </div>

      {/*<NodeToolbar
        className="feature_toolbar"
        isVisible={data.forceToolbarVisible || undefined}
        position={Position.Left}
      >
        <label>Name</label>
        <input
          value={label}
          onChange={handleLabelChange}
          className="feature_toolbar_input"
        />
      </NodeToolbar>*/}
    </div>
  );
};

export default FeatureNode;
export type { FeatureNodeData };
