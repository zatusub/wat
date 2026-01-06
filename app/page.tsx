"use client";

import { useState, useEffect } from "react";
import { explainError, AIResponse } from "./actions";
import ResultView from "./components/ResultView";
import { useAIModel } from "./hooks/useAIModel";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state
  const [errorInput, setErrorInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<AIResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { getModel, getAuthToken } = useAIModel();

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
    setErrorInput("");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-300 bg-background">

      {/* Sidebar (Desktop & Mobile) */}
      <Sidebar
        theme={theme}
        toggleTheme={toggleTheme}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">

        {/* Mobile Header (Hamburger) */}
        {!sidebarOpen && (
          <header className="md:hidden flex items-center p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-surface text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <span className="ml-3 font-bold text-lg">wat!?</span>
          </header>
        )}

        <div className={`flex-1 flex flex-col items-center p-6 md:p-12 ${status === 'idle' ? 'justify-center' : 'pt-10'}`}>
          {status === "idle" || status === "loading" || status === "error" ? (
            <div className="w-full max-w-3xl bg-surface/50 p-2 rounded-2xl md:rounded-3xl border border-surface-foreground/10 shadow-xl backdrop-blur-sm animate-in zoom-in-95 duration-500">
              <div className="bg-background rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-border">
                <textarea
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                  disabled={status === "loading"}
                  placeholder="ここにエラーメッセージを貼り付けてください...&#10;(例: TypeError: Cannot read properties of undefined)"
                  className="w-full h-60 md:h-80 bg-transparent resize-none outline-none text-base md:text-lg placeholder:text-gray-400 font-mono"
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
          ) : (
            <ResultView data={result!} onReset={handleReset} />
          )}
        </div>
      </main>
    </div>
  );
}

