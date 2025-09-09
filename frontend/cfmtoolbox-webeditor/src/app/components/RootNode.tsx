import { Handle, Position } from "@xyflow/react";

export type RootNodeData = {
  label: string;
  groupTypeCardinalityMin?: string;
  groupTypeCardinalityMax?: string;
  groupInstanceCardinalityMin?: string;
  groupInstanceCardinalityMax?: string;
};

const RootNode = ({ data }: { data: RootNodeData }) => {
  return (
    <div className="root-node">
      <div className="root-node-label">{data.label}</div>

      <Handle type="source" position={Position.Bottom} />

      <div className="root-node-group-cardinality">
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
