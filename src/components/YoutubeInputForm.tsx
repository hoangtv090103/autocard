import { useState, useRef } from 'react';
import { Flashcard } from '@/modules/flashcard/domain/entities/flashcard';

export default function YoutubeInputForm({ onFlashcards }: { onFlashcards: (flashcards: Flashcard[]) => void }) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimer(0);
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    const res = await fetch('/api/flashcard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ youtubeUrl }),
    });
    const data = await res.json();
    setLoading(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (data.flashcards) onFlashcards(data.flashcards);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Paste YouTube link..."
          value={youtubeUrl}
          onChange={e => setYoutubeUrl(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded" disabled={loading}>
          {loading ? 'Processing...' : 'Tạo flashcard'}
        </button>
      </form>
      {loading && (
        <div className="flex items-center gap-2 text-blue-600 animate-pulse">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span>Đang tạo transcript &amp; flashcard, vui lòng chờ...</span>
          <span className="ml-2 text-xs">{timer}s</span>
        </div>
      )}
    </div>
  );
}
