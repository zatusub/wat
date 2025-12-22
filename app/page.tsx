"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "./WAT.png";
import logoDark from "./WAT-d.png";
import { explainError, AIResponse } from "./actions";
import ResultView from "./components/ResultView";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useAIModel } from "./hooks/useAIModel";

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [mounted, setMounted] = useState(false);
  const [errorInput, setErrorInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<AIResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { getModel, getAuthToken } = useAIModel();
  const { user, signOut, authStatus } = useAuthenticator();
  const router = useRouter();

  // Handle Theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(savedTheme);
    } else {
      setTheme("system");
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.add(isSystemDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  // Determine current effective theme for asset switching
  const getEffectiveTheme = () => {
    if (theme === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return "light";
    }
    return theme;
  };

  const currentLogo = getEffectiveTheme() === "dark" ? logoDark : logo;

  const handleExplain = async () => {
    if (!errorInput.trim()) return;

    setStatus("loading");
    setErrorMessage("");
    try {
      const model = getModel();
      const token = await getAuthToken();
      const result = await explainError(errorInput, model, token || undefined);

      if (result && "error" in result) {
        console.error("Server Error:", result);
        setErrorMessage(`エラーが発生しました: ${result.error} (${result.details || ''})`);
        setStatus("error");
        return;
      }

      setResult(result as AIResponse);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setErrorMessage("通信に失敗しました。");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setResult(null);
    setErrorMessage("");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <Image
                src={currentLogo}
                alt="WAT Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold tracking-tight">wat!?</span>
          </div>

          <nav className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-surface transition-colors mr-2"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-3">
              {authStatus === 'authenticated' ? (
                <>
                  <span className="text-sm text-gray-500 font-medium hidden sm:inline">
                    {user?.signInDetails?.loginId}
                  </span>
                  <button
                    onClick={signOut}
                    className="bg-surface text-foreground border border-border px-4 py-2 rounded-full text-sm font-medium hover:bg-border transition-colors group flex items-center gap-2"
                  >
                    <span>ログアウト</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    ログイン
                  </button>
                  <button
                    onClick={() => router.push('/login')}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    登録
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col items-center p-6 md:p-12 ${status === 'idle' ? 'justify-center md:mt-10' : 'pt-10'}`}>

        {status === "idle" || status === "loading" || status === "error" ? (
          <>
            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent pb-2">
                wat!?
              </h1>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium">
                {authStatus === 'authenticated'
                  ? `こんにちは、${user?.signInDetails?.loginId?.split('@')[0]}さん！`
                  : 'エンジニアのための、直感的なエラー解説ツール。'
                }
                <br />
                エラーメッセージを貼るだけで、何が起きてるか日本語で教えてくれる
              </p>
            </div>

            {/* Interaction Area */}
            <div className="w-full max-w-3xl bg-surface/50 p-2 rounded-2xl md:rounded-3xl border border-surface-foreground/10 shadow-xl backdrop-blur-sm">
              <div className="bg-background rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-border">
                <textarea
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                  disabled={status === "loading"}
                  placeholder="ここにエラーメッセージを貼り付けてください...&#10;(例: TypeError: Cannot read properties of undefined)"
                  className="w-full h-40 md:h-52 bg-transparent resize-none outline-none text-base md:text-lg placeholder:text-gray-400 font-mono"
                />

                {status === "error" && (
                  <div className="mt-2 text-red-500 text-sm font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    {errorMessage}
                  </div>
                )}

                <div className="mt-4 flex justify-between items-center">
                  <div className="hidden md:flex gap-2 text-xs text-gray-500">
                    <span className="bg-surface px-2 py-1 rounded">Python</span>
                    <span className="bg-surface px-2 py-1 rounded">JavaScript</span>
                    <span className="bg-surface px-2 py-1 rounded">Java</span>
                  </div>
                  <button
                    onClick={handleExplain}
                    disabled={status === "loading" || !errorInput.trim()}
                    className="ml-auto bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {status === "loading" ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>解析中...</span>
                      </>
                    ) : (
                      <>
                        <span>解説してもらう</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {status === "idle" && (
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                <div className="p-6 rounded-2xl bg-surface/30 border border-border hover:border-primary/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 17h6" /></svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">日本語で解説</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">専門用語を避けた、わかりやすい言葉でエラーの原因を説明します。</p>
                </div>
                <div className="p-6 rounded-2xl bg-surface/30 border border-border hover:border-primary/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">コード例提示</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">修正後のコードだけでなく、なぜ直るのかをコードを交えて教えます。</p>
                </div>
                <div className="p-6 rounded-2xl bg-surface/30 border border-border hover:border-primary/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">学習に最適</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">答えを教えるだけではなく、次につながる知識を提供します。</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <ResultView data={result!} onReset={handleReset} />
        )}

      </main>

      <footer className="py-8 text-center text-sm text-gray-500 border-t border-border">
        &copy; {new Date().getFullYear()} wat!? project. All rights reserved.
      </footer>
    </div>
  );
}

