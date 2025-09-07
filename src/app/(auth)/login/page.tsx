'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/auth-client';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await login(data.email, data.password);
      router.push('/admin/dashboard');
    } catch (e) {
      console.error(e);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f13] text-slate-200 flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151a21] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
        {/* Logo */}
        <div className="flex flex-col items-center pt-8">
          <div className="h-14 w-14 rounded-full bg-brand-600/90 grid place-items-center ring-8 ring-brand-600/10">
            {/* simple V logo circle */}
            <span className="text-xl font-black text-white">V</span>
          </div>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">Log in to your account</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register('email')}
              className="w-full rounded-lg bg-[#0f141a] border border-white/10 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/70 focus:border-brand-600"
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-xs text-slate-400 hover:text-slate-200">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className="w-full rounded-lg bg-[#0f141a] border border-white/10 px-4 py-3 pr-10 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/70 focus:border-brand-600"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-slate-200"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Primary CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-500 disabled:opacity-70 transition-colors shadow-[0_8px_24px_-8px_rgba(255,90,31,0.6)]"
          >
            {isSubmitting ? 'Logging in…' : 'Log In'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => (window.location.href = '/api/auth/google')}
            className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-medium flex items-center justify-center gap-3 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.4 32.4 29.1 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 5.1 29.5 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.5 0 19.3-7.6 19.3-21 0-1.3-.1-2.7-.7-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.4 16.3 18.8 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 5.1 29.5 3 24 3 16.1 3 9.3 7.5 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 45c5.1 0 10-1.9 13.6-5.4l-6.3-5.2C29.3 35.5 26.8 36 24 36c-5 0-9.2-3.2-10.7-7.7l-6.6 5.1C9.7 41.5 16.3 45 24 45z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3C34.8 32.1 30 36 24 36c-5 0-9.2-3.2-10.7-7.7l-6.6 5.1C9.7 41.5 16.3 45 24 45c10.5 0 19.3-7.6 19.3-21 0-1.3-.1-2.7-.7-3.5z"/>
            </svg>
            Log in with Google
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-brand-400 hover:text-brand-300 font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
