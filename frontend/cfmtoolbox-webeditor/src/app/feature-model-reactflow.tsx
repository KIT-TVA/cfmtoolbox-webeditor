"use client";
import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import FeatureNode from "./components/FeatureNode";
import RootNode from "./components/RootNode";
import FeatureEdge from "./components/FeatureEdge";
import AddFeatureModal from "./components/AddFeature";

const nodeTypes = {
  feature: FeatureNode,
  root: RootNode,
};

const edgeTypes = {
  edge: FeatureEdge,
};

const initialNodes = [
  {
    id: "1",
    type: "root",
    position: { x: 100, y: 100 },
    data: { label: "Root Feature", min: 1, max: 1, showGroupArc: false },
  },
  {
    id: "2",
    type: "feature",
    position: { x: 100, y: 250 },
    data: { label: "Sub Feature A", min: 0, max: 1, showGroupArc: false },
  },
  {
    id: "3",
    type: "feature",
    position: { x: 300, y: 250 },
    data: { label: "Sub Feature B", min: 1, max: 2, showGroupArc: false },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "edge",
    data: { cardinality: "1..*" },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "edge",
    data: { cardinality: "1..*" },
  },
];

export default function FeatureModelEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [cardinality, setCardinality] = useState('');
  const [parentId, setParentId] = useState('');


  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "edge", data: { cardinality: "1..1" } }, eds)
      ),
    [setEdges]
  );

  const handleAddFeature = () => {
    if (!newFeatureName || !parentId) return alert("Name und Parent müssen angegeben sein.");
    const newId = `${nodes.length + 1}`;
    
    const newNode = {
      id: newId,
      data: { label: `${newFeatureName}`, min: 0, max: 1, showGroupArc: false },
      position: { x: Math.random() * 250, y: Math.random() * 250 }, // Optional: bessere Positionierung
      type: 'feature',
    };
  
    const newEdge = {
      id: `e-${parentId}-${newId}`,
      source: parentId,
      target: newId,
      type: 'edge',
      data: {
        cardinality: '1..n',
      }
    };
  
    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    setIsModalOpen(false);
  
    // Reset Form
    setNewFeatureName('');
    setCardinality('');
    setParentId('');
  };

  
  

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <button
        onClick={() => setIsModalOpen(true)}
        className="m-2 px-4 py-1 bg-blue-600 text-white rounded"
      >
        Add Feature
      </button>
      <AddFeatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddFeature={handleAddFeature}
        newFeatureName={newFeatureName}
        setNewFeatureName={setNewFeatureName}
        cardinality={cardinality}
        setCardinality={setCardinality}
        parentId={parentId}
        setParentId={setParentId}
        nodes={nodes}
      />
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
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
