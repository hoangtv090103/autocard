"use client";

import { useState } from 'react';
import YoutubeInputForm from '@/components/YoutubeInputForm';
import FlashcardList from '@/components/FlashcardList';
import { Flashcard } from '@/modules/flashcard/domain/entities/flashcard';

export default function Home() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Tạo Flashcard từ Video YouTube</h1>
      <YoutubeInputForm onFlashcards={setFlashcards} />
      <FlashcardList flashcards={flashcards} />
    </main>
  );
}
