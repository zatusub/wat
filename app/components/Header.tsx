"use client";

import { useAuthenticator } from '@aws-amplify/ui-react';
import GreenHeader from './green/Header';
import TropicalHeader from './tropical/Header';
import { useEffect, useState } from 'react';

interface HeaderProps {
  theme: "light" | "dark" | "system";
  toggleTheme: () => void;
  onLogoClick?: () => void;
}

export default function Header({ theme, toggleTheme, onLogoClick }: HeaderProps) {
  const { user, signOut, authStatus } = useAuthenticator();
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === 'system') {
      const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
      setEffectiveTheme(matchMedia.matches ? 'dark' : 'light');

      const handleChange = (e: MediaQueryListEvent) => {
        setEffectiveTheme(e.matches ? 'dark' : 'light');
      };
      matchMedia.addEventListener('change', handleChange);
      return () => matchMedia.removeEventListener('change', handleChange);
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme]);

  if (effectiveTheme === 'dark') {
    return <TropicalHeader toggleTheme={toggleTheme} user={user} signOut={signOut} authStatus={authStatus} />;
  }

  return <GreenHeader toggleTheme={toggleTheme} user={user} signOut={signOut} authStatus={authStatus} />;
}
