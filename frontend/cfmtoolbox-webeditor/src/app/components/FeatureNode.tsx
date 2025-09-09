import { Handle, Position } from "@xyflow/react";

export type FeatureNodeData = {
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
    <div className="feature-node">
      <div className="feature-node-label">{data.label}</div>

      {data.featureInstanceCardinalityMin !== "" &&
        data.featureInstanceCardinalityMax !== "" && (
          <div className="feature-node-feature-cardinality">
            ⟨{data.featureInstanceCardinalityMin},{data.featureInstanceCardinalityMax}⟩
          </div>
        )}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div className="feature-node-group-cardinality">
        {data.groupTypeCardinalityMin !== "" &&
          data.groupTypeCardinalityMax !== "" && (
            <div>
              [{data.groupTypeCardinalityMin},{data.groupTypeCardinalityMax}]
            </div>
          )}

        {data.groupInstanceCardinalityMin !== "" &&
          data.groupInstanceCardinalityMax !== "" && (
            <div>
              ⟨{data.groupInstanceCardinalityMin},{data.groupInstanceCardinalityMax}⟩
            </div>
          )}
      </div>
    </div>
  );
};

export default FeatureNode;
