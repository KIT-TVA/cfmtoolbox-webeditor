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
import AddConstraint from "./components/AddConstraint";
import Constraint from "./components/Constraints";


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
  const [nodes, setNodes] = useNodesState(initialNodes);
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
  const [nameError, setNameError] = useState(false);
  const [parentError, setParentError] = useState(false);
  const [constraints, setConstraints] = useState([] as { id: string; source: string; target: string; relation: string; card1Min: string; card1Max: string; card2Min: string; card2Max: string; }[]);
  const [isConstraintModalOpen, setConstraintModalOpen] = useState(false);
  const [feature1, setFeature1] = useState("");
  const [card1Min, setCard1Min] = useState("");
  const [card1Max, setCard1Max] = useState("");
  const [relation, setRelation] = useState("requires");
  const [feature2, setFeature2] = useState("");
  const [card2Min, setCard2Min] = useState("");
  const [card2Max, setCard2Max] = useState("");
  const [editConstraintId, setEditConstraintId] = useState<string | null>(null);


  const addConstraint = ({ source, target, relation, card1Min, card1Max, card2Min, card2Max }: { source: string; target: string; relation: string; card1Min: string; card1Max: string; card2Min: string; card2Max: string; }) => {
    const newConstraint = {
      id: uuidv4(), // Generate unique ID
      source,
      target,
      relation,
      card1Min,
      card1Max,
      card2Min,
      card2Max,
    };
    setConstraints(prev => [...prev, newConstraint]);
  };


  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "edge", data: { cardinality: "1..1" } }, eds)
      ),
    [setEdges]
  );

  const handleAddFeature = () => {
    if (!newFeatureName.trim()) {
      setNameError(true);
      if (!parentId.trim()) {
        setParentError(true);
        return;
      }
      return;
    }
    if (!parentId.trim()) {
      setParentError(true);
      if (!newFeatureName.trim()) {
        setNameError(true);
        return;
      }
      return;
    }
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
    setNameError(false);
    setParentError(false);


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
    setNameError(false);
    setParentError(false);

  };
  const handleUpdateFeature = () => {
    if (!selectedNode) return;
    if (!newFeatureName.trim()) {
      setNameError(true);
      if (!parentId.trim()) {
        setParentError(true);
        return;
      }
      return;
    }
    if (!parentId.trim()) {
      setParentError(true);
      if (!newFeatureName.trim()) {
        setNameError(true);
        return;
      }
      return;
    }
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
    setNameError(false);
    setParentError(false);
  };
  const handleDeleteConstraint = (id: string) => {
    setConstraints(prev => prev.filter(c => c.id !== id));
  };

  const handleEditConstraint = (id: string) => {
    const constraint = constraints.find(c => c.id === id);
    if (!constraint) return;

    setFeature1(constraint.source);
    setCard1Min(constraint.card1Min);
    setCard1Max(constraint.card1Max);
    setRelation(constraint.relation);
    setFeature2(constraint.target);
    setCard2Min(constraint.card2Min);
    setCard2Max(constraint.card2Max);

    setEditConstraintId(id);
    setConstraintModalOpen(true);
  };


  const handleUpdateConstraint = () => {
    if (!editConstraintId) return;

    setConstraints(prev =>
      prev.map(c =>
        c.id === editConstraintId
          ? {
            ...c,
            source: feature1,
            target: feature2,
            relation,
            card1Min,
            card1Max,
            card2Min,
            card2Max,
          }
          : c
      )
    );

    // Zurücksetzen
    setEditConstraintId(null);
    setFeature1('');
    setCard1Min('');
    setCard1Max('');
    setRelation('requires');
    setFeature2('');
    setCard2Min('');
    setCard2Max('');
    setConstraintModalOpen(false);
  };
  const handleDeleteFeature = () => {
    if (selectedNode) {
      setNodes((prev) => prev.filter(node => node.id !== selectedNode.id));
      setSelectedNode(null); // falls du einen aktiven Node hast
      setIsModalOpen(false);
    }
  };
  const NODE_WIDTH = 150;
  const NODE_HEIGHT = 40;

  const isOverlapping = (nodeA: any, nodeB: any) => {
  return !(
    nodeA.position.x + NODE_WIDTH < nodeB.position.x ||
    nodeB.position.x + NODE_WIDTH < nodeA.position.x ||
    nodeA.position.y + NODE_HEIGHT < nodeB.position.y ||
    nodeB.position.y + NODE_HEIGHT < nodeA.position.y
  );
};
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      let updatedNodes = applyNodeChanges(
        changes.map((change) => {
          if (change.type === 'position' && change.position != null) {
            const originalNode = nodes.find((n) => n.id === change.id);
            if (originalNode) {
              return {
                ...change,
                position: {
                  x: change.position.x,
                  y: originalNode.position.y,
                },
              };
            }
          }
          return change;
        }),
        
        nodes
      ) as typeof nodes; 
      updatedNodes = updatedNodes.map((node) => {
        for (const other of updatedNodes) {
          if (node.id !== other.id && isOverlapping(node, other)) {
            return {
              ...node,
              position: { x: other.position.x + NODE_WIDTH + 10, y: node.position.y },
            };
          }
        }
        return node;
      });
      
      setNodes(updatedNodes);
    },
    [nodes]
  );
  
  





  return (
    <div className="flex flex-col h-screen">      <button
      onClick={openAddFeatureModal}
      className="absolute top-2 left-2 z-10 px-4 py-1 bg-blue-600 text-white rounded shadow"
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
        nameError={nameError}
        setNameError={setNameError}
        parentError={parentError}
        setParentError={setParentError}
        onDeleteFeature={handleDeleteFeature}
      />
      <div className="h-[80%] overflow-hidden">      <ReactFlowProvider>
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
          //onNodesChange={onNodesChange}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
      </div>
      <Constraint
        constraints={constraints}
        nodes={nodes}
        onEdit={handleEditConstraint}
        onDelete={handleDeleteConstraint}
        onAddClick={() => setConstraintModalOpen(true)}
      />

      <AddConstraint
        isOpen={isConstraintModalOpen}
        onClose={() => {
          setConstraintModalOpen(false);
          setEditConstraintId(null);
        }}
        onAddConstraint={() => {
          if (editConstraintId) {
            handleUpdateConstraint();
          } else {
            addConstraint({
              source: feature1,
              target: feature2,
              relation,
              card1Min,
              card1Max,
              card2Min,
              card2Max,
            });
            setConstraintModalOpen(false);
            setFeature1('');
            setCard1Min('');
            setCard1Max('');
            setRelation('requires');
            setFeature2('');
            setCard2Min('');
            setCard2Max('');
          }
        }}
        feature1={feature1}
        setFeature1={setFeature1}
        card1Min={card1Min}
        setCard1Min={setCard1Min}
        card1Max={card1Max}
        setCard1Max={setCard1Max}
        relation={relation}
        setRelation={setRelation}
        feature2={feature2}
        setFeature2={setFeature2}
        card2Min={card2Min}
        setCard2Min={setCard2Min}
        card2Max={card2Max}
        setCard2Max={setCard2Max}
        nodes={nodes}
        isEditMode={!!editConstraintId}
      />



    </div>
  );
}
import { v4 as uuidv4 } from 'uuid';

