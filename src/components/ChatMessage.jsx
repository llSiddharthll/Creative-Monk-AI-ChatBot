import React from 'react';
import { Copy, User, Bot } from 'lucide-react';
import { MarkdownMessage } from './MarkdownMessage';
import { ImagePreview } from './ImagePreview';

export function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  const copyToClipboard = () => {
    if (typeof message.content === 'string') {
      navigator.clipboard.writeText(message.content);
    } else {
      navigator.clipboard.writeText(JSON.stringify(message.content));
    }
  };

  return (
    <div className={`flex gap-4 p-6 ${
      isUser 
        ? 'bg-gray-50 dark:bg-gray-800/50' 
        : 'bg-white dark:bg-black'
    } border-b border-gray-100 dark:border-gray-700`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-orange-600 text-white' 
          : 'bg-black dark:bg-orange-500 text-white'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="text-gray-700 dark:text-gray-300">
          {typeof message.content === 'string' ? (
            isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <MarkdownMessage content={message.content} />
            )
          ) : (
            <div className="space-y-3">
              {message.content.map((item, index) => {
                if (item.type === 'text') {
                  return (
                    <div key={index} className="whitespace-pre-wrap">
                      {item.text}
                    </div>
                  );
                } else if (item.type === 'image') {
                  return (
                    <ImagePreview
                      key={index}
                      src={item.url}
                      alt={`Uploaded image ${index + 1}`}
                      className="mt-2"
                    />
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
        
        <button
          onClick={copyToClipboard}
          className="mt-2 inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <Copy size={12} />
          Copy
        </button>
      </div>
    </div>
  );
}