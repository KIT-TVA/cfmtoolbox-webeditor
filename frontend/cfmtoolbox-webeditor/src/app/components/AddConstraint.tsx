import React from "react";

interface ConstraintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddConstraint: () => void;
  feature1: string;
  setFeature1: (val: string) => void;
  card1Min: string;
  setCard1Min: (val: string) => void;
  card1Max: string;
  setCard1Max: (val: string) => void;
  relation: string;
  setRelation: (val: string) => void;
  feature2: string;
  setFeature2: (val: string) => void;
  card2Min: string;
  setCard2Min: (val: string) => void;
  card2Max: string;
  setCard2Max: (val: string) => void;
  nodes: any[];
  isEditMode?: boolean;
}

const ConstraintModal: React.FC<ConstraintModalProps> = ({
  isOpen,
  onClose,
  onAddConstraint,
  feature1,
  setFeature1,
  card1Min,
  setCard1Min,
  card1Max,
  setCard1Max,
  relation,
  setRelation,
  feature2,
  setFeature2,
  card2Min,
  setCard2Min,
  card2Max,
  setCard2Max,
  nodes,
  isEditMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">
            {isEditMode ? 'Constraint bearbeiten' : 'Constraint hinzufügen'}
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium">Feature 1</label>
            <select value={feature1} onChange={e => setFeature1(e.target.value)} className="w-full border p-2 rounded">
              <option value="">Wählen...</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.data.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Kardinalität</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Min"
                value={card1Min}
                onChange={e => /^\d*$/.test(e.target.value) && setCard1Min(e.target.value)}
                className="w-1/2 border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Max"
                value={card1Max}
                onChange={e => (/^\d*$/.test(e.target.value) || e.target.value === "*") && setCard1Max(e.target.value)}
                className="w-1/2 border p-2 rounded"
              />
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium">Beziehung</label>
            <select value={relation} onChange={e => setRelation(e.target.value)} className="w-full border p-2 rounded">
              <option value="requires">requires</option>
              <option value="excludes">excludes</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Feature 2</label>
            <select value={feature2} onChange={e => setFeature2(e.target.value)} className="w-full border p-2 rounded">
              <option value="">Wählen...</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.data.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Kardinalität</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Min"
                value={card2Min}
                onChange={e => /^\d*$/.test(e.target.value) && setCard2Min(e.target.value)}
                className="w-1/2 border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Max"
                value={card2Max}
                onChange={e => (/^\d*$/.test(e.target.value) || e.target.value === "*") && setCard2Max(e.target.value)}
                className="w-1/2 border p-2 rounded"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Abbrechen</button>
          <button onClick={onAddConstraint} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {isEditMode ? 'Speichern' : 'Hinzufügen'}
        </button>
        </div>
      </div>
    </div>
  );
};

export default ConstraintModal;
