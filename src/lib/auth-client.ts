import useSWR from 'swr';
import api from './api';

export function useMe() {
  const { data, error, mutate } = useSWR('/auth/me', async (url) => {
    const res = await api.get(url);
    return res.data;
  });

  return { user: data?.user, isLoading: !data && !error, isError: !!error, mutate };
}

export async function login(email: string, password: string) {
  await api.post('/auth/login', { email, password });
}

export async function logout() {
  await api.post('/auth/logout');
}
