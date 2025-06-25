import React from "react";
import { BsFillTrashFill, BsFillPencilFill  } from "react-icons/bs";


interface Constraint {
  id: string;
  source: string;
  target: string;
  relation: string;
  card1Min: string;
  card1Max: string;
  card2Min: string;
  card2Max: string;
}

interface ConstraintListProps {
  constraints: Constraint[];
  nodes: any[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export default function ConstraintList({
  constraints,
  nodes,
  onEdit,
  onDelete,
  onAddClick,
}: ConstraintListProps) {
  return (
    <div className="h-[20%] bg-gray-100 border-t border-gray-300 p-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold">Constraints</h2>
        <button
          onClick={onAddClick}
          className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700"
          title="Constraint hinzufügen"
        >
          +
        </button>
      </div>
      {constraints.length === 0 ? (
        <p className="text-gray-500">Keine Constraints vorhanden.</p>
      ) : (
        <ul className="space-y-2">
          {constraints.map((c) => (
            <li
              key={c.id}
              className="flex justify-between items-center bg-white p-2 rounded shadow"
            >
              <span>
                {nodes.find((node) => node.id === c.source)?.data.label}{" "}
                {"<"}
                {c.card1Min}...{c.card1Max}
                {">"} <strong>{c.relation}</strong>{" "}
                {nodes.find((node) => node.id === c.target)?.data.label}{" "}
                {"<"}
                {c.card2Min}...{c.card2Max}
                {">"}
              </span>
              <div className="space-x-2 text-sm">
                <button
                  onClick={() => onEdit(c.id)}
                  className="text-blue-600 "
                >
                  <BsFillPencilFill />
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="text-red-600 "
                >
                  <BsFillTrashFill />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
