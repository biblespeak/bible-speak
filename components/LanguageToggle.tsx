
import React from 'react';
import { Language } from '../types';

interface LanguageToggleProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, setLanguage }) => {
  const languages: { id: Language; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'ko', label: '한국어' },
  ];

  return (
    <div className="flex items-center space-x-1 bg-slate-700 rounded-full p-1">
      {languages.map((lang) => (
        <button
          key={lang.id}
          onClick={() => setLanguage(lang.id)}
          className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
            language === lang.id
              ? 'bg-amber-500 text-slate-900'
              : 'text-slate-300 hover:bg-slate-600'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
