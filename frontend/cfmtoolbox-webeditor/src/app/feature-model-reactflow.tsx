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
  getNodesBounds,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";


import FeatureNode from "./components/FeatureNode";
import RootNode from "./components/RootNode";
import FeatureEdge from "./components/FeatureEdge";
import AddFeatureModal from "./components/AddFeature";
import AddConstraint from "./components/AddConstraint";
import Constraint from "./components/Constraints";
import { v4 as uuidv4 } from "uuid";

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
    data: {
      label: "Root Feature",
      featureInstanceCardinalityMin: "1",
      featureInstanceCardinalityMax: "0",
      showGroupArc: false,
      groupTypeCardinalityMin: "1",
      groupTypeCardinalityMax: "*",
      groupInstanceCardinalityMin: "1",
      groupInstanceCardinalityMax: "*",
      parentId: "0",
    },
  },
  {
    id: "2",
    type: "feature",
    position: { x: 100, y: 250 },
    data: {
      label: "Sub Feature A",
      featureInstanceCardinalityMin: "1",
      featureInstanceCardinalityMax: "0",
      showGroupArc: false,
      groupTypeCardinalityMin: "1",
      groupTypeCardinalityMax: "*",
      groupInstanceCardinalityMin: "1",
      groupInstanceCardinalityMax: "*",
      parentId: "1",
    },
  },
  {
    id: "3",
    type: "feature",
    position: { x: 338, y: 250 },
    data: {
      label: "Sub Feature B",
      featureInstanceCardinalityMin: "1",
      featureInstanceCardinalityMax: "0",
      showGroupArc: false,
      groupTypeCardinalityMin: "1",
      groupTypeCardinalityMax: "*",
      groupInstanceCardinalityMin: "1",
      groupInstanceCardinalityMax: "*",
      parentId: "1",
    },
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
  const [newFeatureName, setNewFeatureName] = useState("");
  const [featureInstanceCardinalityMin, setFeatureInstanceCardinalityMin] =
    useState("");
  const [featureInstanceCardinalityMax, setFeatureInstanceCardinalityMax] =
    useState("");
  const [groupTypeCardinalityMin, setGroupTypeCardinalityMin] = useState("");
  const [groupTypeCardinalityMax, setGroupTypeCardinalityMax] = useState("");
  const [groupInstanceCardinalityMin, setGroupInstanceCardinalityMin] =
    useState("");
  const [groupInstanceCardinalityMax, setGroupInstanceCardinalityMax] =
    useState("");
  const [parentId, setParentId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nameError, setNameError] = useState(false);
  const [parentError, setParentError] = useState(false);
  const [featureInstanceMinError, setFeatureInstanceMinError] = useState(false);
  const [featureInstanceMaxError, setFeatureInstanceMaxError] = useState(false);
  const [constraints, setConstraints] = useState(
    [] as {
      id: string;
      source: string;
      target: string;
      relation: string;
      card1Min: string;
      card1Max: string;
      card2Min: string;
      card2Max: string;
    }[]
  );
  const [isConstraintModalOpen, setConstraintModalOpen] = useState(false);
  const [feature1, setFeature1] = useState("");
  const [card1Min, setCard1Min] = useState("");
  const [card1Max, setCard1Max] = useState("");
  const [relation, setRelation] = useState("requires");
  const [feature2, setFeature2] = useState("");
  const [card2Min, setCard2Min] = useState("");
  const [card2Max, setCard2Max] = useState("");
  const [feature1Error, setFeature1Error] = useState(false);
  const [feature2Error, setFeature2Error] = useState(false);
  const [card1MinError, setCard1MinError] = useState(false);
  const [card1MaxError, setCard1MaxError] = useState(false);
  const [card2MinError, setCard2MinError] = useState(false);
  const [card2MaxError, setCard2MaxError] = useState(false);
  const [editConstraintId, setEditConstraintId] = useState<string | null>(null);
  const [isNodeMenuOpen, setIsNodeMenuOpen] = useState(false);
  const [nodeMenuPosition, setNodeMenuPosition] = useState<{
    x: number;
    y: number;
    id?: string;
  } | null>(null);

  const addConstraint = ({
    source,
    target,
    relation,
    card1Min,
    card1Max,
    card2Min,
    card2Max,
  }: {
    source: string;
    target: string;
    relation: string;
    card1Min: string;
    card1Max: string;
    card2Min: string;
    card2Max: string;
  }) => {
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
    setConstraints((prev) => [...prev, newConstraint]);
  };

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "edge", data: { cardinality: "1..1" } }, eds)
      ),
    [setEdges]
  );

  const handleAddFeature = () => {
    let hasError = false;

    if (!newFeatureName.trim()) {
      setNameError(true);
      hasError = true;
    }

    if (!parentId.trim()) {
      setParentError(true);
      hasError = true;
    }

    if (!featureInstanceCardinalityMin.trim()) {
      setFeatureInstanceMinError(true);
      hasError = true;
    }

    if (!featureInstanceCardinalityMax.trim()) {
      setFeatureInstanceMaxError(true);
      hasError = true;
    }
    if (hasError) return;
    const newId = `${nodes.length + 1}`;
    const parentnode = nodes.find((n) => n.id === parentId);
    const siblings = nodes.filter((n) => n.data.parentId === parentId);
    const siblingCount = siblings.length;
    const offsetX = 100;
    const bounds = siblings[siblingCount - 1] ? getNodesBounds([siblings[siblingCount - 1]]) : null;
    const positionY = (parentnode?.position.y || 0) + 150;
    let positionX = 100;
    if (siblingCount === 0) {
      positionX = parentnode?.position.x || 100;
    } else {
      positionX = (siblings[siblingCount - 1]?.position.x || parentnode?.position.x || 100) + (bounds?.width || NODE_WIDTH) + offsetX;
    }

    const newNode = {
      id: newId,
      data: {
        label: `${newFeatureName}`,
        featureInstanceCardinalityMin: `${featureInstanceCardinalityMin}`,
        featureInstanceCardinalityMax: `${featureInstanceCardinalityMax}`,
        showGroupArc: false,
        groupTypeCardinalityMin: `${groupTypeCardinalityMin}`,
        groupTypeCardinalityMax: `${groupTypeCardinalityMax}`,
        groupInstanceCardinalityMin: `${groupInstanceCardinalityMin}`,
        groupInstanceCardinalityMax: `${groupInstanceCardinalityMax}`,
        parentId: `${parentId}`,
      },
      position: { x: positionX, y: positionY },
      type: "feature",
    };

    const newEdge = {
      id: `e-${parentId}-${newId}`,
      source: parentId,
      target: newId,
      type: "edge",
      data: {
        cardinality: "1..n",
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    setIsModalOpen(false);
    setNameError(false);
    setParentError(false);
    setFeatureInstanceMinError(false);
    setFeatureInstanceMaxError(false);

    // Reset Form
    setNewFeatureName("");
    setFeatureInstanceCardinalityMin("");
    setFeatureInstanceCardinalityMax("");
    setGroupTypeCardinalityMax("");
    setGroupTypeCardinalityMin("");
    setGroupInstanceCardinalityMin("");
    setGroupInstanceCardinalityMax("");
    setParentId("");
  };

  const handleNodeClick: NodeMouseHandler<any> = (event, node) => {
    event.preventDefault();
    event.stopPropagation(); // verhindert doppelte Events
    console.log("X", event.clientX, "Y", event.clientY);
    setSelectedNode(node);
    setIsNodeMenuOpen(true);
    if (isNodeMenuOpen && node.id === nodeMenuPosition?.id) {
      setIsNodeMenuOpen(false);
    }
    setNodeMenuPosition({ x: event.clientX, y: event.clientY, id: node.id });

  };

  const handleUpdateFeature = () => {
    if (!selectedNode) return;
    let hasError = false;

    if (!newFeatureName.trim()) {
      setNameError(true);
      hasError = true;
    }

    if (!parentId.trim()) {
      setParentError(true);
      hasError = true;
    }

    if (!featureInstanceCardinalityMin.trim()) {
      setFeatureInstanceMinError(true);
      hasError = true;
    }

    if (!featureInstanceCardinalityMax.trim()) {
      setFeatureInstanceMaxError(true);
      hasError = true;
    }

    if (hasError) return;

    const parentNode = nodes.find((n) => n.id === parentId);
    const siblings = nodes.filter(
      (n) => n.data.parentId === parentId && n.id !== selectedNode.id
    );
    const siblingCount = siblings.length;
    const offsetX = siblingCount * (NODE_WIDTH + 10);
    const positionX = parentNode?.position.x ?? 100 + offsetX;
    const positionY = (parentNode?.position.y ?? 0) + 150;

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode.id
          ? {
            ...node,
            position: { x: positionX, y: positionY },
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
              cardinality: "1..n",
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
    setNewFeatureName("");
    setFeatureInstanceCardinalityMin("");
    setFeatureInstanceCardinalityMax("");
    setGroupTypeCardinalityMax("");
    setGroupTypeCardinalityMin("");
    setGroupInstanceCardinalityMin("");
    setGroupInstanceCardinalityMax("");
    setParentId("");
  };

  const handleEditClick = () => {
    setNewFeatureName(selectedNode?.data.label);
    setFeatureInstanceCardinalityMin(
      selectedNode?.data.featureInstanceCardinalityMin
    );
    setFeatureInstanceCardinalityMax(
      selectedNode?.data.featureInstanceCardinalityMax
    );
    setGroupTypeCardinalityMin(
      selectedNode?.data.groupTypeCardinalityMin || ""
    );
    setGroupTypeCardinalityMax(
      selectedNode?.data.groupTypeCardinalityMax || ""
    );
    setGroupInstanceCardinalityMin(
      selectedNode?.data.groupInstanceCardinalityMin || ""
    );
    setGroupInstanceCardinalityMax(
      selectedNode?.data.groupInstanceCardinalityMax || ""
    );
    setParentId(selectedNode?.data.parentId || "");

    setEditMode(true);
    setIsModalOpen(true);
    setNameError(false);
    setParentError(false);
    setFeatureInstanceMinError(false);
    setFeatureInstanceMaxError(false);

    setIsNodeMenuOpen(false);
  };

  const handleCreateChildClick = () => {
    setIsNodeMenuOpen(false);
    openAddFeatureModal();
    setParentId(selectedNode?.id || "");
  };

  const handleCreateSiblingClick = () => {
    setIsNodeMenuOpen(false);
    openAddFeatureModal();
    setParentId(selectedNode?.data.parentId || "");
  };

  const openAddFeatureModal = () => {
    // Formulardaten zurücksetzen
    setNewFeatureName("");
    setFeatureInstanceCardinalityMin("");
    setFeatureInstanceCardinalityMax("");
    setGroupTypeCardinalityMin("");
    setGroupTypeCardinalityMax("");
    setGroupInstanceCardinalityMin("");
    setGroupInstanceCardinalityMax("");
    setParentId("");

    setEditMode(false);
    setSelectedNode(null);
    setIsModalOpen(true);
    setNameError(false);
    setParentError(false);
    setFeatureInstanceMinError(false);
    setFeatureInstanceMaxError(false);
  };
  const handleDeleteConstraint = (id: string) => {
    setConstraints((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEditConstraint = (id: string) => {
    const constraint = constraints.find((c) => c.id === id);
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

    setConstraints((prev) =>
      prev.map((c) =>
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
    setFeature1("");
    setCard1Min("");
    setCard1Max("");
    setRelation("requires");
    setFeature2("");
    setCard2Min("");
    setCard2Max("");
    setConstraintModalOpen(false);
  };
  const handleAddConstraint = () => {
    setEditConstraintId(null);
    setFeature1("");
    setCard1Min("");
    setCard1Max("");
    setRelation("requires");
    setFeature2("");
    setCard2Min("");
    setCard2Max("");
    setFeature1Error(false);
    setFeature2Error(false);
    setCard1MinError(false);
    setCard1MaxError(false);
    setCard2MinError(false);
    setCard2MaxError(false);
    setConstraintModalOpen(true);
  }
  const handleDeleteFeature = () => {
    if (selectedNode) {
      setNodes((prev) => prev.filter((node) => node.id !== selectedNode.id));
      setSelectedNode(null); // falls du einen aktiven Node hast
      setIsModalOpen(false);
      setIsNodeMenuOpen(false);
    }
  };
  const NODE_WIDTH = 150;

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(
        changes.map((change) => {
          if (change.type === "position" && change.position != null) {
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
      /* let shiftToggle = true;
      const baseNodes = [...updatedNodes];
      const resultNodes: any[] = [];
      
      for (const node of baseNodes) {
        let newPos = { ...node.position };
      
        for (const other of resultNodes) {
          if (node.id !== other.id && isOverlapping({ position: newPos }, other)) {
            const shift = shiftToggle ? 1 : -1;
            shiftToggle = !shiftToggle;
      
            newPos.x = other.position.x + shift * (NODE_WIDTH + 10);
          }
        }
      
        resultNodes.push({
          ...node,
          position: newPos,
        });
      }*/

      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  const handleCreateConstraint = () => {
    let hasError = false;
    if (!feature1.trim()) {
      setFeature1Error(true);
      hasError = true;
    }
    if (!feature2.trim()) {
      setFeature2Error(true);
      hasError = true;
    }
    if (!card1Min.trim()) {
      setCard1MinError(true);
      hasError = true;
    }
    if (!card1Max.trim()) {
      setCard1MaxError(true);
      hasError = true;
    }
    if (!card2Min.trim()) {
      setCard2MinError(true);
      hasError = true;
    }
    if (!card2Max.trim()) {
      setCard2MaxError(true);
      hasError = true;
    }
    if (hasError) return;
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
      setFeature1("");
      setCard1Min("");
      setCard1Max("");
      setRelation("requires");
      setFeature2("");
      setCard2Min("");
      setCard2Max("");
    }
  }


  const handleExport = () => {
    const flowData = {
      nodes,
      edges,
    };

    const json = JSON.stringify(flowData, null, 2);
    const blob = new Blob([json], { type: "application/json" });

    // Trigger Download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "react-flow-export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen">
      {" "}
      <button
        onClick={openAddFeatureModal}
        className="absolute top-2 left-2 z-10 px-4 py-1 bg-blue-600 text-white rounded shadow"
      >
        Add Feature
      </button>
      {isNodeMenuOpen && nodeMenuPosition && (
        <div
          style={{
            position: "absolute",
            top: nodeMenuPosition.y,
            left: nodeMenuPosition.x,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
            flexDirection: "column",
            display: "flex",

          }}
        >
          <button
            onClick={() => setIsNodeMenuOpen(false)}
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              background: "transparent",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              padding: "0",
              lineHeight: "1",
            }}
            aria-label="Close menu"
          >
            ×
          </button>


          <button onClick={handleCreateChildClick} className="text-left px-4 py-2 hover:bg-gray-100 rounded">Create Child
          </button>
          <button onClick={handleCreateSiblingClick} className="text-left px-4 py-2 hover:bg-gray-100 rounded">Create Sibling
          </button>
          <div>
            <button onClick={handleEditClick} className="text-blue-600 px-4 py-2 "><BsFillPencilFill /></button>
            <button onClick={handleDeleteFeature} className="text-red-600 px-4 py-2 "><BsFillTrashFill /></button>
          </div>


        </div>
      )}
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
        featureInstanceMinError={featureInstanceMinError}
        setFeatureInstanceMinError={setFeatureInstanceMinError}
        featureInstanceMaxError={featureInstanceMaxError}
        setFeatureInstanceMaxError={setFeatureInstanceMaxError}
        onDeleteFeature={handleDeleteFeature}
      />
      <div className="h-[80%] overflow-hidden">
        {" "}
        <ReactFlowProvider>
          <button onClick={handleExport}>Export as JSON</button>
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
        onAddClick={handleAddConstraint}
      />
      <AddConstraint
        isOpen={isConstraintModalOpen}
        onClose={() => {
          setConstraintModalOpen(false);
          setEditConstraintId(null);
        }}
        onAddConstraint={handleCreateConstraint}
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
        feature1Error={feature1Error}
        setFeature1Error={setFeature1Error}
        feature2Error={feature2Error}
        setFeature2Error={setFeature2Error}
        card1MinError={card1MinError}
        setCard1MinError={setCard1MinError}
        card1MaxError={card1MaxError}
        setCard1MaxError={setCard1MaxError}
        card2MinError={card2MinError}
        setCard2MinError={setCard2MinError}
        card2MaxError={card2MaxError}
        setCard2MaxError={setCard2MaxError}
        nodes={nodes}
        isEditMode={!!editConstraintId}
      />
    </div>
  );
}
