'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot() {
  return localStorage.getItem('access_token');
}

function getServerSnapshot() {
  return null;
}

export function useIsLoggedIn(): boolean {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return !!token;
}
