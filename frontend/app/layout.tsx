import type { Metadata } from 'next'
import './globals.css'
import { ChatProvider } from '@/src/context/ChatContext'
import ChatButton from '@/src/components/ChatButton'

export const metadata: Metadata = {
  title: 'Domicilia',
  description: 'Domicilia Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

