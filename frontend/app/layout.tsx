import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cymbiose AI - Diagnostic Support",
  description: "AI-powered diagnostic support system for therapists",
  keywords: ["AI", "diagnosis", "therapy", "healthcare", "mental health"],
  authors: [{ name: "Cymbiose AI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-white dark:bg-gray-950">
            <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <svg
                      className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-bold">Cymbiose AI</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Diagnostic Support</p>
                  </div>
                  <div className="sm:hidden">
                    <h1 className="text-lg font-bold">Cymbiose</h1>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-6">
                  <nav className="hidden md:flex items-center space-x-6">
                    <Link
                      href="/"
                      className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/clients"
                      className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Clients
                    </Link>
                    <Link
                      href="/diagnoses/history"
                      className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      History
                    </Link>
                  </nav>
                  
                  {/* Mobile Navigation Menu */}
                  <nav className="md:hidden flex items-center space-x-1">
                    <Link
                      href="/"
                      className="p-2 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Home
                    </Link>
                    <Link
                      href="/clients"
                      className="p-2 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Clients
                    </Link>
                    <Link
                      href="/diagnoses/history"
                      className="p-2 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      History
                    </Link>
                  </nav>
                  
                  <ThemeToggle />
                </div>
              </div>
            </header>
            
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            
            <footer className="border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 mt-auto dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400 space-y-2 sm:space-y-0">
                  <p>© 2025 Cymbiose AI. All rights reserved.</p>
                  <p className="text-xs sm:text-sm">Diagnostic Support System v1.0.0</p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}