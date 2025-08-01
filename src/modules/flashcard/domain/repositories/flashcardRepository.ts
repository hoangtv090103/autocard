import { Flashcard, Video } from '../entities/flashcard';

export interface FlashcardRepository {
  saveFlashcards(flashcards: Flashcard[]): Promise<void>;
  getFlashcardsByVideo(videoId: string): Promise<Flashcard[]>;
}

export interface VideoRepository {
  getVideoInfo(youtubeUrl: string): Promise<Video>;
}
