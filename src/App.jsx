import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ChatHeader } from './components/ChatHeader';
import { ChatSidebar } from './components/ChatSidebar';
import { AuthModal } from './components/AuthModal';
import { EmptyState } from './components/EmptyState';
import { Loader } from './components/Loader';
import { AIThinkingLoader } from './components/AIThinkingLoader';
import { sendMessageToAI } from './utils/api';
import { createChatSession, saveMessage, loadChatMessages } from './services/chatService';

function App() {
  useTheme(); // Initialize theme
  const { user, loading: authLoading } = useAuth();
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatState, setChatState] = useState({
    messages: [],
    loading: false,
    error: null
  });
  
  const messagesEndRef = useRef(null);

  // Handle initial loading on page refresh/first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setChatState({
      messages: [],
      loading: false,
      error: null
    });
    setSidebarOpen(false);
  };

  const handleSelectSession = async (sessionId) => {
    try {
      const messages = await loadChatMessages(sessionId);
      setCurrentSessionId(sessionId);
      setChatState({
        messages,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Failed to load chat session:', error);
      setChatState(prev => ({
        ...prev,
        error: 'Failed to load chat history'
      }));
    }
  };

  const handleSendMessage = async (content) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      loading: true,
      error: null
    }));

    try {
      // Create new session if this is the first message
      let sessionId = currentSessionId;
      if (!sessionId) {
        sessionId = await createChatSession(content);
        setCurrentSessionId(sessionId);
      }

      // Save user message
      await saveMessage(sessionId, userMessage);

      // Prepare messages for API
      const apiMessages = [...chatState.messages, userMessage].map(msg => {
        if (typeof msg.content === 'string') {
          return {
            role: msg.role,
            content: msg.content
          };
        } else {
          // Convert MessageContent[] to API format with File objects preserved
          return {
            role: msg.role,
            content: msg.content.map(item => {
              if (item.type === 'text') {
                return { type: 'text', text: item.text };
              } else {
                return { 
                  type: 'image_url', 
                  image_url: { url: item.url },
                  file: item.file // Preserve File object for base64 conversion
                };
              }
            })
          };
        }
      });

      const aiResponse = await sendMessageToAI(apiMessages);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      // Save AI message
      await saveMessage(sessionId, aiMessage);

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        loading: false
      }));
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
    }
  };

  // Show full-screen loader on initial page load
  if (isInitialLoading || authLoading) {
    return (
      <div className="fixed inset-0 bg-gray-50 dark:bg-black flex items-center justify-center z-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-black transition-colors">
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <ChatSidebar
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <ChatHeader 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onShowAuth={() => setShowAuthModal(true)}
      />
      
      <div className="flex-1 overflow-hidden">
        {chatState.messages.length === 0 ? (
          <EmptyState 
            onStartChat={handleSendMessage}
            isAuthenticated={!!user}
            onShowAuth={() => setShowAuthModal(true)}
          />
        ) : (
          <div className="h-full overflow-y-auto myscrollbar">
            <div className="max-w-4xl mx-auto">
              {chatState.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {chatState.loading && <AIThinkingLoader />}
              
              {chatState.error && (
                <div className="p-6 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800">
                  <div className="max-w-4xl mx-auto text-red-700 dark:text-red-400">
                    <strong>Error:</strong> {chatState.error}
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} loading={chatState.loading} />
    </div>
  );
}

export default App;