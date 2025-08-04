import { supabase } from '../lib/supabase';

// Generate title from first user message
function generateChatTitle(firstMessage) {
  let text = '';
  
  if (typeof firstMessage === 'string') {
    text = firstMessage;
  } else {
    const textContent = firstMessage.find(item => item.type === 'text');
    text = textContent ? textContent.text : 'New Chat';
  }
  
  // Truncate and clean up the title
  return text.slice(0, 50).trim() || 'New Chat';
}

// Create a new chat session
export async function createChatSession(firstMessage) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  const title = firstMessage ? generateChatTitle(firstMessage) : 'New Chat';
  
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: user.id,
      title
    })
    .select('id')
    .single();
    
  if (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
  
  return data.id;
}

// Get all chat sessions for the current user
export async function getChatSessions() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id, title, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching chat sessions:', error);
    throw error;
  }
  
  return data.map(session => ({
    id: session.id,
    title: session.title,
    created_at: session.created_at,
    updated_at: session.updated_at
  }));
}

// Save a message to a chat session
export async function saveMessage(sessionId, message) {
  const { error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      role: message.role,
      content: message.content
    });
    
  if (error) {
    console.error('Error saving message:', error);
    throw error;
  }
  
  // Update session's updated_at timestamp
  await supabase
    .from('chat_sessions')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', sessionId);
}

// Load messages from a chat session
export async function loadChatMessages(sessionId) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Error loading chat messages:', error);
    throw error;
  }
  
  return data.map(msg => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp: new Date(msg.created_at)
  }));
}

// Delete a chat session
export async function deleteChatSession(sessionId) {
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);
    
  if (error) {
    console.error('Error deleting chat session:', error);
    throw error;
  }
}

// Update chat session title
export async function updateChatTitle(sessionId, title) {
  const { error } = await supabase
    .from('chat_sessions')
    .update({ title })
    .eq('id', sessionId);
    
  if (error) {
    console.error('Error updating chat title:', error);
    throw error;
  }
}