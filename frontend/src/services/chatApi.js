/**
 * Service API simplifié pour envoyer des messages
 */

import CHAT_CONFIG from '../config/chatConfig';

/**
 * Envoie un message à l'API
 * @param {Object} messageData - Données du message
 * @param {string} messageData.text - Texte du message
 * @param {string} messageData.name - Nom de l'expéditeur
 * @param {string} messageData.email - Email de l'expéditeur
 * @param {string} messageData.phone - Téléphone (optionnel)
 * @param {string} messageData.companyId - ID de l'entreprise
 * @returns {Promise<Object>} Réponse de l'API
 */
export async function sendMessage(messageData) {
  try {
    const response = await fetch(`${CHAT_CONFIG.API_URL}${CHAT_CONFIG.ENDPOINTS.MESSAGES}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: messageData.text,
        name: messageData.name,
        email: messageData.email,
        phone: messageData.phone || '',
        companyId: messageData.companyId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('[ChatAPI] Message envoyé:', data);
    return data;
  } catch (error) {
    console.error('[ChatAPI] Erreur lors de l\'envoi du message:', error);
    throw error;
  }
}
