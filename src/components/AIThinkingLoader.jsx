import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export function AIThinkingLoader() {
  return (
    <div className="flex gap-4 p-6 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-700">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-black dark:bg-orange-500 text-white">
        <Brain size={16} className="animate-pulse" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            AI Assistant
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            thinking...
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-orange-500 animate-pulse" />
            <span className="text-sm">Processing your request</span>
          </div>
          
          {/* Animated dots */}
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        
        {/* Thinking animation bars */}
        <div className="mt-3 space-y-2">
          <div className="flex gap-2">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '60%' }}></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '40%', animationDelay: '200ms' }}></div>
          </div>
          <div className="flex gap-2">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '45%', animationDelay: '400ms' }}></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '35%', animationDelay: '600ms' }}></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: '20%', animationDelay: '800ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}