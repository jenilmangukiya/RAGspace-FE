import { useState, useEffect } from 'react';
import { chatApi } from '../api/chat.api';
import { conversationsApi } from '../api/conversations.api';
import { ChatMessage, ChatSource, Conversation } from '../types';
import { toast } from 'sonner';

export const useChat = (appId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastSources, setLastSources] = useState<ChatSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);

  const fetchConversations = async () => {
    if (!appId) return;
    setIsConversationsLoading(true);
    try {
      const data = await conversationsApi.getConversations(appId);
      setConversations(data);
    } catch (err) {
      toast.error('Failed to load conversations');
    } finally {
      setIsConversationsLoading(false);
    }
  };

  useEffect(() => {
    if (appId) {
      fetchConversations();
      // Reset active conversation when appId changes
      setActiveConversationId(null);
      setMessages([]);
      setLastSources([]);
    } else {
      setConversations([]);
      setActiveConversationId(null);
      setMessages([]);
      setLastSources([]);
    }
  }, [appId]);

  const selectConversation = async (conversationId: string | null) => {
    if (!conversationId) {
      setActiveConversationId(null);
      setMessages([]);
      setLastSources([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await conversationsApi.getConversation(conversationId);
      setActiveConversationId(conversationId);
      // Map and ensure proper ChatMessage formatting
      const chatMessages: ChatMessage[] = (data.messages || []).map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
      setMessages(chatMessages);
      setLastSources([]);
    } catch (err) {
      toast.error('Failed to load conversation history');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!appId) {
      toast.error('No app context selected.');
      return;
    }
    if (!text.trim()) return;

    let convoId = activeConversationId;
    let isNewConvo = false;
    setIsLoading(true);

    try {
      // 1. Create a conversation if none is active
      if (!convoId) {
        isNewConvo = true;
        const newConvo = await conversationsApi.createConversation(appId);
        convoId = newConvo.id;
        setActiveConversationId(convoId);
        setConversations((prev) => [newConvo, ...prev]);
      }

      // 2. Append user message locally
      const userMessage: ChatMessage = { role: 'user', content: text };
      setMessages((prev) => [...prev, userMessage]);
      setLastSources([]); // Clear previous sources until new response arrives

      // 3. Add assistant placeholder message that we will stream tokens into
      let currentAssistantMessage = '';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '' },
      ]);

      await chatApi.streamMessage(
        {
          app_id: appId,
          query: text,
          conversation_id: convoId,
        },
        {
          onToken: (token) => {
            currentAssistantMessage += token;
            setMessages((prev) => {
              const updated = [...prev];
              if (updated.length > 0) {
                const lastIndex = updated.length - 1;
                if (updated[lastIndex].role === 'assistant') {
                  updated[lastIndex] = {
                    ...updated[lastIndex],
                    content: currentAssistantMessage,
                  };
                }
              }
              return updated;
            });
          },
          onSources: (sources) => {
            setLastSources(sources || []);
          },
          onDone: async () => {
            setIsLoading(false);
            // If it was a new conversation, refresh conversations list so the auto-generated title is loaded
            if (isNewConvo) {
              await fetchConversations();
            }
          },
          onError: (error) => {
            const msg = error.message || 'Failed to send message';
            toast.error(msg);
            setIsLoading(false);
            // Rollback on failure
            setMessages((prev) => {
              const updated = [...prev];
              if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
                updated.pop();
              }
              if (updated.length > 0 && updated[updated.length - 1].role === 'user') {
                updated.pop();
              }
              return updated;
            });
          },
        }
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to initialize conversation');
      setIsLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await conversationsApi.deleteConversation(conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (activeConversationId === conversationId) {
        selectConversation(null);
      }
      toast.success('Conversation deleted');
    } catch (err) {
      toast.error('Failed to delete conversation');
    }
  };

  const renameConversation = async (conversationId: string, title: string) => {
    if (!title.trim()) return;
    try {
      const updated = await conversationsApi.renameConversation(conversationId, title);
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, title: updated.title } : c))
      );
      toast.success('Conversation renamed');
    } catch (err) {
      toast.error('Failed to rename conversation');
    }
  };

  const clearChat = () => {
    setMessages([]);
    setLastSources([]);
    setActiveConversationId(null);
  };

  return {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    isConversationsLoading,
    sources: lastSources,
    sendMessage,
    selectConversation,
    deleteConversation,
    renameConversation,
    fetchConversations,
    clearChat,
  };
};
