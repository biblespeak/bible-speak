import React from 'react';
import { Spinner } from './Spinner';

interface LoadingIndicatorProps {
  translations: { [key: string]: string };
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ translations }) => {
  return (
    <div className="text-center p-8 bg-slate-800/50 rounded-lg max-w-2xl mx-auto w-full flex flex-col items-center gap-4">
      <Spinner />
      <h3 className="text-2xl font-bold text-amber-400">{translations.loadingTitle}</h3>
      <p className="text-slate-400">{translations.loadingBody}</p>
      <p className="text-sm text-slate-500">{translations.loadingTime}</p>
    </div>
  );
};
