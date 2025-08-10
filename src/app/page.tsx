"use client";

import { useState } from 'react';
import YoutubeInputForm from '@/components/YoutubeInputForm';
import FlashcardList from '@/components/FlashcardList';
import { Flashcard } from '@/modules/flashcard/domain/entities/flashcard';

export default function Home() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  return (
    <main className="max-w-4xl mx-auto py-10 px-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-gray-100">
        Tạo Flashcard từ Video YouTube
      </h1>
      <YoutubeInputForm onFlashcards={setFlashcards} />
      <FlashcardList flashcards={flashcards} />
    </main>
  );
}
