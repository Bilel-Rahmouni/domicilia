'use client';

import { Suspense } from 'react';
import Chat from '@/src/components/Chat';

function ChatContent() {
  return <Chat />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ChatContent />
    </Suspense>
  );
}

