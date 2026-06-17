import { useState } from 'react';
import { chatApi } from '../api/chat.api';
import { ChatMessage, ChatSource } from '../types';
import { toast } from 'sonner';

export const useChat = (appId: string | undefined) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastSources, setLastSources] = useState<ChatSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!appId) {
      toast.error('No app context selected.');
      return;
    }
    if (!text.trim()) return;

    // 1. Append user message locally
    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLastSources([]); // Clear previous sources until new response arrives
    setIsLoading(true);

    // 2. Add assistant placeholder message that we will stream tokens into
    let currentAssistantMessage = '';
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '' },
    ]);

    await chatApi.streamMessage(
      {
        app_id: appId,
        query: text,
        history: messages, // Send history (excluding the current user message just added)
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
        onDone: () => {
          setIsLoading(false);
        },
        onError: (error) => {
          const msg = error.message || 'Failed to send message';
          toast.error(msg);
          setIsLoading(false);
          // Rollback: Remove the last assistant message and user message on failure
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
  };

  const clearChat = () => {
    setMessages([]);
    setLastSources([]);
  };

  return {
    messages,
    sendMessage,
    clearChat,
    isLoading,
    sources: lastSources,
  };
};
