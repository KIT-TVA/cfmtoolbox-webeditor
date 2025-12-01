import { Handle, Position } from "@xyflow/react";

/**
 * Type definition for the data passed to the feature node component.
 * Includes label, featureInstanceCardinalityMin, featureInstanceCardinalityMax, groupTypeCardinalityMin, groupTypeCardinalityMax,
 * groupInstanceCardinalityMin, groupInstanceCardinalityMax and parentId.
 */
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

/**
 * Definition of the feature node component for the reactflow editor.
 * @param data The data for the root node. Includes label and cardinality information, see FeatureNodeData type.
 * @returns html element representing a feature node.
 */
const FeatureNode = ({ data }: { data: FeatureNodeData }) => {
  return (
    <div className="feature-node">
      <div className="feature-node-label">{data.label}</div>

      {data.featureInstanceCardinalityMin !== "" &&
        data.featureInstanceCardinalityMax !== "" && (
          <div className="feature-node-feature-cardinality">
            ⟨{data.featureInstanceCardinalityMin},
            {data.featureInstanceCardinalityMax}⟩
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
              ⟨{data.groupInstanceCardinalityMin},
              {data.groupInstanceCardinalityMax}⟩
            </div>
          )}
      </div>
    </div>
  );
};

export default FeatureNode;
