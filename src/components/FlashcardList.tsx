import { Flashcard } from '@/modules/flashcard/domain/entities/flashcard';
import { useRef } from 'react';

export default function FlashcardList({ flashcards }: { flashcards: Flashcard[] }) {
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  if (!flashcards.length) return <div>Chưa có flashcard nào.</div>;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {flashcards.map((card, idx) => {
        const audioUrl = card.vocabulary.audio;
        return (
          <div key={card.id} className="border rounded p-4 shadow">
            <div className="font-bold text-lg">{card.vocabulary.word}</div>
            <div className="flex items-center gap-2 italic text-gray-500">
              {audioUrl && (
                <button
                  type="button"
                  aria-label="Phát âm thanh"
                  className="p-1 rounded hover:bg-blue-100 focus:outline-none"
                  onClick={() => audioRefs.current[idx] && audioRefs.current[idx]!.play()}
                >
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 7H5a1 1 0 00-1 1v4a1 1 0 001 1h4l4 4V3l-4 4z" />
                  </svg>
                </button>
              )}
              <span>{card.vocabulary.phonetic}</span>
              {audioUrl && (
                <audio
                  ref={el => {
                    audioRefs.current[idx] = el ?? null;
                  }}
                  src={audioUrl}
                  preload="auto"
                  style={{ display: 'none' }}
                />
              )}
            </div>
            <div className="text-blue-700">{card.vocabulary.meaning}</div>
            <div className="text-sm text-gray-600">{card.vocabulary.type}</div>
            <div className="mt-2 text-sm">Ngữ cảnh: {card.vocabulary.context}</div>
            <div className="mt-2 text-xs text-gray-400">Chủ đề: {card.topic}</div>
          </div>
        );
      })}
    </div>
  );
}
