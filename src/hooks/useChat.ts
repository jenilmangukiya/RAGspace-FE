import { useState, useEffect, useCallback } from 'react';
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

  const fetchConversations = useCallback(async () => {
    if (!appId) return;
    setIsConversationsLoading(true);
    try {
      const data = await conversationsApi.getConversations(appId);
      setConversations(data);
    } catch {
      toast.error('Failed to load conversations');
    } finally {
      setIsConversationsLoading(false);
    }
  }, [appId]);

  const resetActiveChat = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
    setLastSources([]);
  }, []);

  const clearConversations = useCallback(() => {
    setConversations([]);
  }, []);

  useEffect(() => {
    const initData = async () => {
      await Promise.resolve();
      if (appId) {
        fetchConversations();
        resetActiveChat();
      } else {
        clearConversations();
        resetActiveChat();
      }
    };
    initData();
  }, [appId, fetchConversations, resetActiveChat, clearConversations]);

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
      
      const chatMessages: ChatMessage[] = (data.messages || []).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
      setMessages(chatMessages);
      setLastSources([]);
    } catch {
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
          app_id: appId as string,
          query: text,
          conversation_id: convoId as string,
        },
        {
          onToken: (token) => {
            currentAssistantMessage += token;
            setMessages((prev) => {
              const updated = [...prev];
              const lastIndex = updated.length - 1;
              const lastMsg = lastIndex >= 0 ? updated[lastIndex] : null;
              if (lastMsg && lastMsg.role === 'assistant') {
                updated[lastIndex] = {
                  ...lastMsg,
                  content: currentAssistantMessage,
                };
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
              const lastIdx = updated.length - 1;
              if (lastIdx >= 0 && updated[lastIdx]?.role === 'assistant') {
                updated.pop();
              }
              const newLastIdx = updated.length - 1;
              if (newLastIdx >= 0 && updated[newLastIdx]?.role === 'user') {
                updated.pop();
              }
              return updated;
            });
          },
        }
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to initialize conversation';
      toast.error(msg);
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
    } catch {
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
    } catch {
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
