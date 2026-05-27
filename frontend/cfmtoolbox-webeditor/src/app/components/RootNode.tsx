import { Handle, Position } from "@xyflow/react";
import { NodeData } from "../types/FeatureModel";

/**
 * Definition of the root node component for the reactflow editor.
 * @param data The data for the root node. Includes label and cardinality information, see RootNodeData type.
 * @returns html element representing the root node.
 */
const RootNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="root-node">
      <div className="root-node-label">{data.label}</div>

      <Handle type="source" position={Position.Bottom} />

      <div className="root-node-group-cardinality">
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

export default RootNode;
