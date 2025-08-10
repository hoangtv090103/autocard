import { AIVocabularyExtractor } from '@/modules/flashcard/domain/services/aiVocabularyExtractor';
import { Vocabulary } from '@/modules/flashcard/domain/entities/flashcard';
import { GoogleGenAI } from '@google/genai';

export class GeminiAIVocabularyExtractor implements AIVocabularyExtractor {
    private ai: GoogleGenAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is not set.');
        }        this.ai = new GoogleGenAI({ apiKey });
    }

    async extractVocabularies(transcript: string, topic: string): Promise<Vocabulary[]> {
        const prompt = `Transcript: ${transcript}\nChủ đề: ${topic}\nHãy trả về danh sách từ vựng quan trọng, mỗi từ gồm: word, phonetic, meaning, type, context. Đáp lại bằng JSON array.`;

        try {
            const response = await this.ai.models.generateContent({
                model: process.env.GEMINI_MODEL || 'gemma-3-27b-it',
                contents: [{ parts: [{ text: prompt }] }],
            });

            // The SDK response structure may differ; adjust as needed
            const content = response.text ?? response.candidates?.[0]?.content?.parts?.[0]?.text;
            if (typeof content !== 'string') {
                console.error('Gemini response content is not a string:', content, response);
                return [];
            }
            const cleanedContent = content
                .replace(/^\s*```(?:json)?/i, '')
                .replace(/```\s*$/, '')
                .trim();
            try {
                const vocabularies: Vocabulary[] = JSON.parse(cleanedContent);
                return vocabularies;
            } catch (jsonErr) {
                console.error('Error parsing Gemini vocabulary response as JSON:', jsonErr, '\nRaw content:', cleanedContent);
                return [];
            }
        } catch (e) {
            console.error('Error handling Gemini response:', e);
            return [];
        }
    }
}
