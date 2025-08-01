
# Auto Flashcard Generator from YouTube

Generate flashcard sets from YouTube videos using Next.js, Supabase, AI (Gemini/OpenRouter), and Clean Architecture.

## Main Features
- Enter a YouTube link, the system automatically fetches the transcript and extracts key vocabulary using AI.
- Store flashcards on Supabase.
- Display pronunciation, audio, meaning, word type, and context for each word.
- Modern UI with loading effects and a timer when generating flashcards.
- Listen to word pronunciation via a small play button.

## Project Structure

```
/auto-flashcard
├── src/
│   ├── app/                  # Next.js app router, API routes, pages
│   │   └── api/flashcard/    # API endpoint for flashcard creation
│   ├── components/           # React components (UI, form, flashcard list, etc.)
│   └── modules/flashcard/    # Clean Architecture: domain, application, infrastructure
│       ├── domain/           # Entity, repository, service interface
│       ├── application/      # Use case (CreateFlashcardFromYoutubeUseCase)
│       └── infrastructure/   # Repository, AI extractor, service implementations
├── public/                   # Static assets
├── .env.example              # Environment variable example file
├── README.md                 # Project documentation
└── ...
```

## Setup & Run
1. Clone the repo, copy `.env.example` to `.env.local`, and fill in the required keys.
2. Install packages:
    ```bash
    npm install
    ```
3. Start development server:
    ```bash
    npm run dev
    ```
4. Visit `http://localhost:3000` to use the app.

## Environment Variables
See `.env.example` for required variables.

## Technologies Used
- Next.js 15 (App Router, TypeScript, TailwindCSS)
- Supabase (DB, Auth)
- OpenRouter AI, Gemini API (Google)
- Free Dictionary API (for pronunciation/audio)
- LangChain (for YouTube transcript)
- Clean Architecture

## Contribution
PRs, issues, and feedback are welcome!
