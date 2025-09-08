'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { Role } from '@/navigation/navConfig';

const RoleContext = createContext<Role>('SUPER_ADMIN');

export function RoleProvider({ role, children }: { role: Role; children: ReactNode }) {
  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}

