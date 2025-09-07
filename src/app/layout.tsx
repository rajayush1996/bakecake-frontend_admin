import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/i18n';
import { defaultLocale, type Locale } from '@/i18n-config';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'BakeCake Admin',
  description: 'Admin CMS for BakeCake',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value as Locale) || defaultLocale;
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-100 antialiased transition-colors">
        <I18nProvider initialLocale={locale} initialMessages={messages}>
          {/* Global wrapper */}
          <div className="flex flex-col min-h-screen">
            {/* Page content */}
            <main className="flex-1 flex items-center justify-center">
              {children}
            </main>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
