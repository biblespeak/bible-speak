import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface AboutSectionProps {
  onClose: () => void;
  translations: { [key: string]: string };
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onClose, translations }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-3xl w-full relative border border-slate-700 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
          aria-label={translations.close}
        >
          <CloseIcon className="h-6 w-6" />
        </button>
        <div className="prose prose-invert prose-amber max-w-none">
          <h2 className="text-amber-400 border-b border-slate-700 pb-2">{translations.aboutTitle}</h2>
          
          <div className="space-y-8 mt-6">
            <section>
              <h3 className="text-amber-500 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block"></span>
                {translations.aboutPurposeTitle}
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed">{translations.aboutPurposeBody}</p>
            </section>

            <section>
              <h3 className="text-amber-500 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block"></span>
                {translations.aboutGuideTitle}
              </h3>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <p className="text-slate-300 whitespace-pre-line leading-relaxed italic">
                  {translations.aboutGuideBody}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-amber-500 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block"></span>
                {translations.aboutDoctrineTitle}
              </h3>
              <p className="text-slate-300 leading-relaxed">{translations.aboutDoctrineBody}</p>
            </section>

            <section>
              <h3 className="text-amber-500 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block"></span>
                {translations.aboutMethodTitle}
              </h3>
              <p className="text-slate-300 leading-relaxed">{translations.aboutMethodBody}</p>
            </section>

            <section className="bg-amber-900/10 p-6 rounded-xl border border-amber-900/30">
              <h3 className="text-amber-400 flex items-center gap-2 mt-0">
                <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
                {translations.aboutSpiritTitle}
              </h3>
              <p className="text-slate-200 leading-relaxed font-medium">
                {translations.aboutSpiritBody}
              </p>
            </section>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-700 flex justify-center">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-slate-700 text-slate-100 rounded-full hover:bg-amber-600 hover:text-slate-900 transition-all font-bold"
            >
                {translations.close}
            </button>
        </div>
      </div>
    </div>
  );
};