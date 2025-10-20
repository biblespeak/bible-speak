import { GoogleGenAI, Type } from "@google/genai";
import { GroupedVerseResult, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const keyTermSchema = {
  type: Type.OBJECT,
  properties: {
    term: { type: Type.STRING, description: "The key term in its original script (e.g., ἀγάπη)." },
    transliteration: { type: Type.STRING, description: "The English transliteration of the term (e.g., agapē)." },
    explanation: { type: Type.STRING, description: "A brief, layperson-friendly explanation of the term's significance in this context." },
  },
  required: ["term", "transliteration", "explanation"],
};

const originalLanguageDetailSchema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "The full verse text in the original language script." },
    transliteration: { type: Type.STRING, description: "A full English transliteration of the verse." },
    key_terms: {
      type: Type.ARRAY,
      description: "An analysis of 1-3 key terms from the original language text.",
      items: keyTermSchema,
    },
  },
  required: ["text", "transliteration", "key_terms"],
};

const verseTranslationSchema = {
  type: Type.OBJECT,
  properties: {
    version: { type: Type.STRING, description: "The Bible version abbreviation (e.g., ESV, NASB1995, KRV, RNKSV, Original)." },
    text: { type: Type.STRING, description: "The text of the verse in the specified version." },
    original_language_detail: {
      type: Type.OBJECT,
      properties: originalLanguageDetailSchema.properties,
      description: "Detailed analysis of the original language text. Only present when version is 'Original'.",
    },
  },
  required: ["version", "text"],
};

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      reference: { type: Type.STRING, description: "The canonical Bible reference (e.g., John 3:16)." },
      relevance_explanation: { type: Type.STRING, description: "A one-sentence explanation of why this verse is relevant to the user's query." },
      context: { type: Type.STRING, description: "A comprehensive (4-5 sentence) historical-literary context for the verse, suitable for Reformed hermeneutics. Explain the author, audience, genre, and its place in redemptive history." },
      translations: {
        type: Type.ARRAY,
        description: "An array containing the verse in all requested translations.",
        items: verseTranslationSchema,
      },
    },
    required: ["reference", "relevance_explanation", "context", "translations"],
  },
};

export const findVerses = async (query: string, language: Language): Promise<GroupedVerseResult[]> => {
  const versions = language === 'en' ? 'ESV, NASB1995' : 'KRV, RNKSV';
  
  try {
    const prompt = `
      User query: "${query}"
      Language: "${language}"
      Bible Versions: "${versions}, Original"

      Task: Perform a comprehensive and exhaustive search across all 66 books of the Protestant Bible to find every single verse that is directly relevant to the user's query. The goal is maximum recall and completeness. Do not omit any relevant verses. For each distinct verse reference, provide a single, shared relevance explanation and context. Then, provide the text for that verse in all requested Bible versions, including the Original Language.

      RULES:
      1.  Group results by canonical reference. Do NOT repeat the 'relevance_explanation' or 'context' for different translations of the same verse.
      2.  For the 'Original' language version:
          - Provide the full verse text in its original script (Hebrew for OT, Greek for NT).
          - Provide a complete, readable English transliteration of the original text.
          - Identify 1-3 key terms. For each term, provide the original word, its transliteration, and a simple explanation of its importance.
      3.  Cross-Language Consistency: The selection of verses and the core theological interpretation must be consistent regardless of the target language. The search should be based on the universal theological concept, not language-specific idioms, to ensure English and Korean results are parallel.
      4.  Return a JSON array matching the required schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonStr = response.text.trim();
    const results = JSON.parse(jsonStr) as any[];

    if (!Array.isArray(results)) {
      throw new Error("Invalid response format from API: Expected an array.");
    }
    
    return results.map(result => ({
        ...result,
        id: result.reference.replace(/[\s:]/g, '-')
    }));

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw new Error("Failed to fetch search results from the AI service. The model may have returned an invalid format.");
  }
};