import React from 'react';
import { Sun, Moon, Menu, LogOut, User } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

export function ChatHeader({ onToggleSidebar, onShowAuth }) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Toggle chat history"
          >
            <Menu size={20} />
          </button>
          <div className="p-2 rounded-lg border-2 border-orange-500">
            <img 
              src="/image.png" 
              alt="Creative Monk AI Bot" 
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Creative Monk AI Bot</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Made by Siddharth</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={onShowAuth}
              className="flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <User size={16} />
              Sign In
            </button>
          )}
          
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}