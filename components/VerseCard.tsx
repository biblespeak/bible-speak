import React from 'react';
import { GroupedVerseResult, OriginalLanguageDetail, VerseTranslation } from '../types';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { KakaoShareButton } from './KakaoShareButton';

interface VerseCardProps {
  verseGroup: GroupedVerseResult;
  isBookmarked: boolean;
  onToggleBookmark: (verseGroup: GroupedVerseResult) => void;
  translations: { [key: string]: string };
}

const versionMap: { [key: string]: string } = {
    ESV: 'ESV',
    Original: 'Original Language',
    KRV: '개역한글 (1961)',
    RNKSV: '새번역 (2001)',
    NKRV: '개역개정 (1998)',
};

const OriginalLanguageDisplay: React.FC<{ detail: OriginalLanguageDetail, translations: { [key: string]: string } }> = ({ detail, translations }) => (
    <div className="space-y-4 mt-2 text-slate-300">
        <p className="text-lg leading-relaxed">{detail.text}</p>
        <p className="text-md italic text-slate-400">{detail.transliteration}</p>
        <div>
            <h5 className="font-bold text-amber-500 mb-2">{translations.keyTerms}</h5>
            <div className="space-y-3">
                {detail.key_terms.map(term => (
                    <div key={term.term}>
                        <p>
                            <strong className="text-slate-100">{term.term}</strong>
                            <em className="text-slate-400 ml-2">({term.transliteration})</em>
                        </p>
                        <p className="text-sm text-slate-400">{term.explanation}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const VerseCard: React.FC<VerseCardProps> = ({ verseGroup, isBookmarked, onToggleBookmark, translations }) => {
  const getVersionLabel = (versionKey: string) => {
    if (versionKey === 'Original') return translations.originalLanguage;
    return versionMap[versionKey] || versionKey;
  }
  
  const preferredTranslation = verseGroup.translations.find(t => t.version === 'ESV' || t.version === 'KRV' || t.version === 'RNKSV' || t.version === 'NKRV');
  const shareText = preferredTranslation ? preferredTranslation.text : verseGroup.relevance_explanation;

  const versionOrder: VerseTranslation['version'][] = ['KRV', 'NKRV', 'RNKSV', 'ESV', 'Original'];
  const sortedTranslations = [...verseGroup.translations].sort((a, b) => {
    const indexA = versionOrder.indexOf(a.version);
    const indexB = versionOrder.indexOf(b.version);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-amber-400">{verseGroup.reference}</h3>
        <div className="flex items-center space-x-2">
            <KakaoShareButton
                title={verseGroup.reference}
                description={shareText}
                translations={translations}
            />
            <button
                onClick={() => onToggleBookmark(verseGroup)}
                className="p-2 text-slate-400 hover:text-amber-500 transition"
                aria-label="Bookmark verse"
            >
                <BookmarkIcon className="h-6 w-6" filled={isBookmarked} />
            </button>
        </div>
      </div>

      {/* Translations come first */}
      <div className="space-y-4 mb-6">
        {sortedTranslations.map((t, index) => (
          <div className={index > 0 ? "border-t border-slate-700/50 pt-4 mt-4" : ""} key={t.version}>
            <h4 className="font-bold text-amber-400">{getVersionLabel(t.version)}</h4>
            {t.original_language_detail ? (
              <OriginalLanguageDisplay detail={t.original_language_detail} translations={translations} />
            ) : (
              <p className="text-slate-300 text-lg leading-relaxed">"{t.text}"</p>
            )}
          </div>
        ))}
      </div>

      {/* Commentary comes after, separated by a line */}
      <div className="space-y-4 pt-6 border-t border-slate-700">
        <div>
          <h4 className="font-bold text-slate-200 text-lg">{translations.relevance}</h4>
          <p className="text-slate-400">{verseGroup.relevance_explanation}</p>
        </div>
        <div>
          <h4 className="font-bold text-slate-200 text-lg">{translations.context}</h4>
          <p className="text-slate-400 whitespace-pre-line leading-relaxed">{verseGroup.context}</p>
        </div>
      </div>
    </div>
  );
};