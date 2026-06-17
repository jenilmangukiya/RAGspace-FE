import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { chatApi, SendMessagePayload } from '../api/chat.api';
import { ChatMessage, ChatSource } from '../types';
import { toast } from 'sonner';

export const useChat = (appId: string | undefined) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastSources, setLastSources] = useState<ChatSource[]>([]);

  // Send message mutation
  const chatMutation = useMutation({
    mutationFn: (payload: SendMessagePayload) => chatApi.sendMessage(payload),
    onSuccess: (response) => {
      // Append assistant response to messages
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.answer },
      ]);
      setLastSources(response.sources || []);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.detail || error.message || 'Failed to send message';
      toast.error(msg);
      // Remove last user message on error so they can try again
      setMessages((prev) => prev.slice(0, -1));
    },
  });

  const sendMessage = async (text: string) => {
    if (!appId) {
      toast.error('No app context selected.');
      return;
    }
    if (!text.trim()) return;

    // 1. Append user message locally
    const userMessage: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLastSources([]); // Clear previous sources until new response arrives

    // 2. Trigger mutation with full history context
    await chatMutation.mutateAsync({
      app_id: appId,
      query: text,
      history: messages, // Send history (excluding the current user message just added, as backend takes query + history separately)
    });
  };

  const clearChat = () => {
    setMessages([]);
    setLastSources([]);
  };

  return {
    messages,
    sendMessage,
    clearChat,
    isLoading: chatMutation.isPending,
    sources: lastSources,
  };
};
