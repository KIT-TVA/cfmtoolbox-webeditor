"use client";
import React, { useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Handle,
  useNodesState,
  useEdgesState,
  Connection,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const FeatureNode = ({
  data,
}: {
  data: { label: string; min?: number; max?: number };
}) => (
  <div className="p-2 border-2 rounded-lg shadow bg-white">
    <div className="font-bold text-blue-700">{data.label}</div>
    {data.min !== undefined && data.max !== undefined && (
      <div className="text-xs text-gray-600">
        [{data.min}..{data.max}]
      </div>
    )}
    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const RootNode = ({
  data,
}: {
  data: { label: string; min?: number; max?: number };
}) => (
  <div className="p-2 border-2 rounded-lg shadow bg-white">
    <div className="font-bold text-blue-700">{data.label}</div>
    {data.min !== undefined && data.max !== undefined && (
      <div className="text-xs text-gray-600">
        [{data.min}..{data.max}]
      </div>
    )}
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const nodeTypes = {
  feature: FeatureNode,
  root: RootNode,
};

const initialNodes = [
  {
    id: "1",
    type: "root",
    position: { x: 100, y: 100 },
    data: { label: "Root Feature", min: 1, max: 1 },
  },
  {
    id: "2",
    type: "feature",
    position: { x: 100, y: 250 },
    data: { label: "Sub Feature A", min: 0, max: 1 },
  },
  {
    id: "3",
    type: "feature",
    position: { x: 300, y: 250 },
    data: { label: "Sub Feature B", min: 1, max: 2 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
];

export default function FeatureModelEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const addFeatureNode = () => {
    const id = `${nodes.length + 1}`;
    const newNode = {
      id,
      type: "feature",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Feature ${id}`, min: 0, max: 1 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <button
        onClick={addFeatureNode}
        className="m-2 px-4 py-1 bg-blue-600 text-white rounded"
      >
        Add Feature
      </button>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
