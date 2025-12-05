# Guide d'intégration du Chat

Ce guide explique comment intégrer le système de chat dans votre projet Next.js ou React.

## Vue d'ensemble

Le système de chat comprend :
- **ChatModal** : Modal de chat avec popup
- **ChatButton** : Bouton flottant pour ouvrir le chat
- **Chat** : Page de chat complète (route `/chat`)
- **ChatContext** : Gestion globale de l'état du chat
- **chatApi** : Service API pour communiquer avec le backend

## Méthodes d'intégration

### Méthode 1 : Bouton flottant (Recommandé)

Le bouton flottant est déjà intégré dans `layout.tsx` et apparaît sur toutes les pages.

```tsx
// frontend/app/layout.tsx
import { ChatProvider } from '@/src/context/ChatContext'
import ChatButton from '@/src/components/ChatButton'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChatProvider>
          {children}
          <ChatButton />
        </ChatProvider>
      </body>
    </html>
  )
}
```

**Personnalisation du bouton :**

```tsx
<ChatButton 
  companyId="votre-company-id"
  position="bottom-right" // ou "bottom-left", "top-right", "top-left"
  label="Chat Support"
/>
```

### Méthode 2 : Lien vers la page de chat

Ajoutez un lien vers la page `/chat` dans votre navigation :

```tsx
import Link from 'next/link'

<Link href="/chat?companyId=votre-company-id">
  Ouvrir le chat
</Link>
```

La page `/chat` est déjà configurée et supporte les paramètres URL :
- `?companyId=xxx` : Définit l'ID de l'entreprise

### Méthode 3 : Composant React personnalisé

Utilisez le `ChatModal` directement dans votre composant :

```tsx
'use client'

import { useState } from 'react'
import { ChatProvider } from '@/src/context/ChatContext'
import ChatModal from '@/src/components/ChatModal'

export default function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ChatProvider>
      <button onClick={() => setIsOpen(true)}>
        Ouvrir le chat
      </button>
      <ChatModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        companyId="votre-company-id"
      />
    </ChatProvider>
  )
}
```

## Configuration

### Configuration de l'API

Modifiez `src/config/chatConfig.js` pour configurer l'URL de l'API :

```javascript
const CHAT_CONFIG = {
  API_URL: 'http://localhost:3002/api', // Changez selon votre backend
  DEFAULT_COMPANY_ID: 'domicilia', // ID par défaut
  // ...
}
```

### Company ID par défaut

Le `companyId` par défaut est `"domicilia"`. Vous pouvez le changer :

1. **Dans la configuration** : Modifiez `DEFAULT_COMPANY_ID` dans `chatConfig.js`
2. **Via props** : Passez `companyId` au `ChatButton` ou `ChatModal`
3. **Via URL** : Utilisez `?companyId=xxx` dans l'URL de la page `/chat`

## Structure des fichiers

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatModal.jsx          # Modal de chat
│   │   ├── ChatModal.module.css   # Styles du modal
│   │   ├── ChatButton.jsx         # Bouton flottant
│   │   ├── ChatButton.module.css  # Styles du bouton
│   │   ├── Chat.jsx               # Page de chat complète
│   │   └── Chat.module.css        # Styles de la page
│   ├── context/
│   │   └── ChatContext.jsx        # Context React
│   ├── services/
│   │   └── chatApi.js             # Service API
│   └── config/
│       └── chatConfig.js          # Configuration
├── app/
│   ├── layout.tsx                 # Layout avec ChatProvider
│   ├── page.tsx                   # Page d'accueil
│   └── chat/
│       └── page.jsx               # Page /chat
└── ...
```

## Fonctionnalités

### Gestion des conversations

- Création automatique d'une conversation si elle n'existe pas
- Recherche d'une conversation existante par `companyId` et `email`
- Persistance dans `localStorage` en cas d'échec de l'API

### Envoi de messages

- Envoi optimiste (le message apparaît immédiatement)
- Gestion des erreurs avec indicateurs visuels
- Support des messages en attente

### Interface utilisateur

- Formulaire de saisie des informations utilisateur (nom, email, téléphone)
- Indicateur de frappe
- Messages avec timestamps
- Auto-scroll vers les nouveaux messages
- Design responsive (mobile/desktop)
- Animations et transitions fluides

## Exemples d'utilisation

### Exemple 1 : Chat avec company ID spécifique

```tsx
<ChatButton companyId="mon-entreprise" />
```

### Exemple 2 : Chat dans un composant personnalisé

```tsx
'use client'

import { useState } from 'react'
import { ChatProvider, useChat } from '@/src/context/ChatContext'
import ChatModal from '@/src/components/ChatModal'

function ChatWrapper() {
  const [isOpen, setIsOpen] = useState(false)
  const { initializeConversation } = useChat()

  const handleOpen = async () => {
    // Pré-remplir les infos utilisateur si disponibles
    await initializeConversation({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+33 6 12 34 56 78'
    }, 'mon-entreprise')
    setIsOpen(true)
  }

  return (
    <>
      <button onClick={handleOpen}>Chatter</button>
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default function Page() {
  return (
    <ChatProvider>
      <ChatWrapper />
    </ChatProvider>
  )
}
```

### Exemple 3 : Utilisation du hook useChat

```tsx
'use client'

import { useChat } from '@/src/context/ChatContext'

export default function MyComponent() {
  const { 
    messages, 
    conversation, 
    sendMessage, 
    isLoading 
  } = useChat()

  return (
    <div>
      <h2>Messages ({messages.length})</h2>
      {messages.map(msg => (
        <div key={msg.id}>{msg.text}</div>
      ))}
      <button 
        onClick={() => sendMessage('Hello!')}
        disabled={isLoading}
      >
        Envoyer
      </button>
    </div>
  )
}
```

## Dépannage

### Le chat ne s'affiche pas

1. Vérifiez que `ChatProvider` enveloppe votre application dans `layout.tsx`
2. Vérifiez que les fichiers CSS sont bien importés
3. Vérifiez la console pour les erreurs

### Les messages ne s'envoient pas

1. Vérifiez que l'API backend est démarrée
2. Vérifiez l'URL de l'API dans `chatConfig.js`
3. Vérifiez la console pour les erreurs réseau
4. Les messages sont sauvegardés dans `localStorage` en backup

### Le companyId n'est pas pris en compte

1. Vérifiez que vous passez `companyId` en prop ou via l'URL
2. Vérifiez que le `ChatProvider` est bien configuré
3. Les paramètres URL sont prioritaires sur la configuration

## Support

Pour toute question ou problème, consultez :
- `CHAT_API_SETUP.md` : Guide de configuration de l'API
- Les logs de la console pour le débogage
- Le code source des composants pour plus de détails

