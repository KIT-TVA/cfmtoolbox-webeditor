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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h2 className="text-xl font-semibold text-red-600 mb-4">{t('error_modal.title')}</h2>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {t('error_modal.close')}
                    </button>
                </div>
            </div>
        </div>
    );
}
