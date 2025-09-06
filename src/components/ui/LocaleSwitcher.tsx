'use client';
import { useI18n, locales } from '@/i18n';

export default function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex gap-2 text-sm">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={l === locale ? 'font-bold underline' : 'hover:underline'}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
