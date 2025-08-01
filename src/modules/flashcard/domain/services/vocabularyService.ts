import { Vocabulary } from '../entities/flashcard';

export interface VocabularyService {
  extractVocabularies(transcript: string, topic: string): Promise<Vocabulary[]>;
  enrichVocabulary(vocab: Vocabulary): Promise<Vocabulary>;
}
