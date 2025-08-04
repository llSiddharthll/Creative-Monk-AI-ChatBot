import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { getChatSessions, updateChatTitle, deleteChatSession } from '../services/chatService';

export function ChatSidebar({ currentSessionId, onSelectSession, onNewChat, isOpen, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const chatSessions = await getChatSessions();
      setSessions(chatSessions);
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteChatSession(sessionId);
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (currentSessionId === sessionId) {
          onNewChat();
        }
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  const handleEditTitle = (session, e) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveTitle = async (sessionId) => {
    if (editTitle.trim()) {
      try {
        await updateChatTitle(sessionId, editTitle.trim());
        setSessions(prev => prev.map(s => 
          s.id === sessionId ? { ...s, title: editTitle.trim() } : s
        ));
      } catch (error) {
        console.error('Failed to update title:', error);
      }
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Chat History</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            New Chat
          </button>
        </div>

        {/* Chat Sessions */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Loading chats...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No chat history yet
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  currentSessionId === session.id
                    ? 'bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => {
                  onSelectSession(session.id);
                  onClose();
                }}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare size={16} className="mt-1 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {editingId === session.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveTitle(session.id);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveTitle(session.id);
                          }}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelEdit();
                          }}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                          {session.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(session.updated_at).toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>
                  
                  {editingId !== session.id && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={(e) => handleEditTitle(session, e)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Edit title"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete chat"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}