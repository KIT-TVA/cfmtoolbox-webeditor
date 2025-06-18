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
import { group } from "console";

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
    data: { label: "Root Feature", featureInstanceCardinalityMin: "1", featureInstanceCardinalityMax: "0", showGroupArc: false, groupTypeCardinalityMin: "1", groupTypeCardinalityMax: "*", groupInstanceCardinalityMin: "1", groupInstanceCardinalityMax: "*"},
  },
  {
    id: "2",
    type: "feature",
    position: { x: 100, y: 250 },
    data: { label: "Sub Feature A", featureInstanceCardinalityMin: "1", featureInstanceCardinalityMax: "0", showGroupArc: false, groupTypeCardinalityMin: "1", groupTypeCardinalityMax: "*", groupInstanceCardinalityMin: "1", groupInstanceCardinalityMax: "*" },
  },
  {
    id: "3",
    type: "feature",
    position: { x: 300, y: 250 },
    data: { label: "Sub Feature B", featureInstanceCardinalityMin: "1", featureInstanceCardinalityMax: "0", showGroupArc: false, groupTypeCardinalityMin: "1", groupTypeCardinalityMax: "*", groupInstanceCardinalityMin: "1", groupInstanceCardinalityMax: "*" },
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
  const [featureInstanceCardinalityMin, setFeatureInstanceCardinalityMin] = useState('');
  const [featureInstanceCardinalityMax, setFeatureInstanceCardinalityMax] = useState('');
  const [groupTypeCardinalityMin, setGroupTypeCardinalityMin] = useState('');
  const [groupTypeCardinalityMax, setGroupTypeCardinalityMax] = useState('');
  const [groupInstanceCardinalityMin, setGroupInstanceCardinalityMin] = useState('');
  const [groupInstanceCardinalityMax, setGroupInstanceCardinalityMax] = useState('');
  const [parentId, setParentId] = useState('');


  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "edge", data: { cardinality: "1..1" } }, eds)
      ),
    [setEdges]
  );

  const handleAddFeature = () => {
    //if (!newFeatureName || !parentId) return alert("Name und Parent müssen angegeben sein.");
    const newId = `${nodes.length + 1}`;

    const newNode = {
      id: newId,
      data: { label: `${newFeatureName}`, featureInstanceCardinalityMin: `${featureInstanceCardinalityMin}`, featureInstanceCardinalityMax: `${featureInstanceCardinalityMax}`, showGroupArc: false, groupTypeCardinalityMin: `${groupTypeCardinalityMin}`, groupTypeCardinalityMax: `${groupTypeCardinalityMax}`, groupInstanceCardinalityMin: `${groupInstanceCardinalityMin}`, groupInstanceCardinalityMax: `${groupInstanceCardinalityMax}` },
      position: { x: Math.random() * 250, y: Math.random() * 250 }, 
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
    setFeatureInstanceCardinalityMin('');
    setFeatureInstanceCardinalityMax('');
    setGroupTypeCardinalityMax('');
    setGroupTypeCardinalityMin('');
    setGroupInstanceCardinalityMin('');
    setGroupInstanceCardinalityMax('');
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
        featureInstanceCardinalityMin={featureInstanceCardinalityMin}
        setFeatureInstanceCardinalityMin={setFeatureInstanceCardinalityMin}
        featureInstanceCardinalityMax={featureInstanceCardinalityMax}
        setFeatureInstanceCardinalityMax={setFeatureInstanceCardinalityMax}
        groupTypeCardinalityMin={groupTypeCardinalityMin}
        setGroupTypeCardinalityMin={setGroupTypeCardinalityMin}
        groupTypeCardinalityMax={groupTypeCardinalityMax}
        setGroupTypeCardinalityMax={setGroupTypeCardinalityMax}
        groupInstanceCardinalityMin={groupInstanceCardinalityMin}
        setGroupInstanceCardinalityMin={setGroupInstanceCardinalityMin}
        groupInstanceCardinalityMax={groupInstanceCardinalityMax}
        setGroupInstanceCardinalityMax={setGroupInstanceCardinalityMax}
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
