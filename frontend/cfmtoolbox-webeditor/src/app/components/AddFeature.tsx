import React, { useEffect, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { CompoundInterval, Interval } from "../types/FeatureModel";

class CompoundIntervalParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompoundIntervalParseError';
    Object.setPrototypeOf(this, CompoundIntervalParseError.prototype);
  }
}

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

  const compoundIntervalToText = (compoundInterval: CompoundInterval) => compoundInterval?.map((interval: Interval) => {
    return "[" + interval.lower + "," + interval.upper + "]";
  }).join("")

  const parseCompoundInterval = (text: string): CompoundInterval => {
    if (text === "") return [];

    text = text.replaceAll(/^\[|\]$/g, ''); // Remove leading and trailing interval brackets
    const singleIntervalTexts: string[] = text.split("]["); // Split between each interval
    return singleIntervalTexts.map((intervalText) => {
      const minMaxPair = intervalText.split(","); // Split number pair inside each interval
      const min = minMaxPair[0];
      const max = minMaxPair[1];

      // Check if input is valid
      // !( min && !max ==> max==*)
      if (!(Number.isInteger(Number(min)) && (Number.isInteger(Number(max)) || max === "*"))
        || min === "" || max === "") {
        console.log(minMaxPair);
        throw new CompoundIntervalParseError("Error parsing " + minMaxPair);
      }

      return {
        lower: min,
        upper: max
      }
    });
  };

  const [featureInstanceCardinalityText, setFeatureInstanceCardinalityText] = useState(compoundIntervalToText(featureInstanceCardinality));
  const [groupTypeCardinalityText, setGroupTypeCardinalityText] = useState(compoundIntervalToText(groupTypeCardinality));
  const [groupInstanceCardinalityText, setGroupInstanceCardinalityText] = useState(compoundIntervalToText(groupInstanceCardinality));

  useEffect(() => {
    setFeatureInstanceCardinalityText(compoundIntervalToText(featureInstanceCardinality));
  }, [featureInstanceCardinality]);
  useEffect(() => {
    setGroupTypeCardinalityText(compoundIntervalToText(groupTypeCardinality));
  }, [groupTypeCardinality]);
  useEffect(() => {
    setGroupInstanceCardinalityText(compoundIntervalToText(groupInstanceCardinality));
  }, [groupInstanceCardinality]);

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
              <input
                type="text"
                className="feature-modal__input"
                placeholder="[1,2][4,6][9,*]"
                value={featureInstanceCardinalityText}
                onChange={(e) => {
                  setFeatureInstanceCardinalityText(e.target.value);
                  try {
                    const intervals = parseCompoundInterval(e.target.value);
                    setFeatureInstanceCardinality(intervals);
                    if (setFeatureInstanceError) setFeatureInstanceError(false);
                  } catch (error) {
                    if (error instanceof CompoundIntervalParseError) {
                      console.log(error.message);
                      if (setFeatureInstanceError) setFeatureInstanceError(true);
                    } else {
                      throw error;
                    }
                  }
                }}
              />
            </div>
          </>
        )}
        {(featureInstanceError) && (
          <p className="feature-modal__error">{t("feature_modal.cardinalityRequired")}</p>
        )}

        <label className="feature-modal__label">{t("feature_modal.groupTypeCardinality")}:</label>
        <div className="feature-modal__flex">
          <input
            type="text"
            className="feature-modal__input feature-modal__input"
            placeholder="[1,2][4,6]][9,*]"
            value={groupTypeCardinalityText}
            onChange={(e) => {
              setGroupTypeCardinalityText(e.target.value);
              try {
                const intervals = parseCompoundInterval(e.target.value);
                setGroupTypeCardinality(intervals);
              } catch (error) {
                if (error instanceof CompoundIntervalParseError) {
                  console.log(error.message);
                } else {
                  throw error;
                }
              }
            }}
          />
        </div>

        <label className="feature-modal__label">{t("feature_modal.groupInstanceCardinality")}:</label>
        <div className="feature-modal__flex">
          <input
            type="text"
            className="feature-modal__input feature-modal__input"
            placeholder={t("feature_modal.min")}
            value={groupInstanceCardinalityText}
            onChange={(e) => {
              setGroupInstanceCardinalityText(e.target.value);
              try {
                const intervals = parseCompoundInterval(e.target.value);
                setGroupInstanceCardinality(intervals);
              } catch (error) {
                if (error instanceof CompoundIntervalParseError) {
                  console.log(error.message);
                } else {
                  throw error;
                }
              }
            }}
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
