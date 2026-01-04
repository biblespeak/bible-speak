import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface HistorySectionProps {
  onClose: () => void;
  translations: { [key: string]: string };
}

export const HistorySection: React.FC<HistorySectionProps> = ({ onClose, translations }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-2xl w-full relative border border-slate-700 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
          aria-label={translations.close}
        >
          <CloseIcon className="h-6 w-6" />
        </button>
        <div className="prose prose-invert prose-lg max-w-none">
          <h2 className="text-amber-400">{translations.historyTitle}</h2>
          <p className="text-slate-300 whitespace-pre-line leading-relaxed">
            {translations.historyContent}
          </p>
        </div>
      </div>
    </div>
  );
};