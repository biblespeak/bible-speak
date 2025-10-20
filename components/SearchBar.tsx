import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { StopIcon } from './icons/StopIcon';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  translations: { [key: string]: string };
  onCancel: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, onCancel, translations }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={translations.searchPlaceholder}
          className="w-full p-4 pr-16 text-lg bg-slate-700 text-slate-100 border-2 border-slate-600 rounded-full focus:ring-amber-500 focus:border-amber-500 transition"
          disabled={isLoading}
        />
        {isLoading ? (
          <button
            type="button"
            onClick={onCancel}
            className="absolute inset-y-0 right-0 flex items-center justify-center w-14 h-14 bg-slate-600 text-slate-100 rounded-full m-1 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 transition"
            aria-label={translations.cancelSearch}
          >
            <StopIcon className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center justify-center w-14 h-14 bg-amber-500 text-slate-900 rounded-full m-1 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-amber-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition"
            disabled={isLoading}
            aria-label={translations.searchButton}
          >
            <SearchIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </form>
  );
};
