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
  NodeChange,
  applyNodeChanges,
  NodeMouseHandler,
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
    data: { label: "Root Feature", featureInstanceCardinalityMin: "1", featureInstanceCardinalityMax: "0", showGroupArc: false, groupTypeCardinalityMin: "1", groupTypeCardinalityMax: "*", groupInstanceCardinalityMin: "1", groupInstanceCardinalityMax: "*", parentId: "0" },
  },
  {
    id: "2",
    type: "feature",
    position: { x: 100, y: 250 },
    data: { label: "Sub Feature A", featureInstanceCardinalityMin: "1", featureInstanceCardinalityMax: "0", showGroupArc: false, groupTypeCardinalityMin: "1", groupTypeCardinalityMax: "*", groupInstanceCardinalityMin: "1", groupInstanceCardinalityMax: "*", parentId: "1" },
  },
  {
    id: "3",
    type: "feature",
    position: { x: 300, y: 250 },
    data: { label: "Sub Feature B", featureInstanceCardinalityMin: "1", featureInstanceCardinalityMax: "0", showGroupArc: false, groupTypeCardinalityMin: "1", groupTypeCardinalityMax: "*", groupInstanceCardinalityMin: "1", groupInstanceCardinalityMax: "*", parentId: "1" },
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
  const [editMode, setEditMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

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
    const parentnode = nodes.find((n) => n.id === parentId);
    const positionX = (parentnode?.position.x || 100)
    const positionY = (parentnode?.position.y || 0) + 150; // Position below the parent node
    const newNode = {
      id: newId,
      data: { label: `${newFeatureName}`, featureInstanceCardinalityMin: `${featureInstanceCardinalityMin}`, featureInstanceCardinalityMax: `${featureInstanceCardinalityMax}`, showGroupArc: false, groupTypeCardinalityMin: `${groupTypeCardinalityMin}`, groupTypeCardinalityMax: `${groupTypeCardinalityMax}`, groupInstanceCardinalityMin: `${groupInstanceCardinalityMin}`, groupInstanceCardinalityMax: `${groupInstanceCardinalityMax}`, parentId: `${parentId}` },
      position: { x: positionX, y: positionY },
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

  const handleNodeClick: NodeMouseHandler<any> = (event, node) => {
    setNewFeatureName(node.data.label);
    setFeatureInstanceCardinalityMin(node.data.featureInstanceCardinalityMin);
    setFeatureInstanceCardinalityMax(node.data.featureInstanceCardinalityMax);
    setGroupTypeCardinalityMin(node.data.groupTypeCardinalityMin || "");
    setGroupTypeCardinalityMax(node.data.groupTypeCardinalityMax || "");
    setGroupInstanceCardinalityMin(node.data.groupInstanceCardinalityMin || "");
    setGroupInstanceCardinalityMax(node.data.groupInstanceCardinalityMax || "");
    setParentId(node.data.parentId || "");

    setSelectedNode(node);
    setEditMode(true);
    setIsModalOpen(true);
    
  };
  const handleUpdateFeature = () => {
    if (!selectedNode) return;

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode.id
          ? {
            ...node,
            data: {
              ...node.data,
              label: newFeatureName,
              featureInstanceCardinalityMin,
              featureInstanceCardinalityMax,
              groupTypeCardinalityMin,
              groupTypeCardinalityMax,
              groupInstanceCardinalityMin,
              groupInstanceCardinalityMax,
              parentId,
            },
          }
          : node
      )
    );

    setEdges((prevEdges) => {
      // Entferne alte Kante(n) zu dieser Node
      const edgesWithoutOld = prevEdges.filter(
        (e) => e.target !== selectedNode.id
      );

      // Falls ein neuer Parent gesetzt wurde, füge neue Kante hinzu
      if (parentId) {
        return [
          ...edgesWithoutOld,
          {
            id: `${parentId}-${selectedNode.id}`,
            source: parentId,
            target: selectedNode.id,
            type: "edge",
            data: {
              cardinality: '1..n',
            },
          },
        ];
      }

      return edgesWithoutOld;
    });

    setIsModalOpen(false);
    setEditMode(false);
    setSelectedNode(selectedNode);

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

  const openAddFeatureModal = () => {
    // Formulardaten zurücksetzen
    setNewFeatureName('');
    setFeatureInstanceCardinalityMin('');
    setFeatureInstanceCardinalityMax('');
    setGroupTypeCardinalityMin('');
    setGroupTypeCardinalityMax('');
    setGroupInstanceCardinalityMin('');
    setGroupInstanceCardinalityMax('');
    setParentId('');
  
    setEditMode(false);
    setSelectedNode(null);
    setIsModalOpen(true);
  };
  


  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <button
        onClick={openAddFeatureModal}
        className="m-2 px-4 py-1 bg-blue-600 text-white rounded"
      >
        Add Feature
      </button>
      <AddFeatureModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditMode(false);
        }}
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
        editMode={editMode}
        onUpdateFeature={handleUpdateFeature}
        nodes={nodes}
        selectedNode={selectedNode}
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
          onNodeClick={handleNodeClick}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
