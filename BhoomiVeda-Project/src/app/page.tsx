'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import AuthPage from '@/components/auth-page';
import DashboardLayout from '@/components/dashboard-layout';
import { ThemeProvider } from 'next-themes';

export default function Home() {
  const { checkingAuth, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-500 font-medium">Loading BhoomiVeda...</p>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {isAuthenticated ? <DashboardLayout /> : <AuthPage />}
    </ThemeProvider>
  );
}
