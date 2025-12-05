'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { sendMessage as apiSendMessage } from '../services/chatApi';
import CHAT_CONFIG from '../config/chatConfig';

const ChatContext = createContext(null);

/**
 * Provider simplifié pour gérer l'état du chat
 */
export function ChatProvider({ children, defaultCompanyId = CHAT_CONFIG.DEFAULT_COMPANY_ID }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companyId, setCompanyId] = useState(defaultCompanyId);
  const [lastSentMessage, setLastSentMessage] = useState(null);

  /**
   * Envoie un message
   */
  const sendMessage = useCallback(async (text, userInfo) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiSendMessage({
        text: text.trim(),
        name: userInfo?.name || 'Utilisateur',
        email: userInfo?.email || '',
        phone: userInfo?.phone || '',
        companyId: companyId,
      });

      setLastSentMessage({
        text,
        timestamp: new Date().toISOString(),
        success: true,
      });

      return response;
    } catch (err) {
      console.error('[ChatContext] Erreur lors de l\'envoi du message:', err);
      setError('Impossible d\'envoyer le message. Réessayez plus tard.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  const value = {
    isLoading,
    error,
    companyId,
    setCompanyId,
    sendMessage,
    lastSentMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

/**
 * Hook pour utiliser le contexte du chat
 */
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat doit être utilisé dans un ChatProvider');
  }
  return context;
}
