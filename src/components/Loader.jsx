import React from 'react';

export function Loader() {
  return (
    <div className="flex items-center justify-center p-8 h-screen w-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-bounce">
          <div className="w-16 h-16 border-2 border-orange-500 rounded-2xl p-3 bg-white dark:bg-white/20 shadow-lg">
            <img 
              src="/image.png" 
              alt="Creative Monk AI Bot" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <span className="text-sm font-medium">Creative Monk</span>
        </div>
      </div>
    </div>
  );
}