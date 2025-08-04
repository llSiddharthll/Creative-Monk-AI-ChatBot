import React from 'react';
import { X, Download } from 'lucide-react';

export function ImagePreview({ src, alt, onRemove, className = '' }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`relative group inline-block ${className}`}>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-64 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
      />
      
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
            title="Remove image"
          >
            <X size={14} />
          </button>
        )}
        <button
          onClick={handleDownload}
          className="p-1 bg-gray-800 hover:bg-gray-900 text-white rounded-full shadow-lg transition-colors"
          title="Download image"
        >
          <Download size={14} />
        </button>
      </div>
    </div>
  );
}