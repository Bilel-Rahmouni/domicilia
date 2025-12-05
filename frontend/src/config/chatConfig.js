/**
 * Configuration centralisée de l'API de chat
 */

const CHAT_CONFIG = {
  API_URL: 'http://localhost:3002/api',
  ENDPOINTS: {
    MESSAGES: '/messages',
  },
  DEFAULT_COMPANY_ID: 'domicilia',
  DEFAULT_COMPANY_NAME: 'Domicilia',
};

// Logs de configuration au démarrage
if (typeof window !== 'undefined') {
  console.log('[ChatConfig] Configuration initialisée:', {
    API_URL: CHAT_CONFIG.API_URL,
    DEFAULT_COMPANY_ID: CHAT_CONFIG.DEFAULT_COMPANY_ID,
  });
}

export default CHAT_CONFIG;

