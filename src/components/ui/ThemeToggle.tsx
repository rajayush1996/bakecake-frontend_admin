'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    if (stored === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-white"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
