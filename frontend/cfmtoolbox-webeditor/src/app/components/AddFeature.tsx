import React from "react";

interface AddFeatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddFeature: () => void;
    newFeatureName: string;
    setNewFeatureName: React.Dispatch<React.SetStateAction<string>>;
    featureInstanceCardinalityMin: string;
    setFeatureInstanceCardinalityMin: React.Dispatch<React.SetStateAction<string>>;
    featureInstanceCardinalityMax: string;
    setFeatureInstanceCardinalityMax: React.Dispatch<React.SetStateAction<string>>;
    groupTypeCardinalityMin: string;
    setGroupTypeCardinalityMin: React.Dispatch<React.SetStateAction<string>>;
    groupTypeCardinalityMax: string;
    setGroupTypeCardinalityMax: React.Dispatch<React.SetStateAction<string>>;
    groupInstanceCardinalityMin: string;
    setGroupInstanceCardinalityMin: React.Dispatch<React.SetStateAction<string>>;
    groupInstanceCardinalityMax: string;
    setGroupInstanceCardinalityMax: React.Dispatch<React.SetStateAction<string>>;
    parentId: string;
    setParentId: React.Dispatch<React.SetStateAction<string>>;
    nodes: any[];
    onUpdateFeature?: () => void;
    editMode?: boolean;
    selectedNode?: any;
    isRootNode?: boolean;
    nameError?: boolean;
    setNameError?: React.Dispatch<React.SetStateAction<boolean>>;
    parentError?: boolean;
    setParentError?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddFeatureModal({
    isOpen,
    onClose,
    onAddFeature,
    newFeatureName,
    setNewFeatureName,
    featureInstanceCardinalityMin,
    setFeatureInstanceCardinalityMin,
    featureInstanceCardinalityMax,
    setFeatureInstanceCardinalityMax,
    groupInstanceCardinalityMin,
    setGroupInstanceCardinalityMin,
    groupInstanceCardinalityMax,
    setGroupInstanceCardinalityMax,
    groupTypeCardinalityMin,
    setGroupTypeCardinalityMin,
    groupTypeCardinalityMax,
    setGroupTypeCardinalityMax,
    parentId,
    setParentId,
    nodes,
    onUpdateFeature,
    editMode,
    selectedNode,
    isRootNode = false,
    nameError = false,
    setNameError,
    parentError = false,
    setParentError,
}: AddFeatureModalProps) {
    if (!isOpen) return null;

    if (selectedNode?.type === "root" && editMode) {
        isRootNode = true;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg z-[10000]">
                <h2 className="text-xl font-semibold mb-4">
                    {editMode ? "Feature bearbeiten" : "Neues Feature hinzufügen"}
                </h2>

                <label className="block mb-2">Name:</label>
                <input
                    type="text"
                    className={`w-full border rounded p-2 mb-4 ${nameError ? "border-red-500 mb-2" : "border-gray-300"}`}
                    value={newFeatureName}
                    onChange={(e) => {
                        setNewFeatureName(e.target.value);
                        if (nameError && setNameError) setNameError(false);
                    }}
                />
                {nameError && (
                    <p className="text-red-600 text-sm ">Name ist ein Pflichtfeld.</p>
                )}


                {!isRootNode && (
                    <>
                        <label className="block mb-2">Feature-Instanzkardinalität:</label>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                className="w-1/2 border rounded p-2"
                                placeholder="Min"
                                value={featureInstanceCardinalityMin}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setFeatureInstanceCardinalityMin(value);
                                    }
                                }}
                            />
                            <input
                                type="text"
                                className="w-1/2 border rounded p-2"
                                placeholder="Max"
                                value={featureInstanceCardinalityMax}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value) || value === "*") {
                                        setFeatureInstanceCardinalityMax(value);
                                    }
                                }}
                            />
                        </div>
                    </>
                )}
                <label className="block mb-2">Gruppentypkardinalität:</label>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        className="w-1/2 border rounded p-2"
                        placeholder="Min"
                        value={groupTypeCardinalityMin}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                setGroupTypeCardinalityMin(value);
                            }
                        }}
                    />
                    <input
                        type="text"
                        className="w-1/2 border rounded p-2"
                        placeholder="Max"
                        value={groupTypeCardinalityMax}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) || value === "*") {
                                setGroupTypeCardinalityMax(value);
                            }
                        }}
                    />
                </div>

                <label className="block mb-2">Gruppeninstanzkardinalität:</label>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        className="w-1/2 border rounded p-2"
                        placeholder="Min"
                        value={groupInstanceCardinalityMin}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                setGroupInstanceCardinalityMin(value);
                            }
                        }}
                    />
                    <input
                        type="text"
                        className="w-1/2 border rounded p-2"
                        placeholder="Max"
                        value={groupInstanceCardinalityMax}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) || value === "*") {
                                setGroupInstanceCardinalityMax(value);
                            }
                        }}
                    />
                </div>
                {!isRootNode && (
                    <>
                        <label className="block mb-2">Parent Feature:</label>
                        <select
                            className={`w-full border rounded p-2 mb-4 ${parentError ? "border-red-500 mb-2" : "border-gray-300"}"`}
                            value={parentId}
                            onChange={(e) => {
                                setParentId(e.target.value);
                                if (parentError && setParentError) setParentError(false);

                            }}
                        >
                            <option value="">-- Bitte wählen --</option>
                            {nodes
                                .filter(node => !editMode || node.id !== selectedNode?.id)  // Filter raus, wenn editMode und node ist aktueller Node
                                .map(node => (
                                    <option key={node.id} value={node.id}>
                                        {node.data.label}
                                    </option>
                                ))}
                        </select>
                        {parentError && (
                    <p className="text-red-600 text-sm ">Parent Feature ist ein Pflichtfeld.</p>
                )}
                    </>
                )}


                <div className="flex justify-end gap-2">
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
                        Abbrechen
                    </button>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={editMode ? onUpdateFeature : onAddFeature}
                    >
                        {editMode ? "Speichern" : "Hinzufügen"}
                    </button>
                </div>
            </div>
        </div>
    );
}
