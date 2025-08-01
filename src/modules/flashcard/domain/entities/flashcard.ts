// Định nghĩa entity cho từ vựng (Vocabulary)
export interface Vocabulary {
  word: string;
  meaning: string;
  phonetic?: string;
  audio?: string;
  type?: string;
  context?: string;
  example?: string; // ví dụ sử dụng từ trong câu
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
  youtubeId?: string; // YouTube video ID (không phải UUID)
  title: string;
  transcript: string;
  topic: string;
}
