import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Paperclip } from 'lucide-react';
import { ImagePreview } from './ImagePreview';

export function ChatInput({ onSendMessage, loading }) {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((message.trim() || images.length > 0) && !loading) {
      if (images.length > 0) {
        const content = [];
        
        if (message.trim()) {
          content.push({
            type: 'text',
            text: message.trim()
          });
        }
        
        images.forEach(image => {
          content.push({
            type: 'image',
            url: URL.createObjectURL(image),
            file: image
          });
        });
        
        onSendMessage(content);
      } else {
        onSendMessage(message.trim());
      }
      
      setMessage('');
      setImages([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageUpload = (files) => {
    if (!files) return;
    
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    setImages(prev => [...prev, ...imageFiles].slice(0, 5)); // Limit to 5 images
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setImages(prev => [...prev, file].slice(0, 5));
        }
      }
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [message]);

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {/* Image previews */}
        {images.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {images.map((image, index) => (
              <ImagePreview
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Upload ${index + 1}`}
                onRemove={() => removeImage(index)}
                className="max-w-32"
              />
            ))}
          </div>
        )}
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleImageUpload(e.target.files)}
        />
        
        <div className="relative flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Type your message here..."
              className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-white/10 text-gray-900 dark:text-gray-100 px-4 py-3 pr-12 focus:border-orange-500 dark:focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500 dark:placeholder-gray-400 myscrollbar"
              rows={1}
              disabled={loading}
            />
          </div>
          
          <button
            type="button"
            onClick={handleFileClick}
            disabled={loading}
            className="flex-shrink-0 text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Upload image"
          >
            <Paperclip size={20} />
          </button>
          
          <button
            type="submit"
            disabled={(!message.trim() && images.length === 0) || loading}
            className="flex-shrink-0 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Press Enter to send, Shift+Enter for new line • Paste or upload images</span>
          <span>{message.length}/2000</span>
        </div>
      </form>
    </div>
  );
}