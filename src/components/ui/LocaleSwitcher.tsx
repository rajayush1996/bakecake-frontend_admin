'use client';
import { useI18n, locales } from '@/i18n';

export default function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <select
      value={locale}
      onChange={e => setLocale(e.target.value as (typeof locales)[number])}
      className="w-full bg-transparent text-sm"
    >
      {locales.map(l => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
