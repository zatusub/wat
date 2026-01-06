"use client";

import { useEffect, useState } from 'react';
import GreenFooter from './green/Footer';
import TropicalFooter from './tropical/Footer';

export default function Footer() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Ideally this should use a Context, but for now we'll check localStorage/DOM
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    // Initial check
    checkTheme();

    // Observer for class changes on html element
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  if (theme === 'dark') {
    return <TropicalFooter />;
  }

  return <GreenFooter />;
}
