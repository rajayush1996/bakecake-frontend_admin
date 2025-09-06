import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/i18n';
import { defaultLocale, type Locale } from '@/i18n-config';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: "BakeCake Admin",
  description: "Admin CMS for BakeCake",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value as Locale) || defaultLocale;
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body className="antialiased">
        <I18nProvider initialLocale={locale} initialMessages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
