'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/i18n';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await login(data.email, data.password);
      router.push('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(t('Login.error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#fde68a,_#fbcfe8,_#e0e7ff)] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-md">
        <div className="mb-8 text-center">
          <span className="mb-4 inline-block rounded-full bg-yellow-200 px-3 py-1 text-sm font-medium text-slate-700">
            {t('Login.pill')}
          </span>
          <h1 className="text-3xl font-bold">{t('Login.title')}</h1>
          <p className="mt-2 text-slate-600">{t('Login.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              {t('Login.email')}
            </label>
            <Input id="email" type="email" className="bg-white/80" {...register('email')} />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              {t('Login.password')}
            </label>
            <Input id="password" type="password" className="bg-white/80" {...register('password')} />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
              />
              {t('Login.remember')}
            </label>
            <a href="#" className="text-slate-600 hover:text-slate-900">
              {t('Login.forgot')}
            </a>
          </div>
          {error && <p className="text-center text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">
            {t('Login.submit')}
          </Button>
          <p className="text-center text-sm text-slate-600">
            {t('Login.noAccount')}{' '}
            <a href="#" className="font-medium text-slate-900 hover:underline">
              {t('Login.signUp')}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
