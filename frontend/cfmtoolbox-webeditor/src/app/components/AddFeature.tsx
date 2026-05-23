import React from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import CompoundIntervalInput from "./CompoundIntervalInputField";
import { CompoundInterval } from "../types/FeatureModel";

interface AddFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFeature: () => void;
  newFeatureName: string;
  setNewFeatureName: React.Dispatch<React.SetStateAction<string>>;
  featureInstanceCardinality: CompoundInterval;
  setFeatureInstanceCardinality: React.Dispatch<React.SetStateAction<CompoundInterval>>;
  groupTypeCardinality: CompoundInterval;
  setGroupTypeCardinality: React.Dispatch<React.SetStateAction<CompoundInterval>>;
  groupInstanceCardinality: CompoundInterval;
  setGroupInstanceCardinality: React.Dispatch<React.SetStateAction<CompoundInterval>>;
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
  featureInstanceError?: boolean;
  setFeatureInstanceError?: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteFeature?: () => void;
}

export default function AddFeatureModal({
  isOpen,
  onClose,
  onAddFeature,
  newFeatureName,
  setNewFeatureName,
  featureInstanceCardinality,
  setFeatureInstanceCardinality,
  groupTypeCardinality,
  setGroupTypeCardinality,
  groupInstanceCardinality,
  setGroupInstanceCardinality,
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
  featureInstanceError = false,
  setFeatureInstanceError,
  onDeleteFeature
}: AddFeatureModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;
  if (selectedNode?.type === "root" && editMode) isRootNode = true;

  return (
    <div className="feature-modal__overlay">
      <div className="feature-modal__container">
        <h2 className="feature-modal__title">
          {editMode ? t("feature_modal.editTitle") : t("feature_modal.addTitle")}
        </h2>

        <label className="feature-modal__label">{t("feature_modal.name")}:</label>
        <input
          type="text"
          className={`feature-modal__input feature-modal__input--mb ${nameError ? "feature-modal__input--error" : ""}`}
          value={newFeatureName}
          onChange={(e) => {
            setNewFeatureName(e.target.value);
            if (nameError && setNameError) setNameError(false);
          }}
        />
        {nameError && (
          <p className="feature-modal__error">{t("feature_modal.nameRequired")}</p>
        )}

        {!isRootNode && (
          <>
            <label className="feature-modal__label">{t("feature_modal.featureInstanceCardinality")}:</label>
            <div className="feature-modal__flex">
              <CompoundIntervalInput
                compoundInterval={featureInstanceCardinality}
                setCompoundInterval={setFeatureInstanceCardinality}
                setCompoundIntervalParseError={setFeatureInstanceError}
              />
            </div>
          </>
        )}
        {(featureInstanceError) && (
          <p className="feature-modal__error">{t("feature_modal.cardinalityRequired")}</p>
        )}

        <label className="feature-modal__label">{t("feature_modal.groupTypeCardinality")}:</label>
        <div className="feature-modal__flex">
          <CompoundIntervalInput
            compoundInterval={groupTypeCardinality}
            setCompoundInterval={setGroupTypeCardinality}
          />
        </div>

        <label className="feature-modal__label">{t("feature_modal.groupInstanceCardinality")}:</label>
        <div className="feature-modal__flex">
          <CompoundIntervalInput
            compoundInterval={groupInstanceCardinality}
            setCompoundInterval={setGroupInstanceCardinality}
          />
        </div>

        {!isRootNode && (
          <>
            <label className="feature-modal__label">{t("feature_modal.parentFeature")}:</label>
            <select
              className={`feature-modal__select feature-modal__input--mb ${parentError ? "feature-modal__input--error" : ""}`}
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
              <p className="feature-modal__error">{t("feature_modal.parentRequired")}</p>
            )}
          </>
        )}

        <div className="feature-modal__footer">
          {editMode && (
            <button className="feature-modal__btn feature-modal__btn--icon" onClick={onDeleteFeature}>
              <BsFillTrashFill />
            </button>
          )}
          <div className="feature-modal__actions">
            <button className="feature-modal__btn feature-modal__btn--cancel" onClick={onClose}>
              {t("feature_modal.cancel")}
            </button>
            <button
              className="feature-modal__btn feature-modal__btn--primary"
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
