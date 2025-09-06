import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider, defaultLocale } from '@/i18n';
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
  const locale = cookieStore.get('locale')?.value || defaultLocale;
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
