import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from '@/components/ThemeToggle';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auto Flashcard",
  description: "Tạo flashcard từ YouTube với AI và Supabase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <header className="p-4 flex justify-between items-center">
            <ThemeToggle />
            <nav className="flex space-x-4">
              <SignedOut>
                <SignInButton>Sign in</SignInButton>
                <SignUpButton>Sign up</SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </nav>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
