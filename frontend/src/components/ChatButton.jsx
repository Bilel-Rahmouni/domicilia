'use client';

import React, { useState } from 'react';
import ChatModal from './ChatModal';
import styles from './ChatButton.module.css';

/**
 * Bouton flottant pour ouvrir le chat
 * Position configurable (bottom-right par défaut)
 * Animation au survol
 * companyId par défaut : "domicilia"
 */
export default function ChatButton({
  companyId = 'domicilia',
  position = 'bottom-right',
  label = 'Contact',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClass = {
    'bottom-right': styles.bottomRight,
    'bottom-left': styles.bottomLeft,
    'top-right': styles.topRight,
    'top-left': styles.topLeft,
  }[position] || styles.bottomRight;

  return (
    <>
      <button
        className={`${styles.chatButton} ${positionClass} ${className}`}
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir le chat"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.icon}
        >
          <path
            d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
            fill="currentColor"
          />
          <path
            d="M7 9H17V11H7V9ZM7 12H15V14H7V12ZM7 6H17V8H7V6Z"
            fill="currentColor"
          />
        </svg>
        <span className={styles.label}>{label}</span>
      </button>

      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} companyId={companyId} />
    </>
  );
}

