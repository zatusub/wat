"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthenticator } from "@aws-amplify/ui-react";
import logo from "../WAT.png";
import logoDark from "../WAT-d.png";

interface SidebarProps {
  theme: "light" | "dark" | "system";
  toggleTheme: () => void;
  isOpen: boolean;       // For mobile responsiveness
  setIsOpen: (isOpen: boolean) => void; // For mobile responsiveness
}

export default function Sidebar({ theme, toggleTheme, isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();
  const { user, signOut } = useAuthenticator();

  // Determine current logo
  const [currentLogo, setCurrentLogo] = useState(logo);

  // Theme logic for logo - duplicate of Header logic but local to Sidebar
  useEffect(() => {
    // Simplified logic: purely check theme prop or system pref
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setCurrentLogo(isDark ? logoDark : logo);
  }, [theme]);


  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-72 bg-surface/50 backdrop-blur-3xl border-r border-border
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Top Section */}
        <div className="p-6 space-y-8 flex-1 overflow-y-auto">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="relative w-10 h-10">
              <Image
                src={currentLogo}
                alt="WAT Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">wat!?</span>
          </div>

          {/* History Section (Mock) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">
              Recent Errors
            </h3>
            <div className="space-y-1">
              {[
                { id: 1, title: "TypeError: Cannot read..." },
                { id: 2, title: "SyntaxError: Unexpec..." },
                { id: 3, title: "NullPointerException" },
              ].map((item) => (
                <button
                  key={item.id}
                  className="w-full text-left px-3 py-2 text-sm text-foreground/80 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors truncate"
                >
                  {item.title}
                </button>
              ))}
              <div className="px-3 py-2 text-xs text-muted-foreground italic">
                ...and more history
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-6 border-t border-border space-y-6 bg-surface/30">

          {/* Upgrade Button */}
          <button className="w-full relative group overflow-hidden rounded-xl p-[1px]">
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-surface rounded-xl px-4 py-3 flex items-center justify-center gap-2">
              <span className="font-bold text-sm bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Upgrade Plan
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </button>

          {/* User & Settings */}
          <div className="flex items-center justify-between gap-2">

            {/* User Profile */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                {user?.signInDetails?.loginId?.[0]?.toUpperCase() || "G"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate">
                  {user?.signInDetails?.loginId?.split('@')[0] || "Guest"}
                </span>
                <span className="text-xs text-muted-foreground">Free Plan</span>
              </div>
            </div>

            {/* Settings / Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label="Settings"
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
          </div>

        </div>
      </aside>
    </>
  );
}
