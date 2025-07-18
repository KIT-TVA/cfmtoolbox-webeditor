import { Handle, Position } from "@xyflow/react";

type RootNodeData = {
  label: string;
  // featureInstanceCardinalityMin: string;
  //  featureInstanceCardinalityMax: string;
  groupTypeCardinalityMin?: string;
  groupTypeCardinalityMax?: string;
  groupInstanceCardinalityMin?: string;
  groupInstanceCardinalityMax?: string;
};

const RootNode = ({ data }: { data: RootNodeData }) => {
  return (
    <div className="p-2 border-2 rounded-lg shadow bg-white">
      <div className="font-bold text-blue-700">{data.label}</div>
      {/*{data.featureInstanceCardinalityMin !== "" &&
        data.featureInstanceCardinalityMax !== "" && (
          <div className="text-xs text-gray-600">
            ⟨{data.featureInstanceCardinalityMin},
            {data.featureInstanceCardinalityMax}⟩
          </div>
        )}*/}

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
    </div>
  );
};

export default RootNode;
export type { RootNodeData };
