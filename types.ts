export type Language = 'en' | 'ko';

export interface KeyTerm {
  term: string;
  transliteration: string;
  explanation: string;
}

export interface OriginalLanguageDetail {
  text: string;
  transliteration: string;
  key_terms: KeyTerm[];
}

export interface VerseTranslation {
  version: 'ESV' | 'KRV' | 'RNKSV' | 'NKRV' | 'Original';
  text: string;
  original_language_detail?: OriginalLanguageDetail;
}

export interface GroupedVerseResult {
  id: string; // Unique ID for the group, e.g., "John-3-16"
  reference: string;
  relevance_explanation: string;
  context: string;
  translations: VerseTranslation[];
}