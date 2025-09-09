import React from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";

export interface Constraint {
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
  nodes: { id: string; data: { label: string } }[];
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
  const { t } = useTranslation();

  const getNodeLabel = (id: string) =>
    nodes.find((n) => n.id === id)?.data.label ?? t("constraints.unknown");

  return (
    <div className="constraint-list">
      <div className="constraint-list__header">
        <h2>{t('constraints.title')}</h2>
        <button
          onClick={onAddClick}
          className="constraint-list__add-btn"
          title={t('constraints.add')}
        >
          +
        </button>
      </div>

      {constraints.length === 0 ? (
        <p className="constraint-list__empty">{t('constraints.noConstraints')}</p>
      ) : (
        <ul className="constraint-list__items">
          {constraints.map((c) => (
            <li key={c.id} className="constraint-list__item">
              <span>
                {getNodeLabel(c.source)} {"<"}
                {c.card1Min}...{c.card1Max}
                {">"} <strong>{t(`constraints.relation.${c.relation}`)}</strong>{" "}
                {getNodeLabel(c.target)} {"<"}
                {c.card2Min}...{c.card2Max}
                {">"}
              </span>
              <div className="constraint-list__actions">
                <button
                  onClick={() => onEdit(c.id)}
                  className="constraint-list__edit-btn"
                  title={t("constraints.edit")}
                >
                  <BsFillPencilFill />
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="constraint-list__delete-btn"
                  title={t("constraints.delete")}
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
