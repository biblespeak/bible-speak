import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SavedItems } from './components/SavedItems';
import { AboutSection } from './components/AboutSection';
import { LanguageToggle } from './components/LanguageToggle';
import { findVerses } from './services/geminiService';
import { GroupedVerseResult, Language } from './types';
import { translations } from './translations';
import { LoadingIndicator } from './components/LoadingIndicator';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GroupedVerseResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [savedTopics, setSavedTopics] = useState<string[]>([]);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<GroupedVerseResult[]>([]);
  
  const [showAbout, setShowAbout] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [lastSearchCancelled, setLastSearchCancelled] = useState(false);

  // Ref to uniquely identify each search request to prevent race conditions from old requests.
  const searchIdRef = useRef(0);

  const langTranslations = translations[language];

  useEffect(() => {
    const storedTopics = localStorage.getItem(`bibleSpeak_savedTopics_${language}`);
    if (storedTopics) {
      setSavedTopics(JSON.parse(storedTopics));
    } else {
      setSavedTopics([]);
    }
    const storedBookmarks = localStorage.getItem(`bibleSpeak_bookmarkedVerses_${language}`);
    if (storedBookmarks) {
      setBookmarkedVerses(JSON.parse(storedBookmarks));
    } else {
      setBookmarkedVerses([]);
    }
  }, [language]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    setQuery(searchQuery);
    setShowSaved(false);
    setLastSearchCancelled(false);

    const currentSearchId = ++searchIdRef.current;

    try {
      const result = await findVerses(searchQuery, language);
      // Only update state if this is the most recent, non-cancelled search
      if (searchIdRef.current === currentSearchId) {
        setResults(result);
        if (!savedTopics.includes(searchQuery)) {
          const updatedTopics = [...savedTopics, searchQuery];
          setSavedTopics(updatedTopics);
          localStorage.setItem(`bibleSpeak_savedTopics_${language}`, JSON.stringify(updatedTopics));
        }
      }
    } catch (err) {
      if (searchIdRef.current === currentSearchId) {
        setError(err instanceof Error ? err.message : translations[language].error);
      }
    } finally {
      if (searchIdRef.current === currentSearchId) {
        setIsLoading(false);
      }
    }
  }, [language, savedTopics]);

  const handleCancelSearch = useCallback(() => {
    searchIdRef.current++; // Invalidate the current search
    setIsLoading(false);
    setError(null);
    setLastSearchCancelled(true);
  }, []);

  // Re-runs the search with the new language if a query already exists and wasn't cancelled.
  useEffect(() => {
    if (query && !lastSearchCancelled) {
      handleSearch(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);
  
  const toggleBookmark = useCallback((verseGroup: GroupedVerseResult) => {
    const isBookmarked = bookmarkedVerses.some(v => v.id === verseGroup.id);
    let updatedBookmarks;
    if (isBookmarked) {
      updatedBookmarks = bookmarkedVerses.filter(v => v.id !== verseGroup.id);
    } else {
      updatedBookmarks = [...bookmarkedVerses, verseGroup];
    }
    setBookmarkedVerses(updatedBookmarks);
    localStorage.setItem(`bibleSpeak_bookmarkedVerses_${language}`, JSON.stringify(updatedBookmarks));
  }, [language, bookmarkedVerses]);

  const deleteSavedTopic = useCallback((topic: string) => {
    const updatedTopics = savedTopics.filter(t => t !== topic);
    setSavedTopics(updatedTopics);
    localStorage.setItem(`bibleSpeak_savedTopics_${language}`, JSON.stringify(updatedTopics));
  }, [language, savedTopics]);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-300">
      <header className="p-4 flex justify-between items-center sticky top-0 bg-slate-900/80 backdrop-blur-sm z-10">
        <button onClick={() => setShowAbout(true)} className="text-sm text-slate-400 hover:text-amber-500">
          {langTranslations.about}
        </button>
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 hidden sm:block">
          BIBLE SPEAK
        </h1>
        <LanguageToggle language={language} setLanguage={setLanguage} />
      </header>

      <main className="container mx-auto p-4 flex flex-col items-center gap-8">
        <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                {langTranslations.title}
            </h2>
            <p className="text-slate-400 mt-2 max-w-2xl">{langTranslations.blurb}</p>
        </div>
        
        <div className="w-full max-w-2xl flex flex-col items-center gap-6 p-6 bg-slate-800/50 rounded-lg">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} translations={langTranslations} onCancel={handleCancelSearch} />
        </div>
        
        {isLoading && <LoadingIndicator translations={langTranslations} />}
        {error && <p className="text-red-500 bg-red-900/50 p-4 rounded-md">{error}</p>}
        
        <div className="w-full max-w-5xl">
          <ResultsDisplay 
            results={results}
            isLoading={isLoading}
            bookmarkedVerses={bookmarkedVerses}
            onToggleBookmark={toggleBookmark}
            translations={langTranslations}
          />
        </div>
        
        {(savedTopics.length > 0 || bookmarkedVerses.length > 0) && (
            <div className="w-full max-w-5xl">
                <button 
                    onClick={() => setShowSaved(!showSaved)}
                    className="w-full text-center p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                >
                    {showSaved ? langTranslations.hide : langTranslations.show} {langTranslations.savedTopics} &amp; {langTranslations.bookmarkedVerses}
                </button>
                {showSaved && (
                    <SavedItems 
                        savedTopics={savedTopics}
                        bookmarkedVerses={bookmarkedVerses}
                        onDeleteTopic={deleteSavedTopic}
                        onToggleBookmark={toggleBookmark}
                        onSearchTopic={handleSearch}
                        translations={langTranslations}
                    />
                )}
            </div>
        )}

      </main>
      
      {showAbout && <AboutSection onClose={() => setShowAbout(false)} translations={langTranslations} />}

      <footer className="text-center p-4 text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Bible Speak. All Rights Reserved.
      </footer>
    </div>
  );
}

export default App;