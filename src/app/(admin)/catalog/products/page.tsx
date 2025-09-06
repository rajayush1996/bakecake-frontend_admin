"use client";
import { useI18n } from '@/i18n';

export default function ProductsPage() {
  const { t } = useI18n();
  return <p>{t('Products.placeholder')}</p>;
}
