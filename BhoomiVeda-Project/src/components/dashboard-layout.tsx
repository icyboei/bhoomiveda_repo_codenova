'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useTheme } from 'next-themes';
import {
  Home,
  Bot,
  Users,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  Sprout,
} from 'lucide-react';
import { toast } from 'sonner';
import DashboardHome from './dashboard-home';
import DashboardAiCrop from './dashboard-ai-crop';
import DashboardCommunity from './dashboard-community';
import DashboardSchemes from './dashboard-schemes';
import DashboardProfile from './dashboard-profile';

type Page = 'home' | 'ai-crop' | 'community' | 'schemes' | 'profile';

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'ai-crop', label: 'AI Crops', icon: Bot },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'schemes', label: 'Schemes', icon: FileText },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [activePage, setActivePage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <DashboardHome />;
      case 'ai-crop':
        return <DashboardAiCrop />;
      case 'community':
        return <DashboardCommunity />;
      case 'schemes':
        return <DashboardSchemes />;
      case 'profile':
        return <DashboardProfile />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-[#2fb26d]" />
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Bhoomi<span className="text-[#2fb26d]">Veda</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
                </div>
                <div className="px-4 py-3 text-center text-xs text-gray-500">
                  View your notifications on the Dashboard page
                </div>
              </div>
            )}
          </div>

          {/* User info */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2fb26d] text-white flex items-center justify-center text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                {user?.name || 'User'}
              </p>
              <span className="text-[10px] bg-[#edf7ee] text-[#2d6a4f] px-2 py-0.5 rounded-full font-semibold capitalize">
                {user?.role || 'farmer'}
              </span>
            </div>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
          <nav className="flex-1 py-4 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                    isActive
                      ? 'bg-[#edf7ee] text-[#1f8a43] dark:bg-[#1f8a43]/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-[#1f8a43]' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-xl flex flex-col animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Sprout className="h-6 w-6 text-[#2fb26d]" />
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Bhoomi<span className="text-[#2fb26d]">Veda</span>
                  </h1>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2fb26d] text-white flex items-center justify-center text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name || 'User'}
                    </p>
                    <span className="text-[10px] bg-[#edf7ee] text-[#2d6a4f] px-2 py-0.5 rounded-full font-semibold capitalize">
                      {user?.role || 'farmer'}
                    </span>
                  </div>
                </div>
              </div>

              <nav className="flex-1 py-3 px-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActivePage(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                        isActive
                          ? 'bg-[#edf7ee] text-[#1f8a43] dark:bg-[#1f8a43]/20'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-[#1f8a43]' : ''}`} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderPage()}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around py-2 px-2 z-30 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-all min-w-[44px] min-h-[44px] justify-center ${
                isActive
                  ? 'text-[#1f8a43]'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
