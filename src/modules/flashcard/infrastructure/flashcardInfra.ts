import { FlashcardRepository, VideoRepository } from '@/modules/flashcard/domain/repositories/flashcardRepository';
import { VocabularyService } from '@/modules/flashcard/domain/services/vocabularyService';
import { Flashcard, Video, Vocabulary } from '@/modules/flashcard/domain/entities/flashcard';
import { supabase } from '@/lib/supabaseClient';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
import { YoutubeLoader } from '@langchain/community/document_loaders/web/youtube';

// Placeholder: Sử dụng Supabase client thực tế để lưu flashcard
export class SupabaseFlashcardRepository implements FlashcardRepository {
  async saveFlashcards(flashcards: Flashcard[]): Promise<void> {
    // Lưu từng flashcard vào bảng 'flashcards'
    if (flashcards.length === 0) return;
    // Insert as JSONB vocabulary field, not as flat columns
    const rows = flashcards.map(card => ({
      vocabulary: card.vocabulary,
      created_at: card.createdAt,
      topic: card.topic,
      video_id: card.videoId,
    }));
    const { error } = await supabase.from('flashcards').insert(rows);
    if (error) {
      console.error('Error inserting flashcards:', error);
      throw new Error('Failed to insert flashcards');
    }
  }
  async getFlashcardsByVideo(videoId: string): Promise<Flashcard[]> {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('video_id', videoId);
    if (error || !data) return [];
    return data
      .filter((row: Record<string, unknown>) =>
        typeof row.id === 'string' &&
        typeof row.vocabulary === 'object' &&
        typeof row.created_at === 'string' &&
        typeof row.topic === 'string' &&
        typeof row.video_id === 'string'
      )
      .map((row: Record<string, unknown>): Flashcard => ({
        id: row.id as string,
        vocabulary: row.vocabulary as Vocabulary,
        createdAt: row.created_at as string,
        topic: row.topic as string,
        videoId: row.video_id as string,
      }));
  }
}

// Placeholder: Lấy thông tin video từ YouTube
export class YoutubeVideoRepository implements VideoRepository {
  async getVideoInfo(youtubeUrl: string): Promise<Video> {
    // Lấy videoId từ url
    const videoIdMatch = youtubeUrl.match(/[?&]v=([^&#]+)/) || youtubeUrl.match(/youtu\.be\/([^?&#]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : '';
    if (!videoId) throw new Error('Invalid YouTube URL');
    // Lấy title
    const infoRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`);
    const infoJson = await infoRes.json();
    const title = infoJson.items?.[0]?.snippet?.title || '';
    // Lấy transcript thực tế bằng YoutubeLoader mới
    let transcript = '';
    try {
      const loader = YoutubeLoader.createFromUrl(youtubeUrl, {
        language: 'en',
        addVideoInfo: true,
      });
      const docs = await loader.load();
      transcript = docs[0]?.pageContent || '';
      if (!transcript) {
        console.warn('Transcript empty for videoId:', videoId, 'url:', youtubeUrl);
      }
    } catch (err) {
      console.error('Transcript fetch error (langchain) for videoId:', videoId, 'url:', youtubeUrl, err);
      transcript = '';
    }
    // Chủ đề tạm lấy từ title
    const topic = title;
    return {
      // Không cần tạo id, Supabase sẽ tự gen UUID
      youtubeId: videoId, // Lưu YouTube ID riêng
      title,
      transcript,
      topic,
    } as Video;
  }
}

// Placeholder: Trích xuất và enrich từ vựng
export class SimpleVocabularyService implements VocabularyService {
  async extractVocabularies(transcript: string, topic: string): Promise<Vocabulary[]> {
    // Simple extraction: split transcript, filter stopwords, return unique words as vocabularies
    const stopwords = new Set([
      'the', 'is', 'in', 'at', 'of', 'a', 'and', 'to', 'it', 'on', 'for', 'with', 'as', 'by', 'an', 'be', 'this', 'that', 'from', 'or', 'are', 'was', 'but', 'not', 'have', 'has', 'had', 'they', 'you', 'we', 'he', 'she', 'his', 'her', 'their', 'our', 'my', 'your', 'its', 'which', 'who', 'whom', 'what', 'when', 'where', 'why', 'how', 'can', 'could', 'should', 'would', 'will', 'shall', 'may', 'might', 'do', 'does', 'did', 'so', 'if', 'then', 'than', 'because', 'about', 'into', 'up', 'down', 'out', 'over', 'under', 'again', 'further', 'once', 'here', 'there', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'only', 'own', 'same', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
    ]);
    const words = transcript
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopwords.has(w));
    const uniqueWords = Array.from(new Set(words)).slice(0, 10); // limit to 10 vocabularies
    return uniqueWords.map(word => ({
      word,
      meaning: '',
      type: '',
      context: transcript,
    }));
  }
  async enrichVocabulary(vocab: Vocabulary): Promise<Vocabulary> {
    // Gọi Free Dictionary API để lấy phiên âm (phonetic) và audio
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(vocab.word)}`);
      if (!res.ok) return { ...vocab };
      const data = await res.json();
      // Lấy audio đầu tiên nếu có
      let audio = undefined;
      type Phonetic = { text?: string; audio?: string };
      if (Array.isArray(data?.[0]?.phonetics)) {
        const found = (data[0].phonetics as Phonetic[]).find((p: Phonetic) => p.audio);
        if (found) audio = found.audio;
      }
      return { ...vocab, audio };
    } catch (e) {
      console.error('Error fetching phonetic/audio:', e);
      return { ...vocab };
    }
  }
}
