'use client';
import { createContext, ReactNode, useContext, useState } from 'react';
import { locales, defaultLocale, type Locale } from './i18n-config';

type Messages = Record<string, string>;

interface I18nContextValue {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => Promise<void>;
}

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  t: (key) => key,
  setLocale: async () => {}
});

export function I18nProvider({
  children,
  initialLocale,
  initialMessages
}: {
  children: ReactNode;
  initialLocale: Locale;
  initialMessages: Messages;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Messages>(initialMessages);

  const setLocale = async (nextLocale: Locale) => {
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

export { locales, defaultLocale };
export type { Locale };
