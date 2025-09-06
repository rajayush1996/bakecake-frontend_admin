"use client";
import { useI18n } from '@/i18n';

export default function DashboardPage() {
  const { t } = useI18n();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t('Dashboard.heading')}</h1>
      <p>{t('Dashboard.welcome')}</p>
    </div>
  );
}
