import { AIVocabularyExtractor } from '@/modules/flashcard/domain/services/aiVocabularyExtractor';
import { Vocabulary } from '@/modules/flashcard/domain/entities/flashcard';

export class OpenRouterAIVocabularyExtractor implements AIVocabularyExtractor {
  async extractVocabularies(transcript: string, topic: string): Promise<Vocabulary[]> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY environment variable is not set.');
    }
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'system',
            content: 'Bạn là một trợ lý AI giúp trích xuất từ vựng quan trọng từ transcript video theo chủ đề.'
          },
          {
            role: 'user',
            content: `Transcript: ${transcript}\nChủ đề: ${topic}\nHãy trả về danh sách từ vựng quan trọng, mỗi từ gồm: word, phonetic, meaning, type, context. Đáp lại bằng JSON array.`
          }
        ],
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`OpenRouter API request failed with status ${res.status}:`, errorText);
      throw new Error(`OpenRouter API request failed with status ${res.status}`);
    }

    const data = await res.json();
    try {
      const content = data.choices?.[0]?.message?.content;
      if (typeof content !== 'string') {
        console.error('OpenRouter response content is not a string:', content, data);
        return [];
      }
      // Remove Markdown code block markers if present
      const cleanedContent = content
        .replace(/^\s*```(?:json)?/i, '')
        .replace(/```\s*$/, '')
        .trim();
      try {
        const vocabularies: Vocabulary[] = JSON.parse(cleanedContent);
        return vocabularies;
      } catch (jsonErr) {
        console.error('Error parsing vocabulary response as JSON:', jsonErr, '\nRaw content:', cleanedContent);
        return [];
      }
    } catch (e) {
      console.error('Error handling OpenRouter response:', e, data);
      return [];
    }
  }
}
