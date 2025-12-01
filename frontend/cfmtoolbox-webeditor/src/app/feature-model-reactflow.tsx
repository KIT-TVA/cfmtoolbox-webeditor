"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import {
  BsFillTrashFill,
  BsFillPencilFill,
  BsThreeDotsVertical,
} from "react-icons/bs";

import FeatureNode from "./components/FeatureNode";
import RootNode from "./components/RootNode";
import FeatureEdge from "./components/FeatureEdge";
import AddFeatureModal from "./components/AddFeature";
import AddConstraint from "./components/AddConstraint";
import Constraint from "./components/Constraints";
import { v4 as uuidv4 } from "uuid";
import { exportFeatureModel } from "./components/ExportFeatureModel";
import { importFeatureModel } from "./components/ImportFeatureModel";
import "./i18n";
import { useTranslation } from "react-i18next";
import ErrorModal from "./components/Error";
import { exportFeatureModelImage } from "./components/exportImage";
import { layoutFeatureModel } from "./components/LayoutFeatureModel";
import demoModel from "./demo/multiplayer (1).json";
import { flushSync } from "react-dom";

const CFM_TOOLBOX_BACKEND = "http://193.196.37.174:3001";
// TODO: Make this configurable

const nodeTypes = {
  feature: FeatureNode,
  root: RootNode,
};

const edgeTypes = {
  edge: FeatureEdge,
};

const initialNodes = [
  {
    id: "root",
    type: "root",
    position: { x: 100, y: 100 },
    data: {
      label: "Root Feature",
      featureInstanceCardinalityMin: "1",
      featureInstanceCardinalityMax: "1",
      groupTypeCardinalityMin: "1",
      groupTypeCardinalityMax: "*",
      groupInstanceCardinalityMin: "1",
      groupInstanceCardinalityMax: "*",
      parentId: "0",
    },
  },
  {
    id: "feature",
    type: "feature",
    position: { x: 100, y: 250 },
    data: {
      label: "Feature",
      featureInstanceCardinalityMin: "0",
      featureInstanceCardinalityMax: "1",
      groupTypeCardinalityMin: "1",
      groupTypeCardinalityMax: "*",
      groupInstanceCardinalityMin: "1",
      groupInstanceCardinalityMax: "*",
      parentId: "root",
    },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "root",
    target: "feature",
    type: "edge",
    data: { cardinality: "1..*" },
  },
];

export default function FeatureModelEditor() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
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
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [submenuOpenImport, setSubmenuImportOpen] = useState(false);
  const [submenuOpenExport, setSubmenuExportOpen] = useState(false);
  const fileInputRefUvl = useRef<HTMLInputElement>(null);
  const fileInputRefJson = useRef<HTMLInputElement>(null);
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const exportWrapperRef = useRef<HTMLDivElement>(null);
  const [pendingLayout, setPendingLayout] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    // Load Model from local storage
    const nodes = localStorage.getItem("nodes");
    const edges = localStorage.getItem("edges");
    const constraints = localStorage.getItem("constraints");

    console.log("Loaded: ", nodes, edges, constraints);

    if (nodes) setNodes(JSON.parse(nodes));
    if (edges) setEdges(JSON.parse(edges));
    if (constraints) setConstraints(JSON.parse(constraints));
  }, []);

  useEffect(() => {
    // Store Model in local storage
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
    localStorage.setItem("constraints", JSON.stringify(constraints));
  }, [nodes, edges, constraints]);

      setNodes(nodes);
      setEdges(edges);
      setConstraints(constraints);
      setPendingLayout(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (pendingLayout) {
      handleLayoutFeatureModel();
      setPendingLayout(false);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, pendingLayout]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

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
    const bounds = siblings[siblingCount - 1]
      ? getNodesBounds([siblings[siblingCount - 1]])
      : null;
    const positionY = (parentnode?.position.y || 0) + 150;
    let positionX = 100;
    if (siblingCount === 0) {
      positionX = parentnode?.position.x || 100;
    } else {
      positionX =
        (siblings[siblingCount - 1]?.position.x ||
          parentnode?.position.x ||
          100) +
        (bounds?.width || NODE_WIDTH) +
        offsetX;
    }

    const newNode = {
      id: newId,
      data: {
        label: `${newFeatureName}`,
        featureInstanceCardinalityMin: `${featureInstanceCardinalityMin}`,
        featureInstanceCardinalityMax: `${featureInstanceCardinalityMax}`,
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
    event.stopPropagation(); // prevent event bubbling
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
      // Remove old edges connected to this node
      const edgesWithoutOld = prevEdges.filter(
        (e) => e.target !== selectedNode.id
      );

      // If new parentId is set, add new edge
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
    // Reset Form
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

    // Reset Form
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
  };
  const handleDeleteFeature = () => {
    if (selectedNode) {
      setNodes((prev) => prev.filter((node) => node.id !== selectedNode.id));
      setSelectedNode(null); // if active node is deleted, set to null
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
  };

  const handleExport = () => {
    const json = exportFeatureModel(nodes, constraints);
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

  const handleUvlExport = async () => {
    const json = exportFeatureModel(nodes, constraints);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    };
    let blob;
    const resp = await fetch(
      CFM_TOOLBOX_BACKEND + "/convert/fromjson/uvl/",
      requestOptions
    );
    if (resp.ok) {
      blob = await resp.blob();
    } else {
      setErrorMessage(t("main.exportError") + ": " + resp.statusText);
      setErrorModalOpen(true);
      return;
    }
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "model.uvl";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("Importing file:", file);
    if (!file) return;

    const text = await file.text();
    const json = JSON.parse(text);

    const { nodes, edges, constraints } = importFeatureModel(json);

    setNodes(nodes);
    setEdges(edges);
    setConstraints(constraints);
    setPendingLayout(true);
  };
  const handleUvlImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("featuremodel", file);

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    try {
      const resp = await fetch(
        CFM_TOOLBOX_BACKEND + "/convert/tojson/uvl/",
        requestOptions
      );
      if (resp.ok) {
        const json = await resp.json();
        const { nodes, edges, constraints } = importFeatureModel(json);
        setNodes(nodes);
        setEdges(edges);
        setConstraints(constraints);
        setPendingLayout(true);
      } else {
        const errorText = await resp.text();
        setErrorMessage(t("main.importError") + ": " + resp.statusText);
        setErrorModalOpen(true);
        console.error("Error importing UVL file:", errorText);
      }
    } catch (error) {
      setErrorMessage(t("main.importError") + ": " + error);
      setErrorModalOpen(true);
      console.error("Error importing UVL file:", error);
    }
  };

  const handleLayoutFeatureModel = () => {
    const flatNodes = nodes.map((node) => ({
      id: node.id,
      name: node.data.label,
      parentId: node.data.parentId || null,
    }));

    const positions = layoutFeatureModel(flatNodes, NODE_WIDTH);

    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        position: positions[node.id],
      }))
    );
  };

  return (
    <div className="editor-container">
      <input
        type="file"
        accept=".json"
        ref={fileInputRefJson}
        onChange={handleImport}
        className="hidden-input"
      />
      <input
        type="file"
        accept=".uvl"
        ref={fileInputRefUvl}
        onChange={handleUvlImport}
        className="hidden-input"
      />

      <div className="toolbar">
        <button onClick={openAddFeatureModal} className="button-primary">
          {t("main.addFeature")}
        </button>
        <button onClick={handleLayoutFeatureModel} className="button-primary">
          {t("main.layoutModel")}
        </button>
        <button onClick={() => toggleTheme()} className="button-primary">
          {t("main.switchTheme")} {theme === "light" ? "Dark" : "Light"} Theme
        </button>
        <button
          onClick={() => {
            setIsDropdownOpen(!isDropdownOpen);
            setSubmenuImportOpen(false);
            setSubmenuExportOpen(false);
          }}
          className="dropdown-button"
        >
          <BsThreeDotsVertical size={24} />
        </button>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <ul className="dropdown-list">
              <li
                onMouseEnter={() => setSubmenuImportOpen(true)}
                onMouseLeave={() => setSubmenuImportOpen(false)}
                className="dropdown-item"
              >
                {t("main.import")}

                {submenuOpenImport && (
                  <ul className="submenu">
                    <li>
                      <button
                        onClick={() => fileInputRefJson.current?.click()}
                        className="submenu-button"
                      >
                        {t("main.importJson")}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => fileInputRefUvl.current?.click()}
                        className="submenu-button"
                      >
                        {t("main.importUvl")}
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              <li
                onMouseEnter={() => setSubmenuExportOpen(true)}
                onMouseLeave={() => setSubmenuExportOpen(false)}
                className="dropdown-item"
              >
                {t("main.export")}

                {submenuOpenExport && (
                  <ul className="submenu">
                    <li>
                      <button onClick={handleExport} className="submenu-button">
                        {t("main.exportJson")}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleUvlExport}
                        className="submenu-button"
                      >
                        {t("main.exportUvl")}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          exportFeatureModelImage({
                            nodes,
                            containerRef:
                              exportWrapperRef as React.RefObject<HTMLElement>,
                            constraints,
                            format: "png",
                            fileName: "feature-model",
                          })
                        }
                        className="submenu-button"
                      >
                        {t("main.exportPng")}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          exportFeatureModelImage({
                            nodes,
                            containerRef:
                              exportWrapperRef as React.RefObject<HTMLElement>,
                            constraints,
                            format: "svg",
                            fileName: "feature-model",
                          })
                        }
                        className="submenu-button"
                      >
                        {t("main.exportSvg")}
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>

      {isNodeMenuOpen && nodeMenuPosition && (
        <div
          className="node-menu"
          style={{
            top: nodeMenuPosition.y,
            left: nodeMenuPosition.x,
          }}
        >
          <button
            className="node-menu-close"
            onClick={() => setIsNodeMenuOpen(false)}
          >
            ×
          </button>
          <button onClick={handleCreateChildClick} className="node-menu-item">
            {t("main.createChild")}
          </button>
          <button onClick={handleCreateSiblingClick} className="node-menu-item">
            {t("main.createSibling")}
          </button>
          <div className="node-menu-actions">
            <button onClick={handleEditClick} className="node-menu-edit">
              <BsFillPencilFill />
            </button>
            <button onClick={handleDeleteFeature} className="node-menu-delete">
              <BsFillTrashFill />
            </button>
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

      <div ref={exportWrapperRef} className="editor-flow-wrapper">
        <div ref={reactFlowWrapper} className="editor-flow-inner">
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

      <ErrorModal
        isOpen={errorModalOpen}
        message={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </div>
  );
}
