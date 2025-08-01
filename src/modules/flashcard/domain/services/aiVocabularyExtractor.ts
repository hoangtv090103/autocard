import { Vocabulary } from '../entities/flashcard';

export interface AIVocabularyExtractor {
  extractVocabularies(transcript: string, topic: string): Promise<Vocabulary[]>;
}
