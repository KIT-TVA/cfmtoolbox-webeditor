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
  const [nameError, setNameError] = useState(false);
  const [parentError, setParentError] = useState(false);
  const [constraints, setConstraints] = useState<
    { id: string; source: string; target: string; relation: string; card1Min: string; card1Max: string; card2Min: string; card2Max: string; }[]
  >([
    { id: "c1", source: "Feature A", target: "Feature B", relation: "requires", card1Min: "1", card1Max: "*", card2Min: "1", card2Max: "2" },
  ]);
  const [newSource, setNewSource] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [isConstraintModalOpen, setConstraintModalOpen] = useState(false);
  const [feature1, setFeature1] = useState("");
  const [card1Min, setCard1Min] = useState("");
  const [card1Max, setCard1Max] = useState("");
  const [relation, setRelation] = useState("requires");
  const [feature2, setFeature2] = useState("");
  const [card2Min, setCard2Min] = useState("");
  const [card2Max, setCard2Max] = useState("");

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
    const newSource = prompt("Neuer Source:", constraints.find(c => c.id === id)?.source);
    const newTarget = prompt("Neuer Target:", constraints.find(c => c.id === id)?.target);
    if (newSource && newTarget) {
      setConstraints(prev =>
        prev.map(c => c.id === id ? { ...c, source: newSource, target: newTarget } : c)
      );
    }
  };




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
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
      </div>
      <div className="h-[20%] bg-gray-100 border-t border-gray-300 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">Constraints</h2>
          <button
            onClick={() => setConstraintModalOpen(true)}
            className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700"
            title="Constraint hinzufügen"
          >
            +
          </button>
        </div>
        {/* Liste */}
        {constraints.length === 0 ? (
          <p className="text-gray-500">Keine Constraints vorhanden.</p>
        ) : (
          <ul className="space-y-2">
            {constraints.map(c => (
              <li key={c.id} className="flex justify-between items-center bg-white p-2 rounded shadow">
                <span>
                  {nodes.find(node => node.id === c.source)?.data.label}{" "}
                  {"<"}{c.card1Min}{"..."}{c.card1Max}{">"}{" "}
                  <strong>{c.relation}</strong>{" "}
                  {nodes.find(node => node.id === c.target)?.data.label}{" "}
                  {"<"}{c.card2Min}{"..."}{c.card2Max}{">"}

                </span>
                <div className="space-x-2 text-sm">
                  <button onClick={() => handleEditConstraint(c.id)} className="text-blue-600 hover:underline">
                    Bearbeiten
                  </button>
                  <button onClick={() => handleDeleteConstraint(c.id)} className="text-red-600 hover:underline">
                    Löschen
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {isConstraintModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Constraint hinzufügen</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Feature 1 Dropdown */}
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">Feature 1</label>
                <select
                  value={feature1}
                  onChange={(e) => setFeature1(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="">Wählen...</option>
                  {nodes
                    .map(node => (
                      <option key={node.id} value={node.id}>
                        {node.data.label}
                      </option>
                    ))}
                </select>
              </div>

              {/* Cardinalität 1 */}
              <div className="col-span-1">

                <label className="block mb-1 text-sm font-medium">Kardinalität</label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={card1Min}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setCard1Min(value);
                      }
                    }}
                    placeholder="Min"
                    className="w-1/2 border rounded p-2"
                  />
                  <input
                    type="text"
                    value={card1Max}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) || value === "*") {
                        setCard1Max(value);
                      }
                    }}
                    placeholder="Max"
                    className="w-1/2 border rounded p-2"
                  />
                </div>
              </div>

              {/* Relation */}
              <div className="col-span-2">
                <label className="block mb-1 text-sm font-medium">Beziehung</label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="requires">requires</option>
                  <option value="excludes">excludes</option>
                </select>
              </div>

              {/* Feature 2 Dropdown */}
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">Feature 2</label>
                <select
                  value={feature2}
                  onChange={(e) => setFeature2(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="">Wählen...</option>
                  {nodes
                    .map(node => (
                      <option key={node.id} value={node.id}>
                        {node.data.label}
                      </option>
                    ))}
                </select>
              </div>

              {/* Cardinalität 2 */}
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">Kardinalität</label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={card2Min}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setCard2Min(value);
                      }
                    }}
                    placeholder="Min"
                    className="w-1/2 border rounded p-2"
                  />
                  <input
                    type="text"
                    value={card2Max}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) || value === "*") {
                        setCard2Max(value);
                      }
                    }}
                    placeholder="Max"
                    className="w-1/2 border rounded p-2"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConstraintModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  // Constraint speichern (z. B. in deine Liste)
                  addConstraint({
                    source: feature1,
                    target: feature2,
                    relation,
                    card1Min: card1Min,
                    card1Max: card1Max,
                    card2Min: card2Min,
                    card2Max: card2Max,
                  });
                  setConstraintModalOpen(false);
                  setFeature1(""); setFeature2("");
                  setRelation("requires");
                  setCard1Min("");
                  setCard1Max("");
                  setCard2Max("");
                  setCard2Min("");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
import { v4 as uuidv4 } from 'uuid';

