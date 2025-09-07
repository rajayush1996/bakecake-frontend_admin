import useSWR from 'swr';

const dummyUser = { email: 'admin@example.com' };

export function useMe() {
  const { data, error, mutate } = useSWR('/auth/me', async () => {
    if (typeof document !== 'undefined' && document.cookie.includes('access_token=')) {
      return { user: dummyUser };
    }
    throw new Error('Unauthorized');
  });

  return { user: data?.user, isLoading: !data && !error, isError: !!error, mutate };
}

export async function login(email: string, password: string) {
  if (email === dummyUser.email && password === 'admin123') {
    document.cookie = 'access_token=dummy-token; path=/';
    return;
  }
  throw new Error('Invalid credentials');
}

export async function logout() {
  document.cookie = 'access_token=; Max-Age=0; path=/';
}
