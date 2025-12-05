# Guide de configuration de l'API de chat

Ce guide décrit la structure de l'API backend attendue par le système de chat.

## URL de base

Par défaut, l'API est configurée pour `http://localhost:3002/api`.

Modifiez `src/config/chatConfig.js` pour changer l'URL :

```javascript
const CHAT_CONFIG = {
  API_URL: 'https://votre-api.com/api',
  // ...
}
```

## Endpoints

### 1. Créer ou récupérer une conversation

**POST** `/api/conversations`

**Corps de la requête :**
```json
{
  "companyId": "renklar",
  "companyName": "Renklar",
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+33 6 12 34 56 78"
  }
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "conversation": {
    "_id": "conversation-id",
    "companyId": "renklar",
    "companyName": "Renklar",
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+33 6 12 34 56 78"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Comportement :**
- Si une conversation existe déjà pour ce `companyId` et cet `email`, la retourner
- Sinon, créer une nouvelle conversation

### 2. Rechercher une conversation par companyId et email

**GET** `/api/conversations/by-company?companyId=renklar&email=john@example.com`

**Réponse attendue (si trouvée) :**
```json
{
  "success": true,
  "conversation": {
    "_id": "conversation-id",
    "companyId": "renklar",
    "companyName": "Renklar",
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+33 6 12 34 56 78"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Réponse si non trouvée :**
- Status `404` ou `{ "success": false }`

### 3. Envoyer un message

**POST** `/api/messages`

**Corps de la requête :**
```json
{
  "conversationId": "conversation-id",
  "text": "Bonjour, j'ai une question",
  "senderId": "john@example.com",
  "senderName": "John Doe",
  "companyId": "renklar",
  "companyName": "Renklar",
  "isSupport": false
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": {
    "_id": "message-id",
    "conversationId": "conversation-id",
    "text": "Bonjour, j'ai une question",
    "senderId": "john@example.com",
    "senderName": "John Doe",
    "companyId": "renklar",
    "companyName": "Renklar",
    "isSupport": false,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Récupérer les messages d'une conversation

**GET** `/api/messages?conversationId=conversation-id`

**Réponse attendue :**
```json
{
  "success": true,
  "messages": [
    {
      "_id": "message-id-1",
      "conversationId": "conversation-id",
      "text": "Bonjour",
      "senderId": "john@example.com",
      "senderName": "John Doe",
      "companyId": "renklar",
      "companyName": "Renklar",
      "isSupport": false,
      "timestamp": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "message-id-2",
      "conversationId": "conversation-id",
      "text": "Bonjour, comment puis-je vous aider ?",
      "senderId": "support@renklar.com",
      "senderName": "Support Renklar",
      "companyId": "renklar",
      "companyName": "Renklar",
      "isSupport": true,
      "timestamp": "2024-01-01T00:01:00.000Z",
      "createdAt": "2024-01-01T00:01:00.000Z"
    }
  ]
}
```

## Format des données

### Conversation

```typescript
{
  _id: string;              // ID unique de la conversation
  companyId: string;         // ID de l'entreprise
  companyName: string;       // Nom de l'entreprise
  user: {
    name: string;            // Nom de l'utilisateur
    email: string;           // Email de l'utilisateur
    phone?: string;          // Téléphone (optionnel)
  };
  createdAt: string;         // Date de création (ISO 8601)
  updatedAt: string;         // Date de mise à jour (ISO 8601)
}
```

### Message

```typescript
{
  _id: string;               // ID unique du message
  conversationId: string;   // ID de la conversation
  text: string;             // Contenu du message
  senderId: string;         // ID de l'expéditeur (email ou ID)
  senderName: string;       // Nom de l'expéditeur
  companyId: string;        // ID de l'entreprise
  companyName: string;      // Nom de l'entreprise
  isSupport: boolean;       // true si message du support, false si utilisateur
  timestamp: string;        // Date du message (ISO 8601)
  createdAt: string;        // Date de création (ISO 8601)
}
```

## Gestion des erreurs

### Codes de statut HTTP

- **200** : Succès
- **201** : Créé avec succès
- **400** : Requête invalide
- **404** : Ressource non trouvée
- **500** : Erreur serveur

### Format des erreurs

```json
{
  "success": false,
  "error": "Message d'erreur descriptif"
}
```

## Exemple d'implémentation backend (Node.js/Express)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// POST /api/conversations
app.post('/api/conversations', async (req, res) => {
  try {
    const { companyId, companyName, user } = req.body;
    
    // Vérifier si une conversation existe déjà
    let conversation = await Conversation.findOne({
      companyId,
      'user.email': user.email
    });
    
    if (!conversation) {
      // Créer une nouvelle conversation
      conversation = await Conversation.create({
        companyId,
        companyName,
        user
      });
    }
    
    res.json({
      success: true,
      conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/conversations/by-company
app.get('/api/conversations/by-company', async (req, res) => {
  try {
    const { companyId, email } = req.query;
    
    const conversation = await Conversation.findOne({
      companyId,
      'user.email': email
    });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }
    
    res.json({
      success: true,
      conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/messages
app.post('/api/messages', async (req, res) => {
  try {
    const { conversationId, text, senderId, senderName, companyId, companyName, isSupport } = req.body;
    
    const message = await Message.create({
      conversationId,
      text,
      senderId,
      senderName,
      companyId,
      companyName,
      isSupport: isSupport || false,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/messages
app.get('/api/messages', async (req, res) => {
  try {
    const { conversationId } = req.query;
    
    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 });
    
    res.json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3002, () => {
  console.log('API de chat démarrée sur http://localhost:3002');
});
```

## CORS

Si votre frontend et backend sont sur des domaines différents, configurez CORS :

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // URL de votre frontend
  credentials: true
}));
```

## Dépannage

### Les requêtes échouent avec CORS

1. Configurez CORS sur votre backend
2. Vérifiez que l'URL de l'API est correcte
3. Vérifiez que le backend est démarré

### Les messages ne s'affichent pas

1. Vérifiez le format de la réponse (doit contenir `success: true` et `messages: [...]`)
2. Vérifiez que les messages sont triés par date
3. Vérifiez les logs du backend pour les erreurs

### Les conversations ne se créent pas

1. Vérifiez que tous les champs requis sont présents
2. Vérifiez le format de la réponse (doit contenir `success: true` et `conversation: {...}`)
3. Vérifiez les logs du backend pour les erreurs

## Logs de débogage

Le frontend envoie des logs détaillés dans la console :

- `[ChatConfig]` : Configuration
- `[ChatAPI]` : Appels API
- `[ChatContext]` : Gestion de l'état

Activez les logs dans la console du navigateur pour suivre le flux des données.

