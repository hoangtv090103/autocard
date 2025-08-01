// Định nghĩa entity cho từ vựng (Vocabulary)
export interface Vocabulary {
  word: string;
  phonetic?: string;
  audio?: string;
  meaning: string;
  type?: string;
  context?: string;
}

// Định nghĩa entity cho flashcard
export interface Flashcard {
  id: string;
  vocabulary: Vocabulary;
  createdAt: string;
  topic: string;
  videoId: string;
}

// Định nghĩa entity cho video
export interface Video {
  id: string;
  title: string;
  transcript: string;
  topic: string;
}
