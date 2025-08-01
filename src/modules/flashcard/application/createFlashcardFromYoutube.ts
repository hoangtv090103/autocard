
import { FlashcardRepository, VideoRepository } from '../domain/repositories/flashcardRepository';
import { VocabularyService } from '../domain/services/vocabularyService';
import { AIVocabularyExtractor } from '../domain/services/aiVocabularyExtractor';
import { Flashcard } from '../domain/entities/flashcard';

export class CreateFlashcardFromYoutubeUseCase {
  constructor(
    private videoRepo: VideoRepository,
    private flashcardRepo: FlashcardRepository,
    private vocabService: VocabularyService,
    private aiExtractor?: AIVocabularyExtractor
  ) {}

  async execute(youtubeUrl: string): Promise<Flashcard[]> {
    // 1. Lấy thông tin video
    const video = await this.videoRepo.getVideoInfo(youtubeUrl);
    // 2. Trích xuất từ vựng nổi bật bằng AI nếu có, fallback sang vocabService
    let vocabularies;
    if (this.aiExtractor) {
      vocabularies = await this.aiExtractor.extractVocabularies(video.transcript, video.topic);
    } else {
      vocabularies = await this.vocabService.extractVocabularies(video.transcript, video.topic);
    }
    // 3. Lấy thông tin chi tiết cho từng từ
    const enrichedVocabularies = await Promise.all(
      vocabularies.map(vocab => this.vocabService.enrichVocabulary(vocab))
    );
    // 4. Tạo flashcard
    const flashcards: Flashcard[] = enrichedVocabularies.map(vocab => ({
      // Không tạo id, để Supabase tự gen
      vocabulary: vocab,
      createdAt: new Date().toISOString(),
      topic: video.topic,
      videoId: video.id!,
    }));
    // 5. Lưu flashcard
    await this.flashcardRepo.saveFlashcards(flashcards);
    return flashcards;
  }
}
