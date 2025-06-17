
import React from "react";

interface AddFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFeature: () => void;
  newFeatureName: string;
  setNewFeatureName: React.Dispatch<React.SetStateAction<string>>;
  cardinality: string;
  setCardinality: React.Dispatch<React.SetStateAction<string>>;
  parentId: string;
  setParentId: React.Dispatch<React.SetStateAction<string>>;
  nodes: any[];
}

export default function AddFeatureModal({
  isOpen,
  onClose,
  onAddFeature,
  newFeatureName,
  setNewFeatureName,
  cardinality,
  setCardinality,
  parentId,
  setParentId,
  nodes,
}: AddFeatureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg z-[10000]">
        <h2 className="text-xl font-semibold mb-4">Neues Feature hinzufügen</h2>

        <label className="block mb-2">Name:</label>
        <input
          type="text"
          className="w-full border rounded p-2 mb-4"
          value={newFeatureName}
          onChange={(e) => setNewFeatureName(e.target.value)}
        />

        <label className="block mb-2">Kardinalität:</label>
        <input
          type="text"
          className="w-full border rounded p-2 mb-4"
          value={cardinality}
          onChange={(e) => setCardinality(e.target.value)}
        />

        <label className="block mb-2">Parent Node:</label>
        <select
          className="w-full border rounded p-2 mb-4"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        >
          <option value="">-- Bitte wählen --</option>
          {nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.data.label}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onClose}
          >
            Abbrechen
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={onAddFeature}
          >
            Hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
}
