import React from 'react';
import { Lightbulb, Code, HelpCircle } from 'lucide-react';

export function EmptyState({ onStartChat, isAuthenticated, onShowAuth }) {
  const suggestions = [
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Explain a concept",
      description: "How does photosynthesis work?",
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Write code",
      description: "Create a React component for a todo list",
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: "Get help",
      description: "What's the best way to learn programming?",
    },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-black">
      <div className="max-w-2xl mx-auto text-center">
        <div className="border-2 border-orange-500 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <img 
            src="/image.png" 
            alt="Creative Monk AI Bot" 
            className="w-8 h-8 object-contain"
          />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Welcome to Creative Monk AI Bot
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {isAuthenticated 
            ? "Start a conversation with Creative Monk AI. Ask questions, get help with coding, analyze images, or explore any topic you're curious about."
            : "Sign in to start chatting with Creative Monk AI and save your conversation history."
          }
        </p>
        
        {!isAuthenticated && (
          <div className="mb-8">
            <button
              onClick={onShowAuth}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
            >
              Sign In to Get Started
            </button>
          </div>
        )}
        
        <div className={`grid md:grid-cols-3 gap-4 ${!isAuthenticated ? 'opacity-50 pointer-events-none' : ''}`}>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => isAuthenticated && onStartChat(suggestion.description)}
              className="p-4 text-left border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#ffffff15] rounded-xl hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-lg dark:hover:shadow-orange-900/20 transition-all group"
            >
              <div className="text-orange-600 dark:text-orange-400 mb-3 group-hover:text-orange-700 dark:group-hover:text-orange-300">
                {suggestion.icon}
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                {suggestion.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {suggestion.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}