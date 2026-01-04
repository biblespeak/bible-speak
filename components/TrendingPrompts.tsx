import React from 'react';
import { SparkleIcon } from './icons/SparkleIcon';

interface TrendingPromptsProps {
  prompts: string[];
  isLoading: boolean;
  onPromptClick: (prompt: string) => void;
  translations: { [key: string]: string };
}

const SkeletonLoader: React.FC = () => (
  <div className="w-full bg-slate-700/50 rounded-full h-11 animate-pulse"></div>
);

export const TrendingPrompts: React.FC<TrendingPromptsProps> = ({ prompts, isLoading, onPromptClick, translations }) => {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-4">
      <h3 className="flex items-center gap-2 text-lg text-amber-400 font-semibold tracking-wide">
        <SparkleIcon className="w-5 h-5" />
        {translations.trendingTitle}
      </h3>
      <div className="w-full flex flex-col items-center gap-3">
        {isLoading ? (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : (
          prompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onPromptClick(prompt)}
              className="w-full text-center p-3 bg-slate-800 rounded-full hover:bg-slate-700 hover:border-amber-500 border-2 border-slate-700 transition-all text-slate-300 hover:text-white"
            >
              {prompt}
            </button>
          ))
        )}
      </div>
    </div>
  );
};