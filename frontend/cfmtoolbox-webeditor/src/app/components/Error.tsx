import React from "react";
import { useTranslation } from "react-i18next";

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function ErrorModal({ isOpen, message, onClose }: ErrorModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="error-modal-overlay">
      <div className="error-modal-container">
        <h2 className="error-modal-title">{t("error_modal.title")}</h2>
        <p className="error-modal-message">{message}</p>
        <div className="error-modal-actions">
          <button onClick={onClose} className="error-modal-close-btn">
            {t("error_modal.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
