import { GoogleGenAI, Type } from "@google/genai";
import { GroupedVerseResult, Language } from "../types";

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
    text: { type: Type.STRING, description: "The full verse text in the original language script (Hebrew for OT, Greek for NT)." },
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
    version: { type: Type.STRING, description: "The Bible version abbreviation (e.g., ESV, KRV, RNKSV, NKRV, Original)." },
    text: { type: Type.STRING, description: "The text of the verse in the specified version." },
    original_language_detail: {
      ...originalLanguageDetailSchema,
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
      context: { type: Type.STRING, description: "A comprehensive historical-literary context for the verse." },
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
  const versions = language === 'en' ? 'ESV' : 'KRV, RNKSV, NKRV';
  const targetLanguage = language === 'ko' ? 'Korean' : 'English';
  
  try {
    const prompt = `
      User query: "${query}"
      Target Output Language: "${targetLanguage}"
      Bible Versions requested: "${versions}, Original"

      Task: Perform a deep and exhaustive exegesis across all 66 books of the Bible to find verses relevant to the query. Aim to return an average of 4-5 of the most significant verses.

      SEARCH RESULT PRIORITIZATION:
      1.  **Prioritize Words of Christ**: When the user's topic or inquiry relates to a subject Jesus directly addressed, you MUST prioritize those specific verses.
      2.  **Gospel Precedence**: Verses from the Gospels (Matthew, Mark, Luke, John) should be given higher precedence in the results when relevant.

      HERMENEUTICAL GUIDELINES:
      - All interpretations must be Christ-centered (Christotelic).
      - The analysis should recognize the unfolding of God's single redemptive plan through a series of covenants and emphasize the Sovereignty of God throughout Scripture.
      - Use a historical-grammatical method of interpretation that affirms the inspiration, inerrancy, and authority of the 66 books of the Protestant Bible.
      - For the 'context' field, provide a richer, more detailed exegetical analysis, expanding on the historical, literary, and theological nuances. The length should be approximately 20-30% longer than a brief summary to ensure depth.
      - Avoid modern liberal or secular-critical interpretations that challenge the divine authorship and unity of Scripture.

      STRICT LANGUAGE RULES:
      1. All AI-generated fields (relevance_explanation, context, key_terms.explanation) MUST be written in ${targetLanguage}.
      2. If the Target Output Language is Korean, you MUST provide all commentaries and explanations in Korean, even if the user query was in English.
      3. For the 'Original' language text, provide the Hebrew/Greek script.

      ADDITIONAL RULES:
      1. Group results by canonical reference.
      2. For 'Original' version: Include script, transliteration, and 1-3 key term analyses.
      3. Return a JSON array matching the required schema.
    `;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      console.error("Gemini API returned an empty response text.");
      throw new Error("API returned an empty response.");
    }

    let jsonStr = responseText.trim();
    if (jsonStr.startsWith("```") && jsonStr.endsWith("```")) {
      jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim();
      if (jsonStr.startsWith("json")) {
        jsonStr = jsonStr.substring(4).trim();
      }
    }

    const results = JSON.parse(jsonStr) as any[];

    if (!Array.isArray(results)) {
      console.error("Parsed response is not an array:", results);
      throw new Error("Invalid response format from API: Expected an array.");
    }
    
    return results.map(result => ({
        ...result,
        id: result.reference.replace(/[\s:]/g, '-')
    }));

  } catch (error: any) {
    console.error("Error from Gemini API:", error);
    throw new Error("Failed to fetch search results. Please check the browser console for details.");
  }
};

export const getTrendingPrompts = async (language: Language): Promise<string[]> => {
  const targetLanguage = language === 'ko' ? 'Korean' : 'English';
  try {
    const prompt = `
      Act as a Reformed theologian creating three varied, concise Bible study prompts. Based on current global sentiments and timeless human questions, generate ONLY 3 prompts.

      RULES:
      1. The output MUST be a simple JSON array of 3 strings. Do not include any other text, markdown, or explanation.
      2. All prompts must be in ${targetLanguage}.
      3. The three prompts MUST follow this structure:
          - Prompt 1: A single, profound, two-to-three word theological topic (e.g., "Imputed Righteousness", "The Hypostatic Union", "Sola Fide").
          - Prompt 2: A specific Bible verse reference followed by a short, insightful question about it (e.g., "John 1:1 - What does it mean that the Word was God?", "Genesis 3:15 - How is this the first gospel promise?").
          - Prompt 3: A concise doctrinal or thematic question (e.g., "How does the Old Testament foreshadow Christ?", "What is the doctrine of adoption?").
      4. All prompts must be short one-liners.

      Example valid output for English:
      ["Covenant Theology", "Romans 8:28 - How does God work ALL things for good?", "What is the role of the Holy Spirit?"]
    `;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
    });

    const responseText = response.text;
    if (!responseText) {
      console.error("Gemini API returned an empty response for trending prompts.");
      return [];
    }
    
    let jsonStr = responseText.trim();
    if (jsonStr.startsWith("```") && jsonStr.endsWith("```")) {
      jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim();
      if (jsonStr.startsWith("json")) {
        jsonStr = jsonStr.substring(4).trim();
      }
    }

    const prompts = JSON.parse(jsonStr);

    if (Array.isArray(prompts) && prompts.every(p => typeof p === 'string')) {
      return prompts;
    } else {
      console.error("Parsed response for trending prompts is not an array of strings:", prompts);
      return [];
    }

  } catch (error) {
    console.error("Error fetching trending prompts:", error);
    return [];
  }
};