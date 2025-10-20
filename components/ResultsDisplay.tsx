
import React from 'react';
import { GroupedVerseResult } from '../types';
import { VerseCard } from './VerseCard';

interface ResultsDisplayProps {
  results: GroupedVerseResult[];
  isLoading: boolean;
  bookmarkedVerses: GroupedVerseResult[];
  onToggleBookmark: (verseGroup: GroupedVerseResult) => void;
  translations: { [key: string]: string };
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading, bookmarkedVerses, onToggleBookmark, translations }) => {
  if (isLoading) {
    return null; // Spinner is handled in App.tsx
  }

  if (results.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-800/50 rounded-lg max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-amber-400 mb-2">{translations.initialMessageTitle}</h3>
        <p className="text-slate-400">{translations.initialMessageBody}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {results.map((verseGroup) => (
        <VerseCard
          key={verseGroup.id}
          verseGroup={verseGroup}
          isBookmarked={bookmarkedVerses.some(v => v.id === verseGroup.id)}
          onToggleBookmark={onToggleBookmark}
          translations={translations}
        />
      ))}
    </div>
  );
};
