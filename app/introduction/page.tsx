"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';

export default function Introduction() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [mounted, setMounted] = useState(false);
  const { user, authStatus } = useAuthenticator();
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-24 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8 py-10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 animate-fade-in">
            プログラミング学習補助ツール
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight pb-2">
            エラー解決は、<br />最高の「学び」だ。
          </h1>

          <p className="max-w-3xl mx-auto text-xl text-muted-foreground font-medium leading-relaxed">
            {authStatus === 'authenticated'
              ? `ようこそ、${user?.signInDetails?.loginId?.split('@')[0]}さん。`
              : 'AIにコードを書いてもらうだけの学習は、もう終わりにしましょう。'
            }
            <br className="hidden md:block" />
            wat!?は、英語のエラーメッセージを解析し、あなたの「なぜ？」に答えます。<br />
            答えを丸写しするのではなく、<span className="text-foreground decoration-primary decoration-4 underline-offset-4 font-bold">「理解して、自分で直す」</span>力を育てます。
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="w-full sm:w-auto bg-primary text-primary-foreground px-10 py-5 rounded-full text-lg font-bold hover:scale-105 transition-all shadow-xl shadow-primary/25 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 17h6" /></svg>
              今すぐ「学び」を始める
            </button>
            {!user && (
              <button
                onClick={() => router.push('/login')}
                className="w-full sm:w-auto bg-surface border border-border px-10 py-5 rounded-full text-lg font-bold hover:bg-border transition-all"
              >
                アカウント作成
              </button>
            )}
          </div>
        </section>

        {/* Philosophy / Features (Bento Grid) */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Why errlenz?
            </h2>
            <p className="text-muted-foreground">
              私たちは「エラー」を障害ではなく、成長の機会だと捉えています。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 gap-6">
            {/* Main Feature: Understanding */}
            <div className="md:col-span-3 lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-surface to-background p-8 rounded-[2rem] border border-border/50 shadow-sm flex flex-col group overflow-hidden relative">
              <div className="relative z-10 flex-1 flex flex-col justify-between h-full">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZsH8Z" /><path d="M12 14c2.28 0 4-2.5 4-5s-1.8-4.5-4-4.5S8 6.5 8 9c0 2.5 1.72 5 4 5Z" /><path d="M8 12h8" /><path d="M12 16h.01" /></svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">「答え」よりも、「理解」を。</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    AIに修正後のコードをもらって、それを貼り付けて終わり...。それでは応用力が身につきません。
                    <br /><br />
                    wat!?は、<span className="text-foreground font-bold">「なぜそのエラーが起きたのか」</span><span className="text-foreground font-bold">「どういうロジックで直すべきなのか」</span>を、まるで先生のように丁寧に解説します。
                  </p>
                </div>
                <div className="mt-8 p-4 bg-background/50 rounded-xl border border-border/50 backdrop-blur-sm">
                  <p className="text-sm font-mono text-gray-500 mb-2">User voice</p>
                  <p className="text-sm italic">「エラーの意味がわかると、自分で直せるようになる。それが一番楽しい！」(14歳 学生)</p>
                </div>
              </div>

              {/* Decorative Background */}
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-5 scale-[2] pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              </div>
            </div>

            {/* Feature: No Jargon */}
            <div className="md:col-span-3 lg:col-span-2 bg-gradient-to-br from-surface to-background p-8 rounded-[2rem] border border-border/50 shadow-sm group">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">専門用語は使いません</h3>
              <p className="text-muted-foreground leading-relaxed">
                「NullPointer」「Indent」... 初めて聞く言葉でパニックになる必要はありません。小学生でもわかる言葉や例え話で、優しく説明します。
              </p>
            </div>

            {/* Feature: Self-Correction */}
            <div className="md:col-span-3 lg:col-span-2 bg-gradient-to-br from-surface to-background p-8 rounded-[2rem] border border-border/50 shadow-sm group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 11.08 22 2 7 2 7.07 9.17" /><polyline points="2 12.92 2 22 17 22 16.93 14.83" /><rect x="14" y="9" width="8" height="5" rx="2" /><rect x="2" y="9" width="8" height="5" rx="2" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">脱コピペ学習</h3>
              <p className="text-muted-foreground leading-relaxed">
                エラーを直すのはAIではなく、あなた自身です。私たちはそのための「ヒント」と「地図」を渡すだけ。自力で動く達成感を提供します。
              </p>
            </div>

            {/* Feature: Wide */}
            <div className="md:col-span-6 lg:col-span-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 p-8 rounded-[2rem] border border-border/50 shadow-sm flex flex-col md:flex-row items-center gap-8 group overflow-hidden">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">10年先も使える基礎力</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  特定の言語のその場限りの修正方法ではなく、プログラミング全般に通じる「デバッグの考え方」が身につきます。
                  wat!?での経験は、将来どんな言語を学ぶときにも必ず役に立ちます。
                </p>
              </div>
              <div className="flex gap-4 opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500">
                <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-2xl font-black text-gray-400">?</div>
                <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-2xl font-black text-blue-500">!</div>
                <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-2xl font-black text-green-500">!!</div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Mission Statement - Refined per GEMINI.md principles */}
        <section className="relative py-12 px-4 flex justify-center">
          {/* Background decoration for depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-64 bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

          <div className="w-full max-w-4xl bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-black/5 text-center space-y-10 group hover:scale-[1.01] transition-transform duration-500 ease-out">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Our Philosophy
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
              AIを、「答え」から<br className="md:hidden" /><span className="text-primary italic">「伴走者」</span>へ。
            </h2>

            <div className="space-y-8 max-w-3xl mx-auto">
              <p className="text-lg md:text-2xl text-foreground font-medium leading-relaxed">
                今の時代、AIを使えば「動くコード」は一瞬で手に入ります。
              </p>

              <div className="relative py-6 px-8 rounded-3xl bg-surface/50 border border-border/50 text-muted-foreground leading-relaxed text-base md:text-lg">
                <p>
                  しかし、答えをコピーするだけの体験は、時に学ぶ人の
                  <span className="block md:inline text-foreground font-bold decoration-primary/30 underline decoration-4 underline-offset-8">
                    思考を奪い、成長を邪魔してしまう
                  </span>
                  と私たちは考えています。
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                  大切なのは、エラーを前にした時の「なぜ？」という好奇心。<br />
                  私たちはあえて、あなたの代わりにコードを書き直すことはしません。
                </p>

                <div className="pt-6">
                  <p className="text-xl md:text-2xl text-foreground font-bold tracking-tight">
                    「自分で理解し、自分で直した」というその一歩こそが、<br className="hidden md:block" />
                    あなたが一生使い続ける<span className="bg-gradient-to-r from-primary/20 to-purple-500/20 px-2 py-1 rounded-lg">本当のスキル</span>になるからです。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases / Personas */}
        <section className="py-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
            USECASES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-surface/30 rounded-2xl border border-border/50">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="font-bold text-lg mb-2">Game Creators</h3>
              <p className="text-sm text-muted-foreground">「MinecraftのModを作りたいけど、Javaのエラーが怖くて進めない...」そんな君の夢を、エラー解説でサポートします。</p>
            </div>
            <div className="p-6 bg-surface/30 rounded-2xl border border-border/50">
              <div className="text-4xl mb-4">🏫</div>
              <h3 className="font-bold text-lg mb-2">For Students</h3>
              <p className="text-sm text-muted-foreground">授業中、先生に質問するのは恥ずかしい。でも自分で理解したい。そんな時、こっそりwat!?に聞いてみてください。</p>
            </div>
            <div className="p-6 bg-surface/30 rounded-2xl border border-border/50">
              <div className="text-4xl mb-4">👴</div>
              <h3 className="font-bold text-lg mb-2">Lifelong Learners</h3>
              <p className="text-sm text-muted-foreground">Webサイト作成に挑戦中のあなた。「Uncaught SyntaxError」なんて出ても大丈夫。一つずつ一緒に解決しましょう。</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-foreground text-background rounded-[3rem] p-12 md:p-24 text-center space-y-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"></div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight relative z-10 leading-tight">
            AIに流されず、<br />自らの力で成長しよう。
          </h2>
          <p className="text-background/70 text-lg max-w-xl mx-auto relative z-10">
            もうエラーは怖くありません。それは成長のためのステップです。
          </p>
          <div className="pt-8 relative z-10">
            <button
              onClick={() => router.push('/')}
              className="bg-background text-foreground px-12 py-5 rounded-full text-xl font-bold hover:bg-background/90 transition-all shadow-2xl active:scale-95"
            >
              今すぐ無料で使う
            </button>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div >
  );
}
