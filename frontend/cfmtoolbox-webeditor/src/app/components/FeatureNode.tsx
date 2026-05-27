import { Handle, Position } from "@xyflow/react";
import { NodeData } from "../types/FeatureModel";

/**
 * Definition of the feature node component for the reactflow editor.
 * @param data The data for the root node. Includes label and cardinality information, see FeatureNodeData type.
 * @returns html element representing a feature node.
 */
const FeatureNode = ({ data }: { data: NodeData }) => {
  console.log("Feature Node Data:", data)
  return (
    <div className="feature-node">
      <div className="feature-node-label">{data.label}</div>

      {data.featureInstanceCardinality !== null && (
          <div className="feature-node-feature-cardinality">
            ⟨{
              data.featureInstanceCardinality.map((i) => {
                return i.lower + "," + i.upper;
              }).join("⟩⟨")
            }⟩
          </div>
        )}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div className="feature-node-group-cardinality">
        {data.groupTypeCardinality !== null && (
          <div>
            [{
              data.groupTypeCardinality?.map((i) => {
                return i.lower + "," + i.upper;
              }).join("][")
            }]
          </div>
          )
        }

        {data.groupInstanceCardinality !== null && (
          <div>
            ⟨{
              data.groupInstanceCardinality?.map((i) => {
                return i.lower + "," + i.upper;
              }).join("⟩⟨")
            }⟩
          </div>
          )
        }
      </div>
    </div>
  );
};

export default FeatureNode;
