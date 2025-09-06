'use client';
import {createContext, ReactNode, useContext, useState} from 'react';

type Messages = Record<string, string>;

interface I18nContextValue {
  locale: string;
  t: (key: string) => string;
  setLocale: (locale: string) => Promise<void>;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  t: (key) => key,
  setLocale: async () => {}
});

export function I18nProvider({
  children,
  initialLocale,
  initialMessages
}: {
  children: ReactNode;
  initialLocale: string;
  initialMessages: Messages;
}) {
  const [locale, setLocaleState] = useState(initialLocale);
  const [messages, setMessages] = useState<Messages>(initialMessages);

  const setLocale = async (nextLocale: string) => {
    if (nextLocale === locale) return;
    const mod = await import(`@/messages/${nextLocale}.json`);
    setLocaleState(nextLocale);
    setMessages(mod.default);
    document.cookie = `locale=${nextLocale}; path=/`;
  };

  const t = (key: string) => messages[key] ?? key;

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
