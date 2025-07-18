import React from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";

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
  featureInstanceMinError?: boolean;
  setFeatureInstanceMinError?: React.Dispatch<React.SetStateAction<boolean>>;
  featureInstanceMaxError?: boolean;
  setFeatureInstanceMaxError?: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteFeature?: () => void;
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
  featureInstanceMinError = false,
  setFeatureInstanceMinError,
  featureInstanceMaxError = false,
  setFeatureInstanceMaxError,
  onDeleteFeature
}: AddFeatureModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;
  if (selectedNode?.type === "root" && editMode) isRootNode = true;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg z-[10000]">
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? t("feature_modal.editTitle") : t("feature_modal.addTitle")}
        </h2>

        <label className="block mb-2">{t("feature_modal.name")}:</label>
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
          <p className="text-red-600 text-sm">{t("feature_modal.nameRequired")}</p>
        )}

        {!isRootNode && (
          <>
            <label className="block mb-2">{t("feature_modal.featureInstanceCardinality")}:</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="w-1/2 border rounded p-2"
                placeholder={t("feature_modal.min")}
                value={featureInstanceCardinalityMin}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setFeatureInstanceCardinalityMin(value);
                  }
                  if (featureInstanceMinError && setFeatureInstanceMinError) setFeatureInstanceMinError(false);
                }}
              />
              <input
                type="text"
                className="w-1/2 border rounded p-2"
                placeholder={t("feature_modal.max")}
                value={featureInstanceCardinalityMax}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) || value === "*") {
                    setFeatureInstanceCardinalityMax(value);
                  }
                  if (featureInstanceMaxError && setFeatureInstanceMaxError) setFeatureInstanceMaxError(false);
                }}
              />
            </div>
          </>
        )}
        {(featureInstanceMinError || featureInstanceMaxError) && (
          <p className="text-red-600 text-sm">{t("feature_modal.cardinalityRequired")}</p>
        )}

        <label className="block mb-2">{t("feature_modal.groupTypeCardinality")}:</label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="w-1/2 border rounded p-2"
            placeholder={t("feature_modal.min")}
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
            placeholder={t("feature_modal.max")}
            value={groupTypeCardinalityMax}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) || value === "*") {
                setGroupTypeCardinalityMax(value);
              }
            }}
          />
        </div>

        <label className="block mb-2">{t("feature_modal.groupInstanceCardinality")}:</label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="w-1/2 border rounded p-2"
            placeholder={t("feature_modal.min")}
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
            placeholder={t("feature_modal.max")}
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
            <label className="block mb-2">{t("feature_modal.parentFeature")}:</label>
            <select
              className={`w-full border rounded p-2 mb-4 ${parentError ? "border-red-500 mb-2" : "border-gray-300"}`}
              value={parentId}
              onChange={(e) => {
                setParentId(e.target.value);
                if (parentError && setParentError) setParentError(false);
              }}
            >
              <option value="">{t("feature_modal.select")}</option>
              {nodes
                .filter(node => !editMode || node.id !== selectedNode?.id)
                .map(node => (
                  <option key={node.id} value={node.id}>
                    {node.data.label}
                  </option>
                ))}
            </select>
            {parentError && (
              <p className="text-red-600 text-sm">{t("feature_modal.parentRequired")}</p>
            )}
          </>
        )}

        <div className="flex justify-between items-center mt-4">
          {editMode && (
            <button className="flex items-center text-red-600" onClick={onDeleteFeature}>
              <span className="mr-1"><BsFillTrashFill /></span>
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
              {t("feature_modal.cancel")}
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={editMode ? onUpdateFeature : onAddFeature}
            >
              {editMode ? t("feature_modal.save") : t("feature_modal.add")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
