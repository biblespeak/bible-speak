
import React from 'react';
import { GroupedVerseResult } from '../types';
import { VerseCard } from './VerseCard';
import { TrashIcon } from './icons/TrashIcon';

interface SavedItemsProps {
  savedTopics: string[];
  bookmarkedVerses: GroupedVerseResult[];
  onDeleteTopic: (topic: string) => void;
  onToggleBookmark: (verseGroup: GroupedVerseResult) => void;
  onSearchTopic: (topic: string) => void;
  translations: { [key: string]: string };
}

export const SavedItems: React.FC<SavedItemsProps> = ({
  savedTopics,
  bookmarkedVerses,
  onDeleteTopic,
  onToggleBookmark,
  onSearchTopic,
  translations,
}) => {
  return (
    <div className="w-full mt-6 space-y-10">
      {savedTopics.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-center mb-4 text-slate-100">{translations.savedTopics}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {savedTopics.map((topic) => (
              <div key={topic} className="flex items-center bg-slate-700 rounded-full">
                <button
                  onClick={() => onSearchTopic(topic)}
                  className="px-4 py-2 text-amber-400 hover:text-amber-300"
                >
                  {topic}
                </button>
                <button
                  onClick={() => onDeleteTopic(topic)}
                  className="pr-3 pl-2 text-slate-400 hover:text-red-500"
                  aria-label={`${translations.remove} ${topic}`}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {bookmarkedVerses.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-center mb-4 text-slate-100">{translations.bookmarkedVerses}</h2>
          <div className="space-y-6">
            {bookmarkedVerses.map((verseGroup) => (
              <VerseCard
                key={verseGroup.id}
                verseGroup={verseGroup}
                isBookmarked={true}
                onToggleBookmark={onToggleBookmark}
                translations={translations}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
