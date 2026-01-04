import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SavedItems } from './components/SavedItems';
import { AboutSection } from './components/AboutSection';
import { HistorySection } from './components/HistorySection';
import { WordOfGodSection } from './components/WordOfGodSection';
import { LanguageToggle } from './components/LanguageToggle';
import { findVerses, getTrendingPrompts } from './services/geminiService';
import { GroupedVerseResult, Language } from './types';
import { translations } from './translations';
import { LoadingIndicator } from './components/LoadingIndicator';
import { InAppBrowserMessage } from './components/InAppBrowserMessage';
import { TrendingPrompts } from './components/TrendingPrompts';

declare global {
  interface AIStudio {
    openSelectKey: () => Promise<void>;
    hasSelectedApiKey: () => Promise<boolean>;
  }

  interface Window {
    aistudio?: AIStudio;
    Kakao: any; // Add Kakao to the window interface
  }
}

function App() {
  const [query, setQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [results, setResults] = useState<GroupedVerseResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  const [savedTopics, setSavedTopics] = useState<string[]>([]);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<GroupedVerseResult[]>([]);
  
  const [showAbout, setShowAbout] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showWordOfGod, setShowWordOfGod] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [lastSearchCancelled, setLastSearchCancelled] = useState(false);

  const [trendingPrompts, setTrendingPrompts] = useState<string[]>([]);
  const [promptsLoading, setPromptsLoading] = useState(true);

  const searchIdRef = useRef(0);
  const langTranslations = translations[language];

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    if (/KAKAOTALK/i.test(userAgent)) {
      const kakaoIntentUrl = `kakaotalk://web/openExternal?url=${encodeURIComponent(window.location.href)}`;
      window.location.href = kakaoIntentUrl;
      return;
    }

    const inAppBrowserRegex = /FBAN|FBAV|Instagram|Line/i;
    if (inAppBrowserRegex.test(userAgent)) {
      setIsInAppBrowser(true);
    }

    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('YOUR_JAVASCRIPT_APP_KEY_HERE');
    }
  }, []);

  useEffect(() => {
    const fetchPrompts = async () => {
      setPromptsLoading(true);
      // CACHE BUST: Version key to v2 to invalidate old caches
      const cacheKey = `bibleSpeak_trendingPrompts_v2_${language}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const { prompts, timestamp } = JSON.parse(cachedData);
        const age = Date.now() - timestamp;
        if (age < 24 * 60 * 60 * 1000) { // 24-hour cache
          setTrendingPrompts(prompts);
          setPromptsLoading(false);
          return;
        }
      }

      try {
        const newPrompts = await getTrendingPrompts(language);
        if (newPrompts.length > 0) {
            setTrendingPrompts(newPrompts);
            localStorage.setItem(cacheKey, JSON.stringify({ prompts: newPrompts, timestamp: Date.now() }));
        }
      } catch (error) {
        console.error("Failed to load trending prompts", error);
        setTrendingPrompts([]);
      } finally {
        setPromptsLoading(false);
      }
    };
    fetchPrompts();
  }, [language]);


  useEffect(() => {
    const storedTopics = localStorage.getItem(`bibleSpeak_savedTopics_${language}`);
    if (storedTopics) setSavedTopics(JSON.parse(storedTopics));
    else setSavedTopics([]);
    
    const storedBookmarks = localStorage.getItem(`bibleSpeak_bookmarkedVerses_${language}`);
    if (storedBookmarks) setBookmarkedVerses(JSON.parse(storedBookmarks));
    else setBookmarkedVerses([]);
  }, [language]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    setSearchInputValue(trimmedQuery);
    setIsLoading(true);
    setError(null);
    setResults([]);
    setQuery(trimmedQuery);
    setShowSaved(false);
    setLastSearchCancelled(false);

    const currentSearchId = ++searchIdRef.current;

    try {
      const result = await findVerses(trimmedQuery, language);
      if (searchIdRef.current === currentSearchId) {
        setResults(result);
        if (!savedTopics.includes(trimmedQuery)) {
          const updatedTopics = [...savedTopics, trimmedQuery];
          setSavedTopics(updatedTopics);
          localStorage.setItem(`bibleSpeak_savedTopics_${language}`, JSON.stringify(updatedTopics));
        }
      }
    } catch (err) {
      if (searchIdRef.current === currentSearchId) {
        setError(err instanceof Error ? err.message : langTranslations.error);
      }
    } finally {
      if (searchIdRef.current === currentSearchId) {
        setIsLoading(false);
      }
    }
  }, [language, savedTopics, langTranslations]);

  const handleCancelSearch = useCallback(() => {
    searchIdRef.current++;
    setIsLoading(false);
    setError(null);
    setLastSearchCancelled(true);
  }, []);
  
  useEffect(() => {
    if (query && !lastSearchCancelled) {
      handleSearch(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);
  
  const toggleBookmark = useCallback((verseGroup: GroupedVerseResult) => {
    const isBookmarked = bookmarkedVerses.some(v => v.id === verseGroup.id);
    const updatedBookmarks = isBookmarked
      ? bookmarkedVerses.filter(v => v.id !== verseGroup.id)
      : [...bookmarkedVerses, verseGroup];
    setBookmarkedVerses(updatedBookmarks);
    localStorage.setItem(`bibleSpeak_bookmarkedVerses_${language}`, JSON.stringify(updatedBookmarks));
  }, [language, bookmarkedVerses]);

  const deleteSavedTopic = useCallback((topic: string) => {
    const updatedTopics = savedTopics.filter(t => t !== topic);
    setSavedTopics(updatedTopics);
    localStorage.setItem(`bibleSpeak_savedTopics_${language}`, JSON.stringify(updatedTopics));
  }, [language, savedTopics]);

  if (isInAppBrowser) {
    return <InAppBrowserMessage translations={langTranslations} />;
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-300">
      <header className="p-4 flex justify-between items-center sticky top-0 bg-slate-900/80 backdrop-blur-sm z-10 border-b border-slate-800">
        <nav className="flex items-center space-x-2 md:space-x-4">
          <button onClick={() => setShowAbout(true)} className="text-sm text-slate-400 hover:text-amber-500 transition-colors">
            {langTranslations.about}
          </button>
          <button onClick={() => setShowHistory(true)} className="text-sm text-slate-400 hover:text-amber-500 transition-colors">
            {langTranslations.bibleHistory}
          </button>
          <button onClick={() => setShowWordOfGod(true)} className="text-sm text-slate-400 hover:text-amber-500 transition-colors">
            {langTranslations.wordOfGod}
          </button>
        </nav>
        <LanguageToggle language={language} setLanguage={setLanguage} />
      </header>

      <main className="container mx-auto p-4 flex flex-col items-center gap-8">
        <div className="text-center pt-8">
            <h1 className="text-5xl font-extrabold text-amber-400 mb-2">{langTranslations.title}</h1>
            <p className="text-slate-400 max-w-2xl">{langTranslations.blurb}</p>
        </div>
        
        <div className="w-full max-w-2xl flex flex-col items-center gap-6 p-6 bg-slate-800/50 rounded-lg shadow-inner">
            <SearchBar 
              value={searchInputValue}
              onChange={setSearchInputValue}
              onSearch={handleSearch} 
              isLoading={isLoading} 
              translations={langTranslations} 
              onCancel={handleCancelSearch} 
            />
        </div>
        
        {isLoading && <LoadingIndicator translations={langTranslations} />}
        {error && <p className="text-red-500 bg-red-900/50 p-4 rounded-md border border-red-900">{error}</p>}
        
        {!isLoading && !error && results.length === 0 && (
          <TrendingPrompts 
            prompts={trendingPrompts}
            isLoading={promptsLoading}
            onPromptClick={handleSearch}
            translations={langTranslations}
          />
        )}

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
                    className="w-full text-center p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all border border-slate-700"
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
      {showHistory && <HistorySection onClose={() => setShowHistory(false)} translations={langTranslations} />}
      {showWordOfGod && <WordOfGodSection onClose={() => setShowWordOfGod(false)} translations={langTranslations} />}

      <footer className="text-center p-8 text-xs text-slate-500 mt-auto">
        &copy; {new Date().getFullYear()} Bible Speak. All Rights Reserved. Rooted in Historic Reformed Theology.
      </footer>
    </div>
  );
}

export default App;