import { Handle, Position } from "@xyflow/react";

/**
 * Type definition for the data passed to the root node component.
 * Includes label, groupTypeCardinalityMin, groupTypeCardinalityMax,
 * groupInstanceCardinalityMin, groupInstanceCardinalityMax.
 */
export type RootNodeData = {
  label: string;
  groupTypeCardinalityMin?: string;
  groupTypeCardinalityMax?: string;
  groupInstanceCardinalityMin?: string;
  groupInstanceCardinalityMax?: string;
};

/**
 * Definition of the root node component for the reactflow editor.
 * @param data The data for the root node. Includes label and cardinality information, see RootNodeData type.
 * @returns html element representing the root node.
 */
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
