import React from "react";
import { useTranslation } from "react-i18next";

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
  feature1Error?: boolean;
  setFeature1Error?: React.Dispatch<React.SetStateAction<boolean>>;
  feature2Error?: boolean;
  setFeature2Error?: React.Dispatch<React.SetStateAction<boolean>>;
  card1MinError?: boolean;
  setCard1MinError?: React.Dispatch<React.SetStateAction<boolean>>;
  card1MaxError?: boolean;
  setCard1MaxError?: React.Dispatch<React.SetStateAction<boolean>>;
  card2MinError?: boolean;
  setCard2MinError?: React.Dispatch<React.SetStateAction<boolean>>;
  card2MaxError?: boolean;
  setCard2MaxError?: React.Dispatch<React.SetStateAction<boolean>>;
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
  feature1Error = false,
  setFeature1Error,
  feature2Error = false,
  setFeature2Error,
  card1MinError = false,
  setCard1MinError,
  card1MaxError = false,
  setCard1MaxError,
  card2MinError = false,
  setCard2MinError,
  card2MaxError = false,
  setCard2MaxError,
  nodes,
  isEditMode = false,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">
          {isEditMode ? t('constraint_modal.editTitle') : t('constraint_modal.addTitle')}
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Feature 1 */}
          <div>
            <label className="text-sm font-medium">{t('constraint_modal.feature1')}</label>
            <select
              value={feature1}
              onChange={(e) => {
                setFeature1(e.target.value);
                if (feature1Error && setFeature1Error) setFeature1Error(false);
              }}
              className="w-full border p-2 rounded"
            >
              <option value="">{t('constraint_modal.select')}</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.data.label}</option>
              ))}
            </select>
            {feature1Error && (
              <p className="text-red-600 text-sm">{t('constraint_modal.feature1Error')}</p>
            )}
          </div>

          {/* Kardinalität 1 */}
          <div>
            <label className="text-sm font-medium">{t('constraint_modal.cardinality')}</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('constraint_modal.min')}
                value={card1Min}
                onChange={e => {
                  if (/^\d*$/.test(e.target.value)) {
                    setCard1Min(e.target.value);
                    if (card1MinError && setCard1MinError) setCard1MinError(false);
                  }
                }}
                className="w-1/2 border p-2 rounded"
              />
              <input
                type="text"
                placeholder={t('constraint_modal.max')}
                value={card1Max}
                onChange={e => {
                  if (/^\d*$/.test(e.target.value) || e.target.value === "*") {
                    setCard1Max(e.target.value);
                    if (card1MaxError && setCard1MaxError) setCard1MaxError(false);
                  }
                }}
                className="w-1/2 border p-2 rounded "
              />
            </div>
            {(card1MinError || card1MaxError) && (
              <p className="text-red-600 text-sm">{t('constraint_modal.cardinalityError')}</p>
            )}
          </div>

          {/* Beziehung */}
          <div className="col-span-2">
            <label className="text-sm font-medium">{t('constraint_modal.relation')}</label>
            <select
              value={relation}
              onChange={e => setRelation(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="requires">{t('constraint_modal.requires')}</option>
              <option value="excludes">{t('constraint_modal.excludes')}</option>
            </select>
          </div>

          {/* Feature 2 */}
          <div>
            <label className="text-sm font-medium">{t('constraint_modal.feature2')}</label>
            <select
              value={feature2}
              onChange={e => {
                setFeature2(e.target.value);
                if (feature2Error && setFeature2Error) setFeature2Error(false);
              }}
              className="w-full border p-2 rounded"
            >
              <option value="">{t('constraint_modal.select')}</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.data.label}</option>
              ))}
            </select>
            {feature2Error && (
              <p className="text-red-600 text-sm">{t('constraint_modal.feature2Error')}</p>
            )}
          </div>

          {/* Kardinalität 2 */}
          <div>
            <label className="text-sm font-medium">{t('constraint_modal.cardinality')}</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('constraint_modal.min')}
                value={card2Min}
                onChange={e => {
                  if (/^\d*$/.test(e.target.value)) {
                    setCard2Min(e.target.value);
                    if (card2MinError && setCard2MinError) setCard2MinError(false);
                  }
                }}
                className="w-1/2 border p-2 rounded "
              />
              <input
                type="text"
                placeholder={t('constraint_modal.max')}
                value={card2Max}
                onChange={e => {
                  if (/^\d*$/.test(e.target.value) || e.target.value === "*") {
                    setCard2Max(e.target.value);
                    if (card2MaxError && setCard2MaxError) setCard2MaxError(false);
                  }
                }}
                className="w-1/2 border p-2 rounded "
              />
            </div>
            {(card2MinError || card2MaxError) && (
              <p className="text-red-600 text-sm">{t('constraint_modal.cardinalityError')}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            {t('constraint_modal.cancel')}
          </button>
          <button onClick={onAddConstraint} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {isEditMode ? t('constraint_modal.save') : t('constraint_modal.add')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConstraintModal;
