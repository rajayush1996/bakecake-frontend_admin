'use client';
import useSWR from 'swr';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useI18n } from '@/i18n';

interface Category {
  id: number;
  title: string;
  slug: string;
  iconUrl?: string;
  sortOrder?: number;
  isActive: boolean;
}

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  iconUrl: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean(),
});

type CategoryForm = z.infer<typeof schema>;

export default function CategoriesPage() {
  const { t } = useI18n();
  const { data, mutate } = useSWR<Category[]>('/categories', async (url: string) => (await api.get(url)).data);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryForm>({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true },
  });

  const onSubmit = async (values: CategoryForm) => {
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, values);
      } else {
        await api.post('/categories', values);
      }
      mutate();
      setOpen(false);
      reset({ isActive: true });
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert(t('Categories.saveError'));
    }
  };

  const openNew = () => {
    reset({ title: '', slug: '', iconUrl: '', sortOrder: undefined, isActive: true });
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (cat: Category) => {
    const { id: _id, ...rest } = cat;
    void _id;
    reset(rest);
    setEditing(cat);
    setOpen(true);
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(t('Categories.deleteConfirm'))) return;
    await api.delete(`/categories/${cat.id}`);
    mutate();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t('Categories.heading')}</h1>
        <Button onClick={openNew}>{t('Categories.new')}</Button>
      </div>
      <table className="w-full border border-slate-200">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2 text-left">{t('Categories.columns.title')}</th>
            <th className="p-2 text-left">{t('Categories.columns.slug')}</th>
            <th className="p-2 text-left">{t('Categories.columns.isActive')}</th>
            <th className="p-2 text-left">{t('Categories.columns.sortOrder')}</th>
            <th className="p-2">{t('Categories.columns.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((cat) => (
            <tr key={cat.id} className="border-t">
              <td className="p-2">{cat.title}</td>
              <td className="p-2">{cat.slug}</td>
              <td className="p-2">{cat.isActive ? 'Yes' : 'No'}</td>
              <td className="p-2">{cat.sortOrder}</td>
              <td className="p-2 space-x-2">
                <Button className="px-2 py-1" onClick={() => openEdit(cat)}>{t('Categories.edit')}</Button>
                <Button className="px-2 py-1 bg-red-600 hover:bg-red-500" onClick={() => handleDelete(cat)}>{t('Categories.delete')}</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-lg font-semibold">{editing ? t('Categories.edit') : t('Categories.new')}</h2>
          <div>
            <Input placeholder={t('Categories.form.title')} {...register('title')} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>
          <div>
            <Input placeholder={t('Categories.form.slug')} {...register('slug')} />
            {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
          </div>
          <div>
            <Input placeholder={t('Categories.form.iconUrl')} {...register('iconUrl')} />
          </div>
          <div>
            <Input type="number" placeholder={t('Categories.form.sortOrder')} {...register('sortOrder', { valueAsNumber: true })} />
          </div>
          <div className="flex items-center gap-2">
            <Switch {...register('isActive')} />
            <span>{t('Categories.form.isActive')}</span>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" className="bg-slate-500 hover:bg-slate-400" onClick={() => setOpen(false)}>{t('Categories.form.cancel')}</Button>
            <Button type="submit">{t('Categories.form.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

