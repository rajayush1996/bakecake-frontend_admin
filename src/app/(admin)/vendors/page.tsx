"use client";
import { useI18n } from '@/i18n';

export default function VendorsPage() {
  const { t } = useI18n();
  return <p>{t('Vendors.placeholder')}</p>;
}
