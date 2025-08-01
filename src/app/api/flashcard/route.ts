import { NextRequest, NextResponse } from 'next/server';
import { CreateFlashcardFromYoutubeUseCase } from '@/modules/flashcard/application/createFlashcardFromYoutube';
import { SupabaseFlashcardRepository, YoutubeVideoRepository, SimpleVocabularyService } from '@/modules/flashcard/infrastructure/flashcardInfra';
import { GeminiAIVocabularyExtractor } from '@/modules/flashcard/infrastructure/geminiAIVocabularyExtractor';

export async function POST(req: NextRequest) {
  const { youtubeUrl } = await req.json();
  if (!youtubeUrl) {
    return NextResponse.json({ error: 'Missing youtubeUrl' }, { status: 400 });
  }
  const useCase = new CreateFlashcardFromYoutubeUseCase(
    new YoutubeVideoRepository(),
    new SupabaseFlashcardRepository(),
    new SimpleVocabularyService(),
    new GeminiAIVocabularyExtractor()
  );
  try {
    const flashcards = await useCase.execute(youtubeUrl);
    return NextResponse.json({ flashcards });
  } catch (error: unknown) {
    let errorMessage = 'Failed to create flashcards';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
